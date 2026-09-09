'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Shield, Lock, Award, Heart, ExternalLink, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-950/90 border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-t from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MediScan <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Enterprise-grade open-source AI platform for diagnostic medical report interpretation, instant camera scanning, OCR biomarker extraction, and emergency risk triage.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> HIPAA Aligned
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> AES-256 Zero-Knowledge
              </span>
            </div>
          </div>

          {/* Clinical Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Clinical Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/scanner" className="hover:text-cyan-400 transition-colors">
                  AI Camera Scanner
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-cyan-400 transition-colors">
                  Upload Lab Reports
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-cyan-400 transition-colors">
                  Biomarker Analysis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Health Trend Charts
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-cyan-400 transition-colors">
                  Compare Historical Tests
                </Link>
              </li>
            </ul>
          </div>

          {/* AI & Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              AI Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/chat" className="hover:text-cyan-400 transition-colors">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-400 transition-colors">
                  Audit & Compliance
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  Clinical Validation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Healthcare FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Open Source */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Legal & Open Source
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                MIT License • Open Source
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300/90 text-xs leading-relaxed mb-8 flex items-start gap-3">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <strong className="font-semibold block mb-0.5 text-amber-200">
              Mandatory Statutory Medical Disclaimer
            </strong>
            This AI-generated analysis is for informational and educational purposes only and is not a substitute for clinical diagnosis, treatment, or medical advice from a qualified healthcare professional. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediScan AI. Built for hospitals, clinicians, and patients globally.</p>
          <div className="flex items-center gap-2">
            <span>Powered by Open-Source AI</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              Designed with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
