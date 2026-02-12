import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

function cosineSimilarity(vecA, vecB) {
    const properties = ['R', 'I', 'A', 'S', 'E', 'C'];
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (const prop of properties) {
        const valA = vecA[prop] || 0;
        const valB = vecB[prop] || 0;
        dotProduct += valA * valB;
        magnitudeA += valA * valA;
        magnitudeB += valB * valB;
    }

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function verifyRecommendations() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();

        // 1. Fetch all mapped jobs
        const res = await client.query('SELECT title_nl, riasec_vector FROM esco_occupations WHERE riasec_vector IS NOT NULL');
        const jobs = res.rows;
        console.log(`Loaded ${jobs.length} jobs for simulation.`);

        // 2. Define Test Profiles
        const testProfiles = [
            {
                name: 'The Builder (High Realistic)',
                scores: { R: 1.0, I: 0.2, A: 0.1, S: 0.1, E: 0.2, C: 0.5 }
            },
            {
                name: 'The Helper (High Social)',
                scores: { R: 0.1, I: 0.3, A: 0.4, S: 1.0, E: 0.5, C: 0.2 }
            },
            {
                name: 'The Organizer (High Conventional)',
                scores: { R: 0.2, I: 0.1, A: 0.1, S: 0.3, E: 0.4, C: 1.0 }
            }
        ];

        // 3. Run Simulation
        for (const profile of testProfiles) {
            console.log(`\n--- Simulation: ${profile.name} ---`);
            const scoredJobs = jobs.map(job => {
                const vector = typeof job.riasec_vector === 'string' ? JSON.parse(job.riasec_vector) : job.riasec_vector;
                return {
                    title: job.title_nl,
                    score: cosineSimilarity(profile.scores, vector)
                };
            });

            // Sort by score desc
            scoredJobs.sort((a, b) => b.score - a.score);

            // Show top 5
            console.table(scoredJobs.slice(0, 5));
        }

    } catch (err) {
        console.error('Error verifying recommendations:', err);
    } finally {
        await client.end();
    }
}

verifyRecommendations();
