'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  UploadCloud,
  FileCheck2,
  Activity,
  ShieldAlert,
  BarChart3,
  Cpu,
  HeartPulse,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  FileText,
  Zap,
  Play
} from 'lucide-react';
import { DnaHelix3D } from '../components/3d/DnaHelix3D';
import { EcgLine } from '../components/layout/EcgLine';
import { translations, Language } from '../lib/i18n/translations';

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const updateLang = () => {
      const stored = localStorage.getItem('mediscan_lang') as Language;
      if (stored) setLang(stored);
    };
    updateLang();
    window.addEventListener('language_changed', updateLang);
    return () => window.removeEventListener('language_changed', updateLang);
  }, []);

  const t = translations[lang];

  const handleLaunchSample = (scenario: 'metabolic' | 'cardiac' | 'wellness') => {
    sessionStorage.setItem('mediscan_active_report_type', scenario);
    router.push('/analysis?source=sample&type=' + scenario);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Aurora Gradient Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[680px] pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-60 left-1/3 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Decipher Complex{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Medical Reports
              </span>{' '}
              with Clinical AI
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              {t.hero.subtitle}
            </p>

            {/* Animated ECG Pulse Indicator */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
                <span className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  REAL-TIME ECG RHYTHM TELEMETRY
                </span>
                <span className="font-mono text-slate-300">Normal Sinus: 72 BPM</span>
              </div>
              <EcgLine height={45} speed={2} color="#00f0ff" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/scanner"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>{t.hero.ctaScan}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/upload"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-white/10 hover:border-cyan-400/40 shadow-lg transition-all"
              >
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>{t.hero.ctaUpload}</span>
              </Link>
            </div>

            {/* Quick Demo Pre-Load Triggers */}
            <div className="pt-3">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Instant Zero-Upload Clinical Demos:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLaunchSample('metabolic')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Metabolic / Diabetic Panel</span>
                  <span className="text-[10px] bg-amber-500/30 px-1.5 py-0.2 rounded font-mono">Moderate</span>
                </button>

                <button
                  onClick={() => handleLaunchSample('cardiac')}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>Cardiac Emergency Panel</span>
                  <span className="text-[10px] bg-red-500/30 px-1.5 py-0.2 rounded font-mono">Critical</span>
                </button>

                <button
                  onClick={() => handleLaunchSample('wellness')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Executive Wellness Checkup</span>
                  <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.2 rounded font-mono">Optimal</span>
                </button>
              </div>
            </div>

            {/* Hero Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl font-black text-cyan-400 block">99.4%</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statAccuracy}</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block">60+</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statBiomarkers}</span>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-400 block">&lt; 1.5s</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statSpeed}</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: 3D DNA Helix Hologram Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/80 border border-cyan-500/30 shadow-[0_0_60px_rgba(56,189,248,0.2)] backdrop-blur-xl overflow-hidden group">
              {/* Corner tech decals */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>3D GENOMIC HELIX VISUALIZER</span>
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500">
                INTERACTIVE CANVAS
              </div>

              {/* 3D Canvas */}
              <div className="h-96 w-full flex items-center justify-center pt-4">
                <DnaHelix3D />
              </div>

              {/* Bottom Holographic HUD */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Biomarker Synthesis Core
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">ONLINE</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Analyzing multi-axial relationships between HbA1c, LDL cholesterol, liver enzymes, and renal filtration indices in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 font-bold uppercase tracking-wider">
            Enterprise Open-Source Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision, Safety & Clinical Clarity
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A unified clinical intelligence suite designed for hospitals, diagnostic laboratories, physicians, and health-conscious individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Smart AI Camera Scanner
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time browser MediaDevices camera access with boundary edge-detection, perspective auto-crop, deskew, noise reduction, and multi-page batch scanning.
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>Explore Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
              Critical Emergency Triage
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant detection of life-threatening lab values (Troponin, severe thrombocytopenia, hyperkalemia) with high-visibility red pulse alerts and emergency routing.
            </p>
            <button
              onClick={() => handleLaunchSample('cardiac')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300"
            >
              <span>View Emergency Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              Interactive Health Trends
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Longitudinal tracking over time with area charts, 6-axis organ health radar, risk meters, and comparative biomarker diffs across past reports.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              60+ Biomarkers Analyzed
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Covers Complete Blood Count (CBC), Lipid profiles, Diabetic/HbA1c, Renal (KFT), Hepatic (LFT), Thyroid, Vitamins (D3/B12), and Urinalysis.
            </p>
            <Link
              href="/analysis"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Sample Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Multilingual Assistant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant report translations and conversational voice guidance in English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) with voice speech-to-text.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              <span>Try AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              HIPAA & Security Compliance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Client-side zero-leakage analysis options, AES-256 encrypted storage, audit logs, and clear statutory medical disclaimers.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              <span>View Compliance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 p-8 sm:p-12 text-center overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.15)]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Experience the Future of Medical Report Intelligence?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload any existing laboratory PDF or launch the smart camera scanner right from your mobile phone or laptop.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/scanner"
                className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
              >
                Launch AI Camera
              </Link>
              <Link
                href="/upload"
                className="px-6 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold text-xs border border-white/15 transition-all"
              >
                Upload Document
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
