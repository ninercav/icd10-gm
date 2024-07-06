import path from 'path';
import testcsv from 'csvtojson';
import { DiagnosisObject } from './icd10-gm';

const headers = ['classificationLevel', 'codableEndpoint', 'explicitOrSubclassified', 'chapterNr', 'firstThreeCharsOfGroup', 'codeWithoutCross', 'codeWithoutExtraChars', 'codeWithoutPunctuation', 'classTitle'];

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

async function readCSVData(): Promise<DiagnosisObject[]> {
    try {
        const isDirectlyExecuted = require.main === module;
        let filePath;
        if (isDirectlyExecuted) {
            // Path when the script is run directly
            filePath = path.join(__dirname, '../data', 'icd10gm2024syst_kodes.txt');
        } else {
            // Path when the script is included in a package
            filePath = path.join(process.cwd(), 'node_modules', 'icd10-gm', 'data', 'icd10gm2024syst_kodes.txt');
        }
        const jsonArray = await testcsv({
            noheader: true,
            headers: headers,
            delimiter: ';'
        }).fromFile(filePath);
        const filteredData = await filterData(jsonArray);
        return filteredData;
    } catch(error) {
        console.log("Error reading CSV data: ", error);
    }
    return [];
}

async function filterData(data: any[]): Promise<DiagnosisObject[]> {
    const filteredData: DiagnosisObject[] = [];
    data.forEach((diagnosisObject) => {
        if (diagnosisObject['classificationLevel'] === '3' && diagnosisObject['explicitOrSubclassified'] === 'X') { // only get the main categories (e.g. E10) - need three-digit code for that
            const newObj: any = {};
            headers.forEach((header) => {
                newObj[header] = diagnosisObject[header];
            });
            const newDiagnosisObject: DiagnosisObject = newObj;
            filteredData.push(newDiagnosisObject);
        }
    });
    return filteredData;

}