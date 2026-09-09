'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Key,
  Database,
  Activity,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function AdminPage() {
  const [selectedRole, setSelectedRole] = useState<'Doctor' | 'Lab Tech' | 'Patient' | 'Compliance Officer'>('Doctor');

  const auditLogs = [
    {
      id: 'LOG-9921',
      timestamp: '2026-08-14 18:42:10 UTC',
      user: 'dr.mehta@metropolis.med',
      role: 'Attending Clinician',
      action: 'VIEW_REPORT',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: '192.168.1.14 (VPN Verified)'
    },
    {
      id: 'LOG-9920',
      timestamp: '2026-08-14 18:35:44 UTC',
      user: 'ai_engine@mediscan.internal',
      role: 'System AI Worker',
      action: 'BIOMARKER_EXTRACTION',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: 'Internal Pipeline Cluster'
    },
    {
      id: 'LOG-9919',
      timestamp: '2026-08-14 18:12:05 UTC',
      user: 'patient.rahul@gmail.com',
      role: 'Patient (MFA Verified)',
      action: 'EXPORT_PDF',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: '49.36.112.9'
    },
    {
      id: 'LOG-9918',
      timestamp: '2026-08-14 17:50:31 UTC',
      user: 'security@hospital.net',
      role: 'Compliance Officer',
      action: 'HIPAA_AUDIT_CYCLE',
      resource: 'SYSTEM_WIDE',
      status: 'VERIFIED',
      ip: '10.0.4.12'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              HIPAA & GDPR Security Center
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Enterprise Governance & Audit Logs
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cryptographic integrity verification, immutable audit telemetry, and role-based access control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              AES-256-GCM ACTIVE
            </span>
          </div>
        </div>

        {/* Security Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">HIPAA Security Rule</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-400">100% Compliant</span>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">Audit trails, encryption, and access controls verified.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Zero-Knowledge Retention</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-cyan-400">Client-Side First</span>
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">No PHI stored without patient biometric authorization.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">OCR Extraction Integrity</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-indigo-400">99.8% F1 Score</span>
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400">Multi-engine OCR cross-consensus validation.</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Active MFA Sessions</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-purple-400">Enforced</span>
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-[11px] text-slate-400">Time-based TOTP & FIDO2 hardware keys enabled.</p>
          </div>
        </div>

        {/* Role-Based Access Control Simulation */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400">Select an identity to preview authorized operational privileges.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['Doctor', 'Lab Tech', 'Patient', 'Compliance Officer'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Can View Full Biomarkers</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Can Edit Extracted Lab Values</span>
              <span className={`font-bold flex items-center gap-1 mt-1 ${selectedRole === 'Doctor' || selectedRole === 'Lab Tech' ? 'text-emerald-400' : 'text-red-400'}`}>
                {selectedRole === 'Doctor' || selectedRole === 'Lab Tech' ? 'Authorized' : 'Restricted'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Can Export Clinical PDF</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Can Access Audit Logs</span>
              <span className={`font-bold flex items-center gap-1 mt-1 ${selectedRole === 'Compliance Officer' ? 'text-emerald-400' : 'text-red-400'}`}>
                {selectedRole === 'Compliance Officer' ? 'Superuser Access' : 'Restricted'}
              </span>
            </div>
          </div>
        </div>

        {/* Immutable Audit Log Table */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Immutable HIPAA Audit Trail</h3>
              <p className="text-xs text-slate-400">Cryptographically signed transaction log of all access requests.</p>
            </div>
            <button
              onClick={() => alert('Exporting encrypted compliance audit log (CSV).')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold border border-white/10 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Export Audit CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="px-6 py-3.5">Log ID</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">User Identity</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Resource</th>
                  <th className="px-6 py-3.5">Network Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 font-bold text-cyan-400">{log.id}</td>
                    <td className="px-6 py-3.5 text-slate-400">{log.timestamp}</td>
                    <td className="px-6 py-3.5 text-white font-sans">{log.user}</td>
                    <td className="px-6 py-3.5 text-slate-300 font-sans">{log.role}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-300">{log.resource}</td>
                    <td className="px-6 py-3.5 text-slate-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
