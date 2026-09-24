'use client';

import React from 'react';
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
  Sparkles,
  ArrowRight,
  Lock,
  Globe
} from 'lucide-react';
import { DnaHelix3D } from '../components/3d/DnaHelix3D';
import { EcgLine } from '../components/layout/EcgLine';
import { useLanguage } from '../lib/i18n/LanguageContext';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLaunchSample = (scenario: 'metabolic' | 'cardiac' | 'wellness') => {
    sessionStorage.setItem('mediscan_active_report_type', scenario);
    router.push('/analysis?source=sample&type=' + scenario);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {t.hero.titlePrefix}{' '}
              <span className="text-teal-400 font-extrabold">
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleSuffix}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* ECG Pulse Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
                <span className="flex items-center gap-1.5 text-teal-400 font-mono font-medium">
                  <Activity className="w-3.5 h-3.5" />
                  {t.hero.ecgTelemetry}
                </span>
                <span className="font-mono text-slate-300">{t.hero.ecgNormal}</span>
              </div>
              <EcgLine height={40} speed={2} color="#0d9488" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/scanner"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{t.hero.ctaScan}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/upload"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-xs border border-slate-800 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-teal-400" />
                <span>{t.hero.ctaUpload}</span>
              </Link>
            </div>

            {/* Quick Demo Pre-Load Triggers */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                {t.hero.instantDemos}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLaunchSample('metabolic')}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-amber-700/40 text-amber-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{t.hero.sampleMetabolic}</span>
                  <span className="text-[10px] bg-amber-950/60 px-1 py-0.2 rounded font-mono font-semibold">{t.common.moderate}</span>
                </button>

                <button
                  onClick={() => handleLaunchSample('cardiac')}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-rose-700/40 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.hero.sampleCardiac}</span>
                  <span className="text-[10px] bg-rose-950/60 px-1 py-0.2 rounded font-mono font-semibold">{t.common.critical}</span>
                </button>

                <button
                  onClick={() => handleLaunchSample('wellness')}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-emerald-700/40 text-emerald-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{t.hero.sampleWellness}</span>
                  <span className="text-[10px] bg-emerald-950/60 px-1 py-0.2 rounded font-mono font-semibold">{t.common.optimal}</span>
                </button>
              </div>
            </div>

            {/* Hero Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <span className="text-xl font-bold text-teal-400 block font-mono">99.4%</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statAccuracy}</span>
              </div>
              <div>
                <span className="text-xl font-bold text-emerald-400 block font-mono">60+</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statBiomarkers}</span>
              </div>
              <div>
                <span className="text-xl font-bold text-sky-400 block font-mono">&lt; 1.5s</span>
                <span className="text-xs text-slate-400 font-medium">{t.hero.statSpeed}</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: 3D Visualization Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl p-5 bg-slate-900/80 border border-slate-800 overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 font-medium text-teal-400">
                  <Activity className="w-3.5 h-3.5" />
                  {t.hero.hologramTitle}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {t.hero.hologramBadge}
                </span>
              </div>

              {/* 3D Canvas */}
              <div className="h-80 w-full flex items-center justify-center">
                <DnaHelix3D />
              </div>

              {/* HUD summary */}
              <div className="p-3 rounded-lg bg-[#0b111e] border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-teal-400" />
                    {t.hero.coreTitle}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">{t.hero.coreOnline}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {t.hero.coreDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section className="space-y-8 pt-4 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-xs text-teal-300 font-semibold uppercase tracking-wider">
            {t.hero.featureHeadingBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t.hero.featureHeadingTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.hero.featureHeadingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/80 border border-teal-700/50 text-teal-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureScannerTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureScannerDesc}
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
            >
              <span>{t.hero.featureScannerLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-700/50 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureEmergencyTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureEmergencyDesc}
            </p>
            <button
              onClick={() => handleLaunchSample('cardiac')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              <span>{t.hero.featureEmergencyLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-700/50 text-sky-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureMultiTenantTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureMultiTenantDesc}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              <span>{t.hero.featureMultiTenantLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureBiomarkersTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureBiomarkersDesc}
            </p>
            <Link
              href="/analysis"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>{t.hero.featureBiomarkersLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/80 border border-teal-700/50 text-teal-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureAssistantTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureAssistantDesc}
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
            >
              <span>{t.hero.featureAssistantLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {t.hero.featureDossierTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.featureDossierDesc}
            </p>
            <Link
              href="/analysis"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <span>{t.hero.featureDossierLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-6">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.hero.featureHeadingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.hero.featureHeadingSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/scanner"
              className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              {t.hero.ctaScan}
            </Link>
            <Link
              href="/upload"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              {t.hero.ctaUpload}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
