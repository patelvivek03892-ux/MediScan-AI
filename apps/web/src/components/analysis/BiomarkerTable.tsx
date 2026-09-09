'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { Biomarker, BiomarkerCategory } from '../../types/medical';
import { calculateSeverityColor } from '../../lib/reportAnalyzer';

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
}

export const BiomarkerTable: React.FC<BiomarkerTableProps> = ({ biomarkers }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: string[] = ['ALL', ...Array.from(new Set(biomarkers.map((b) => b.category)))];

  const filtered = biomarkers.filter((bm) => {
    const matchesCategory = selectedCategory === 'ALL' || bm.category === selectedCategory;
    const matchesSearch =
      bm.name.toLowerCase().includes(search.toLowerCase()) ||
      bm.clinicalSignificance.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Biomarker Laboratory Profile
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time reference interval comparison and automated clinical status mapping.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search biomarkers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400 transition-colors w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bm) => {
          const colors = calculateSeverityColor(bm.status);
          const percent = Math.min(
            100,
            Math.max(
              0,
              ((bm.value - (bm.refMin * 0.7)) / ((bm.refMax * 1.3) - (bm.refMin * 0.7))) * 100
            )
          );

          return (
            <div
              key={bm.id}
              className={`rounded-2xl p-4 border bg-slate-950/50 hover:bg-slate-900/50 transition-all space-y-3 ${colors.bg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {bm.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{bm.name}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${colors.badge}`}
                >
                  {bm.status.replace('_', ' ')}
                </span>
              </div>

              {/* Measured Value vs Range */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">{bm.value}</span>
                  <span className="text-xs text-slate-400 ml-1.5 font-medium">{bm.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Normal Interval</span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    {bm.refMin} – {bm.refMax} {bm.unit}
                  </span>
                </div>
              </div>

              {/* Visual Range Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Low</span>
                  <span>Optimal</span>
                  <span>High</span>
                </div>
              </div>

              {/* Clinical note */}
              <div className="pt-2 border-t border-white/5 flex items-start gap-1.5 text-[11px] text-slate-300">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-snug">{bm.clinicalSignificance}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
