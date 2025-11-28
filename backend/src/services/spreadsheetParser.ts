import xlsx from 'xlsx';
import fs from 'fs';
import { parse as csvParse } from 'csv-parse';

type RawRow = Record<string, any>;

function parseXlsx(filePath: string): RawRow[] {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet, { defval: null });
}

function parseCsv(filePath: string): RawRow[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const records = csvParse(content, {
        columns: true,
        skip_empty_lines: true,
    }) as unknown as RawRow[];
    return records;
}

export default async function parseSpreadsheet(filePath: string): Promise<RawRow[]> {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (!ext) throw new Error('Unknown file extension');

    if (ext === 'xlsx' || ext === 'xls') {
        return parseXlsx(filePath);
    }

    if (ext === 'csv') {
        return parseCsv(filePath);
    }

    throw new Error('Unsupported file type');
}