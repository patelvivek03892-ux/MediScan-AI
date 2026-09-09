'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  FileCheck2,
  AlertCircle,
  Sparkles,
  Camera,
  FolderOpen,
  ArrowRight,
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { translations, Language } from '../../lib/i18n/translations';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');

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

  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);

    // Multi-stage OCR & AI Pipeline simulation
    setProcessStep('Normalizing document orientation & deskewing...');
    setTimeout(() => {
      setProcessStep('Running Surya + PaddleOCR multi-engine extraction...');
      setTimeout(() => {
        setProcessStep('Matching 60+ clinical biomarker reference ranges...');
        setTimeout(() => {
          setIsProcessing(false);
          sessionStorage.setItem('mediscan_uploaded_filename', file.name);
          sessionStorage.setItem('mediscan_active_report_type', 'uploaded_file');
          router.push('/analysis?source=upload&filename=' + encodeURIComponent(file.name));
        }, 800);
      }, 800);
    }, 800);
  };

  const loadSampleScenario = (scenario: string) => {
    sessionStorage.setItem('mediscan_active_report_type', scenario);
    router.push(`/analysis?source=sample&type=${scenario}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Multi-Format Ingestion Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Upload Diagnostic Medical Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Drop blood tests, pathology sheets, discharge summaries, or radiology reports. Automatically runs adaptive edge detection, deskew, and multi-engine OCR.
          </p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-white/15 bg-slate-900/60 hover:bg-slate-900/80 hover:border-cyan-500/40'
          } backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.4)]`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.zip"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.25)] group-hover:scale-105 transition-transform">
              <UploadCloud className="w-10 h-10" />
            </div>

            <div>
              <p className="text-base font-bold text-white">
                Drag and drop your report here, or{' '}
                <span className="text-cyan-400 underline decoration-cyan-400/40">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, Multi-page PDF, JPG, PNG, WEBP, HEIC, ZIP (Up to 50MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
                PDF
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
                JPG / PNG
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
                DICOM Sheets
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
                Multi-Page ZIP
              </span>
            </div>
          </div>

          {/* Processing Status Modal Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/90 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Sparkles className="w-6 h-6 text-cyan-400 absolute" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-white">Analyzing Medical Document</h4>
                <p className="text-xs font-mono text-cyan-300 animate-pulse">{processStep}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cloud Storage Quick Import Buttons */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            Direct Cloud Storage Import:
          </span>
          <div className="flex flex-wrap gap-2">
            {['Google Drive', 'Dropbox', 'OneDrive', 'Apple Files'].map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  alert(`Connecting to ${provider} OAuth secure file picker.`);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* Pre-loaded Clinical Scenarios for Instant Zero-Setup Testing */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              Pre-loaded Clinical Test Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Test full AI extraction, biomarker parsing, and emergency detection immediately without personal documents:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Scenario 1 */}
            <button
              onClick={() => loadSampleScenario('metabolic')}
              className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-amber-400/40 text-left transition-all group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  MODERATE RISK
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Metabolic & Diabetic Panel
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Elevated HbA1c (7.6%), LDL (169 mg/dL), mild anemia (Hb 11.4), and mild renal decline.
              </p>
            </button>

            {/* Scenario 2 */}
            <button
              onClick={() => loadSampleScenario('cardiac')}
              className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 hover:border-red-400 text-left transition-all group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                  CRITICAL EMERGENCY
                </span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                Acute Cardiac & Platelet Alert
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Troponin I (0.48 ng/mL), critical thrombocytopenia (18k platelets), and hyperkalemia.
              </p>
            </button>

            {/* Scenario 3 */}
            <button
              onClick={() => loadSampleScenario('wellness')}
              className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-emerald-400/40 text-left transition-all group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  OPTIMAL (96/100)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Executive Wellness Checkup
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Balanced lipid profile, optimal HbA1c (5.1%), normal kidneys, and healthy hemoglobin.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
