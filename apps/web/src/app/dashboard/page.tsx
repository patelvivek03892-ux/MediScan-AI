'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Heart,
  Droplets,
  ShieldAlert,
  Zap,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BiomarkerTrendChart } from '../../components/charts/BiomarkerTrendChart';
import { OrganHealthRadar } from '../../components/charts/OrganHealthRadar';
import { METABOLIC_REPORT } from '../../lib/sampleData';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');

  const categories = [
    'All Categories',
    'Blood & Diabetes',
    'Complete Blood Count (CBC)',
    'Lipid Profile',
    'Kidney Function (KFT)',
    'Liver Function (LFT)',
    'Thyroid Profile',
    'Vitamins & Minerals'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Interactive Health Intelligence
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Health Analytics & Longitudinal Trends
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-test timeline charts, organ risk radars, and predictive biomarker deviation forecasting.
            </p>
          </div>

          {/* Time period filter pills */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs">
            {['Last 3 Months', 'Last 6 Months', '1 Year', 'All Time'].map((period, i) => (
              <button
                key={period}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  i === 1
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Health KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fasting Glucose */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Fasting Glucose</span>
              <span className="flex items-center gap-1 text-red-400 font-bold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14 mg/dL
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">142</span>
              <span className="text-xs text-slate-400">mg/dL</span>
            </div>
            <div className="text-[11px] text-amber-300 flex items-center gap-1">
              <span>Status: Impaired fasting glucose</span>
            </div>
          </div>

          {/* Card 2: HbA1c */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>HbA1c Glycated</span>
              <span className="flex items-center gap-1 text-red-400 font-bold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +0.5%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">7.6</span>
              <span className="text-xs text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-amber-300 flex items-center gap-1">
              <span>Target: &lt; 5.7% (Suboptimal)</span>
            </div>
          </div>

          {/* Card 3: LDL Cholesterol */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>LDL Cholesterol</span>
              <span className="flex items-center gap-1 text-red-400 font-bold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14 mg/dL
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">169</span>
              <span className="text-xs text-slate-400">mg/dL</span>
            </div>
            <div className="text-[11px] text-amber-300 flex items-center gap-1">
              <span>Target: &lt; 100 mg/dL</span>
            </div>
          </div>

          {/* Card 4: eGFR Filtration */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>eGFR Filtration</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <ArrowDownRight className="w-3.5 h-3.5" /> -9 mL/min
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">64</span>
              <span className="text-xs text-slate-400">mL/min</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Stage 2 Mild Reduction</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Biomarker Trend Area Chart (7 Cols) */}
          <div className="lg:col-span-7">
            <BiomarkerTrendChart biomarkers={METABOLIC_REPORT.biomarkers} />
          </div>

          {/* Systemic Organ Radar (5 Cols) */}
          <div className="lg:col-span-5">
            <OrganHealthRadar scores={METABOLIC_REPORT.organScores} />
          </div>
        </div>

        {/* AI Chart Intelligence & Predictive Forecasts */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 md:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>AI Predictive Health Intelligence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-white block">
                Metabolic Trajectory
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                HbA1c has trended upward by 1.8% over the past 6 months (5.8% → 7.6%). Implementing a 30-minute daily post-prandial walk can reduce this trend by 0.6% within 60 days.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-white block">
                Cardiovascular Plaque Risk
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                LDL / HDL ratio is currently 4.69 (target &lt; 3.0). High triglycerides (215 mg/dL) suggest elevated remnant lipoproteins; increasing soluble fiber and reducing fructose is strongly advised.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-white block">
                Renal Microvascular Health
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mild eGFR reduction to 64 mL/min correlates with blood glucose spikes. Controlling blood pressure (&lt;130/80) and avoiding chronic NSAIDs is recommended to preserve filtration units.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
