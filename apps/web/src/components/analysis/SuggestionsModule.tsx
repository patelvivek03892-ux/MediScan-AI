'use client';

import React from 'react';
import { Apple, Dumbbell, Activity, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { MedicalReport } from '../../types/medical';
import { generateReportSuggestions, ReportSuggestions } from '../../lib/ai/suggestionsEngine';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface SuggestionsModuleProps {
  report: MedicalReport;
}

export const SuggestionsModule: React.FC<SuggestionsModuleProps> = ({ report }) => {
  const { lang, t } = useLanguage();
  const suggestions: ReportSuggestions = generateReportSuggestions(report, lang);

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-800/80">
        <div className="p-2 rounded-lg bg-teal-950/60 border border-teal-700/40 text-teal-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.ai.suggestionsTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.ai.suggestionsSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category 1: Nutrition */}
        <div className="p-4 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Apple className="w-4 h-4" />
            <span>{t.ai.nutritionTitle}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {suggestions.nutrition.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Category 2: Lifestyle */}
        <div className="p-4 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <Dumbbell className="w-4 h-4" />
            <span>{t.ai.lifestyleTitle}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {suggestions.lifestyle.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Category 3: Self-Monitoring */}
        <div className="p-4 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>{t.ai.monitoringTitle}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {suggestions.monitoring.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Category 4: Professional Follow-Up */}
        <div className="p-4 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>{t.ai.followUpTitle}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {suggestions.professionalFollowUp.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
