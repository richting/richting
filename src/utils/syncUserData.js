import { supabase } from '../lib/supabase';

/**
 * Save user RIASEC scores to database
 * @param {string} userId - User UUID
 * @param {Object} scores - RIASEC scores object { R, I, A, S, E, C }
 */
export async function saveUserScores(userId, scores) {
    try {
        const { error } = await supabase
            .from('user_scores')
            .upsert({
                user_id: userId,
                r_score: scores.R || 0,
                i_score: scores.I || 0,
                a_score: scores.A || 0,
                s_score: scores.S || 0,
                e_score: scores.E || 0,
                c_score: scores.C || 0
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error saving scores:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save user scores:', error);
    }
}

/**
 * Save user work values to database
 * @param {string} userId - User UUID
 * @param {Object} values - Work values object
 */
export async function saveUserValues(userId, values) {
    try {
        // Support both new O*NET keys and legacy keys for backward compatibility
        const upsertData = {
            user_id: userId,
            // New O*NET Keys
            achievement: values.achievement || 5,
            independence: values.independence || 5,
            recognition: values.recognition || 5,
            relationships: values.relationships || 5,
            support: values.support || 5,
            working_conditions: values.working_conditions || 5,
            // Legacy Keys (map roughly or keep defaults)
            security: values.working_conditions || values.security || 5,
            creativity: values.independence || values.creativity || 5,
            autonomy: values.independence || values.autonomy || 5,
            team: values.relationships || values.team || 5,
            dynamic: values.recognition || values.dynamic || 5, // Rough mapping
            impact: values.achievement || values.impact || 5
        };

        const { error } = await supabase
            .from('user_values')
            .upsert(upsertData, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error saving values:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save user values:', error);
    }
}

/**
 * Save user self-efficacy (skills confidence) to database
 * @param {string} userId - User UUID
 * @param {Object} efficacyMap - Map of skill_key -> confidence_score (1-10)
 */
export async function saveUserSelfEfficacy(userId, efficacyMap) {
    try {
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                self_efficacy: efficacyMap
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Error saving self efficacy:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save self efficacy:', error);
    }
}

/**
 * Save user progress to database
 * @param {string} userId - User UUID
 * @param {Object} progress - Progress object
 */
export async function saveUserProgress(userId, progress) {
    try {
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                reliability_score: progress.reliabilityScore || 0,
                completed_modules: progress.completedModules || [],
                current_step: progress.currentStep || 0,
                daily_swipes: progress.dailySwipes !== undefined ? progress.dailySwipes : 0,
                last_swipe_date: progress.lastSwipeDate || null
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save user progress:', error);
    }
}

/**
 * Save user personality vector to database
 * @param {string} userId - User UUID
 * @param {Object} personalityVector - Big Five personality scores
 */
export async function savePersonalityVector(userId, personalityVector) {
    try {
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                personality_vector: personalityVector
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Error saving personality vector:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save personality vector:', error);
    }
}

/**
 * Save a user response (swipe or dilemma)
 * @param {string} userId - User UUID
 * @param {string} responseType - 'swipe' or 'dilemma'
 * @param {string} itemId - Card ID or dilemma ID
 * @param {string} responseValue - 'left', 'right', or slider value
 */
export async function saveUserResponse(userId, responseType, itemId, responseValue) {
    try {
        const { error } = await supabase
            .from('user_responses')
            .insert({
                user_id: userId,
                response_type: responseType,
                item_id: itemId,
                response_value: responseValue
            });

        if (error) {
            console.error('Error saving response:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to save user response:', error);
    }
}

/**
 * Load all user data from database
 * @param {string} userId - User UUID
 * @returns {Object} User data object with scores, values, and progress
 */
// Load user data from database
// Returns { data: Object, error: Error | null }
export async function loadUserData(userId) {
    console.log('Loading user data for:', userId);

    let criticalError = null;

    // Helper to safely fetch single row
    const fetchTable = async (table) => {
        if (criticalError) return null; // Stop fetching if already failed

        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // PGRST116 means 0 rows found - this is normal for new/empty accounts
            if (error.code === 'PGRST116') {
                return null;
            }
            // REAL Error (Network, Auth, etc)
            console.error(`Error loading ${table}:`, error);
            criticalError = error; // Capture the first error
            return null;
        }
        return data;
    };

    try {
        // Execute fetches in parallel
        const [scoresData, valuesData, progressData] = await Promise.all([
            fetchTable('user_scores'),
            fetchTable('user_values'),
            fetchTable('user_progress')
        ]);

        if (criticalError) {
            return { data: null, error: criticalError };
        }

        const userDataStructure = {
            scores: scoresData ? {
                R: scoresData.r_score,
                I: scoresData.i_score,
                A: scoresData.a_score,
                S: scoresData.s_score,
                E: scoresData.e_score,
                C: scoresData.c_score
            } : null,
            values: valuesData ? {
                // New O*NET Keys
                achievement: valuesData.achievement || 5,
                independence: valuesData.independence || 5,
                recognition: valuesData.recognition || 5,
                relationships: valuesData.relationships || 5,
                support: valuesData.support || 5,
                working_conditions: valuesData.working_conditions || 5,
                // Legacy Fallback
                security: valuesData.security,
                creativity: valuesData.creativity,
                autonomy: valuesData.autonomy,
                team: valuesData.team,
                dynamic: valuesData.dynamic,
                impact: valuesData.impact
            } : null,
            progress: progressData ? {
                reliabilityScore: progressData.reliability_score,
                completedModules: progressData.completed_modules || [],
                currentStep: progressData.current_step || 0,
                dailySwipes: progressData.daily_swipes || 0,
                lastSwipeDate: progressData.last_swipe_date || null
            } : null,
            personalityVector: progressData?.personality_vector ?
                progressData.personality_vector : null,
            selfEfficacy: progressData?.self_efficacy ?
                progressData.self_efficacy : null
        };

        return { data: userDataStructure, error: null };

    } catch (error) {
        console.error('Critical failure in loadUserData:', error);
        return { data: null, error: error };
    }
}

/**
 * Initialize user data tables for a new user
 * @param {string} userId - User UUID
 */
export async function initializeUserData(userId) {
    try {
        await Promise.all([
            supabase.from('user_scores').insert({
                user_id: userId,
                r_score: 0,
                i_score: 0,
                a_score: 0,
                s_score: 0,
                e_score: 0,
                c_score: 0
            }),
            supabase.from('user_values').insert({
                user_id: userId,
                security: 5,
                creativity: 5,
                autonomy: 5,
                team: 5,
                dynamic: 5,
                impact: 5
            }),
            supabase.from('user_progress').insert({
                user_id: userId,
                reliability_score: 0,
                completed_modules: [],
                current_step: 0
            })
        ]);
    } catch (error) {
        console.error('Failed to initialize user data:', error);
    }
}
/**
 * Reset a specific module's progress
 * @param {string} userId - User UUID
 * @param {string} moduleName - 'swipes', 'dilemmas', 'values', 'bigfive'
 */
export async function resetUserModule(userId, moduleName) {
    try {
        console.log(`Resetting module ${moduleName} for user ${userId}`);

        // 1. Reset specific data tables
        if (moduleName === 'onboarding') {
            await supabase.from('user_progress').update({
                current_step: 0
            }).eq('user_id', userId);
        }
        else if (moduleName === 'swipes') {
            await supabase.from('user_scores').upsert({
                user_id: userId,
                r_score: 0, i_score: 0, a_score: 0,
                s_score: 0, e_score: 0, c_score: 0
            }, { onConflict: 'user_id' });
            // Also clear swiped cards tracking if possible?
            // We don't have a table for that yet easily accessible here,
            // but the scores are the main thing.
        }
        else if (moduleName === 'dilemmas' || moduleName === 'values') {
            await supabase.from('user_values').upsert({
                user_id: userId,
                security: 5, creativity: 5, autonomy: 5,
                team: 5, dynamic: 5, impact: 5
            }, { onConflict: 'user_id' });
        }
        else if (moduleName === 'bigfive') {
            await supabase.from('user_progress').update({
                personality_vector: {
                    extraversion: 0, conscientiousness: 0, openness: 0,
                    agreeableness: 0, stability: 0
                }
            }).eq('user_id', userId);
        }

        // 2. Remove from completed_modules list
        // Map generic module names (from Profile) to specific internal IDs (from Completion)
        const IDS_TO_REMOVE = {
            'swipes': ['onboarding_swipes', 'swipes'],
            'dilemmas': ['dilemmas'],
            'values': ['work_values_deep', 'values_module', 'values'],
            'bigfive': ['personality', 'personality_big_five', 'bigfive'],
            'onboarding': ['onboarding']
        };

        const idsToRemove = IDS_TO_REMOVE[moduleName] || [moduleName];

        // First get current progress
        const { data: progress } = await supabase
            .from('user_progress')
            .select('completed_modules')
            .eq('user_id', userId)
            .single();

        if (progress && progress.completed_modules) {
            const newModules = progress.completed_modules.filter(m => !idsToRemove.includes(m));

            await supabase.from('user_progress').update({
                completed_modules: newModules
            }).eq('user_id', userId);
        }

    } catch (error) {
        console.error(`Failed to reset module ${moduleName}:`, error);
        throw error;
    }
}
