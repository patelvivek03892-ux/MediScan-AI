'use client';

import React from 'react';
import { Activity, ShieldCheck, Users, Award, Code2 } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-xs text-teal-300 font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>{t.about.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {t.about.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <h3 className="text-sm font-bold text-white">{t.about.card1Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.card1Desc}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <Users className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">{t.about.card2Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.card2Desc}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <Award className="w-6 h-6 text-amber-400" />
          <h3 className="text-sm font-bold text-white">{t.about.card3Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.card3Desc}
          </p>
        </div>
      </div>

      {/* Open-Source Attribution & Credits Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
          <Code2 className="w-4 h-4" />
          <span>{t.about.creditsTitle}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.about.creditsDesc}
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
          <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 font-mono">MIT License</span>
          <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 font-mono">PaddleOCR / DocTR / Surya</span>
          <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 font-mono">Next.js & React</span>
          <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 font-mono">Recharts & Lucide Icons</span>
        </div>
      </div>
    </div>
  );
}
