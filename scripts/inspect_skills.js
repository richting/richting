import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or Anon Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectData() {
    console.log("Fetching 1 career...");
    const { data: careers, error: cError } = await supabase
        .from('careers')
        .select('*')
        .limit(1);

    if (cError) console.error("Career Error:", cError);
    else {
        const c = careers[0];
        console.log("Career Sample:", c ? c.title : "None");
        console.log("Skills Field Type:", typeof c?.skills);
        console.log("Skills Content:", JSON.stringify(c?.skills, null, 2));
    }

    console.log("\nFetching 1 sector...");
    const { data: sectors, error: sError } = await supabase
        .from('sectors')
        .select('*')
        .limit(1);

    if (sError) console.error("Sector Error:", sError);
    else {
        const s = sectors[0];
        console.log("Sector Sample:", s ? s.title : "None");
        console.log("Top Skills Field Type:", typeof s?.top_skills);
        console.log("Top Skills Content:", JSON.stringify(s?.top_skills, null, 2));
    }
}

inspectData();
