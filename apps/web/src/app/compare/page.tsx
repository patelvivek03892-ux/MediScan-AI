'use client';

import React from 'react';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { METABOLIC_REPORT } from '../../lib/sampleData';

export default function ComparePage() {
  const comparisonItems = [
    {
      name: 'Hemoglobin',
      category: 'CBC',
      unit: 'g/dL',
      baseline: 12.8,
      current: 11.4,
      delta: -1.4,
      status: 'WORSENED',
      note: 'Mild normocytic anemia developed'
    },
    {
      name: 'Fasting Blood Glucose',
      category: 'Diabetic',
      unit: 'mg/dL',
      baseline: 95,
      current: 142,
      delta: +47,
      status: 'WORSENED',
      note: 'Elevated into impaired diabetic range'
    },
    {
      name: 'HbA1c Glycated',
      category: 'Diabetic',
      unit: '%',
      baseline: 5.8,
      current: 7.6,
      delta: +1.8,
      status: 'WORSENED',
      note: 'Suboptimal glycemic regulation'
    },
    {
      name: 'LDL Cholesterol',
      category: 'Lipid',
      unit: 'mg/dL',
      baseline: 130,
      current: 169,
      delta: +39,
      status: 'WORSENED',
      note: 'Atherogenic dyslipidemia increase'
    },
    {
      name: 'HDL Cholesterol (Good)',
      category: 'Lipid',
      unit: 'mg/dL',
      baseline: 44,
      current: 36,
      delta: -8,
      status: 'WORSENED',
      note: 'Protective HDL dropped'
    },
    {
      name: 'Triglycerides',
      category: 'Lipid',
      unit: 'mg/dL',
      baseline: 140,
      current: 215,
      delta: +75,
      status: 'WORSENED',
      note: 'Hypertriglyceridemia spike'
    },
    {
      name: 'Serum Creatinine',
      category: 'Kidney',
      unit: 'mg/dL',
      baseline: 0.95,
      current: 1.32,
      delta: +0.37,
      status: 'WORSENED',
      note: 'Mild renal clearance drop'
    },
    {
      name: 'ALT (SGPT)',
      category: 'Liver',
      unit: 'U/L',
      baseline: 32,
      current: 46,
      delta: +14,
      status: 'STABLE',
      note: 'Remains within normal limits'
    },
    {
      name: 'TSH (Thyroid)',
      category: 'Thyroid',
      unit: 'uIU/mL',
      baseline: 2.1,
      current: 2.35,
      delta: +0.25,
      status: 'STABLE',
      note: 'Euthyroid stability preserved'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-semibold mb-2">
              <GitCompare className="w-3.5 h-3.5" />
              Longitudinal Report Diff Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Side-by-Side Report Comparison
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Comparing Baseline Report (14-Feb-2026) vs Current Diagnostic Panel (12-Aug-2026).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Interval: 6 Months (180 Days)</span>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baseline Panel */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              BASELINE TEST (6 MONTHS AGO)
            </span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-white">Annual Health Profile</h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Score: 88/100
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Normal fasting blood sugar, borderline LDL, optimal kidney clearance, normal hemoglobin.
            </p>
          </div>

          {/* Current Panel */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              CURRENT TEST (12-AUG-2026)
            </span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-white">Metabolic & Lipid Panel</h3>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Score: 68/100 (-20 pts)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Significant elevation in fasting glucose & HbA1c; rise in atherogenic LDL; mild anemia.
            </p>
          </div>
        </div>

        {/* Comparison Biomarker Table */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Biomarker Delta Tracking</h3>
            <p className="text-xs text-slate-400">
              Detailed breakdown of biological metric shifts between the two testing intervals.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="px-6 py-3.5">Biomarker</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Baseline</th>
                  <th className="px-6 py-3.5">Current</th>
                  <th className="px-6 py-3.5">Delta Shift</th>
                  <th className="px-6 py-3.5">Clinical Trajectory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {comparisonItems.map((item, i) => {
                  const isWorsened = item.status === 'WORSENED';
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono">
                        {item.baseline} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-white font-mono font-bold">
                        {item.current} {item.unit}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold ${
                            isWorsened ? 'text-red-400' : 'text-slate-400'
                          }`}
                        >
                          {item.delta > 0 ? `+${item.delta}` : item.delta} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isWorsened
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isWorsened ? (
                            <TrendingUp className="w-3 h-3 text-red-400" />
                          ) : (
                            <Minus className="w-3 h-3 text-emerald-400" />
                          )}
                          {item.note}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
