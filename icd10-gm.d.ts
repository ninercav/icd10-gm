export interface DiagnosisData {
    name: string;
    ICDCode: string;
}

export interface DiagnosisObject {
  classificationLevel: '3' | '4' | '5';
  codableEndpoint: 'T' | 'N'; // T = terminale Schlüsselnummer, N = nicht terminale Schlüsselnummer
  explicitOrSubclassified: 'X' | 'S'; // X = explizit, S = subklassifiziert
  chapterNr: string;
  firstThreeCharsOfGroup: string;
  codeWithoutCross: string;
  codeWithoutExtraChars: string;
  codeWithoutPunctuation: string;
  classTitle: string;
}

// Declare the module and its exports
declare module 'icd10-gm' {
  export async function getICDCodeByDiagnosisName(diagnosisName: string): Promise<DiagnosisData[]>;
  export async function getAllDiagnosisCodes(): Promise<DiagnosisObject[]>;
}