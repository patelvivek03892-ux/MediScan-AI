'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Share2,
  AlertTriangle,
  HeartPulse,
  Activity,
  Calendar,
  User,
  Building,
  Stethoscope,
  Sparkles,
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { MedicalReport } from '../../types/medical';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from '../../lib/sampleData';
import { EmergencyBanner } from '../../components/analysis/EmergencyBanner';
import { HealthScoreGauge } from '../../components/analysis/HealthScoreGauge';
import { BiomarkerTable } from '../../components/analysis/BiomarkerTable';
import { ActionPlanCard } from '../../components/analysis/ActionPlanCard';
import { OrganHealthRadar } from '../../components/charts/OrganHealthRadar';
import { exportReportToPdf } from '../../lib/pdfExport';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParam = searchParams.get('type');
  const sourceParam = searchParams.get('source');

  const [report, setReport] = useState<MedicalReport>(METABOLIC_REPORT);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeParam === 'cardiac') {
      setReport(CARDIAC_CRITICAL_REPORT);
    } else if (typeParam === 'wellness') {
      setReport(WELLNESS_NORMAL_REPORT);
    } else {
      // Check session storage
      const stored = sessionStorage.getItem('mediscan_active_report_type');
      if (stored === 'cardiac') {
        setReport(CARDIAC_CRITICAL_REPORT);
      } else if (stored === 'wellness') {
        setReport(WELLNESS_NORMAL_REPORT);
      } else {
        setReport(METABOLIC_REPORT);
      }
    }
  }, [typeParam]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-1/3 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navigation & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/upload')}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Back to Upload"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  REPORT ID: {report.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300">
                  OCR Accuracy: {(report.ocrConfidence * 100).toFixed(1)}%
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {report.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-xs text-slate-300 font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => exportReportToPdf(report)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Emergency Detection Banner (if critical) */}
        {report.emergencyAlert && (
          <EmergencyBanner alert={report.emergencyAlert} />
        )}

        {/* Patient & Laboratory Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Patient</span>
              <span className="font-bold text-white">
                {report.patientName} ({report.age}y / {report.gender})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Attending Clinician</span>
              <span className="font-bold text-white truncate max-w-[160px] block">
                {report.doctorName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Diagnostic Facility</span>
              <span className="font-bold text-white truncate max-w-[160px] block">
                {report.laboratory}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Sample / Test Date</span>
              <span className="font-bold text-white">{report.sampleDate}</span>
            </div>
          </div>
        </div>

        {/* Upper Analytics Grid: Executive Summary, HealthScoreGauge, Organ Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Executive Summary & Differential Possibilities (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Clinical Executive Summary</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>

            {/* Differential Possibilities */}
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Possible Medical Conditions & Clinical Patterns
                </h3>
                <p className="text-xs text-slate-400">
                  Probabilistic diagnostic patterns synthesized from laboratory biomarker deviations.
                </p>
              </div>

              <div className="space-y-3">
                {report.differentialPossibilities.map((diff, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{diff.condition}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {(diff.probability * 100).toFixed(0)}% Probability
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{diff.rationale}</p>
                    <div className="text-[10px] font-mono text-slate-400">
                      Recommendation: {diff.urgency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Score Gauge & Organ Radar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <HealthScoreGauge
              score={report.overallHealthScore}
              riskLevel={report.riskLevel}
              confidence={report.aiConfidence}
            />

            <OrganHealthRadar scores={report.organScores} />
          </div>
        </div>

        {/* Biomarkers Laboratory Breakdown Table */}
        <BiomarkerTable biomarkers={report.biomarkers} />

        {/* Personalized Clinical Action & Lifestyle Protocol */}
        <ActionPlanCard actionPlan={report.actionPlan} />

        {/* Mandatory Medical Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300 font-semibold block mb-0.5">
              Statutory Medical Disclaimer
            </strong>
            This AI-generated analysis is for informational purposes only and is not a substitute for diagnosis, treatment, or advice from a qualified healthcare professional. Always consult your doctor before making medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-20 text-center">Loading Clinical Analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
