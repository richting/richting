// Reliability Engine - Core logic for calculating and managing reliability scores

/**
 * Module definitions with their score contributions
 */
export const MODULES = {
    ONBOARDING_SWIPES: {
        id: 'onboarding', // Changed from 'onboarding_swipes' to match missionData.js
        name: 'Onboarding Swipes',
        scoreValue: 30,
        requiresPremium: false
    },
    PERSONALITY_BIG_FIVE: {
        id: 'personality', // Changed from 'personality_big_five'
        name: 'Persoonlijkheid (Big Five)',
        scoreValue: 20,
        requiresPremium: true
    },
    CAPABILITIES: {
        id: 'capabilities',
        name: 'Capaciteiten',
        scoreValue: 20,
        requiresPremium: true
    },
    WORK_VALUES_DEEP: {
        id: 'work_values_deep',
        name: 'Werkwaarden Verdieping',
        scoreValue: 15,
        requiresPremium: false
    },
    PRACTICE_VALIDATION: {
        id: 'practice_validation',
        name: 'Praktijk-validatie',
        scoreValue: 15,
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
