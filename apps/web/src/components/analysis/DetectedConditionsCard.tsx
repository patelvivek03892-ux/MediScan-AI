'use client';

import React from 'react';
import { Stethoscope, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { MedicalReport } from '../../types/medical';
import { detectGroundedConditions } from '../../lib/ai/conditionEngine';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface DetectedConditionsCardProps {
  report: MedicalReport;
}

export const DetectedConditionsCard: React.FC<DetectedConditionsCardProps> = ({ report }) => {
  const { lang, t } = useLanguage();
  const conditions = detectGroundedConditions(report, lang);

  if (!conditions || conditions.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/40 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {t.ai.conditionsTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.ai.conditionsSubtitle}
            </p>
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 text-xs text-slate-300 leading-relaxed">
          No clinical pattern deviations or anomalous conditions were identified in this report. All tested biomarkers align with expected physiological baselines.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-800/80">
        <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/40 text-amber-400">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.ai.conditionsTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.ai.conditionsSubtitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {conditions.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-[#0b111e] border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                {item.condition}
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 w-fit">
                {item.severityNote}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-medium">
                  {t.ai.supportingFinding}
                </span>
                <span className="text-slate-200 font-medium block mt-0.5">
                  {item.supportingFinding}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-medium">
                  {t.ai.observedValue} / {t.ai.refRange}
                </span>
                <span className="text-teal-400 font-mono font-bold block mt-0.5">
                  {item.observedValue}{' '}
                  <span className="text-slate-400 font-normal">
                    (Ref: {item.referenceRange})
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs leading-relaxed text-slate-300">
              <p>
                <strong className="text-white">{t.ai.explanation}: </strong>
                {item.explanation}
              </p>
              <div className="flex items-start gap-2 pt-1 text-teal-300 bg-teal-950/20 border border-teal-800/30 p-2.5 rounded-lg">
                <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{t.ai.nextStep}:</strong> {item.nextStep}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
