
import { calculateMatches, calculateSectorMatchesEnhanced, getDynamicWeights } from '../src/utils/matchingEngine.js';

// Mock Data
const userScores = { R: 20, I: 5, A: 5, S: 5, E: 5, C: 5 }; // High Realistic
const userValues = { achievement: 10, independence: 10, recognition: 5, relationships: 5, support: 5, working_conditions: 5 };
const personalityVector = { extraversion: 10, conscientiousness: 10, openness: 10, agreeableness: 10, stability: 10 };
const selfEfficacy = { 'programming': 10, 'critical_thinking': 10, 'complex_problem_solving': 10 };

const mockSector = [{
    id: 1,
    name_nl: "Tech Sector",
    riasec_vector: { R: 20, I: 5, A: 5, S: 5, E: 5, C: 5 }, // Perfect match
    personality_fit: { extraversion: 10, conscientiousness: 10, openness: 10, agreeableness: 10, stability: 10 }, // Perfect match
    work_values: ['achievement', 'independence'], // Perfect match
    top_skills: [
        { name: "Programming", level: 7, importance: 5 },
        { name: "Critical Thinking", level: 7, importance: 5 },
        { name: "Complex Problem Solving", level: 7, importance: 5 }
    ]
}];

const mockCareer = [{
    title: "Software Dev",
    riasec_vector: { R: 20, I: 5, A: 5, S: 5, E: 5, C: 5 },
    personality_fit: { extraversion: 10, conscientiousness: 10, openness: 10, agreeableness: 10, stability: 10 },
    work_values: ['achievement', 'independence'],
    skills: [
        { name: "Programming", level: 7, importance: 5 },
        { name: "Critical Thinking", level: 7, importance: 5 },
        { name: "Complex Problem Solving", level: 7, importance: 5 }
    ],
    sector_id: 1
}];

async function runTests() {
    console.log("--- Testing Scoring Logic ---");

    // Test Phase 3 (Full Reliability)
    console.log("\n1. Testing Phase 3 (Score 100) - Perfect Match Scenario");
    const weights = getDynamicWeights(100);
    console.log("Weights:", weights);

    const matches = calculateMatches(
        userScores,
        userValues,
        mockCareer,
        personalityVector,
        100,
        selfEfficacy
    );

    const match = matches[0];
    console.log(`Match Score: ${match.matchScore.toFixed(4)}`);
    console.log(`- RIASEC (${match.weights.riasec}): ${match.riasecMatch.toFixed(4)}`);
    console.log(`- Personality (${match.weights.personality}): ${match.personalityMatch.toFixed(4)}`);
    console.log(`- Values (${match.weights.values}): ${match.valueMatch.toFixed(4)}`);
    console.log(`- SCCT Modifier (${match.weights.scct}): ${match.scctModifier.toFixed(4)}`);

    if (match.matchScore < 0.99) {
        console.error("FAIL: Perfect match should be close to 1.0");
    } else {
        console.log("PASS: Perfect match logic holds");
    }

    // Test Sector Enhanced
    console.log("\n2. Testing Sector Enhanced (Score 100)");
    const sectorMatches = await calculateSectorMatchesEnhanced(
        userScores,
        userValues,
        mockSector,
        mockCareer,
        personalityVector,
        100,
        selfEfficacy
    );
    const sMatch = sectorMatches[0];
    console.log(`Sector Score: ${sMatch.matchScore.toFixed(4)}`);
    console.log(`- Hybrid RIASEC: ${((sMatch.riasecMatch * 0.6) + (sMatch.careerAggregateScore * 0.3) + (sMatch.congruenceBonus * 0.1) + 0.1).toFixed(4)}`); // Reconstruct logic
    console.log(`    - Direct: ${sMatch.riasecMatch}`);
    console.log(`    - Career Agg: ${sMatch.careerAggregateScore}`);
    console.log(`    - Congruence: ${sMatch.congruenceBonus}`);

}

runTests();
