'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.terms.title}</h1>
        <p className="text-xs text-slate-400 mt-1">{t.terms.lastUpdated}</p>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-amber-100">{t.terms.noticeTitle}</strong> {t.terms.noticeDesc}
        </p>
      </div>

      <div className="space-y-5 text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-5 sm:p-6 rounded-xl border border-slate-800">
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.terms.s1Title}</h2>
          <p>{t.terms.s1Desc}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.terms.s2Title}</h2>
          <p>{t.terms.s2Desc}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.terms.s3Title}</h2>
          <p>{t.terms.s3Desc}</p>
        </section>
      </div>
    </div>
  );
}
