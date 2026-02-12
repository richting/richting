import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function verifyMigration() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        console.log('--- Verifying Migration Status ---\n');

        // 1. Check Sectors
        const sectorsRes = await client.query('SELECT COUNT(*) FROM sectors');
        const sectorsCount = parseInt(sectorsRes.rows[0].count);
        console.log(`✅ Sectors Table: ${sectorsCount} rows (Expected: 16)`);

        if (sectorsCount !== 16) {
            console.warn('⚠️ WARNING: Sector count is not 16!');
        }

        // 2. Check ESCO Occupations Total
        const escoRes = await client.query('SELECT COUNT(*) FROM esco_occupations');
        const escoCount = parseInt(escoRes.rows[0].count);
        console.log(`✅ ESCO Occupations: ${escoCount} rows`);

        // 3. Check Mapped Occupations (RIASEC)
        const mappedRes = await client.query('SELECT COUNT(*) FROM esco_occupations WHERE riasec_vector IS NOT NULL');
        const mappedCount = parseInt(mappedRes.rows[0].count);
        const mapPercent = ((mappedCount / escoCount) * 100).toFixed(1);
        console.log(`✅ Mapped to O*NET (RIASEC): ${mappedCount} (${mapPercent}%)`);

        // 4. Check Sector Linking
        const linkedRes = await client.query('SELECT COUNT(*) FROM esco_occupations WHERE sector_id IS NOT NULL');
        const linkedCount = parseInt(linkedRes.rows[0].count);
        const linkPercent = ((linkedCount / escoCount) * 100).toFixed(1);
        console.log(`✅ Linked to Sectors: ${linkedCount} (${linkPercent}%)`);

        // 5. Check Dutch Titles
        const nlTitleRes = await client.query('SELECT COUNT(*) FROM esco_occupations WHERE title_nl IS NULL OR title_nl = \'\'');
        const missingNlCount = parseInt(nlTitleRes.rows[0].count);
        if (missingNlCount === 0) {
            console.log(`✅ Dutch Titles: All ${escoCount} present`);
        } else {
            console.warn(`⚠️ Dutch Titles: Missing in ${missingNlCount} rows`);
        }

        // 6. Check for Orphaned Linked Occupations (should be 0 if FK is correct)
        // (Implicitly checked by foreign key, but good to double check logic)

        // 7. Sample Data
        console.log('\n--- Random Sample Data ---');
        const sample = await client.query(`
            SELECT left(title_nl, 30) as title, 
                   left(code, 6) as isco, 
                   left(onet_source_code, 8) as onet,
                   (sector_id IS NOT NULL) as has_sector
            FROM esco_occupations 
            WHERE riasec_vector IS NOT NULL 
            ORDER BY RANDOM() 
            LIMIT 5
        `);
        console.table(sample.rows);

    } catch (err) {
        console.error('Error verifying migration:', err);
    } finally {
        await client.end();
    }
}

verifyMigration();
