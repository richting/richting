// Reliability Engine - Core logic for calculating and managing reliability scores

/**
 * Module definitions with their score contributions
 */
export const MODULES = {
    ONBOARDING_SWIPES: {
        id: 'onboarding_swipes',
        name: 'Onboarding Swipes',
        scoreValue: 30,
        requiresPremium: false
    },
    PERSONALITY_BIG_FIVE: {
        id: 'personality_big_five',
        name: 'Persoonlijkheid (Big Five)',
        scoreValue: 20,
        requiresPremium: true
    },
    VALUES_MODULE: {
        id: 'values_module',
        name: 'Waarden Module',
        scoreValue: 20,
        requiresPremium: true
    },
    DAILY_DILEMMA_1: {
        id: 'daily_dilemma_1',
        name: 'Daily Dilemma 1',
        scoreValue: 5,
        requiresPremium: false
    },
    DAILY_DILEMMA_2: {
        id: 'daily_dilemma_2',
        name: 'Daily Dilemma 2',
        scoreValue: 5,
        requiresPremium: false
    },
    DAILY_DILEMMA_3: {
        id: 'daily_dilemma_3',
        name: 'Daily Dilemma 3',
        scoreValue: 5,
        requiresPremium: false
    },
    DAILY_DILEMMA_4: {
        id: 'daily_dilemma_4',
        name: 'Daily Dilemma 4',
        scoreValue: 5,
        requiresPremium: false
    },
    DAILY_DILEMMA_5: {
        id: 'daily_dilemma_5',
        name: 'Daily Dilemma 5',
        scoreValue: 5,
        requiresPremium: false
    },
    DAILY_DILEMMA_6: {
        id: 'daily_dilemma_6',
        name: 'Daily Dilemma 6',
        scoreValue: 5,
        requiresPremium: false
    }
};

/**
 * Calculate total reliability score based on completed modules
 * @param {string[]} completedModules - Array of completed module IDs
 * @returns {number} Total reliability score (0-100)
 */
export const calculateReliabilityScore = (completedModules) => {
    let totalScore = 0;

    Object.values(MODULES).forEach(module => {
        if (completedModules.includes(module.id)) {
            totalScore += module.scoreValue;
        }
    });

    return Math.min(100, totalScore);
};

/**
 * Get the next available module for the user
 * @param {string[]} completedModules - Array of completed module IDs
 * @param {boolean} isPremium - Whether user has premium access
 * @returns {object|null} Next module or null if all completed
 */
export const getNextModule = (completedModules, isPremium) => {
    const availableModules = Object.values(MODULES).filter(module => {
        // Skip if already completed
        if (completedModules.includes(module.id)) {
            return false;
        }

        // Skip premium modules if user is not premium
        if (module.requiresPremium && !isPremium) {
            return false;
        }

        return true;
    });

    return availableModules.length > 0 ? availableModules[0] : null;
};

/**
 * Get dynamic progress message based on reliability score
 * @param {number} score - Current reliability score (0-100)
 * @returns {string} Progress message
 */
export const getProgressMessage = (score) => {
    if (score < 30) {
        return "Begin je reis. Voltooi de onboarding om je eerste richting te bepalen.";
    } else if (score === 30) {
        return "Richting bepaald. Je profiel is nu nog een ruwe schets.";
    } else if (score < 60) {
        return "Profiel groeit. Meer data betekent betere matches.";
    } else if (score < 100) {
        return "Profiel scherper. Je interesses en waarden zijn gekoppeld.";
    } else {
        return "Volledige Richting bereikt. Je rapport is klaar.";
    }
};

/**
 * Get progress status for UI display
 * @param {number} score - Current reliability score (0-100)
 * @returns {object} Status object with color and label
 */
export const getProgressStatus = (score) => {
    if (score < 30) {
        return {
            color: 'text-gray-500',
            bgColor: 'bg-gray-100',
            label: 'Aan het starten'
        };
    } else if (score < 60) {
        return {
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            label: 'Basis profiel'
        };
    } else if (score < 100) {
        return {
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            label: 'Sterk profiel'
        };
    } else {
        return {
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            label: 'Volledig profiel'
        };
    }
};

/**
 * Check if user can access a specific module
 * @param {string} moduleId - Module ID to check
 * @param {boolean} isPremium - Whether user has premium access
 * @returns {boolean} Whether module is accessible
 */
export const canAccessModule = (moduleId, isPremium) => {
    const module = Object.values(MODULES).find(m => m.id === moduleId);
    if (!module) return false;

    return !module.requiresPremium || isPremium;
};
