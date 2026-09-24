'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Share2,
  Calendar,
  User,
  Building,
  Stethoscope,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Edit3,
  RefreshCw,
  Image as ImageIcon,
  Mail,
  AlertCircle
} from 'lucide-react';
import { MedicalReport } from '../../types/medical';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from '../../lib/sampleData';
import { EmergencyBanner } from '../../components/analysis/EmergencyBanner';
import { HealthScoreGauge } from '../../components/analysis/HealthScoreGauge';
import { BiomarkerTable } from '../../components/analysis/BiomarkerTable';
import { ActionPlanCard } from '../../components/analysis/ActionPlanCard';
import { KeyFindingsCard } from '../../components/analysis/KeyFindingsCard';
import { DetectedConditionsCard } from '../../components/analysis/DetectedConditionsCard';
import { SuggestionsModule } from '../../components/analysis/SuggestionsModule';
import { setActiveReportContext } from '../../lib/ai/reportContext';
import { OrganHealthRadar } from '../../components/charts/OrganHealthRadar';
import { exportReportToPdf } from '../../lib/pdfExport';
import { analyzeReportText } from '../../lib/reportAnalyzer';
import { EmailNotificationModal } from '../../components/analysis/EmailNotificationModal';
import { getCurrentUser, UserProfile } from '../../lib/authStore';
import { saveUserReport, getUserReports, getUserReportById, fetchUserReportById } from '../../lib/userReportsStore';
import { useLanguage } from '../../lib/i18n/LanguageContext';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const reportIdParam = searchParams.get('report_id') || searchParams.get('id');
  const typeParam = searchParams.get('type');

  const [report, setReport] = useState<MedicalReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorNotFound, setErrorNotFound] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rawText, setRawOcrText] = useState<string>('');
  const [showInspector, setShowInspector] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setErrorNotFound(null);

    const user = getCurrentUser();
    setCurrentUser(user);

    const loadTargetReport = async () => {
      // 1. Explicit scenario selection without report ID
      if (typeParam === 'cardiac' && (!reportIdParam || reportIdParam === CARDIAC_CRITICAL_REPORT.id)) {
        if (!isCurrent) return;
        setReport(CARDIAC_CRITICAL_REPORT);
        setActiveReportContext(CARDIAC_CRITICAL_REPORT);
        setIsLoading(false);
        return;
      }
      if (typeParam === 'wellness' && (!reportIdParam || reportIdParam === WELLNESS_NORMAL_REPORT.id)) {
        if (!isCurrent) return;
        setReport(WELLNESS_NORMAL_REPORT);
        setActiveReportContext(WELLNESS_NORMAL_REPORT);
        setIsLoading(false);
        return;
      }
      if (typeParam === 'metabolic' && (!reportIdParam || reportIdParam === METABOLIC_REPORT.id)) {
        if (!isCurrent) return;
        setReport(METABOLIC_REPORT);
        setActiveReportContext(METABOLIC_REPORT);
        setIsLoading(false);
        return;
      }

      // 2. Specific report ID requested
      if (reportIdParam) {
        // a. Check report-specific sessionStorage cache
        const specificKey = `mediscan_report_${reportIdParam}`;
        const specificJson = typeof window !== 'undefined' ? sessionStorage.getItem(specificKey) : null;
        if (specificJson) {
          try {
            const parsed = JSON.parse(specificJson);
            if (parsed && (parsed.id === reportIdParam || !parsed.id)) {
              parsed.id = reportIdParam;
              if (!isCurrent) return;
              setReport(parsed);
              setActiveReportContext(parsed);
              if (parsed.rawText) {
                setRawOcrText(parsed.rawText);
                setEditableText(parsed.rawText);
              }
              const img = sessionStorage.getItem('mediscan_preview_image');
              if (img) setPreviewImage(img);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Could not parse specific cached report:', e);
          }
        }

        // b. Check user saved reports
        if (user) {
          const userRep = getUserReportById(user.id, reportIdParam);
          if (userRep) {
            if (!isCurrent) return;
            setReport(userRep);
            setActiveReportContext(userRep);
            if (userRep.rawText) {
              setRawOcrText(userRep.rawText);
              setEditableText(userRep.rawText);
            }
            setIsLoading(false);
            return;
          }

          // c. Fetch from backend API
          const remoteRep = await fetchUserReportById(user.id, reportIdParam);
          if (remoteRep) {
            if (!isCurrent) return;
            setReport(remoteRep);
            setActiveReportContext(remoteRep);
            if (remoteRep.rawText) {
              setRawOcrText(remoteRep.rawText);
              setEditableText(remoteRep.rawText);
            }
            setIsLoading(false);
            return;
          }
        }

        // d. Check sample reports matching reportIdParam
        if (reportIdParam === METABOLIC_REPORT.id) {
          if (!isCurrent) return;
          setReport(METABOLIC_REPORT);
          setActiveReportContext(METABOLIC_REPORT);
          setIsLoading(false);
          return;
        }

        // If explicitly requested report ID is not found, report error
        if (!isCurrent) return;
        setErrorNotFound(`Medical report with identifier "${reportIdParam}" could not be found.`);
        setIsLoading(false);
        return;
      }

      // 3. Fallback when no reportIdParam is provided
      // Check active report ID from sessionStorage
      const activeReportId = typeof window !== 'undefined' ? sessionStorage.getItem('mediscan_current_report_id') : null;
      if (activeReportId) {
        const foundActive = getUserReportById(user?.id || '', activeReportId);
        if (foundActive) {
          if (!isCurrent) return;
          setReport(foundActive);
          setActiveReportContext(foundActive);
          if (foundActive.rawText) {
            setRawOcrText(foundActive.rawText);
            setEditableText(foundActive.rawText);
          }
          setIsLoading(false);
          return;
        }
      }

      // Check user saved reports
      if (user) {
        const savedReports = getUserReports(user.id);
        if (savedReports && savedReports.length > 0) {
          if (!isCurrent) return;
          setReport(savedReports[0]);
          setActiveReportContext(savedReports[0]);
          if (savedReports[0].rawText) {
            setRawOcrText(savedReports[0].rawText);
            setEditableText(savedReports[0].rawText);
          }
          setIsLoading(false);
          return;
        }
      }

      // Default demo report
      if (!isCurrent) return;
      setReport(METABOLIC_REPORT);
      setActiveReportContext(METABOLIC_REPORT);
      setIsLoading(false);
    };

    loadTargetReport();

    return () => {
      isCurrent = false;
    };
  }, [reportIdParam, typeParam]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReanalyze = () => {
    if (!editableText.trim() || !report) return;
    setIsLoading(true);
    const user = getCurrentUser();
    const reanalyzed = analyzeReportText(editableText, report.title, user);
    reanalyzed.id = report.id; // Keep consistent report ID
    setReport(reanalyzed);
    setRawOcrText(editableText);
    sessionStorage.setItem('mediscan_current_report_id', reanalyzed.id);
    sessionStorage.setItem(`mediscan_report_${reanalyzed.id}`, JSON.stringify(reanalyzed));
    sessionStorage.setItem('mediscan_custom_report_json', JSON.stringify(reanalyzed));
    sessionStorage.setItem('mediscan_custom_report_text', editableText);
    setActiveReportContext(reanalyzed);
    if (user) {
      saveUserReport(user.id, reanalyzed);
    }
    setIsEditingText(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="py-16 px-4 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Analysis in progress...</h2>
          <p className="text-xs text-slate-400">Loading diagnostic biomarker data and evaluating reference ranges...</p>
        </div>
      </div>
    );
  }

  if (errorNotFound || !report) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Report Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorNotFound || 'The requested analysis result could not be located or has expired.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push('/upload')}
              className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
            >
              Analyze a New Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/upload')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={t.analysis.backToDashboard}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-teal-400">
                {t.analysis.reportId}: {report.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-300">
                {t.scanner.confidence}: {(report.ocrConfidence * 100).toFixed(1)}%
              </span>
              {report.id.startsWith('REP-') && report.title.includes('Analysis:') && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  Live Extracted
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {report.title}
            </h1>
            {currentUser && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-400 bg-teal-950/40 border border-teal-800/40 px-2.5 py-0.5 rounded-md w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Linked to Account: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Raw OCR Inspector */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showInspector
                ? 'bg-teal-950/60 border-teal-700/60 text-teal-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {showInspector ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showInspector ? t.common.close : t.analysis.rawOcrInspector}</span>
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 font-medium transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.analysis.emailReport}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => exportReportToPdf(report)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.analysis.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Email Notification Dispatch Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-teal-950/60 border border-teal-700/40 text-teal-400 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block">{t.analysis.emailReport}</span>
            <span className="text-slate-400">{t.chat.emailSentSuccess}</span>
          </div>
        </div>
        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
        >
          {t.analysis.emailReport}
        </button>
      </div>

      {/* OCR Inspector & Document Drawer */}
      {showInspector && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">{t.analysis.rawOcrInspector}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingText(!isEditingText)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Edit3 className="w-3 h-3 text-teal-400" />
                <span>{isEditingText ? t.common.cancel : t.analysis.edit}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Image Preview */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                Original Scan / Document Preview:
              </span>
              <div className="aspect-[4/3] rounded-lg bg-[#0b111e] border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Original Uploaded Lab"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <FileText className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs">
                      Synthetic digital input or sample scenario.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted OCR Plaintext & Editor */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                Extracted OCR Laboratory Stream:
              </span>
              {isEditingText ? (
                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    className="w-full bg-[#0b111e] border border-teal-600/50 rounded-lg p-3 text-xs font-mono text-slate-200 outline-none leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleReanalyze}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.analysis.reanalyze}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="aspect-[4/3] overflow-y-auto rounded-lg bg-[#0b111e] border border-slate-800 p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {rawText || `SYNTHETIC LAB DOSSIER: ${report.title}\nReport ID: ${report.id}\nPatient: ${report.patientName}\nDate: ${report.sampleDate}\nBiomarkers parsed: ${report.biomarkers.length}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Detection Banner */}
      {report.emergencyAlert && (
        <EmergencyBanner alert={report.emergencyAlert} />
      )}

      {/* Patient & Laboratory Metadata Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-800 text-teal-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">{t.analysis.patientName}</span>
            <span className="font-semibold text-white">
              {report.patientName} ({report.age}y / {report.gender})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-800 text-teal-400">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">{t.analysis.orderingPhysician}</span>
            <span className="font-semibold text-white truncate max-w-[160px] block">
              {report.doctorName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-800 text-teal-400">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">{t.analysis.laboratory}</span>
            <span className="font-semibold text-white truncate max-w-[160px] block">
              {report.laboratory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-800 text-teal-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">{t.analysis.date}</span>
            <span className="font-semibold text-white">{report.sampleDate}</span>
          </div>
        </div>
      </div>

      {/* Upper Analytics Grid: Executive Summary, HealthScoreGauge, Organ Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{t.analysis.executiveSummary}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* Detected / Possible Conditions Module */}
          <DetectedConditionsCard report={report} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <HealthScoreGauge
            score={report.overallHealthScore}
            riskLevel={report.riskLevel}
            confidence={report.aiConfidence}
          />

          <OrganHealthRadar scores={report.organScores} />
        </div>
      </div>

      {/* Structured Key Laboratory Findings */}
      <KeyFindingsCard biomarkers={report.biomarkers} />

      {/* Biomarkers Laboratory Breakdown Table */}
      <BiomarkerTable biomarkers={report.biomarkers} />

      {/* AI Suggestions & Recommendations Module */}
      <SuggestionsModule report={report} />

      {/* Personalized Clinical Action & Lifestyle Protocol */}
      <ActionPlanCard actionPlan={report.actionPlan} />

      {/* Mandatory Medical Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300 font-semibold block mb-0.5">
            {t.footer.disclaimerTitle}
          </strong>
          {t.analysis.disclaimer}
        </p>
      </div>

      {/* Email Dispatch Modal */}
      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        report={report}
      />
    </div>
  );
}

export default function AnalysisPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16] text-white p-20 text-center text-xs">{t.common.loading}</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
