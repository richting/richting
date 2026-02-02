import { create } from 'zustand';
import { saveUserScores, saveUserValues, saveUserProgress, savePersonalityVector } from '../utils/syncUserData';
import { supabase } from '../lib/supabase';

export const useStore = create((set) => ({
    // RIASEC Scores (0-20 per category typically, normalized later)
    userScores: {
        R: 0,
        I: 0,
        A: 0,
        S: 0,
        E: 0,
        C: 0
    },

    // User Values (sliders 0-100 probably, or 1-10)
    userValues: {
        security: 5,
        creativity: 5,
        autonomy: 5,
        team: 5,
        dynamic: 5,
        impact: 5
    },

    // Personality Vector (Big Five: -10 to +10 per factor)
    personalityVector: {
        extraversion: 0,
        conscientiousness: 0,
        openness: 0,
        agreeableness: 0,
        stability: 0
    },

    // Navigation State
    currentStep: 0, // 0: Onboarding, 1: Swipes, 2: Dilemmas, 3: Auth, 4: Home, 5: Profile, 6: Matches, 7: Deep Dive

    // User State
    user: null, // null or { name, email, ... }
    isPremium: false,
    isLoginMode: false, // true if user clicked "Inloggen" button

    // Reliability Score System (0-100%)
    reliabilityScore: 0, // Starts at 0, set to 30 after onboarding
    completedModules: [], // Array of completed module IDs

    // Daily Swipe Tracking
    dailySwipes: 0, // Number of swipes done today
    lastSwipeDate: null, // Date of last swipe (YYYY-MM-DD)
    MAX_FREE_SWIPES: 10, // Free accounts get 10 swipes per day

    // Actions
    login: (userData, loadedData) => set((state) => {
        // If we have loaded data from database, merge it into state
        const newState = {
            user: userData,
            isLoginMode: false,
            isPremium: userData.isPremium || false
        };

        if (loadedData) {
            if (loadedData.scores) {
                newState.userScores = loadedData.scores;
            }
            if (loadedData.values) {
                newState.userValues = loadedData.values;
            }
            if (loadedData.progress) {
                newState.reliabilityScore = loadedData.progress.reliabilityScore;
                newState.completedModules = loadedData.progress.completedModules;
                newState.currentStep = loadedData.progress.currentStep;
                newState.dailySwipes = loadedData.progress.dailySwipes || 0;
                newState.lastSwipeDate = loadedData.progress.lastSwipeDate || null;
            }
            if (loadedData.personalityVector) {
                newState.personalityVector = loadedData.personalityVector;
            }
        }

        return newState;
    }),
    setLoginMode: (mode) => set({ isLoginMode: mode }),
    logout: async () => {
        await supabase.auth.signOut();
        set({
            user: null,
            isPremium: false,
            currentStep: 0,
            reliabilityScore: 0,
            completedModules: [],
            userScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
            userValues: { security: 5, creativity: 5, autonomy: 5, team: 5, dynamic: 5, impact: 5 }
        });
    },

    addScore: (type, amount) => set((state) => {
        const newScores = {
            ...state.userScores,
            [type]: state.userScores[type] + amount
        };

        // Auto-save to database if user is logged in
        if (state.user?.id) {
            saveUserScores(state.user.id, newScores);
        }

        return { userScores: newScores };
    }),

    // New: Handle activity swipe with daily limits
    swipedActivities: [], // Track IDs of swiped activities
    swipeActivity: (activityId, riasecCode, direction, intensity = 1) => set((state) => {
        // Check if we need to reset daily count (new day)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const isNewDay = state.lastSwipeDate !== today;

        // Reset count if it's a new day
        let currentDailySwipes = isNewDay ? 0 : state.dailySwipes;

        // Enforce limits for free accounts
        if (!state.isPremium && currentDailySwipes >= state.MAX_FREE_SWIPES) {
            // Already at limit, don't process swipe
            return state;
        }

        // Track that this activity is done so it doesn't show again immediately
        const newSwipedActivities = [...state.swipedActivities, activityId];

        // Only update score if swiped RIGHT (liked)
        let newScores = state.userScores;
        if (direction === 'right') {
            newScores = {
                ...state.userScores,
                [riasecCode]: state.userScores[riasecCode] + intensity
            };

            // Auto-save scores to database if user is logged in
            if (state.user?.id) {
                saveUserScores(state.user.id, newScores);
            }
        }

        // Increment daily swipe count
        const newDailySwipes = currentDailySwipes + 1;

        // Save progress with daily swipe tracking
        if (state.user?.id) {
            saveUserProgress(state.user.id, {
                reliabilityScore: state.reliabilityScore,
                completedModules: state.completedModules,
                currentStep: state.currentStep,
                dailySwipes: newDailySwipes,
                lastSwipeDate: today
            });
        }

        return {
            userScores: newScores,
            swipedActivities: newSwipedActivities,
            dailySwipes: newDailySwipes,
            lastSwipeDate: today
        };
    }),

    // Set a specific value (e.g. from sliders)
    setValue: (key, value) => set((state) => {
        const newValues = {
            ...state.userValues,
            [key]: value
        };

        // Auto-save to database if user is logged in
        if (state.user?.id) {
            saveUserValues(state.user.id, newValues);
        }

        return { userValues: newValues };
    }),

    // Set personality vector
    setPersonalityVector: (vector) => set((state) => {
        // Auto-save to database if user is logged in
        if (state.user?.id) {
            savePersonalityVector(state.user.id, vector);
        }

        return { personalityVector: vector };
    }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    setStep: (step) => set((state) => {
        // Prevent authenticated users from accessing onboarding steps (0-2)
        if (state.user && step >= 0 && step <= 2) {
            console.warn('Cannot navigate to onboarding steps while authenticated');
            return { currentStep: 4 }; // Redirect to HomeScreen
        }
        return { currentStep: step };
    }),

    setPremium: (status) => set({ isPremium: status }),

    // Sector Selection (changed from Career Selection)
    selectedSectorId: null,
    setSelectedSectorId: (id) => set({ selectedSectorId: id }),

    // Career Practice Validation
    selectedCareerDirection: null, // { direction: string, name: string, returnStep: number }
    setSelectedCareerDirection: (data) => set({ selectedCareerDirection: data }),

    // Practice Validation Results
    validationResults: null, // { beforeScores, afterScores, careerDirection }
    setValidationResults: (results) => set({ validationResults: results }),
    clearValidationResults: () => set({ validationResults: null }),

    // Reliability Score Actions
    setReliabilityScore: (score) => set({ reliabilityScore: Math.min(100, Math.max(0, score)) }),

    addCompletedModule: (moduleId) => set((state) => {
        if (state.completedModules.includes(moduleId)) {
            return state; // Already completed
        }
        return {
            completedModules: [...state.completedModules, moduleId]
        };
    }),

    updateReliability: (moduleId, scoreIncrease) => set((state) => {
        if (state.completedModules.includes(moduleId)) {
            return state; // Already completed
        }

        const newProgress = {
            completedModules: [...state.completedModules, moduleId],
            reliabilityScore: Math.min(100, state.reliabilityScore + scoreIncrease),
            currentStep: state.currentStep
        };

        // Auto-save to database if user is logged in
        if (state.user?.id) {
            saveUserProgress(state.user.id, newProgress);
        }

        return newProgress;
    }),

    // New mission-based completion
    completeModule: (moduleId, scoreIncrease) => set((state) => {
        if (state.completedModules.includes(moduleId)) {
            return state; // Already completed
        }
        return {
            completedModules: [...state.completedModules, moduleId],
            reliabilityScore: Math.min(100, state.reliabilityScore + scoreIncrease)
        };
    }),

    reset: () => set({
        userScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        userValues: { security: 5, creativity: 5, autonomy: 5, team: 5, dynamic: 5, impact: 5 },
        personalityVector: { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 },
        currentStep: 0,
        user: null,
        reliabilityScore: 0,
        completedModules: []
    })
}));
