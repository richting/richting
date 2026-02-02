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
        const { error } = await supabase
            .from('user_values')
            .upsert({
                user_id: userId,
                security: values.security || 5,
                creativity: values.creativity || 5,
                autonomy: values.autonomy || 5,
                team: values.team || 5,
                dynamic: values.dynamic || 5,
                impact: values.impact || 5
            }, {
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
export async function loadUserData(userId) {
    try {
        const [scoresResult, valuesResult, progressResult] = await Promise.all([
            supabase.from('user_scores').select('*').eq('user_id', userId).single(),
            supabase.from('user_values').select('*').eq('user_id', userId).single(),
            supabase.from('user_progress').select('*').eq('user_id', userId).single()
        ]);

        return {
            scores: scoresResult.data ? {
                R: scoresResult.data.r_score,
                I: scoresResult.data.i_score,
                A: scoresResult.data.a_score,
                S: scoresResult.data.s_score,
                E: scoresResult.data.e_score,
                C: scoresResult.data.c_score
            } : null,
            values: valuesResult.data ? {
                security: valuesResult.data.security,
                creativity: valuesResult.data.creativity,
                autonomy: valuesResult.data.autonomy,
                team: valuesResult.data.team,
                dynamic: valuesResult.data.dynamic,
                impact: valuesResult.data.impact
            } : null,
            progress: progressResult.data ? {
                reliabilityScore: progressResult.data.reliability_score,
                completedModules: progressResult.data.completed_modules,
                currentStep: progressResult.data.current_step,
                dailySwipes: progressResult.data.daily_swipes || 0,
                lastSwipeDate: progressResult.data.last_swipe_date || null
            } : null,
            personalityVector: progressResult.data?.personality_vector ?
                progressResult.data.personality_vector : null
        };
    } catch (error) {
        console.error('Failed to load user data:', error);
        return { scores: null, values: null, progress: null, personalityVector: null };
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
