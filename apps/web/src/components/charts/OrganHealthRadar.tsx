'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { ShieldAlert } from 'lucide-react';

interface OrganScores {
  cardiovascular: number;
  endocrine: number;
  renal: number;
  hepatic: number;
  hematology: number;
  immune: number;
}

interface OrganHealthRadarProps {
  scores?: Partial<OrganScores>;
}

export const OrganHealthRadar: React.FC<OrganHealthRadarProps> = ({ scores }) => {
  const safeScores = {
    cardiovascular: scores?.cardiovascular ?? 85,
    endocrine: scores?.endocrine ?? 85,
    renal: scores?.renal ?? 85,
    hepatic: scores?.hepatic ?? 85,
    hematology: scores?.hematology ?? 85,
    immune: scores?.immune ?? 85
  };

  const data = [
    { organ: 'Cardio', score: safeScores.cardiovascular, fullMark: 100 },
    { organ: 'Endocrine', score: safeScores.endocrine, fullMark: 100 },
    { organ: 'Renal (Kidneys)', score: safeScores.renal, fullMark: 100 },
    { organ: 'Hepatic (Liver)', score: safeScores.hepatic, fullMark: 100 },
    { organ: 'Hematology', score: safeScores.hematology, fullMark: 100 },
    { organ: 'Immunity', score: safeScores.immune, fullMark: 100 }
  ];

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Systemic Organ Health Profile
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Multi-axial metabolic balance and organ vulnerability evaluation.
        </p>
      </div>

      <div className="h-64 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="organ" stroke="#94a3b8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.05)" />
            <Radar
              name="Organ Index"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: 'rgba(6,182,212,0.4)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff'
              }}
              formatter={(val: any) => [`${val} / 100`, 'Health Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] text-center">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
          <span className="text-slate-400 block">Renal Index</span>
          <span className="font-bold text-cyan-300">{safeScores.renal}%</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
          <span className="text-slate-400 block">Hepatic</span>
          <span className="font-bold text-emerald-300">{safeScores.hepatic}%</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
          <span className="text-slate-400 block">Cardiovascular</span>
          <span className="font-bold text-amber-300">{safeScores.cardiovascular}%</span>
        </div>
      </div>
    </div>
  );
};
