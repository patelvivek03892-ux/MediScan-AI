'use client';

import { MedicalReport } from '../types/medical';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from './sampleData';
import { getAuthToken } from './authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getStorageKey(userId: string): string {
  return `mediscan_user_reports_${userId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function getUserReports(userId: string): MedicalReport[] {
  if (typeof window === 'undefined' || !userId) return [];
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) {
    // Seed initial report for default test users if empty
    if (userId === 'usr-1' || userId === 'rahul.verma@example.com') {
      const initial = [METABOLIC_REPORT];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    if (userId === 'usr-3' || userId === 'vikram.singhania@hospital.org') {
      const initial = [CARDIAC_CRITICAL_REPORT];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getUserReportById(userId: string, reportId: string): MedicalReport | null {
  if (!reportId) return null;
  
  // 1. Check report-specific sessionStorage cache
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(`mediscan_report_${reportId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id === reportId) return parsed;
      } catch {}
    }
  }

  // 2. Check user-scoped reports
  if (userId) {
    const reports = getUserReports(userId);
    const found = reports.find(r => r.id === reportId);
    if (found) return found;
  }

  // 3. Fallback check for known sample reports
  if (reportId === METABOLIC_REPORT.id) return METABOLIC_REPORT;
  if (reportId === CARDIAC_CRITICAL_REPORT.id) return CARDIAC_CRITICAL_REPORT;
  if (reportId === WELLNESS_NORMAL_REPORT.id) return WELLNESS_NORMAL_REPORT;

  return null;
}

export async function fetchUserReportById(userId: string, reportId: string): Promise<MedicalReport | null> {
  const local = getUserReportById(userId, reportId);
  if (local) return local;

  const token = getAuthToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(reportId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.analysis_result) {
          return data.analysis_result as MedicalReport;
        }
      }
    } catch (err) {
      console.warn('Backend fetch report by id failed:', err);
    }
  }

  return null;
}

export async function saveUserReport(userId: string, report: MedicalReport): Promise<void> {
  if (!userId || !report) return;

  // 1. Sync to backend API if available
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/api/reports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          report_id: report.id,
          filename: report.patientInfo?.labName ? `${report.patientInfo.labName}_report.pdf` : 'lab_analysis.pdf',
          patient_name: report.patientInfo?.name || 'Patient',
          document_type: report.differentialPossibilities?.[0]?.condition || 'Clinical Laboratory Test',
          risk_score: 100 - report.overallHealthScore,
          ocr_confidence: report.aiConfidence || 0.95,
          analysis_result: report
        })
      });
    } catch (err) {
      console.warn('Backend report sync unavailable, saving to secure user local store:', err);
    }
  }

  // 2. Save in user-scoped local storage
  if (typeof window !== 'undefined') {
    const key = getStorageKey(userId);
    const existing = getUserReports(userId);
    const filtered = existing.filter(r => r.id !== report.id);
    filtered.unshift(report);
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mediscan_reports_updated'));
  }
}

export async function deleteUserReport(userId: string, reportId: string): Promise<void> {
  if (!userId || !reportId) return;

  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn('Backend report delete failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const key = getStorageKey(userId);
    const existing = getUserReports(userId);
    const filtered = existing.filter(r => r.id !== reportId);
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mediscan_reports_updated'));
  }
}

export interface UserDashboardData {
  totalReports: number;
  averageHealthScore: number;
  riskLevel: string;
  latestReportDate: string | null;
  organScores: Record<string, number>;
  kpis: {
    glucose: { value: number | null; status: string; delta: string };
    hba1c: { value: number | null; status: string; delta: string };
    cholesterol: { value: number | null; status: string; delta: string };
    egfr: { value: number | null; status: string; delta: string };
  };
  trendHistory: Array<{
    date: string;
    glucose: number;
    cholesterol: number;
    score: number;
  }>;
}

export function getUserDashboardData(userId: string): UserDashboardData {
  const reports = getUserReports(userId);

  if (!reports || reports.length === 0) {
    return {
      totalReports: 0,
      averageHealthScore: 100,
      riskLevel: 'No Tests Recorded (Awaiting First Report)',
      latestReportDate: null,
      organScores: {
        Cardiac: 100,
        Hepatic: 100,
        Renal: 100,
        Metabolic: 100,
        Hematologic: 100,
        Immune: 100
      },
      kpis: {
        glucose: { value: null, status: 'Not tested', delta: '0' },
        hba1c: { value: null, status: 'Not tested', delta: '0' },
        cholesterol: { value: null, status: 'Not tested', delta: '0' },
        egfr: { value: null, status: 'Not tested', delta: '0' }
      },
      trendHistory: []
    };
  }

  const scores = reports.map(r => r.overallHealthScore);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  let riskLevel = 'Low Risk (Optimal Homeostasis)';
  if (avgScore < 60) {
    riskLevel = 'High Risk / Clinical Attention Needed';
  } else if (avgScore < 80) {
    riskLevel = 'Moderate Deviation';
  }

  // Aggregate organ scores from latest report
  const latestReport = reports[0];
  const os: any = latestReport?.organScores || {};
  const organScores: Record<string, number> = {
    Cardiac: os.Cardiac ?? os.cardiovascular ?? 85,
    Hepatic: os.Hepatic ?? os.hepatic ?? 85,
    Renal: os.Renal ?? os.renal ?? 85,
    Metabolic: os.Metabolic ?? os.endocrine ?? 85,
    Hematologic: os.Hematologic ?? os.hematology ?? 85,
    Immune: os.Immune ?? os.immune ?? 85
  };

  // Find latest biomarkers
  const findBiomarker = (terms: string[]) => {
    for (const rep of reports) {
      for (const b of rep.biomarkers) {
        if (terms.some(t => b.name.toLowerCase().includes(t.toLowerCase()))) {
          return b;
        }
      }
    }
    return null;
  };

  const gluc = findBiomarker(['glucose', 'fasting blood sugar']);
  const a1c = findBiomarker(['hba1c', 'glycated']);
  const chol = findBiomarker(['cholesterol', 'ldl']);
  const egfr = findBiomarker(['egfr', 'creatinine']);

  const trendHistory = reports.slice(0, 6).reverse().map((r, i) => {
    const g = r.biomarkers.find(b => b.name.toLowerCase().includes('glucose'))?.value || 95;
    const c = r.biomarkers.find(b => b.name.toLowerCase().includes('cholesterol') || b.name.toLowerCase().includes('ldl'))?.value || 110;
    return {
      date: r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Test ${i + 1}`,
      glucose: typeof g === 'number' ? g : 95,
      cholesterol: typeof c === 'number' ? c : 110,
      score: r.overallHealthScore
    };
  });

  return {
    totalReports: reports.length,
    averageHealthScore: avgScore,
    riskLevel,
    latestReportDate: latestReport.timestamp ? new Date(latestReport.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
    organScores,
    kpis: {
      glucose: {
        value: typeof gluc?.value === 'number' ? gluc.value : null,
        status: gluc?.status || 'Normal',
        delta: gluc && gluc.value > 120 ? '+14 mg/dL' : '-2 mg/dL'
      },
      hba1c: {
        value: typeof a1c?.value === 'number' ? a1c.value : null,
        status: a1c?.status || 'Optimal',
        delta: a1c && a1c.value > 6.0 ? '+0.4%' : 'Optimal'
      },
      cholesterol: {
        value: typeof chol?.value === 'number' ? chol.value : null,
        status: chol?.status || 'Normal',
        delta: chol && chol.value > 150 ? '+18 mg/dL' : '-5 mg/dL'
      },
      egfr: {
        value: typeof egfr?.value === 'number' ? egfr.value : 90,
        status: egfr?.status || 'Optimal',
        delta: 'Stable'
      }
    },
    trendHistory
  };
}
