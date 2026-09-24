'use client';

import React from 'react';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  Minus,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function ComparePage() {
  const { t } = useLanguage();

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
      baseline: 48,
      current: 38,
      delta: -10,
      status: 'WORSENED',
      note: 'Cardioprotective reserve decrease'
    },
    {
      name: 'Serum Creatinine',
      category: 'Renal',
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
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-xs text-teal-300 font-semibold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>{t.compare.title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.compare.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.compare.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Interval: 6 Months (180 Days)</span>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Panel */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
            {t.compare.baseline}
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-bold text-white">{t.hero.sampleWellness}</h3>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Score: 88/100
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Normal fasting blood sugar, borderline LDL, optimal kidney clearance, normal hemoglobin.
          </p>
        </div>

        {/* Current Panel */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block font-semibold">
            {t.compare.current}
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-bold text-white">{t.hero.sampleMetabolic}</h3>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              Score: 68/100 (-20 pts)
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Significant elevation in fasting glucose & HbA1c; rise in atherogenic LDL; mild anemia.
          </p>
        </div>
      </div>

      {/* Comparison Biomarker Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">{t.compare.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.compare.compareNotice}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0b111e] text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">{t.compare.colBiomarker}</th>
                <th className="px-4 py-3">{t.compare.colCategory}</th>
                <th className="px-4 py-3">{t.compare.colBaseline}</th>
                <th className="px-4 py-3">{t.compare.colCurrent}</th>
                <th className="px-4 py-3">{t.compare.colDelta}</th>
                <th className="px-4 py-3">{t.compare.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {comparisonItems.map((item, i) => {
                const isWorsened = item.status === 'WORSENED';
                return (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono">
                      {item.baseline} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-white font-mono font-bold">
                      {item.current} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold ${
                          isWorsened ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {item.delta > 0 ? `+${item.delta}` : item.delta} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider inline-flex items-center gap-1 ${
                          isWorsened
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        }`}
                      >
                        {isWorsened ? (
                          <TrendingUp className="w-3 h-3 text-rose-400" />
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
  );
}
