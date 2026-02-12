import { create } from 'zustand';
import { saveUserScores, saveUserValues, saveUserProgress, savePersonalityVector, saveUserSelfEfficacy, resetUserModule } from '../utils/syncUserData';
import { supabase } from '../lib/supabase';
import { saveToLocalStorage, clearLocalStorage, loadFromLocalStorage } from '../utils/localStorageBackup';

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

    // User Values (O*NET Work Values 1-10)
    userValues: {
        achievement: 5,
        independence: 5,
        recognition: 5,
        relationships: 5,
        support: 5,
        working_conditions: 5
    },

    // Personality Vector (Big Five: -10 to +10 per factor)
    personalityVector: {
        extraversion: 0,
        conscientiousness: 0,
        openness: 0,
        agreeableness: 0,
        stability: 0
    },

    // SCCT Self-Efficacy (1-10 scale per skill cluster)
    selfEfficacy: {
        'complex_problem_solving': 5,
        'critical_thinking': 5,
        'social_perceptiveness': 5,
        'active_listening': 5,
        'programming': 5,
        // Add more default skills as needed
    },

    // Navigation State
    currentStep: 0, // 0: Onboarding, 1: Swipes, 2: Personality, 3: WorkValues, 4: SCCT, 5: Auth, 6: Home, 7: Profile, 8: Matches, 9: Deep Dive

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
        // Import localStorage backup utility (imported at top)
        // LocalStorage backup utility is imported at the top

        // Prepare strict state object to ensure clean slate
        // This prevents "ghost" data from a previous onboarding session from being merged into
        // an existing account if that account has no data or fails to load.

        const defaultScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const defaultValues = { achievement: 5, independence: 5, recognition: 5, relationships: 5, support: 5, working_conditions: 5 };
        const defaultPersonality = { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 };
        const defaultSelfEfficacy = { 'complex_problem_solving': 5, 'critical_thinking': 5, 'social_perceptiveness': 5, 'active_listening': 5, 'programming': 5 };

        // Check for localStorage backup from anonymous session
        const localBackup = loadFromLocalStorage();

        // Merge logic: Use localStorage data if it exists AND is more recent than DB data
        // OR if DB has no data at all
        const hasDBData = loadedData?.scores || loadedData?.personalityVector;
        const useLocalBackup = localBackup && (!hasDBData || localBackup.reliabilityScore > (loadedData?.progress?.reliabilityScore || 0));

        const newState = {
            user: userData,
            isLoginMode: false,
            isPremium: userData.isPremium || false,

            // Use localStorage backup if available and more complete, otherwise use DB data
            userScores: useLocalBackup ? (localBackup.userScores || defaultScores) : (loadedData?.scores || defaultScores),
            userValues: useLocalBackup ? (localBackup.userValues || defaultValues) : (loadedData?.values || defaultValues),
            personalityVector: useLocalBackup ? (localBackup.personalityVector || defaultPersonality) : (loadedData?.personalityVector || defaultPersonality),
            selfEfficacy: useLocalBackup ? (localBackup.selfEfficacy || defaultSelfEfficacy) : (loadedData?.selfEfficacy || defaultSelfEfficacy),

            // Progress
            reliabilityScore: useLocalBackup ? (localBackup.reliabilityScore || 0) : (loadedData?.progress?.reliabilityScore || 0),
            completedModules: useLocalBackup ? (localBackup.completedModules || []) : (loadedData?.progress?.completedModules || []),
            currentStep: useLocalBackup ? (localBackup.currentStep || 6) : (loadedData?.progress?.currentStep ?? 6),
            dailySwipes: loadedData?.progress?.dailySwipes || 0,
            lastSwipeDate: loadedData?.progress?.lastSwipeDate || null
        };

        // If we used localStorage backup, sync it to database
        if (useLocalBackup && userData.id) {
            console.log('📤 Syncing localStorage backup to database...');

            // Sync all data to database
            if (localBackup.userScores) {
                saveUserScores(userData.id, localBackup.userScores);
            }
            if (localBackup.userValues) {
                saveUserValues(userData.id, localBackup.userValues);
            }
            if (localBackup.personalityVector) {
                savePersonalityVector(userData.id, localBackup.personalityVector);
            }
            if (localBackup.selfEfficacy) {
                saveUserSelfEfficacy(userData.id, localBackup.selfEfficacy);
            }

            // Sync progress
            saveUserProgress(userData.id, {
                reliabilityScore: localBackup.reliabilityScore,
                completedModules: localBackup.completedModules,
                currentStep: localBackup.currentStep,
            });

            // Clear localStorage after successful sync
            setTimeout(() => {
                clearLocalStorage();
                console.log('✅ localStorage backup synced and cleared');
            }, 1000);
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
            userScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
            userValues: { achievement: 5, independence: 5, recognition: 5, relationships: 5, support: 5, working_conditions: 5 },
            selfEfficacy: { 'complex_problem_solving': 5, 'critical_thinking': 5, 'social_perceptiveness': 5, 'active_listening': 5, 'programming': 5 }
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
        } else {
            // Backup to localStorage for anonymous users
            setTimeout(() => get().backupToLocalStorage(), 0);
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
        } else {
            // Backup to localStorage for anonymous users
            setTimeout(() => get().backupToLocalStorage(), 0);
        }

        return { userValues: newValues };
    }),

    // Set personality vector
    setPersonalityVector: (vector) => set((state) => {
        // Auto-save to database if user is logged in
        if (state.user?.id) {
            savePersonalityVector(state.user.id, vector);
        } else {
            // Backup to localStorage for anonymous users
            setTimeout(() => get().backupToLocalStorage(), 0);
        }

        return { personalityVector: vector };
    }),

    // Set self efficacy
    setSelfEfficacy: (efficacyData) => set((state) => {
        const newEfficacy = { ...state.selfEfficacy, ...efficacyData };

        // Auto-save to database if user is logged in
        if (state.user?.id) {
            saveUserSelfEfficacy(state.user.id, newEfficacy);
        }

        return { selfEfficacy: newEfficacy };
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

        const newState = { currentStep: targetStep };

        // Auto-save progress
        if (state.user?.id) {
            saveUserProgress(state.user.id, {
                reliabilityScore: state.reliabilityScore,
                completedModules: state.completedModules,
                currentStep: targetStep,
                dailySwipes: state.dailySwipes,
                lastSwipeDate: state.lastSwipeDate
            });
        } else {
            // Backup to localStorage for anonymous users
            // We use get().backupToLocalStorage() but we can't access get() here easily inside set()
            // So we'll use the imported function directly
            // Backup to localStorage for anonymous users
            saveToLocalStorage({
                ...state,
                currentStep: targetStep
            });
        }

        return newState;
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
        } else {
            // Backup to localStorage for anonymous users
            setTimeout(() => get().backupToLocalStorage(), 0);
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
                updates.userValues = { achievement: 5, independence: 5, recognition: 5, relationships: 5, support: 5, working_conditions: 5 };
            }
            else if (moduleName === 'bigfive') {
                updates.personalityVector = { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 };
            }
            else if (moduleName === 'capabilities') { // Assuming capabilities module writes to selfEfficacy
                updates.selfEfficacy = { 'complex_problem_solving': 5, 'critical_thinking': 5, 'social_perceptiveness': 5, 'active_listening': 5, 'programming': 5 };
            }

            return updates;
        });
    },

    // Helper: Initialize store from localStorage backup (for anonymous users)
    // Should be called on app load BEFORE auth check
    initializeFromBackup: () => {
        const state = get();

        // Only restore if user is NOT logged in
        if (!get().user?.id) {
            const backup = loadFromLocalStorage();

            if (backup) {
                console.log('🔄 Restoring from localStorage backup...', backup);
                set({
                    userScores: backup.userScores || state.userScores,
                    userValues: backup.userValues || state.userValues,
                    personalityVector: backup.personalityVector || state.personalityVector,
                    selfEfficacy: backup.selfEfficacy || state.selfEfficacy,
                    reliabilityScore: backup.reliabilityScore || state.reliabilityScore,
                    completedModules: backup.completedModules || state.completedModules,
                    currentStep: backup.currentStep ?? state.currentStep,
                });
                console.log('✅ Restored from localStorage backup');
            }
        }
    },

    // Helper: Backup current state to localStorage (for anonymous users)
    backupToLocalStorage: () => {
        const state = get();

        // Only backup if user is NOT logged in
        if (!state.user?.id) {
            saveToLocalStorage({
                userScores: state.userScores,
                userValues: state.userValues,
                personalityVector: state.personalityVector,
                selfEfficacy: state.selfEfficacy,
                reliabilityScore: state.reliabilityScore,
                completedModules: state.completedModules,
                currentStep: state.currentStep,
            });
        }
    },

    // Helper: Clear localStorage backup (called after successful login/sync)
    clearBackup: () => {
        clearLocalStorage();
    },

    reset: () => set({
        userScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        userValues: { achievement: 5, independence: 5, recognition: 5, relationships: 5, support: 5, working_conditions: 5 },
        personalityVector: { extraversion: 0, conscientiousness: 0, openness: 0, agreeableness: 0, stability: 0 },
        selfEfficacy: { 'complex_problem_solving': 5, 'critical_thinking': 5, 'social_perceptiveness': 5, 'active_listening': 5, 'programming': 5 },
        currentStep: 0,
        user: null,
        reliabilityScore: 0,
        completedModules: []
    })
}));
