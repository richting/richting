export const MISSIONS = [
    {
        id: 'onboarding',
        title: 'Basis Onboarding',
        description: 'Swipes en Dilemma\'s voltooid',
        scoreIncrease: 30,
        isPremium: false,
        completed: true, // Auto-completed after onboarding
        icon: '🎯',
        order: 0
    },
    {
        id: 'personality',
        title: 'Persoonlijkheid',
        description: 'Verdiep je persoonlijkheidsprofiel',
        scoreIncrease: 20,
        isPremium: true,
        icon: '🧠',
        order: 1
    },
    {
        id: 'capabilities',
        title: 'Capaciteiten',
        description: 'Ontdek je sterke punten',
        scoreIncrease: 20,
        isPremium: true,
        icon: '💪',
        order: 2
    },
    {
        id: 'work_values_deep',
        title: 'Werkwaarden Verdieping',
        description: 'Verfijn je werkwaarden',
        scoreIncrease: 15,
        isPremium: false,
        icon: '⚖️',
        order: 3
    },
    {
        id: 'practice_validation',
        title: 'Praktijk-validatie',
        description: 'Valideer met echte scenario\'s',
        scoreIncrease: 15,
        isPremium: false,
        icon: '✅',
        order: 4
    }
];

// Step mappings for navigation
export const MISSION_STEP_MAP = {
    personality: 8,
    capabilities: 9,
    work_values_deep: 10,
    practice_validation: 11
};

// Helper to get next uncompleted mission
export const getNextMission = (completedModules) => {
    return MISSIONS.find(mission =>
        !completedModules.includes(mission.id) && mission.id !== 'onboarding'
    );
};

// Helper to calculate total possible score
export const getTotalPossibleScore = () => {
    return MISSIONS.reduce((sum, mission) => sum + mission.scoreIncrease, 0);
};

// Helper to get mission by ID
export const getMissionById = (id) => {
    return MISSIONS.find(mission => mission.id === id);
};
