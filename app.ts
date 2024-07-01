import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const headers = ['classificationLevel', 'codableEndpoint', 'explicitOrSubclassified', 'chapterNr', 'firstThreeCharsOfGroup', 'codeWithoutCross', 'codeWithoutExtraChars', 'codeWithoutPunctuation', 'classTitle'];

function readCSVData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const diagnosisCodes: any[] = [];
        try {
            const filePath = path.join(__dirname, '../data', 'icd10gm2024syst_kodes.txt');
            fs.createReadStream(filePath, 'utf8')
                .pipe(csv({ separator: ';', headers }))
                .on('data', (data) => { // todo: change package version to 0
                    const newObj: any = {};
                    headers.forEach((header) => {
                        newObj[header] = data[header];
                    });
                    if (newObj['classificationLevel'] === '3' && newObj['explicitOrSubclassified'] === 'X') { // only get the main categories (e.g. E10) - need three-digit code for that
                        diagnosisCodes.push(newObj);
                    }
                })
                .on('end', () => {
                    if (diagnosisCodes.length === 0) {
                        reject(new Error('No data found'));
                    } else {
                        resolve(diagnosisCodes);
                    }
                });
        } catch (error) {
            reject(`Error reading CSV file: ${error.message}`);
        }
    });
}

export async function getICDCodeByDiagnosisName(diagnosisName: string): Promise<object[]> {
    try {
        const diagnosisCodes = await readCSVData();
        const possibleMatches: object[] = [];
        diagnosisCodes.forEach((diagnosisObject) => {
            if (diagnosisObject.classTitle.toLowerCase().includes(diagnosisName.toLowerCase())) {
                possibleMatches.push({ name: diagnosisObject.classTitle, ICDCode: diagnosisObject.codeWithoutExtraChars });
            }
        });
        return possibleMatches;
    } catch (error) {
        throw new Error(`Failed to get ICD codes: ${error.message}`);
    }
}