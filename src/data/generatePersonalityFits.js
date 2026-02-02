// Helper function to generate personality_fit based on RIASEC vector
// This creates reasonable personality profiles for careers based on their dominant RIASEC types

export function generatePersonalityFit(riasecVector) {
    // Initialize personality vector
    const personality = {
        extraversion: 0,
        conscientiousness: 0,
        openness: 0,
        agreeableness: 0,
        stability: 0
    };

    // Realistic (R) - Practical, hands-on
    // Low extraversion, high conscientiousness, moderate openness
    personality.extraversion += riasecVector.R * -5;
    personality.conscientiousness += riasecVector.R * 6;
    personality.openness += riasecVector.R * 2;

    // Investigative (I) - Analytical, curious
    // Low extraversion, high openness, moderate conscientiousness
    personality.extraversion += riasecVector.I * -4;
    personality.openness += riasecVector.I * 8;
    personality.conscientiousness += riasecVector.I * 5;

    // Artistic (A) - Creative, expressive
    // High openness, lower conscientiousness, moderate extraversion
    personality.openness += riasecVector.A * 9;
    personality.conscientiousness += riasecVector.A * -2;
    personality.extraversion += riasecVector.A * 3;

    // Social (S) - People-oriented, helpful
    // High extraversion, high agreeableness, moderate openness
    personality.extraversion += riasecVector.S * 7;
    personality.agreeableness += riasecVector.S * 8;
    personality.openness += riasecVector.S * 4;

    // Enterprising (E) - Leadership, persuasive
    // High extraversion, lower agreeableness, moderate conscientiousness
    personality.extraversion += riasecVector.E * 8;
    personality.agreeableness += riasecVector.E * -2;
    personality.conscientiousness += riasecVector.E * 5;
    personality.stability += riasecVector.E * 6;

    // Conventional (C) - Organized, detail-oriented
    // Low openness, high conscientiousness, moderate extraversion
    personality.conscientiousness += riasecVector.C * 8;
    personality.openness += riasecVector.C * -5;
    personality.extraversion += riasecVector.C * -2;
    personality.stability += riasecVector.C * 5;

    // Normalize to -10 to +10 range and round
    Object.keys(personality).forEach(key => {
        personality[key] = Math.max(-10, Math.min(10, Math.round(personality[key])));
    });

    return personality;
}

// Script to add personality_fit to all careers
import { onetOccupations } from './onetOccupations.js';

const updatedCareers = onetOccupations.map(career => {
    if (!career.personality_fit) {
        return {
            ...career,
            personality_fit: generatePersonalityFit(career.riasec_vector)
        };
    }
    return career;
});

console.log('Sample personality fits:');
console.log('Software Developer:', JSON.stringify(updatedCareers.find(c => c.title === 'Software Developer')?.personality_fit, null, 2));
console.log('Verpleegkundige:', JSON.stringify(updatedCareers.find(c => c.title === 'Verpleegkundige')?.personality_fit, null, 2));
console.log('Marketing Manager:', JSON.stringify(updatedCareers.find(c => c.title === 'Marketing Manager')?.personality_fit, null, 2));
console.log('Accountant:', JSON.stringify(updatedCareers.find(c => c.title === 'Accountant')?.personality_fit, null, 2));

export { updatedCareers };
