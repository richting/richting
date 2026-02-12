export const MISSIONS = [
    {
        id: 'onboarding',
        title: 'Interest Explorer',
        description: 'Ontdek je interesses (RIASEC)',
        scoreIncrease: 30,
        isPremium: false,
        completed: true, // Auto-completed after onboarding
        icon: '🎯',
        order: 0
    },
    {
        id: 'personality',
        title: 'Persoonlijkheid',
        description: 'Big Five Persoonlijkheidstest',
        scoreIncrease: 20,
        isPremium: false, // Made free as part of core flow
        icon: '🧠',
        order: 1
    },
    {
        id: 'work_values_deep',
        title: 'Werkwaarden',
        description: 'Wat vind jij belangrijk?',
        scoreIncrease: 20,
        isPremium: false, // Made free as part of core flow
        icon: '⚖️',
        order: 2
    },
    {
        id: 'capabilities',
        title: 'Capaciteiten',
        description: 'Ken je eigen kracht (SCCT)',
        scoreIncrease: 20,
        isPremium: true,
        icon: '💪',
        order: 3
    },
    {
        id: 'practice_validation',
        title: 'Praktijk-validatie',
        description: 'Valideer je top-matches',
        scoreIncrease: 10,
        isPremium: true,
        icon: '✅',
        order: 4
    }
];

// Step mappings for navigation
export const MISSION_STEP_MAP = {
    personality: 2, // Now part of onboarding flow
    work_values_deep: 3, // Now part of onboarding flow
    capabilities: 14, // Accessed from Hub
    practice_validation: 11 // Accessed from Hub
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
