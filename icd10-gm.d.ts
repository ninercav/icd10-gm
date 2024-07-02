export interface DiagnosisData {
    name: string;
    ICDCode: string;
}

// Declare the module and its exports
declare module 'icd10-gm' {
  export async function getICDCodeByDiagnosisName(): Promise<DiagnosisCode[]>;
}