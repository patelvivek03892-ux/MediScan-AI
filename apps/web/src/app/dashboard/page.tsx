'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Activity,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import { BiomarkerTrendChart } from '../../components/charts/BiomarkerTrendChart';
import { OrganHealthRadar } from '../../components/charts/OrganHealthRadar';
import { METABOLIC_REPORT } from '../../lib/sampleData';
import { getCurrentUser, UserProfile } from '../../lib/authStore';
import { getUserReports, getUserDashboardData, saveUserReport, deleteUserReport } from '../../lib/userReportsStore';
import { MedicalReport } from '../../types/medical';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userReports, setUserReports] = useState<MedicalReport[]>([]);
  const [dashboardData, setDashboardData] = useState(getUserDashboardData('usr-1'));
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');

  const loadUserData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    const userId = user ? user.id : 'usr-1';
    const reports = getUserReports(userId);
    setUserReports(reports);
    setDashboardData(getUserDashboardData(userId));
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener('mediscan_auth_changed', loadUserData);
    window.addEventListener('mediscan_reports_updated', loadUserData);
    return () => {
      window.removeEventListener('mediscan_auth_changed', loadUserData);
      window.removeEventListener('mediscan_reports_updated', loadUserData);
    };
  }, []);

  const handleSeedFirstReport = async () => {
    if (!currentUser) return;
    await saveUserReport(currentUser.id, {
      ...METABOLIC_REPORT,
      id: `REP-2026-${Date.now().toString().slice(-6)}`,
      patientInfo: {
        ...METABOLIC_REPORT.patientInfo,
        name: currentUser.name
      },
      timestamp: new Date().toISOString()
    });
    loadUserData();
  };

  const rawBiomarkers = (userReports.length > 0 && userReports[0]?.biomarkers)
    ? userReports[0].biomarkers
    : (userReports.length === 0 ? METABOLIC_REPORT.biomarkers : []);

  // Compute longitudinal trend across user's reports if multiple tests exist
  const latestBiomarkers = useMemo(() => {
    if (!rawBiomarkers || rawBiomarkers.length === 0) return [];
    if (userReports.length <= 1) return rawBiomarkers;

    const olderReports = userReports.slice(1);
    return rawBiomarkers.map((bm) => {
      // If biomarker already has historical trend (e.g. sample data), keep it
      if (Array.isArray(bm.historicalTrend) && bm.historicalTrend.length > 0) {
        return bm;
      }
      // Look up previous measured values for the exact same biomarker in user's older reports
      const pastValues: number[] = [];
      for (const rep of olderReports) {
        const match = rep.biomarkers?.find(
          (ob) => ob.name.toLowerCase().trim() === bm.name.toLowerCase().trim()
        );
        if (match && typeof match.value === 'number') {
          pastValues.push(match.value);
        }
      }
      if (pastValues.length > 0 && typeof bm.value === 'number') {
        // Reverse so it's chronologically oldest to newest: [...pastValues.reverse(), bm.value]
        return {
          ...bm,
          historicalTrend: [...pastValues.reverse(), bm.value]
        };
      }
      return bm;
    });
  }, [rawBiomarkers, userReports]);
  const organScores = {
    cardiovascular: dashboardData.organScores.Cardiac || 85,
    endocrine: dashboardData.organScores.Metabolic || 85,
    renal: dashboardData.organScores.Renal || 85,
    hepatic: dashboardData.organScores.Hepatic || 85,
    hematology: dashboardData.organScores.Hematologic || 85,
    immune: dashboardData.organScores.Immune || 85
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Patient Profile & Workspace Summary Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-teal-950/80 border border-teal-600/40 flex items-center justify-center text-teal-300 font-bold text-base shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                {currentUser?.name || 'Rahul Verma'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-[10px] font-mono text-teal-300 font-medium">
                {currentUser?.role || t.dashboard.patientRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.dashboard.activeScope} • <span className="text-slate-300 font-medium">{currentUser?.email || 'patient@example.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.dashboard.uploadNew}</span>
          </Link>
          <Link
            href={userReports.length > 0 ? `/analysis?report_id=${encodeURIComponent(userReports[0].id)}&type=custom` : '/analysis'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.dashboard.viewFullAnalysis}</span>
          </Link>
        </div>
      </div>

      {/* Page Title & Time Filtering */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.dashboard.subtitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.dashboard.biomarkerTrendsDesc}
          </p>
        </div>

        {/* Time period filter pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['Last 3 Months', 'Last 6 Months', '1 Year', 'All Time'].map((period, i) => (
            <button
              key={period}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                i === 1
                  ? 'bg-teal-950/80 text-teal-300 border border-teal-700/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State Guard if User Has No Tests Yet */}
      {userReports.length === 0 && (
        <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-lg bg-teal-950/60 border border-teal-700/40 flex items-center justify-center text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">{t.dashboard.noReports}</h3>
            <p className="text-xs text-slate-400">
              {t.dashboard.noReportsDesc}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSeedFirstReport}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.dashboard.seedDemo}</span>
            </button>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{t.dashboard.uploadNew}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Health KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fasting Glucose */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Fasting Glucose</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold font-mono text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> {dashboardData.kpis.glucose.delta}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {dashboardData.kpis.glucose.value ?? 142}
            </span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
            <span>{t.common.status}: {dashboardData.kpis.glucose.status}</span>
          </div>
        </div>

        {/* Card 2: HbA1c */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">HbA1c Glycated</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold font-mono text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> {dashboardData.kpis.hba1c.delta}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {dashboardData.kpis.hba1c.value ?? 7.6}
            </span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
            <span>{t.common.status}: {dashboardData.kpis.hba1c.status}</span>
          </div>
        </div>

        {/* Card 3: LDL Cholesterol */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">LDL Cholesterol</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold font-mono text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> {dashboardData.kpis.cholesterol.delta}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {dashboardData.kpis.cholesterol.value ?? 169}
            </span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
            <span>{t.common.status}: {dashboardData.kpis.cholesterol.status}</span>
          </div>
        </div>

        {/* Card 4: eGFR Filtration */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">eGFR Filtration</span>
            <span className="flex items-center gap-1 text-teal-400 font-semibold font-mono text-[11px]">
              <ArrowDownRight className="w-3.5 h-3.5" /> {dashboardData.kpis.egfr.delta}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {dashboardData.kpis.egfr.value ?? 64}
            </span>
            <span className="text-xs text-slate-400">mL/min</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
            <span>{t.common.status}: {dashboardData.kpis.egfr.status}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Biomarker Trend Area Chart (7 Cols) */}
        <div className="lg:col-span-7">
          <BiomarkerTrendChart biomarkers={latestBiomarkers} />
        </div>

        {/* Systemic Organ Radar (5 Cols) */}
        <div className="lg:col-span-5">
          <OrganHealthRadar scores={organScores} />
        </div>
      </div>

      {/* Clinical Intelligence Summary */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Clinical Assessment Insights ({currentUser?.name || 'Personal Record'})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-200 block">
              {t.dashboard.metabolicHealth}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              HbA1c baseline indicates active glucose elevation. Implementing a 30-minute daily post-prandial walk can reduce this trend by 0.6% within 60 days.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-200 block">
              {t.dashboard.cardiacHealth}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Elevated LDL cholesterol warrants attention; increasing soluble fiber, limiting saturated fats, and scheduling routine cardio checks is recommended.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-200 block">
              {t.dashboard.renalHealth}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filtration markers remain stable. Consistent hydration and avoiding chronic NSAIDs is recommended to preserve nephron filtration integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Report History & Individual Test Records */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Report History & Past Test Records ({userReports.length})</span>
          </div>
          <Link
            href="/upload"
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>+ Analyze New Report</span>
          </Link>
        </div>

        {userReports.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            No medical reports saved yet. Upload or scan a report to start your clinical timeline.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {userReports.map((rep) => {
              const score = rep.overallHealthScore ?? 85;
              const isGood = score >= 80;
              const isMod = score >= 60 && score < 80;

              return (
                <div
                  key={rep.id}
                  className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-teal-400">
                        {rep.id}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {rep.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isGood ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : isMod ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                      }`}>
                        Score: {score}/100 • {rep.riskLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {rep.sampleDate || 'Recent'}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        {rep.patientName || 'Patient'} ({rep.age}y / {rep.gender})
                      </span>
                      <span>
                        {rep.biomarkers?.length || 0} Biomarkers evaluated
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/analysis?report_id=${encodeURIComponent(rep.id)}&type=custom`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700/90 hover:bg-teal-600 text-white text-xs font-medium transition-colors shadow-sm"
                    >
                      <span>View Analysis</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={async () => {
                        if (confirm(`Delete report ${rep.id}?`)) {
                          const uid = currentUser ? currentUser.id : 'usr-1';
                          await deleteUserReport(uid, rep.id);
                          loadUserData();
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-950/50 hover:text-rose-400 text-slate-500 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
