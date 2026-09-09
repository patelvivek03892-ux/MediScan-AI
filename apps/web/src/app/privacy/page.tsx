import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026 | HIPAA & GDPR Compliant</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Zero-Knowledge Processing</h2>
            <p>
              MediScan AI is designed from the ground up to respect patient confidentiality. By default, documents scanned via your camera or uploaded in browser sessions are processed in ephemeral client-side memory or securely piped to your private on-premise container cluster.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Protected Health Information (PHI)</h2>
            <p>
              We do not sell, rent, monetize, or harvest personal health data for advertising. Patient names, lab affiliations, and numerical values are never transferred to commercial brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Cryptographic Transmission</h2>
            <p>
              All data transmitted between your device and API endpoints is encrypted using TLS 1.3 and stored with AES-256-GCM authenticated encryption at rest.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
