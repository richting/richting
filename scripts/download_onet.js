import https from 'https';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const URL = 'https://www.onetcenter.org/dl_files/database/db_29_1_text.zip';
const ZIP_PATH = path.join(process.cwd(), 'db_29_1_text.zip');
const EXTRACT_PATH = path.join(process.cwd(), 'onet_data');

if (!fs.existsSync(EXTRACT_PATH)) {
    fs.mkdirSync(EXTRACT_PATH, { recursive: true });
}

console.log(`Downloading O*NET data from ${URL}...`);

const file = fs.createWriteStream(ZIP_PATH);

https.get(URL, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to download: ${response.statusCode}`);
        return;
    }

    response.pipe(file);

    file.on('finish', () => {
        file.close(() => {
            console.log('Download complete. Extracting...');

            // Use PowerShell to unzip (since we are on Windows)
            const cmd = `powershell -Command "Expand-Archive -Path '${ZIP_PATH}' -DestinationPath '${EXTRACT_PATH}' -Force"`;

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error extracting:', error);
                    return;
                }
                console.log('Extraction complete!');

                // Cleanup zip
                fs.unlinkSync(ZIP_PATH);
            });
        });
    });
}).on('error', (err) => {
    fs.unlink(ZIP_PATH, () => { }); // Delete the file async
    console.error('Error downloading:', err.message);
});
