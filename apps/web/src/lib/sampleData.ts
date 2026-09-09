import { MedicalReport } from '../types/medical';

export const METABOLIC_REPORT: MedicalReport = {
  id: "REP-2026-8891X",
  title: "Comprehensive Metabolic & Lipid Diagnostic Panel",
  patientName: "Rahul Verma",
  age: 42,
  gender: "Male",
  sampleDate: "2026-08-12",
  reportDate: "2026-08-12",
  laboratory: "Metropolis Healthcare & Advanced Genomics",
  doctorName: "Dr. Anjali Mehta, MD (Internal Medicine)",
  type: "Blood & Metabolic Panel",
  executiveSummary: "Analysis reveals suboptimal glycemic regulation consistent with Type 2 Diabetes pattern (HbA1c 7.6%, Fasting Glucose 142 mg/dL), co-occurring with atherogenic mixed dyslipidemia (LDL 169 mg/dL, Triglycerides 215 mg/dL). Mild Stage 2 renal filtration decline (eGFR 64 mL/min) and mild normocytic anemia (Hemoglobin 11.4 g/dL) require structured clinical intervention.",
  overallHealthScore: 68,
  riskLevel: "MODERATE",
  aiConfidence: 0.974,
  ocrConfidence: 0.985,
  emergencyAlert: {
    isCritical: false,
    title: "Moderate Metabolic Risk Detected",
    message: "Significant elevations observed in HbA1c (7.6%) and LDL Cholesterol (169 mg/dL). Recommended physician evaluation within 10 to 14 days.",
    triggeredBiomarkers: ["HbA1c: 7.6%", "LDL: 169 mg/dL", "Triglycerides: 215 mg/dL"],
    actionRequired: "Consult endocrinologist or primary care physician for diabetes & lipid management."
  },
  biomarkers: [
    {
      id: "bm-1",
      name: "Hemoglobin",
      category: "CBC",
      value: 11.4,
      unit: "g/dL",
      refMin: 13.5,
      refMax: 17.5,
      status: "LOW",
      clinicalSignificance: "Mild anemia, reduces cellular oxygen carriage and contributes to fatigue.",
      historicalTrend: [12.8, 12.1, 11.9, 11.4]
    },
    {
      id: "bm-2",
      name: "White Blood Cells (WBC)",
      category: "CBC",
      value: 11800,
      unit: "/cumm",
      refMin: 4000,
      refMax: 11000,
      status: "HIGH",
      clinicalSignificance: "Mild reactive leukocytosis, indicating low-grade systemic inflammation or recovery.",
      historicalTrend: [7200, 8100, 9400, 11800]
    },
    {
      id: "bm-3",
      name: "Platelet Count",
      category: "CBC",
      value: 148000,
      unit: "/cumm",
      refMin: 150000,
      refMax: 450000,
      status: "LOW",
      clinicalSignificance: "Borderline mild thrombocytopenia, monitor to ensure stability.",
      historicalTrend: [210000, 190000, 165000, 148000]
    },
    {
      id: "bm-4",
      name: "HbA1c (Glycated Hemoglobin)",
      category: "Diabetic",
      value: 7.6,
      unit: "%",
      refMin: 4.0,
      refMax: 5.6,
      status: "HIGH",
      clinicalSignificance: "Suboptimal glycemic regulation; correlates to average glucose of 171 mg/dL.",
      historicalTrend: [5.8, 6.4, 7.1, 7.6]
    },
    {
      id: "bm-5",
      name: "Fasting Blood Glucose",
      category: "Diabetic",
      value: 142,
      unit: "mg/dL",
      refMin: 70,
      refMax: 99,
      status: "HIGH",
      clinicalSignificance: "Impaired fasting glucose requiring caloric and medical regulation.",
      historicalTrend: [95, 112, 128, 142]
    },
    {
      id: "bm-6",
      name: "LDL Cholesterol (Bad)",
      category: "Lipid",
      value: 169,
      unit: "mg/dL",
      refMin: 0,
      refMax: 100,
      status: "HIGH",
      clinicalSignificance: "Elevated atherogenic lipoprotein posing elevated cardiovascular risk.",
      historicalTrend: [130, 144, 155, 169]
    },
    {
      id: "bm-7",
      name: "HDL Cholesterol (Good)",
      category: "Lipid",
      value: 36,
      unit: "mg/dL",
      refMin: 40,
      refMax: 60,
      status: "LOW",
      clinicalSignificance: "Sub-optimal cardio-protective reverse cholesterol transporter.",
      historicalTrend: [44, 41, 38, 36]
    },
    {
      id: "bm-8",
      name: "Triglycerides",
      category: "Lipid",
      value: 215,
      unit: "mg/dL",
      refMin: 0,
      refMax: 150,
      status: "HIGH",
      clinicalSignificance: "Hypertriglyceridemia associated with carbohydrate sensitivity & metabolic stress.",
      historicalTrend: [140, 168, 192, 215]
    },
    {
      id: "bm-9",
      name: "Serum Creatinine",
      category: "Kidney",
      value: 1.32,
      unit: "mg/dL",
      refMin: 0.7,
      refMax: 1.2,
      status: "HIGH",
      clinicalSignificance: "Mild elevation indicating need to protect renal microvasculature.",
      historicalTrend: [0.95, 1.05, 1.18, 1.32]
    },
    {
      id: "bm-10",
      name: "eGFR",
      category: "Kidney",
      value: 64,
      unit: "mL/min",
      refMin: 90,
      refMax: 130,
      status: "LOW",
      clinicalSignificance: "Mild GFR reduction; ensure hydration and avoid nephrotoxic agents (NSAIDs).",
      historicalTrend: [92, 84, 73, 64]
    },
    {
      id: "bm-11",
      name: "ALT (SGPT)",
      category: "Liver",
      value: 46,
      unit: "U/L",
      refMin: 7,
      refMax: 56,
      status: "NORMAL",
      clinicalSignificance: "Hepatic transaminases remain in normal range.",
      historicalTrend: [32, 38, 42, 46]
    },
    {
      id: "bm-12",
      name: "TSH (Thyroid Stimulating)",
      category: "Thyroid",
      value: 2.35,
      unit: "uIU/mL",
      refMin: 0.4,
      refMax: 4.2,
      status: "NORMAL",
      clinicalSignificance: "Thyroid axis functioning normally within euthyroid range.",
      historicalTrend: [2.1, 2.2, 2.4, 2.35]
    },
    {
      id: "bm-13",
      name: "Vitamin D3 (25-OH)",
      category: "Vitamins",
      value: 18.5,
      unit: "ng/mL",
      refMin: 30,
      refMax: 100,
      status: "LOW",
      clinicalSignificance: "Insufficiency affecting bone density and cell-mediated immunity.",
      historicalTrend: [24, 21, 19, 18.5]
    }
  ],
  organScores: {
    cardiovascular: 62,
    endocrine: 54,
    renal: 68,
    hepatic: 90,
    hematology: 72,
    immune: 84
  },
  differentialPossibilities: [
    {
      condition: "Type 2 Diabetes Mellitus with Dyslipidemia",
      probability: 0.88,
      urgency: "Routine Clinical Follow-up",
      rationale: "Classic concurrence of HbA1c >= 6.5%, elevated fasting plasma glucose, and elevated triglycerides."
    },
    {
      condition: "Metabolic Syndrome (ATP III Criteria)",
      probability: 0.82,
      urgency: "Investigation",
      rationale: "Meets 3 out of 5 diagnostic criteria: High fasting blood sugar, elevated triglycerides, low HDL."
    },
    {
      condition: "Mild Iron Deficiency vs Chronic Inflammation Anemia",
      probability: 0.64,
      urgency: "Investigation",
      rationale: "Mild hemoglobin depression with low platelets warrants ferritin and iron profile confirmation."
    }
  ],
  actionPlan: {
    diet: [
      "Prioritize high-fiber Mediterranean meal architecture (legumes, chia, wild greens, avocado).",
      "Strictly curtail ultra-processed sugars, sweetened juices, and refined flour carbohydrates.",
      "Incorporate 2 tablespoons of ground flaxseed and extra virgin olive oil to improve lipid profile."
    ],
    exercise: [
      "Target 150-180 minutes of moderate aerobic conditioning (brisk walking at 5 km/h, swimming) weekly.",
      "Incorporate two sessions of multi-joint strength training (squats, resistance bands) to boost muscle glucose uptake."
    ],
    waterAndSleep: [
      "Consume 2.5 to 3.0 liters of structured electrolyte water daily to assist renal clearance.",
      "Maintain consistent 7.5 hours sleep schedule in dark room to regulate morning fasting cortisol."
    ],
    questionsForDoctor: [
      "Should we initiate metformin or an SGLT2 inhibitor to protect both blood sugar and renal function?",
      "Would a moderate-intensity statin be advisable given my LDL of 169 mg/dL?",
      "Do I need a urine microalbumin/creatinine test to check kidney filter health?",
      "Can we order a serum ferritin test to explain the mild anemia?"
    ],
    recommendedFollowUpTests: [
      "Urine Albumin-to-Creatinine Ratio (UACR) within 30 days",
      "Complete Iron Profile & Ferritin",
      "Repeat HbA1c & Fasting Lipid Panel in 90 days"
    ]
  }
};

export const CARDIAC_CRITICAL_REPORT: MedicalReport = {
  id: "REP-2026-9912C",
  title: "Emergency Cardiac & Thrombocytopenia Panel",
  patientName: "Vikram Singhania",
  age: 58,
  gender: "Male",
  sampleDate: "2026-08-14",
  reportDate: "2026-08-14",
  laboratory: "Apex Emergency Trauma Diagnostic Core",
  doctorName: "Dr. K. S. Ramanujan, MD, DM (Cardiology)",
  type: "Emergency Cardiac & Hematology",
  executiveSummary: "CRITICAL ALERT: Significant myocardial injury marker elevation detected with Troponin I at 0.48 ng/mL (standard cutoff < 0.04 ng/mL). Concurrently, severe critical thrombocytopenia is present (Platelet count: 18,000 /cumm) along with hyperkalemia (Potassium: 6.3 mmol/L). Immediate emergency clinical hospitalization and monitoring are mandatory.",
  overallHealthScore: 32,
  riskLevel: "CRITICAL",
  aiConfidence: 0.991,
  ocrConfidence: 0.995,
  emergencyAlert: {
    isCritical: true,
    title: "CRITICAL MEDICAL ALERT: Acute Myocardial & Hematologic Emergency",
    message: "High-sensitivity Cardiac Troponin I is significantly elevated (0.48 ng/mL) alongside severe critical thrombocytopenia (Platelets: 18,000/µL) and hyperkalemia (K+: 6.3 mmol/L). Immediate emergency room admission is required.",
    triggeredBiomarkers: [
      "Cardiac Troponin I: 0.48 ng/mL (Ref: < 0.04)",
      "Platelets: 18,000 /cumm (Ref: > 150,000)",
      "Potassium (K+): 6.3 mmol/L (Ref: 3.5 - 5.0)"
    ],
    actionRequired: "Call emergency medical services immediately or proceed to the nearest Emergency Department. Do not drive yourself."
  },
  biomarkers: [
    {
      id: "bm-c1",
      name: "Cardiac Troponin I (hs-cTnI)",
      category: "Cardiac",
      value: 0.48,
      unit: "ng/mL",
      refMin: 0.0,
      refMax: 0.04,
      status: "CRITICAL_HIGH",
      clinicalSignificance: "Major marker of active myocardial necrosis; high probability of acute coronary syndrome.",
      historicalTrend: [0.01, 0.02, 0.04, 0.48]
    },
    {
      id: "bm-c2",
      name: "Serum Potassium (K+)",
      category: "Electrolytes",
      value: 6.3,
      unit: "mmol/L",
      refMin: 3.5,
      refMax: 5.0,
      status: "CRITICAL_HIGH",
      clinicalSignificance: "Hyperkalemia alters cardiac conduction; risk of ventricular arrhythmias.",
      historicalTrend: [4.4, 4.8, 5.2, 6.3]
    },
    {
      id: "bm-c3",
      name: "Platelet Count",
      category: "CBC",
      value: 18000,
      unit: "/cumm",
      refMin: 150000,
      refMax: 450000,
      status: "CRITICAL_LOW",
      clinicalSignificance: "Severe critical thrombocytopenia; high risk of spontaneous mucosal/internal hemorrhage.",
      historicalTrend: [160000, 110000, 60000, 18000]
    },
    {
      id: "bm-c4",
      name: "D-Dimer",
      category: "Cardiac",
      value: 1.85,
      unit: "ug/mL FEU",
      refMin: 0.0,
      refMax: 0.5,
      status: "HIGH",
      clinicalSignificance: "Elevated fibrin degradation products; warrants evaluation for thromboembolism.",
      historicalTrend: [0.3, 0.45, 0.9, 1.85]
    },
    {
      id: "bm-c5",
      name: "Creatinine",
      category: "Kidney",
      value: 2.1,
      unit: "mg/dL",
      refMin: 0.7,
      refMax: 1.2,
      status: "HIGH",
      clinicalSignificance: "Acute on chronic kidney stress; contributes to potassium retention.",
      historicalTrend: [1.1, 1.3, 1.6, 2.1]
    }
  ],
  organScores: {
    cardiovascular: 28,
    endocrine: 65,
    renal: 45,
    hepatic: 78,
    hematology: 22,
    immune: 50
  },
  differentialPossibilities: [
    {
      condition: "Acute Coronary Syndrome (NSTEMI / STEMI)",
      probability: 0.94,
      urgency: "Urgent Review",
      rationale: "Marked elevation in high-sensitivity Troponin I beyond 99th percentile with clinical presentation."
    },
    {
      condition: "Severe Immune Thrombocytopenia (ITP) / Consumption",
      probability: 0.89,
      urgency: "Urgent Review",
      rationale: "Platelet count below 20,000 /cumm requires immediate platelet transfusion and hematology consult."
    }
  ],
  actionPlan: {
    diet: ["NPO (Nothing by mouth) pending immediate emergency evaluation."],
    exercise: ["STRICT BEDREST. Do not perform any physical exertion."],
    waterAndSleep: ["Emergency medical intravenous access required."],
    questionsForDoctor: [
      "Is emergent coronary angiography indicated?",
      "What is the protocol for urgent potassium-lowering (calcium gluconate, insulin-dextrose)?",
      "Do I require emergent platelet transfusion support?"
    ],
    recommendedFollowUpTests: [
      "12-Lead Electrocardiogram (ECG) IMMEDIATELY",
      "Continuous Cardiac Telemetry",
      "Repeat Troponin in 3 hours",
      "Stat Peripheral Blood Smear"
    ]
  }
};

export const WELLNESS_NORMAL_REPORT: MedicalReport = {
  id: "REP-2026-1044W",
  title: "Executive Annual Preventive Health Profile",
  patientName: "Dr. Priyanshi Patel",
  age: 34,
  gender: "Female",
  sampleDate: "2026-08-10",
  reportDate: "2026-08-10",
  laboratory: "Thyrocare Wellness Diagnostics Center",
  doctorName: "Dr. Rohan Shah, MD",
  type: "Routine Preventive Screening",
  executiveSummary: "All evaluated clinical parameters fall within optimal physiological boundaries. Lipid profile reflects strong cardioprotective metrics with HDL at 64 mg/dL and LDL at 88 mg/dL. Glycemic index is optimal with HbA1c at 5.1%. Liver, kidney, and thyroid markers demonstrate excellent homeostasis.",
  overallHealthScore: 96,
  riskLevel: "LOW",
  aiConfidence: 0.988,
  ocrConfidence: 0.992,
  biomarkers: [
    {
      id: "bm-w1",
      name: "Hemoglobin",
      category: "CBC",
      value: 13.8,
      unit: "g/dL",
      refMin: 12.0,
      refMax: 15.5,
      status: "NORMAL",
      clinicalSignificance: "Robust oxygen carrying capacity.",
      historicalTrend: [13.4, 13.6, 13.7, 13.8]
    },
    {
      id: "bm-w2",
      name: "Platelet Count",
      category: "CBC",
      value: 265000,
      unit: "/cumm",
      refMin: 150000,
      refMax: 450000,
      status: "NORMAL",
      clinicalSignificance: "Healthy clotting homeostasis.",
      historicalTrend: [250000, 260000, 255000, 265000]
    },
    {
      id: "bm-w3",
      name: "HbA1c",
      category: "Diabetic",
      value: 5.1,
      unit: "%",
      refMin: 4.0,
      refMax: 5.6,
      status: "NORMAL",
      clinicalSignificance: "Optimal 90-day glycemic stability.",
      historicalTrend: [5.2, 5.1, 5.2, 5.1]
    },
    {
      id: "bm-w4",
      name: "Total Cholesterol",
      category: "Lipid",
      value: 168,
      unit: "mg/dL",
      refMin: 125,
      refMax: 200,
      status: "NORMAL",
      clinicalSignificance: "Favorable lipid balance.",
      historicalTrend: [175, 172, 170, 168]
    },
    {
      id: "bm-w5",
      name: "HDL Cholesterol (Good)",
      category: "Lipid",
      value: 64,
      unit: "mg/dL",
      refMin: 50,
      refMax: 80,
      status: "NORMAL",
      clinicalSignificance: "High protective anti-atherogenic index.",
      historicalTrend: [58, 60, 62, 64]
    },
    {
      id: "bm-w6",
      name: "Serum Creatinine",
      category: "Kidney",
      value: 0.82,
      unit: "mg/dL",
      refMin: 0.6,
      refMax: 1.1,
      status: "NORMAL",
      clinicalSignificance: "Optimal renal clearance.",
      historicalTrend: [0.85, 0.84, 0.81, 0.82]
    },
    {
      id: "bm-w7",
      name: "TSH (Thyroid)",
      category: "Thyroid",
      value: 1.85,
      unit: "uIU/mL",
      refMin: 0.4,
      refMax: 4.2,
      status: "NORMAL",
      clinicalSignificance: "Balanced endocrine homeostasis.",
      historicalTrend: [1.9, 1.8, 1.85, 1.85]
    }
  ],
  organScores: {
    cardiovascular: 96,
    endocrine: 98,
    renal: 95,
    hepatic: 94,
    hematology: 96,
    immune: 95
  },
  differentialPossibilities: [],
  actionPlan: {
    diet: ["Continue current balanced whole-food, plant-forward nutritional routine."],
    exercise: ["Maintain 150+ minutes weekly of combined cardio and resistance training."],
    waterAndSleep: ["Maintain hydration of 2.5L daily and 7-8 hours quality sleep."],
    questionsForDoctor: ["Confirm routine annual screening schedule."],
    recommendedFollowUpTests: ["Routine annual wellness checkup in 12 months."]
  }
};
