'use client';

import { MedicalReport } from '../types/medical';

export interface EmailNotificationLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  reportId: string;
  reportTitle: string;
  healthScore: number;
  riskLevel: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Bounced';
  subject: string;
  htmlContent: string;
}

const STORAGE_EMAIL_LOGS_KEY = 'mediscan_email_logs';

const SEED_EMAIL_LOGS: EmailNotificationLog[] = [
  {
    id: 'EML-8821',
    recipientEmail: 'rahul.verma@example.com',
    recipientName: 'Rahul Verma',
    reportId: 'REP-2026-8891X',
    reportTitle: 'Comprehensive Metabolic & Lipid Diagnostic Panel',
    healthScore: 68,
    riskLevel: 'MODERATE',
    sentAt: '2026-09-17 14:22:10',
    status: 'Delivered',
    subject: '[MediScan AI] Your Metabolic Panel Analysis is Ready - Score 68/100',
    htmlContent: '<p>Report for Rahul Verma analyzed. Moderate metabolic risk detected.</p>'
  },
  {
    id: 'EML-8820',
    recipientEmail: 'dr.mehta@metropolis.med',
    recipientName: 'Dr. Anjali Mehta, MD',
    reportId: 'REP-2026-8891X',
    reportTitle: 'Comprehensive Metabolic & Lipid Diagnostic Panel',
    healthScore: 68,
    riskLevel: 'MODERATE',
    sentAt: '2026-09-17 14:25:00',
    status: 'Delivered',
    subject: '[Physician Portal] Patient Rahul Verma Clinical Report Notification',
    htmlContent: '<p>Clinical report summary for patient Rahul Verma dispatched to physician record.</p>'
  }
];

export function getEmailLogs(): EmailNotificationLog[] {
  if (typeof window === 'undefined') return SEED_EMAIL_LOGS;
  const stored = localStorage.getItem(STORAGE_EMAIL_LOGS_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_EMAIL_LOGS_KEY, JSON.stringify(SEED_EMAIL_LOGS));
    return SEED_EMAIL_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_EMAIL_LOGS;
  }
}

export function generateReportEmailHtml(report: MedicalReport, recipientName: string): { subject: string; html: string } {
  const abnormalBiomarkers = report.biomarkers.filter(b => b.status !== 'NORMAL');
  
  const subject = `[MediScan AI] Clinical Health Report Analysis Ready (${report.patientName} - Score: ${report.overallHealthScore}/100)`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0284c7, #0369a1); padding: 28px 24px; text-align: center; }
    .title { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; }
    .subtitle { color: #bae6fd; font-size: 13px; margin-top: 6px; }
    .body { padding: 24px; }
    .score-badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 14px; background: ${report.overallHealthScore >= 80 ? '#059669' : report.overallHealthScore >= 60 ? '#d97706' : '#dc2626'}; color: #ffffff; }
    .meta-card { background: #0f172a; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #334155; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #94a3b8; }
    .meta-row strong { color: #f1f5f9; }
    .abnormal-box { background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
    .bm-item { font-size: 13px; color: #fca5a5; margin: 4px 0; }
    .btn { display: inline-block; background: #38bdf8; color: #020617; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin-top: 16px; text-align: center; }
    .disclaimer { font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.5; border-top: 1px solid #334155; pt: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">🩺 MediScan AI</h1>
      <p class="subtitle">Clinical Diagnostic Report & Biomarker Intelligence</p>
    </div>
    <div class="body">
      <p style="font-size: 15px; color: #e2e8f0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Your medical test report has been analyzed by MediScan AI. Below is your clinical summary overview:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span class="score-badge">Health Score: ${report.overallHealthScore} / 100</span>
        <span style="font-size: 13px; color: #94a3b8; margin-left: 12px;">Risk Tier: <strong>${report.riskLevel}</strong></span>
      </div>

      <div class="meta-card">
        <div class="meta-row"><span>Patient:</span> <strong>${report.patientName} (${report.age}y / ${report.gender})</strong></div>
        <div class="meta-row"><span>Report ID:</span> <strong>${report.id}</strong></div>
        <div class="meta-row"><span>Doctor:</span> <strong>${report.doctorName}</strong></div>
        <div class="meta-row"><span>Lab Facility:</span> <strong>${report.laboratory}</strong></div>
        <div class="meta-row"><span>Date:</span> <strong>${report.sampleDate}</strong></div>
      </div>

      <div style="background: #0f172a; border-radius: 12px; padding: 16px; border: 1px solid #334155; margin: 16px 0;">
        <h4 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 14px;">Clinical Executive Summary</h4>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin: 0;">${report.executiveSummary}</p>
      </div>

      ${abnormalBiomarkers.length > 0 ? `
      <div class="abnormal-box">
        <strong style="color: #ef4444; font-size: 13px; display: block; margin-bottom: 6px;">⚠️ Out-of-Range Biomarkers (${abnormalBiomarkers.length}):</strong>
        ${abnormalBiomarkers.map(b => `<div class="bm-item">• <strong>${b.name}</strong>: ${b.value} ${b.unit} [${b.status}] (Ref: ${b.refMin}-${b.refMax} ${b.unit})</div>`).join('')}
      </div>
      ` : ''}

      <div style="text-align: center; margin: 24px 0;">
        <a href="http://localhost:3000/analysis" class="btn">View Full Interactive Analysis & Trends</a>
      </div>

      <div class="disclaimer">
        <strong>Mandatory Medical Disclaimer:</strong> This AI-generated report summary is for educational and informational purposes only. It does not replace clinical consultation, professional diagnosis, or personalized medical care from a licensed healthcare provider.
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

export function sendReportAnalysisEmail(
  report: MedicalReport,
  recipientEmail: string,
  recipientName: string
): EmailNotificationLog {
  const { subject, html } = generateReportEmailHtml(report, recipientName);

  const newLog: EmailNotificationLog = {
    id: `EML-${Date.now().toString().slice(-4)}`,
    recipientEmail,
    recipientName,
    reportId: report.id,
    reportTitle: report.title,
    healthScore: report.overallHealthScore,
    riskLevel: report.riskLevel,
    sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'Delivered',
    subject,
    htmlContent: html
  };

  const logs = getEmailLogs();
  logs.unshift(newLog);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_EMAIL_LOGS_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event('mediscan_emails_updated'));
  }

  return newLog;
}

export interface EmailApiResponse {
  success: boolean;
  dispatch_id: string;
  mode: 'smtp' | 'development_logged';
  recipient: string;
  timestamp: string;
  note: string;
}

/**
 * Dispatches clinical report email via the FastAPI backend outbound SMTP service.
 * Supports multilingual delivery (en, hi, gu).
 * Falls back safely to client-side logging if backend is unreachable.
 */
export async function sendReportEmailViaApi(
  report: MedicalReport,
  recipientEmail: string,
  recipientName: string,
  language: string = 'en'
): Promise<EmailApiResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('mediscan_auth_token');
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/email/send-report`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        report_id: report.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        language,
        report_data: report
      })
    });

    if (res.ok) {
      const data: EmailApiResponse = await res.json();

      // Record in local browser notification log store
      const { subject, html } = generateReportEmailHtml(report, recipientName);
      const newLog: EmailNotificationLog = {
        id: data.dispatch_id,
        recipientEmail,
        recipientName,
        reportId: report.id,
        reportTitle: report.title,
        healthScore: report.overallHealthScore,
        riskLevel: report.riskLevel,
        sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'Delivered',
        subject,
        htmlContent: html
      };

      const logs = getEmailLogs();
      logs.unshift(newLog);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_EMAIL_LOGS_KEY, JSON.stringify(logs));
        window.dispatchEvent(new Event('mediscan_emails_updated'));
      }

      return data;
    } else {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned HTTP ${res.status}`);
    }
  } catch (err: any) {
    console.warn('[EmailService] Backend dispatch issue, falling back to local client log:', err.message);
    const localLog = sendReportAnalysisEmail(report, recipientEmail, recipientName);
    return {
      success: true,
      dispatch_id: localLog.id,
      mode: 'development_logged',
      recipient: recipientEmail,
      timestamp: new Date().toISOString(),
      note: 'Simulated dispatch recorded in local storage.'
    };
  }
}

