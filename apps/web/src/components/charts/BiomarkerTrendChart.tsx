'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { Biomarker } from '../../types/medical';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface BiomarkerTrendChartProps {
  biomarkers?: Biomarker[];
}

export const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ biomarkers = [] }) => {
  const { t } = useLanguage();
  const safeBiomarkers = Array.isArray(biomarkers) ? biomarkers.filter(Boolean) : [];
  const trendable = safeBiomarkers.filter(
    (b): b is Biomarker & { historicalTrend: number[] } =>
      Boolean(b && Array.isArray(b.historicalTrend) && b.historicalTrend.length > 0)
  );

  const [selectedId, setSelectedId] = useState<string>('');

  // Keep selectedId in sync with valid trendable biomarkers
  useEffect(() => {
    if (trendable.length > 0) {
      if (!selectedId || !trendable.some((b) => b.id === selectedId)) {
        setSelectedId(trendable[0].id);
      }
    } else {
      setSelectedId('');
    }
  }, [trendable, selectedId]);

  const activeBm =
    trendable.find((b) => b.id === selectedId) ||
    trendable[0] ||
    null;

  // If no historical trend data exists, render a clean, styled empty state matching the UI
  if (!activeBm || !Array.isArray(activeBm.historicalTrend) || activeBm.historicalTrend.length === 0) {
    return (
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between min-h-[380px]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.dashboard.temporalProgression}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            {t.dashboard.biomarkerTrends}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.dashboard.biomarkerTrendsDesc}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-slate-950/40 my-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
            <TrendingUp className="w-6 h-6 opacity-70" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              {t.dashboard.noTrendData}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
              {t.dashboard.noTrendDataDesc}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Single Test Snapshot
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {safeBiomarkers.length} {safeBiomarkers.length === 1 ? 'biomarker' : 'biomarkers'} recorded
          </span>
        </div>
      </div>
    );
  }

  const trend = activeBm.historicalTrend;
  const dates = ['6 Mos Ago', '3 Mos Ago', '1 Mo Ago', 'Current Test'];
  const data = trend.map((val, i) => ({
    date: trend.length === 4 ? dates[i] : (i === trend.length - 1 ? 'Current' : `T-${trend.length - 1 - i}`),
    value: val,
    refMin: activeBm.refMin,
    refMax: activeBm.refMax
  }));

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.dashboard.temporalProgression}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            {t.dashboard.historicalTrendFor}: {activeBm.name}
          </h3>
        </div>

        {/* Select Biomarker Dropdown */}
        {trendable.length > 1 && (
          <div className="flex items-center gap-2">
            <select
              value={activeBm.id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400 font-medium"
            >
              {trendable.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.value} {b.unit})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: 'rgba(56,189,248,0.3)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              formatter={(val: any) => [`${val} ${activeBm.unit || ''}`, activeBm.name]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVal)"
              dot={{ fill: '#38bdf8', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#00f0ff', stroke: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Meta */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">{t.dashboard.referenceInterval}</span>
          <span className="font-bold text-slate-200">
            {activeBm.refMin !== undefined && activeBm.refMax !== undefined
              ? `${activeBm.refMin} – ${activeBm.refMax} ${activeBm.unit || ''}`
              : 'Standard'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">
            {t.dashboard.baseline} ({trend.length > 1 ? `${trend.length} Tests` : 'Past'})
          </span>
          <span className="font-bold text-slate-200">
            {trend[0] ?? activeBm.value ?? '—'} {activeBm.unit || ''}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">{t.dashboard.currentValue}</span>
          <span className="font-bold text-cyan-400">
            {activeBm.value ?? trend[trend.length - 1] ?? '—'} {activeBm.unit || ''}
          </span>
        </div>
      </div>
    </div>
  );
};
