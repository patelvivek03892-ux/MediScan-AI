'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-xs text-teal-300 font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>HIPAA & Privacy Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.privacy.title}</h1>
        <p className="text-xs text-slate-400 mt-1">{t.privacy.lastUpdated}</p>
      </div>

      <div className="space-y-5 text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-5 sm:p-6 rounded-xl border border-slate-800">
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.privacy.s1Title}</h2>
          <p>{t.privacy.s1Desc}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.privacy.s2Title}</h2>
          <p>{t.privacy.s2Desc}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.privacy.s3Title}</h2>
          <p>{t.privacy.s3Desc}</p>
        </section>
      </div>
    </div>
  );
}
