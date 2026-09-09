export type BiomarkerCategory = 
  | 'CBC' 
  | 'Lipid' 
  | 'Diabetic' 
  | 'Kidney' 
  | 'Liver' 
  | 'Thyroid' 
  | 'Vitamins' 
  | 'Hormonal' 
  | 'Urine' 
  | 'Cardiac'
  | 'Electrolytes';

export type BiomarkerStatus = 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL_LOW' | 'CRITICAL_HIGH';

export interface Biomarker {
  id: string;
  name: string;
  category: BiomarkerCategory;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: BiomarkerStatus;
  clinicalSignificance: string;
  historicalTrend?: number[]; // last 4 time points
}

export interface EmergencyAlert {
  isCritical: boolean;
  title: string;
  message: string;
  triggeredBiomarkers: string[];
  actionRequired: string;
}

export interface DifferentialDiagnosis {
  condition: string;
  probability: number; // 0.0 to 1.0
  urgency: 'Routine Clinical Follow-up' | 'Investigation' | 'Urgent Review';
  rationale: string;
}

export interface ActionPlan {
  diet: string[];
  exercise: string[];
  waterAndSleep: string[];
  questionsForDoctor: string[];
  recommendedFollowUpTests: string[];
}

export interface MedicalReport {
  id: string;
  title: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  sampleDate: string;
  reportDate: string;
  laboratory: string;
  doctorName: string;
  type: string;
  executiveSummary: string;
  overallHealthScore: number; // 0-100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  aiConfidence: number; // 0.0 - 1.0
  emergencyAlert?: EmergencyAlert;
  biomarkers: Biomarker[];
  organScores: {
    cardiovascular: number;
    endocrine: number;
    renal: number;
    hepatic: number;
    hematology: number;
    immune: number;
  };
  differentialPossibilities: DifferentialDiagnosis[];
  actionPlan: ActionPlan;
  ocrConfidence: number;
  rawText?: string;
}
