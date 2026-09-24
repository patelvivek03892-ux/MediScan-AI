'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Shield, Lock, Award, Heart, Code2 } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#090d16] border-t border-slate-800/80 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand & Summary */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-600/40 flex items-center justify-center text-teal-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                MediScan <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer.brandDesc}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                <Shield className="w-3 h-3 text-emerald-400" /> {t.footer.hipaa}
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                <Lock className="w-3 h-3 text-teal-400" /> {t.footer.encryption}
              </span>
            </div>
          </div>

          {/* Clinical Solutions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3">
              {t.footer.clinicalTools}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/scanner" className="hover:text-teal-300 transition-colors">
                  {t.footer.aiScanner}
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-teal-300 transition-colors">
                  {t.footer.uploadLab}
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-teal-300 transition-colors">
                  {t.footer.biomarkerAnalysis}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-300 transition-colors">
                  {t.footer.healthTrend}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-teal-300 transition-colors">
                  {t.footer.compareTests}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI & Features */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3">
              {t.footer.aiIntelligence}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/chat" className="hover:text-teal-300 transition-colors">
                  {t.footer.assistant}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-300 transition-colors">
                  {t.footer.auditCompliance}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-300 transition-colors">
                  {t.footer.validation}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-teal-300 transition-colors">
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Open Source */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-teal-300 transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-300 transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-300 transition-colors">
                  {t.about.creditsTitle}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-teal-300 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                MIT License • Open Source
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs leading-relaxed mb-6 flex items-start gap-2.5">
          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5 text-amber-200">
              {t.footer.disclaimerTitle}
            </strong>
            {t.analysis.disclaimer}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-teal-400">
              Designed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
