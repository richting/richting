// Removed internal import of careerDirections
// Now accepts 'careers' array as 3rd argument
// Updated to support dynamic weighting based on reliability score

const calculateCosineSimilarity = (vecA, vecB) => {
  const categories = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  categories.forEach(cat => {
    const valA = vecA[cat] || 0;
    const valB = vecB[cat] || 0;
    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  });

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Get dynamic weights based on reliability score
 * @param {number} reliabilityScore - User's current reliability score (0-100)
 * @returns {Object} Weights object with riasec, personality, and values weights
 */
export const getDynamicWeights = (reliabilityScore) => {
  if (reliabilityScore < 40) {
    // Phase 1: Pure RIASEC matching
    return {
      riasec: 1.0,
      personality: 0.0,
      values: 0.0
    };
  } else if (reliabilityScore >= 40 && reliabilityScore < 60) {
    // Phase 2: RIASEC + Personality blend
    return {
      riasec: 0.6,
      personality: 0.4,
      values: 0.0
    };
  } else {
    // Phase 3: RIASEC + Personality + Values
    return {
      riasec: 0.4,
      personality: 0.4,
      values: 0.2
    };
  }
};

/**
 * Calculate personality match between user and career ideal
 * @param {Object} userVector - User's Big Five personality vector
 * @param {Object} careerIdealVector - Career's ideal Big Five personality
 * @returns {number} Similarity score (0-1)
 */
const calculatePersonalityMatch = (userVector, careerIdealVector) => {
  if (!userVector || !careerIdealVector) return 0;

  const factors = ['extraversion', 'conscientiousness', 'openness', 'agreeableness', 'stability'];
  let totalSimilarity = 0;
  let validFactors = 0;

  factors.forEach(factor => {
    if (userVector[factor] !== undefined && careerIdealVector[factor] !== undefined) {
      // Calculate similarity based on absolute difference
      // Max difference is 20 (from -10 to +10)
      const difference = Math.abs(userVector[factor] - careerIdealVector[factor]);
      const similarity = 1 - (difference / 20);
      totalSimilarity += Math.max(0, similarity);
      validFactors++;
    }
  });

  return validFactors > 0 ? totalSimilarity / validFactors : 0;
};

export const calculateMatches = (userScores, userValues, careerData, personalityVector = null, reliabilityScore = 0) => {
  if (!careerData || !Array.isArray(careerData)) return [];

  // Get dynamic weights based on reliability score
  const weights = getDynamicWeights(reliabilityScore);

  const matches = careerData.map(career => {
    // Handle both JSONB (from Supabase) and JS object formats
    const vector = typeof career.riasec_vector === 'string'
      ? JSON.parse(career.riasec_vector)
      : career.riasec_vector;

    // Calculate RIASEC match
    const riasecMatch = calculateCosineSimilarity(userScores, vector);

    // Calculate personality match
    let personalityMatch = 0;
    if (personalityVector && career.personality_fit && weights.personality > 0) {
      const personalityFit = typeof career.personality_fit === 'string'
        ? JSON.parse(career.personality_fit)
        : career.personality_fit;

      personalityMatch = calculatePersonalityMatch(personalityVector, personalityFit);
    }

    // Calculate value bonus
    let valueMatch = 0;
    if (weights.values > 0) {
      // Support both new work_values array and legacy value_fit
      if (career.work_values && Array.isArray(career.work_values)) {
        // Calculate average bonus across all work values
        let totalBonus = 0;
        let validValues = 0;

        career.work_values.forEach(workValue => {
          if (userValues[workValue] !== undefined) {
            const userVal = userValues[workValue];
            // Normalize from 1-10 scale to 0-1 scale
            totalBonus += (userVal - 5) / 5; // Range: -1 to 1
            validValues++;
          }
        });

        if (validValues > 0) {
          // Convert to 0-1 scale for consistency
          valueMatch = (totalBonus / validValues + 1) / 2; // Range: 0 to 1
        }
      } else if (career.value_fit && userValues[career.value_fit] !== undefined) {
        // Legacy support for single value_fit
        const userVal = userValues[career.value_fit];
        valueMatch = (((userVal - 5) / 5) + 1) / 2; // Normalize to 0-1
      }
    }

    // Calculate total score with dynamic weights
    const totalScore =
      (riasecMatch * weights.riasec) +
      (personalityMatch * weights.personality) +
      (valueMatch * weights.values);

    return {
      ...career,
      matchScore: totalScore,
      riasecMatch,
      personalityMatch,
      valueMatch,
      weights: { ...weights } // Include weights for debugging
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

// matchingEngine.js - Career & Sector Matching System
// Multi-Level Matching: Combines direct sector matching with career aggregation and RIASEC congruence

/**
 * Holland's RIASEC Hexagon - Defines relationships between types
 * Adjacent types are compatible, opposite types are incompatible
 */
const HOLLAND_HEXAGON = {
  R: { adjacent: ['I', 'C'], opposite: 'S' },
  I: { adjacent: ['R', 'A'], opposite: 'E' },
  A: { adjacent: ['I', 'S'], opposite: 'C' },
  S: { adjacent: ['A', 'E'], opposite: 'R' },
  E: { adjacent: ['S', 'C'], opposite: 'I' },
  C: { adjacent: ['E', 'R'], opposite: 'A' }
};

/**
 * Get top N RIASEC types from a profile
 * @param {Object} profile - RIASEC profile {R, I, A, S, E, C}
 * @param {number} count - Number of top types to return
 * @returns {Array} Array of type codes sorted by score (highest first)
 */
const getTopRIASECTypes = (profile, count = 2) => {
  const types = Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type);
  return types.slice(0, count);
};

/**
 * Calculate RIASEC congruence bonus based on Holland's Hexagon theory
 * @param {Object} userProfile - User's RIASEC scores
 * @param {Object} sectorProfile - Sector's RIASEC profile
 * @returns {number} Congruence bonus/penalty (-0.15 to +0.10)
 */
const calculateCongruenceBonus = (userProfile, sectorProfile) => {
  const userTop = getTopRIASECTypes(userProfile, 2);
  const sectorTop = getTopRIASECTypes(sectorProfile, 2);

  let bonus = 0;

  // Check primary type compatibility
  const userPrimary = userTop[0];
  const sectorPrimary = sectorTop[0];

  if (userPrimary === sectorPrimary) {
    bonus += 0.05; // Perfect match on primary type
  } else if (HOLLAND_HEXAGON[userPrimary]?.adjacent.includes(sectorPrimary)) {
    bonus += 0.03; // Adjacent types (compatible)
  } else if (HOLLAND_HEXAGON[userPrimary]?.opposite === sectorPrimary) {
    bonus -= 0.15; // Opposite types (incompatible) - strong penalty
  }

  // Check secondary type compatibility (smaller weight)
  if (userTop.length > 1 && sectorTop.length > 1) {
    const userSecondary = userTop[1];
    const sectorSecondary = sectorTop[1];

    if (userSecondary === sectorSecondary) {
      bonus += 0.02;
    } else if (HOLLAND_HEXAGON[userSecondary]?.adjacent.includes(sectorSecondary)) {
      bonus += 0.01;
    }
  }

  return Math.max(-0.15, Math.min(0.10, bonus)); // Cap between -15% and +10%
};

/**
 * Calculate matches for sectors (career clusters)
 * NOW WITH MULTI-LEVEL MATCHING:
 * - 60% Direct sector RIASEC match
 * - 30% Aggregated career matches within sector  
 * - 10% Holland Hexagon congruence bonus
 * @param {Object} userScores - User's RIASEC scores
 * @param {Object} userValues - User's work values
 * @param {Array} sectorData - Array of sector objects from database
 * @param {Object} personalityVector - User's Big Five personality vector
 * @param {number} reliabilityScore - User's reliability score (0-100)
 * @returns {Array} Sorted array of sector matches with scores
 */
export const calculateSectorMatches = (userScores, userValues, sectorData, personalityVector = null, reliabilityScore = 0) => {
  if (!sectorData || !Array.isArray(sectorData)) return [];

  // Get dynamic weights based on reliability score
  const weights = getDynamicWeights(reliabilityScore);

  const matches = sectorData.map(sector => {
    // Handle both JSONB (from Supabase) and JS object formats
    const vector = typeof sector.riasec_vector === 'string'
      ? JSON.parse(sector.riasec_vector)
      : sector.riasec_vector;

    // Calculate RIASEC match
    const riasecMatch = calculateCosineSimilarity(userScores, vector);

    // Calculate personality match
    let personalityMatch = 0;
    if (personalityVector && sector.personality_fit && weights.personality > 0) {
      const personalityFit = typeof sector.personality_fit === 'string'
        ? JSON.parse(sector.personality_fit)
        : sector.personality_fit;

      personalityMatch = calculatePersonalityMatch(personalityVector, personalityFit);
    }

    // Calculate value match
    let valueMatch = 0;
    if (weights.values > 0 && sector.work_values && Array.isArray(sector.work_values)) {
      let totalBonus = 0;
      let validValues = 0;

      sector.work_values.forEach(workValue => {
        if (userValues[workValue] !== undefined) {
          const userVal = userValues[workValue];
          // Normalize from 1-10 scale to 0-1 scale
          totalBonus += (userVal - 5) / 5; // Range: -1 to 1
          validValues++;
        }
      });

      if (validValues > 0) {
        // Convert to 0-1 scale for consistency
        valueMatch = (totalBonus / validValues + 1) / 2; // Range: 0 to 1
      }
    }

    // Calculate RIASEC congruence bonus (Holland Hexagon)
    const congruenceBonus = calculateCongruenceBonus(userScores, vector);

    // Calculate total score with dynamic weights
    // Note: This is the BASE score using traditional weighting
    const baseScore =
      (riasecMatch * weights.riasec) +
      (personalityMatch * weights.personality) +
      (valueMatch * weights.values);

    // Apply congruence bonus (capped at -15% to +10%)
    const totalScore = Math.max(0, Math.min(1, baseScore + congruenceBonus));

    return {
      ...sector,
      matchScore: totalScore,
      riasecMatch,
      personalityMatch,
      valueMatch,
      congruenceBonus, // Include for debugging
      weights: { ...weights } // Include weights for debugging
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Enhanced sector matching with career aggregation
 * This version fetches careers within each sector for more accurate matching
 * @param {Object} userScores - User's RIASEC scores
 * @param {Object} userValues - User's work values
 * @param {Array} sectorData - Array of sector objects
 * @param {Array} careerData - Array of all career objects
 * @param {Object} personalityVector - User's Big Five personality vector
 * @param {number} reliabilityScore - User's reliability score (0-100)
 * @returns {Array} Sorted array of sector matches with enhanced scores
 */
export const calculateSectorMatchesEnhanced = async (userScores, userValues, sectorData, careerData, personalityVector = null, reliabilityScore = 0) => {
  if (!sectorData || !Array.isArray(sectorData)) return [];
  if (!careerData || !Array.isArray(careerData)) {
    // Fallback to regular matching if no career data
    return calculateSectorMatches(userScores, userValues, sectorData, personalityVector, reliabilityScore);
  }

  // Get dynamic weights
  const weights = getDynamicWeights(reliabilityScore);

  const matches = sectorData.map(sector => {
    const vector = typeof sector.riasec_vector === 'string'
      ? JSON.parse(sector.riasec_vector)
      : sector.riasec_vector;

    // 1. Direct sector RIASEC match (60% weight)
    const directSectorMatch = calculateCosineSimilarity(userScores, vector);

    // 2. Career aggregation within sector (30% weight)
    const careersInSector = careerData.filter(c => c.sector_id === sector.id);
    let careerAggregateScore = 0;

    if (careersInSector.length > 0) {
      const topCareers = careersInSector.slice(0, Math.min(10, careersInSector.length));
      const careerScores = topCareers.map(career => {
        const careerVector = typeof career.riasec_vector === 'string'
          ? JSON.parse(career.riasec_vector)
          : career.riasec_vector;
        return calculateCosineSimilarity(userScores, careerVector);
      });
      careerAggregateScore = careerScores.reduce((sum, s) => sum + s, 0) / careerScores.length;
    } else {
      // Fallback to sector score if no careers
      careerAggregateScore = directSectorMatch;
    }

    // 3. Holland congruence bonus (10% as bonus/penalty)
    const congruenceBonus = calculateCongruenceBonus(userScores, vector);

    // Hybrid formula: 60% direct + 30% careers + 10% congruence
    const hybridScore =
      (directSectorMatch * 0.60) +
      (careerAggregateScore * 0.30) +
      (congruenceBonus * 0.10) + 0.10; // +0.10 to normalize congruence from bonus to weight

    // Also calculate personality and value matches
    let personalityMatch = 0;
    if (personalityVector && sector.personality_fit && weights.personality > 0) {
      const personalityFit = typeof sector.personality_fit === 'string'
        ? JSON.parse(sector.personality_fit)
        : sector.personality_fit;
      personalityMatch = calculatePersonalityMatch(personalityVector, personalityFit);
    }

    let valueMatch = 0;
    if (weights.values > 0 && sector.work_values && Array.isArray(sector.work_values)) {
      let totalBonus = 0;
      let validValues = 0;

      sector.work_values.forEach(workValue => {
        if (userValues[workValue] !== undefined) {
          totalBonus += (userValues[workValue] - 5) / 5;
          validValues++;
        }
      });

      if (validValues > 0) {
        valueMatch = (totalBonus / validValues + 1) / 2;
      }
    }

    // Final score: combine hybrid RIASEC with personality and values
    const finalScore =
      (hybridScore * weights.riasec) +
      (personalityMatch * weights.personality) +
      (valueMatch * weights.values);

    return {
      ...sector,
      matchScore: Math.max(0, Math.min(1, finalScore)),
      riasecMatch: directSectorMatch,
      careerAggregateScore,
      congruenceBonus,
      personalityMatch,
      valueMatch,
      careersCount: careersInSector.length,
      weights: { ...weights }
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

export const getVisibleMatches = (matches, reliabilityScore, isPremium) => {
  if (isPremium) {
    if (reliabilityScore >= 100) return matches;
    if (reliabilityScore >= 60) return matches.slice(0, 3);
    return matches.slice(0, 1);
  }

  if (reliabilityScore < 30) return [];
  if (reliabilityScore === 30) return matches.slice(0, 1);
  return matches.slice(0, 1);
};

