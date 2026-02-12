
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env');
let envVars = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        }
    });
} catch (e) {
    console.error("Could not read .env file:", e);
}

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGradients() {
    console.log('Searching for questions matching "verhaal"...');

    const { data: questions, error } = await supabase
        .from('assessment_questions')
        .select('id, question_text, metadata, module')
        .ilike('question_text', '%verhaal%')
        .limit(10);

    if (error) {
        console.error('Error fetching questions:', error);
        return;
    }

    console.log(`Found ${questions.length} questions.`);

    questions.forEach(q => {
        console.log(`ID: ${q.id}`);
        console.log(`Text: "${q.question_text}"`);
        console.log(`Module: "${q.module}"`);
        console.log(`Gradient: "${q.metadata?.gradient}"`);
    });
}

checkGradients();
