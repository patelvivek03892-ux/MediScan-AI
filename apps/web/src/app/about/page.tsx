import React from 'react';
import { Activity, ShieldCheck, Heart, Users, Award, FileText } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-semibold">
            <Activity className="w-3.5 h-3.5" />
            Our Mission & Clinical Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Democratizing Medical Intelligence
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MediScan AI is an open-source initiative designed to bridge the gap between complex diagnostic laboratory results and patient understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Clinical Validation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biomarker thresholds and reference ranges are mapped against consensus standards from the WHO, ADA, and College of American Pathologists (CAP).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <Users className="w-8 h-8 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Patient Centric</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowers patients with plain-language explanations, actionable lifestyle modifications, and structured doctor consultation preparation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <Award className="w-8 h-8 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">100% Open Source</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, privacy-preserving, and extensible. Built for community peer review, hospital integrations, and global healthcare equity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
