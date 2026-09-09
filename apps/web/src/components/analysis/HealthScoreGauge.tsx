'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number; // 0 - 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  riskLevel,
  confidence
}) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 60) return '#f59e0b'; // amber
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const color = getColor();

  return (
    <div className="relative rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl flex flex-col items-center justify-between text-center overflow-hidden">
      {/* Background glow circle */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-semibold uppercase tracking-wider">Health Index</span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono">
          AI Confidence: {(confidence * 100).toFixed(1)}%
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative my-2">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Background circle track */}
          <circle
            stroke="rgba(255,255,255,0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white tracking-tight" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      {/* Status & Risk Badge */}
      <div className="mt-3 space-y-1 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white">
          {score >= 80 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span>Risk Tier: {riskLevel}</span>
        </div>
        <p className="text-[11px] text-slate-400 pt-1">
          {score >= 80
            ? 'Optimal homeostatic stability detected.'
            : score >= 60
            ? 'Metabolic elevation requiring proactive clinical follow-up.'
            : 'Immediate physician review strongly recommended.'}
        </p>
      </div>
    </div>
  );
};
