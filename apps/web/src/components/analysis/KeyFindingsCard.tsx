'use client';

import React from 'react';
import { ClipboardList, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Biomarker } from '../../types/medical';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface KeyFindingsCardProps {
  biomarkers: Biomarker[];
}

export const KeyFindingsCard: React.FC<KeyFindingsCardProps> = ({ biomarkers }) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" />
            {t.ai.statusWithin}
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/60 text-blue-400 border border-blue-800/40">
            <Info className="w-3 h-3" />
            {t.ai.statusBelow}
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/60 text-amber-400 border border-amber-800/40">
            <AlertTriangle className="w-3 h-3" />
            {t.ai.statusAbove}
          </span>
        );
      case 'CRITICAL_HIGH':
      case 'CRITICAL_LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-950/60 text-rose-400 border border-rose-800/40">
            <AlertCircle className="w-3 h-3" />
            {t.ai.statusCritical}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-800/80">
        <div className="p-2 rounded-lg bg-teal-950/60 border border-teal-700/40 text-teal-400">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.ai.keyFindingsTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.ai.keyFindingsSubtitle}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0b111e] text-slate-400">
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">{t.analysis.bmColName}</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">{t.analysis.bmColValue}</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">{t.analysis.bmColRange}</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">{t.analysis.bmColStatus}</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">{t.analysis.bmColSignificance}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {biomarkers.map((bm, idx) => {
              const isAbnormal = bm.status !== 'NORMAL';
              return (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isAbnormal ? 'bg-slate-900/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-white">
                    {bm.name}
                    <span className="block text-[10px] text-slate-400 font-mono">{bm.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                    {bm.value} <span className="text-slate-400 font-normal">{bm.unit}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {typeof bm.referenceRange === 'object' && bm.referenceRange !== null
                      ? `${(bm.referenceRange as any).low} - ${(bm.referenceRange as any).high} ${(bm.referenceRange as any).unit}`
                      : (typeof bm.referenceRange === 'string' ? bm.referenceRange : (bm.refMin !== undefined && bm.refMax !== undefined ? `${bm.refMin} - ${bm.refMax} ${bm.unit}` : t.ai.noRefRange))}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(bm.status)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs leading-relaxed">
                    {bm.clinicalSignificance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
