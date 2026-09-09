import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service & Medical Disclaimer</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Mandatory Medical Notice:</strong> The software and services provided by MediScan AI do not provide medical advice, diagnosis, or treatment. It is intended solely for educational, reference, and informational utility.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. No Doctor-Patient Relationship</h2>
            <p>
              Use of the MediScan AI platform, camera scanner, and AI assistant does not establish a physician-patient relationship. You should never delay seeking medical advice, disregard medical recommendations, or discontinue medical treatment because of information provided by this application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Emergency Medical Situations</h2>
            <p>
              IF YOU BELIEVE YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CHEST PAIN, STROKE SYMPTOMS, OR ACUTE SHORTNESS OF BREATH, IMMEDIATELY CALL 911 (OR YOUR LOCAL EMERGENCY SERVICE NUMBER) OR GO TO THE NEAREST EMERGENCY ROOM.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Open-Source License (MIT)</h2>
            <p>
              MediScan AI is released under the permissive MIT Open Source License. The software is provided &quot;as is&quot;, without warranty of any kind, express or implied.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
