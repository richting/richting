import { supabase } from '../lib/supabase'; // Assuming supabase client is exported from here

export const assessmentService = {
    // --- Generic Content ---
    async getQuestions(moduleType) {
        const { data, error } = await supabase
            .from('assessment_questions')
            .select('*')
            .eq('module', moduleType)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data;
    },

    // --- RIASEC ---
    async saveRiasecSwipe(userId, cardId, direction, scores) {
        // Save response log
        const { error: logError } = await supabase
            .from('user_responses')
            .insert({
                user_id: userId,
                response_type: 'swipe',
                item_id: cardId,
                response_value: direction
            });

        if (logError) console.error('Error logging swipe:', logError);

        // We don't save full scores every swipe to DB to avoid spam, 
        // but we could save state periodically.
        // Logic for that should be in the component or a debounced function.
    },

    async completeRiasecModule(userId, finalScores) {
        const { error } = await supabase
            .from('user_scores')
            .upsert({
                user_id: userId,
                r_score: finalScores.R,
                i_score: finalScores.I,
                a_score: finalScores.A,
                s_score: finalScores.S,
                e_score: finalScores.E,
                c_score: finalScores.C,
                updated_at: new Date()
            });

        if (error) throw error;

        // Update progress
        await this.updateProgress(userId, 'riasec');
    },

    // --- Big Five ---
    async completeBigFive(userId, scores) {
        // Assuming we store big5 in user_progress.personality_vector or a new table
        // For now, using user_progress based on existing migration
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                personality_vector: scores,
                updated_at: new Date()
            });

        if (error) throw error;
        await this.updateProgress(userId, 'big5');
    },

    // --- Work Values ---
    async saveWorkValues(userId, values) {
        const { error } = await supabase
            .from('user_values')
            .upsert({
                user_id: userId,
                ...values, // achievement, independence, etc.
                updated_at: new Date()
            });

        if (error) throw error;
        await this.updateProgress(userId, 'work_values');
    },

    // --- Shared Progress Helper ---
    async updateProgress(userId, moduleName) {
        // Fetch current completed modules
        const { data, error } = await supabase
            .from('user_progress')
            .select('completed_modules, reliability_score')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found (create new)

        let completed = data?.completed_modules || [];
        let reliability = data?.reliability_score || 0;

        if (!completed.includes(moduleName)) {
            completed.push(moduleName);

            // Update reliability score based on module
            const rewards = {
                'riasec': 30,
                'big5': 20,
                'work_values': 20,
                'scct': 10
            };

            reliability += (rewards[moduleName] || 0);
        }

        await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                completed_modules: completed,
                reliability_score: reliability,
                updated_at: new Date()
            });
    }
};
