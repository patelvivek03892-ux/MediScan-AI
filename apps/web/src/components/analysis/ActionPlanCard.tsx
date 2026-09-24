'use client';

import React from 'react';
import {
  Apple,
  Dumbbell,
  Moon,
  Droplets,
  HelpCircle,
  CalendarCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ActionPlan } from '../../types/medical';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ actionPlan }) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 md:p-8 backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {t.analysis.actionPlanTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.analysis.actionPlanSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diet Advice */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Apple className="w-4 h-4" />
            <span>{t.analysis.dietaryGuidance}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {actionPlan.diet.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exercise Guidance */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Dumbbell className="w-4 h-4" />
            <span>{t.analysis.exerciseProtocol}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {actionPlan.exercise.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hydration & Sleep */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Droplets className="w-4 h-4" />
            <span>{t.analysis.sleepHydration}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {actionPlan.waterAndSleep.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow-up Diagnostic Tests */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <CalendarCheck className="w-4 h-4" />
            <span>{t.analysis.followUpTests}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {actionPlan.recommendedFollowUpTests.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Questions for Attending Doctor */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950 border border-cyan-500/30 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>{t.analysis.questionsForDoctor}</span>
        </div>
        <p className="text-xs text-slate-400">
          AI-recommended clinical inquiry points to discuss with your physician:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {actionPlan.questionsForDoctor.map((q, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed font-medium">{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
