import XLSX from 'xlsx';
import path from 'path';

const CROSSWALK_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'ESCO_to_ONET-SOC.xlsx');
const workbook = XLSX.readFile(CROSSWALK_FILE_PATH);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('First 5 rows:');
data.slice(0, 5).forEach((row, i) => {
    console.log(`Row ${i}:`, JSON.stringify(row));
});
