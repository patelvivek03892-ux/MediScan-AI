'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  ArrowRight,
  HardDrive,
  ClipboardList,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { recognizeImageWithOCR, OCRProgress } from '../../lib/ocrEngine';
import { analyzeReportText } from '../../lib/reportAnalyzer';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { getCurrentUser } from '../../lib/authStore';
import { saveUserReport } from '../../lib/userReportsStore';
import { setActiveReportContext } from '../../lib/ai/reportContext';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from '../../lib/sampleData';

export default function UploadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setIsProcessing(true);
    setProcessStep(`Preprocessing ${file.name}...`);

    try {
      let extractedText = '';

      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        sessionStorage.setItem('mediscan_preview_image', imageUrl);

        setProcessStep('Running Tesseract neural OCR engine...');
        extractedText = await recognizeImageWithOCR(file, (prog: OCRProgress) => {
          setProcessStep(`Recognizing characters (${(prog.progress * 100).toFixed(0)}%)...`);
        });
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setProcessStep('Reading laboratory text stream...');
        extractedText = await file.text();
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setProcessStep('Extracting PDF text layer & clinical parameters...');
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/extract-text', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.success && data.text && data.text.trim().length > 0) {
            extractedText = data.text;
          } else {
            throw new Error(data.error || 'No readable text layer found in PDF. If this is a photo/scanned PDF, please upload as JPG/PNG or use Camera Scanner.');
          }
        } catch (apiErr: any) {
          throw new Error(apiErr.message || 'PDF extraction failed. If this is a scanned document, please upload as an image (JPG/PNG).');
        }
      } else {
        // Attempt text read for other files
        setProcessStep('Reading document text...');
        try {
          extractedText = await file.text();
        } catch {
          throw new Error('Unsupported file format. Please upload a PDF, TXT, or Image file.');
        }
      }

      setProcessStep('Extracting biomarkers & reference boundaries...');
      const currentUser = getCurrentUser();
      const analyzedReport = analyzeReportText(extractedText, file.name, currentUser);

      if (currentUser) {
        await saveUserReport(currentUser.id, analyzedReport);
      }

      // Reset stale analysis state and set report-specific keys
      sessionStorage.setItem('mediscan_current_report_id', analyzedReport.id);
      sessionStorage.setItem(`mediscan_report_${analyzedReport.id}`, JSON.stringify(analyzedReport));
      sessionStorage.setItem('mediscan_custom_report_json', JSON.stringify(analyzedReport));
      sessionStorage.setItem('mediscan_custom_report_text', extractedText);
      sessionStorage.setItem('mediscan_active_report_type', 'custom');
      setActiveReportContext(analyzedReport);

      setProcessStep('Synthesizing report complete!');
      setTimeout(() => {
        setIsProcessing(false);
        router.push(`/analysis?report_id=${encodeURIComponent(analyzedReport.id)}&type=custom`);
      }, 500);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to process document. Please try again or upload as an image.');
      setIsProcessing(false);
    }
  };

  const handleAnalyzePastedText = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setProcessStep('Synthesizing pasted laboratory parameters...');

    setTimeout(async () => {
      const currentUser = getCurrentUser();
      const analyzedReport = analyzeReportText(pastedText, 'Manual Lab Input.txt', currentUser);
      if (currentUser) {
        await saveUserReport(currentUser.id, analyzedReport);
      }
      // Reset stale analysis state and set report-specific keys
      sessionStorage.setItem('mediscan_current_report_id', analyzedReport.id);
      sessionStorage.setItem(`mediscan_report_${analyzedReport.id}`, JSON.stringify(analyzedReport));
      sessionStorage.setItem('mediscan_custom_report_json', JSON.stringify(analyzedReport));
      sessionStorage.setItem('mediscan_custom_report_text', pastedText);
      sessionStorage.setItem('mediscan_active_report_type', 'custom');
      setActiveReportContext(analyzedReport);

      setIsProcessing(false);
      router.push(`/analysis?report_id=${encodeURIComponent(analyzedReport.id)}&type=custom`);
    }, 600);
  };

  const loadSampleScenario = (scenario: string) => {
    let sampleId = METABOLIC_REPORT.id;
    if (scenario === 'cardiac') sampleId = CARDIAC_CRITICAL_REPORT.id;
    else if (scenario === 'wellness') sampleId = WELLNESS_NORMAL_REPORT.id;

    sessionStorage.setItem('mediscan_current_report_id', sampleId);
    sessionStorage.setItem('mediscan_active_report_type', scenario);
    router.push(`/analysis?report_id=${encodeURIComponent(sampleId)}&type=${scenario}`);
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-semibold">
          <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
          <span>{t.upload.ocrStep}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {t.upload.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          {t.upload.subtitle}
        </p>
      </div>

      {/* Tab Switcher: Upload File vs Paste Text */}
      <div className="flex justify-center">
        <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'upload'
                ? 'bg-teal-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{t.upload.tabUpload}</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'paste'
                ? 'bg-teal-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>{t.upload.tabPaste}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: File Uploader */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors ${
            dragActive
              ? 'border-teal-500 bg-teal-950/20'
              : 'border-slate-700 hover:border-teal-600 bg-slate-900/70 hover:bg-slate-900/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-xl bg-teal-950/80 border border-teal-600/40 flex items-center justify-center text-teal-400">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm sm:text-base font-semibold text-white">
                {t.upload.dragDropText}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.upload.supportedFormats}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                Live OCR Enabled
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                Auto-Range Detection
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                Zero Data Leakage
              </span>
            </div>
          </div>

          {/* Processing Status Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/95 rounded-xl flex flex-col items-center justify-center p-6 space-y-3 z-30">
              <div className="w-10 h-10 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-white">{t.upload.processingTitle}</h4>
                <p className="text-xs font-mono text-teal-300">{processStep}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Paste Report Text Directly */}
      {activeTab === 'paste' && (
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              {t.upload.tabPaste}
            </h3>
            <p className="text-xs text-slate-400">
              {t.upload.pastePlaceholder}
            </p>
          </div>

          <textarea
            rows={8}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={t.upload.pastePlaceholder}
            className="w-full bg-[#0b111e] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 outline-none focus:border-teal-500 transition-colors leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAnalyzePastedText}
              disabled={!pastedText.trim() || isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs disabled:opacity-40 transition-colors shadow-sm"
            >
              <span>{isProcessing ? t.common.loading : t.upload.analyzePastedBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cloud Storage Quick Import Buttons */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-teal-400" />
          Direct Cloud Storage Import:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {['Google Drive', 'Dropbox', 'OneDrive', 'Apple Files'].map((provider) => (
            <button
              key={provider}
              onClick={() => {
                alert(`Connecting to ${provider} secure medical file picker.`);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Pre-loaded Clinical Scenarios */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-400" />
            {t.upload.orUseSample}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify the AI clinical engine with complete authentic laboratory profiles:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => loadSampleScenario('metabolic')}
            className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 hover:border-amber-500/50 text-left transition-colors group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 font-semibold">
                {t.common.moderate.toUpperCase()}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              {t.upload.sampleMetabolic}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              HbA1c (7.6%), LDL (169 mg/dL), mild anemia (11.4 g/dL), mild renal decline.
            </p>
          </button>

          <button
            onClick={() => loadSampleScenario('cardiac')}
            className="p-3.5 rounded-lg bg-[#0b111e] border border-rose-900/40 hover:border-rose-500/60 text-left transition-colors group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 font-semibold">
                {t.common.critical.toUpperCase()}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
              {t.upload.sampleCardiac}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Troponin I (0.48 ng/mL), severe thrombocytopenia (18k platelets), and hyperkalemia.
            </p>
          </button>

          <button
            onClick={() => loadSampleScenario('wellness')}
            className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 hover:border-emerald-500/50 text-left transition-colors group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-semibold">
                {t.common.optimal.toUpperCase()}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t.upload.sampleNormal}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Balanced lipid profile, optimal HbA1c (5.1%), normal kidneys, and healthy hemoglobin.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
