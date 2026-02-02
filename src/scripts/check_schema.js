import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn() {
    console.log('Checking for personality_vector column in user_progress...');

    // Try to select the column from the table
    // We specify the column explicitly. If it doesn't exist, Supabase/PostgREST usually ignores it or returns an error depending on exact query,
    // but a more robust way is to try an update or insert, OR just inspect error.

    // Actually, selecting it is the safest "read-only" check.
    const { data, error } = await supabase
        .from('user_progress')
        .select('personality_vector')
        .limit(1);

    if (error) {
        console.error('Error selecting column:', error.message);
        if (error.message.includes('does not exist') || error.code === 'PGRST301') { // Code for column not found often varies but message is key
            console.log('VERIFICATION FAILED: Column likely missing.');
        }
        process.exit(1);
    }

    console.log('Success! Query for personality_vector executed without error.');
    console.log('Data:', data);
    console.log('VERIFICATION SUCESS: Column exists.');
}

checkColumn();
