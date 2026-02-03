import { create } from 'zustand';
import { saveUserScores, saveUserValues, saveUserProgress, savePersonalityVector, resetUserModule } from '../utils/syncUserData';
import { supabase } from '../lib/supabase';

export const useStore = create((set, get) => ({
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
        // Prepare strict state object to ensure clean slate
        // This prevents "ghost" data from a previous onboarding session from being merged into
        // an existing account if that account has no data or fails to load.

        const defaultScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const defaultValues = { security: 5, creativity: 5, autonomy: 5, team: 5, dynamic: 5, impact: 5 };
        const defaultPersonality = { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 };

        const newState = {
            user: userData,
            isLoginMode: false,
            isPremium: userData.isPremium || false,

            // STRICTLY OVERWRITE STATE - Do not allow shallow merge to keep old local state
            userScores: loadedData?.scores || defaultScores,
            userValues: loadedData?.values || defaultValues,
            personalityVector: loadedData?.personalityVector || defaultPersonality,

            // Progress is safer to merge if needed, but for "Clean Login" we usually want DB truth
            reliabilityScore: loadedData?.progress?.reliabilityScore || 0,
            completedModules: loadedData?.progress?.completedModules || [],
            currentStep: loadedData?.progress?.currentStep ?? 4, // Default to home (4) if login
            dailySwipes: loadedData?.progress?.dailySwipes || 0,
            lastSwipeDate: loadedData?.progress?.lastSwipeDate || null
        };

        // If we found a current step in DB (and it's not 0/onboarding), use it
        // Or if it IS 0, we might want to keep it 0? 
        // Logic: If user logs in, and has NO progress (step 0), they probably should go to onboarding?
        // But the previous logic said "Redirect to home (4)" if authenticated.
        // Let's stick to the safe "Home" default unless DB says otherwise.

        if (loadedData?.progress?.currentStep !== undefined) {
            newState.currentStep = loadedData.progress.currentStep;
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

    nextStep: () => set((state) => {
        const next = state.currentStep + 1;

        // Auto-save progress
        if (state.user?.id) {
            saveUserProgress(state.user.id, {
                reliabilityScore: state.reliabilityScore,
                completedModules: state.completedModules,
                currentStep: next,
                dailySwipes: state.dailySwipes,
                lastSwipeDate: state.lastSwipeDate
            });
        }
        return { currentStep: next };
    }),

    setStep: (step) => set((state) => {
        // Previously we prevented authenticated users from accessing onboarding (0-2)
        // But to allow "Reset / Redo", we now allow it.
        // The initial Redirect on App Load is handled in App.jsx checkAuth, 
        // ensuring they don't see onboarding accidentally.
        let targetStep = step;

        // Auto-save progress
        if (state.user?.id) {
            saveUserProgress(state.user.id, {
                reliabilityScore: state.reliabilityScore,
                completedModules: state.completedModules,
                currentStep: targetStep,
                dailySwipes: state.dailySwipes,
                lastSwipeDate: state.lastSwipeDate
            });
        }

        return { currentStep: targetStep };
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

    resetModule: async (moduleName) => {
        const state = get();

        // 1. Call Backend
        if (state.user?.id) {
            await resetUserModule(state.user.id, moduleName);
        }

        // 2. Update Local State
        set((state) => {
            const updates = {};

            // Map generic module names to specific internal IDs
            const IDS_TO_REMOVE = {
                'swipes': ['onboarding_swipes', 'swipes'],
                'dilemmas': ['dilemmas'],
                'values': ['work_values_deep', 'values_module', 'values'],
                'bigfive': ['personality', 'personality_big_five', 'bigfive'],
                'onboarding': ['onboarding']
            };
            const idsToRemove = IDS_TO_REMOVE[moduleName] || [moduleName];

            // Remove from completedModules logic
            updates.completedModules = state.completedModules.filter(m => !idsToRemove.includes(m));

            // Reset specific data
            if (moduleName === 'swipes') {
                updates.userScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
                // Also reset trackings
                updates.swipedActivities = [];
                updates.dailySwipes = 0; // Optional: give them their swipes back? Maybe not strictly required but friendly.
            }
            else if (moduleName === 'dilemmas' || moduleName === 'values') {
                updates.userValues = { security: 5, creativity: 5, autonomy: 5, team: 5, dynamic: 5, impact: 5 };
            }
            else if (moduleName === 'bigfive') {
                updates.personalityVector = { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 };
            }

            return updates;
        });
    },

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
