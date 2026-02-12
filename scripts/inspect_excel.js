import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const CROSSWALK_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'ESCO_to_ONET-SOC.xlsx');

console.log(`Reading: ${CROSSWALK_FILE_PATH}`);

if (fs.existsSync(CROSSWALK_FILE_PATH)) {
    const workbook = XLSX.readFile(CROSSWALK_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header:1 returns array of arrays
    
    if (data.length > 0) {
        console.log('Headers:', data[0]);
        if (data.length > 1) {
             console.log('First row data:', data[1]);
        }
    } else {
        console.log('Sheet is empty');
    }
} else {
    console.error('File not found');
}
