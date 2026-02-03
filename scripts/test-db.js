
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwrbumxsqrxfjakgypom.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cmJ1bXhzcXJ4Zmpha2d5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTE3NjAsImV4cCI6MjA4NTI2Nzc2MH0.x6EAuNyZ8iOp3ubTc35vAu0kGPgX-KuulQaaZHWuzzE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testDatabase() {
    console.log('--- STARTING DATABASE TEST ---');

    // 1. Test Connection
    try {
        const { data, error } = await supabase.from('user_scores').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('CONNECTION FAILED:', error);
            return;
        }
        console.log('✅ Connection Successful (user_scores table exists)');
    } catch (e) {
        console.error('CRITICAL ERROR:', e);
        return;
    }

    // 2. We need a valid user ID to test RLS policies.
    // We cannot insert into tables without a valid auth user usually, unless RLS is off.
    // Let's try to sign in with a test user or create one?
    // Actually, let's try to lookup the first user in `user_profiles` and use that ID.

    console.log('Fetching a test user ID...');
    const { data: users, error: userError } = await supabase.from('user_profiles').select('id').limit(1);

    if (userError || !users || users.length === 0) {
        console.error('Cannot find any user to test with. Aborting write test.', userError);
        return;
    }

    const TEST_USER_ID = users[0].id; // Use the first found user
    console.log(`Using Test User ID: ${TEST_USER_ID}`);

    // 3. Try to Load Data (Read Test)
    console.log('Attempting READ...');
    const { data: readData, error: readError } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', TEST_USER_ID)
        .single();

    if (readError) {
        if (readError.code === 'PGRST116') {
            console.log('ℹ️ READ: User has no scores yet (0 rows)');
        } else {
            console.error('❌ READ FAILED:', readError);
        }
    } else {
        console.log('✅ READ SUCCESS:', readData);
    }

    // 4. Try to Save Data (Write Test)
    // Note: This might fail if RLS requires us to be authenticated as that user.
    // Since we are using the ANON key, we are NOT authenticated as that user.
    // WE CANNOT WRITE to a user's row unless we are logged in as them (usually).
    // This script proves if RLS is enforced.

    console.log('Attempting WRITE (Upsert)...');
    const { error: writeError } = await supabase
        .from('user_scores')
        .upsert({
            user_id: TEST_USER_ID,
            r_score: 99, // Distinctive value
            i_score: 99
        }, { onConflict: 'user_id' });

    if (writeError) {
        console.error('❌ WRITE FAILED (Expected if RLS is on):', writeError);
        console.log('ℹ️ If RLS is ON, this failure is NORMAL for an unauthenticated script.');
    } else {
        console.log('✅ WRITE SUCCESS (RLS might be off or permissive)');
    }
}

testDatabase();
