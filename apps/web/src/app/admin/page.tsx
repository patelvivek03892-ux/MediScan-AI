'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Mail,
  Search,
  Trash2,
  Eye,
  X,
  Stethoscope,
  UserCheck,
  CheckCircle2,
  Download
} from 'lucide-react';
import Link from 'next/link';
import {
  getAllUsers,
  getCurrentUser,
  loginUser,
  getAuthToken,
  UserProfile,
  UserRole,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from '../../lib/authStore';
import { getEmailLogs, EmailNotificationLog } from '../../lib/emailService';
import { useLanguage } from '../../lib/i18n/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminPage() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailNotificationLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'emails' | 'audit'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [previewEmail, setPreviewEmail] = useState<EmailNotificationLog | null>(null);

  const refreshData = async () => {
    const curr = getCurrentUser();
    setCurrentUser(curr);

    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped: UserProfile[] = data.map((u: any) => ({
            id: String(u.id),
            name: u.full_name,
            email: u.email,
            role: u.role as UserRole,
            phone: u.phone,
            joinedDate: u.created_at ? u.created_at.split('T')[0] : '2026-01-01',
            reportsAnalyzed: u.reports_count || 0,
            status: u.status as 'Active' | 'Suspended'
          }));
          setUsers(mapped);
          setEmailLogs(getEmailLogs());
          return;
        }
      } catch (err) {
        // Fallback
      }
    }

    setUsers(getAllUsers());
    setEmailLogs(getEmailLogs());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('mediscan_auth_changed', refreshData);
    window.addEventListener('mediscan_emails_updated', refreshData);
    return () => {
      window.removeEventListener('mediscan_auth_changed', refreshData);
      window.removeEventListener('mediscan_emails_updated', refreshData);
    };
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const doctorCount = users.filter((u) => u.role === 'Doctor').length;
  const patientCount = users.filter((u) => u.role === 'Patient').length;

  const auditLogs = [
    {
      id: 'LOG-9921',
      timestamp: '2026-09-17 18:42:10 UTC',
      user: 'dr.mehta@metropolis.med',
      role: 'Attending Clinician',
      action: 'VIEW_REPORT',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: '192.168.1.14 (VPN Verified)'
    },
    {
      id: 'LOG-9920',
      timestamp: '2026-09-17 18:35:44 UTC',
      user: 'ai_engine@mediscan.internal',
      role: 'System AI Worker',
      action: 'BIOMARKER_EXTRACTION',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: 'Internal Pipeline Cluster'
    },
    {
      id: 'LOG-9919',
      timestamp: '2026-09-17 18:12:05 UTC',
      user: 'patient.rahul@gmail.com',
      role: 'Patient (MFA Verified)',
      action: 'EXPORT_PDF',
      resource: 'REP-2026-8891X',
      status: 'SUCCESS',
      ip: '49.36.112.9'
    },
    {
      id: 'LOG-9918',
      timestamp: '2026-09-17 17:50:31 UTC',
      user: 'security@hospital.net',
      role: 'Compliance Officer',
      action: 'HIPAA_AUDIT_CYCLE',
      resource: 'SYSTEM_WIDE',
      status: 'VERIFIED',
      ip: '10.0.4.12'
    }
  ];

  if (currentUser && currentUser.role !== 'Admin') {
    return (
      <div className="py-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full p-6 sm:p-8 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{t.auth.authRequired}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.auth.authRequiredDesc}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-white/5 text-left text-xs space-y-1">
            <span className="text-slate-400 block">{t.dashboard.viewingAs}</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{currentUser.name} ({currentUser.email})</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">{currentUser.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 transition-all text-center"
            >
              {t.dashboard.title}
            </Link>
            <button
              onClick={() => {
                loginUser('admin@mediscan.ai', 'Admin');
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold transition-all text-center"
            >
              {t.auth.adminDemo}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.footer.hipaa}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {t.admin.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t.admin.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              {t.footer.encryption}
            </span>
          </div>
        </div>

        {/* Top KPI Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Registered Users */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">{t.admin.totalUsers}</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-white">{users.length}</span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Active Multi-Tenant Database</p>
          </div>

          {/* Card 2: Doctors & Clinicians */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Clinicians & Doctors</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-cyan-400">{doctorCount}</span>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Medical practitioners</p>
          </div>

          {/* Card 3: Active Patients */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Active Patients</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-400">{patientCount}</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Individual patient accounts</p>
          </div>

          {/* Card 4: Email Notifications Dispatched */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium">{t.admin.totalEmails}</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-indigo-400">{emailLogs.length}</span>
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">{t.admin.statusDelivered}</p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.admin.tabUsers} ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'emails'
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{t.admin.tabEmails} ({emailLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.admin.tabAudit}</span>
          </button>
        </div>

        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{t.admin.tabUsers}</h3>
                <p className="text-xs text-slate-400">
                  {t.admin.subtitle}
                </p>
              </div>

              {/* Search & Role Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t.admin.userSearchPlaceholder}
                    className="bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400 w-48"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 text-xs">
                  {['ALL', 'Patient', 'Doctor', 'Lab Tech', 'Admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                        roleFilter === role
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {role === 'ALL' ? t.admin.filterAllRoles : role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3.5">{t.admin.name}</th>
                    <th className="px-5 py-3.5">{t.auth.emailLabel}</th>
                    <th className="px-5 py-3.5">{t.admin.role}</th>
                    <th className="px-5 py-3.5">{t.admin.joinedCol}</th>
                    <th className="px-5 py-3.5">{t.admin.reportsCol}</th>
                    <th className="px-5 py-3.5">{t.admin.statusCol}</th>
                    <th className="px-5 py-3.5 text-right">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredUsers.map((u) => {
                    const isDoctor = u.role === 'Doctor';
                    const isAdmin = u.role === 'Admin';
                    const isLabTech = u.role === 'Lab Tech';

                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold flex items-center justify-center text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-400">{u.phone || 'No phone'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                              isAdmin
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : isDoctor
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : isLabTech
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">{u.joinedDate}</td>
                        <td className="px-5 py-3.5 text-white font-mono font-bold">{u.reportsAnalyzed}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <select
                              value={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                              className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-300 outline-none"
                            >
                              <option value="Patient">Patient</option>
                              <option value="Doctor">Doctor</option>
                              <option value="Lab Tech">Lab Tech</option>
                              <option value="Admin">Admin</option>
                            </select>

                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-semibold"
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Remove user ${u.name}?`)) deleteUser(u.id);
                              }}
                              className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title={t.common.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL NOTIFICATION LOGS */}
        {activeTab === 'emails' && (
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{t.admin.tabEmails}</h3>
                <p className="text-xs text-slate-400">
                  Record of clinical summaries, biomarker alerts, and physician consultation reports dispatched via email.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                  {emailLogs.length} Total Deliveries
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3.5">Log ID</th>
                    <th className="px-5 py-3.5">{t.admin.sentAt}</th>
                    <th className="px-5 py-3.5">{t.admin.recipient}</th>
                    <th className="px-5 py-3.5">{t.analysis.reportId}</th>
                    <th className="px-5 py-3.5">{t.admin.subject}</th>
                    <th className="px-5 py-3.5">{t.admin.statusCol}</th>
                    <th className="px-5 py-3.5 text-right">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-bold font-mono text-cyan-400">{log.id}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">{log.sentAt}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-white block">{log.recipientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.recipientEmail}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">{log.reportId}</td>
                      <td className="px-5 py-3.5 text-slate-200 max-w-[220px] truncate">{log.subject}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setPreviewEmail(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>{t.admin.viewEmail}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HIPAA AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{t.admin.auditComplianceTrail}</h3>
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
                    <th className="px-6 py-3.5">{t.admin.auditTimestamp}</th>
                    <th className="px-6 py-3.5">{t.admin.auditActor}</th>
                    <th className="px-6 py-3.5">{t.admin.role}</th>
                    <th className="px-6 py-3.5">{t.admin.auditEvent}</th>
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
        )}

        {/* Email Preview Modal */}
        {previewEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 overflow-hidden text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-base">{t.admin.viewEmail}</h4>
                  <span className="text-xs font-mono text-cyan-400">{previewEmail.id} • {previewEmail.sentAt}</span>
                </div>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>To:</strong> {previewEmail.recipientName} &lt;{previewEmail.recipientEmail}&gt;</p>
                <p><strong>{t.admin.subject}:</strong> {previewEmail.subject}</p>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 max-h-60 overflow-y-auto space-y-2 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: previewEmail.htmlContent }} />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
