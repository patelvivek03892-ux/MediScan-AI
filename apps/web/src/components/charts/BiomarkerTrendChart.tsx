'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
import { Biomarker } from '../../types/medical';

interface BiomarkerTrendChartProps {
  biomarkers: Biomarker[];
}

export const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ biomarkers }) => {
  const trendable = biomarkers.filter((b) => b.historicalTrend && b.historicalTrend.length > 0);
  const [selectedId, setSelectedId] = useState<string>(trendable[0]?.id || biomarkers[0]?.id);

  const activeBm = biomarkers.find((b) => b.id === selectedId) || biomarkers[0];

  const dates = ['6 Mos Ago', '3 Mos Ago', '1 Mo Ago', 'Current Test'];
  const data = (activeBm.historicalTrend || [activeBm.value, activeBm.value, activeBm.value, activeBm.value]).map(
    (val, i) => ({
      date: dates[i] || `T-${i}`,
      value: val,
      refMin: activeBm.refMin,
      refMax: activeBm.refMax
    })
  );

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Temporal Biomarker Progression</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Historical Trend: {activeBm.name}
          </h3>
        </div>

        {/* Select Biomarker Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedId}
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
              formatter={(val: any) => [`${val} ${activeBm.unit}`, activeBm.name]}
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
          <span className="text-[10px] text-slate-400 block uppercase">Reference Interval</span>
          <span className="font-bold text-slate-200">
            {activeBm.refMin} – {activeBm.refMax} {activeBm.unit}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Baseline (6 Mo)</span>
          <span className="font-bold text-slate-200">
            {activeBm.historicalTrend ? activeBm.historicalTrend[0] : activeBm.value} {activeBm.unit}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Current Value</span>
          <span className="font-bold text-cyan-400">
            {activeBm.value} {activeBm.unit}
          </span>
        </div>
      </div>
    </div>
  );
};
