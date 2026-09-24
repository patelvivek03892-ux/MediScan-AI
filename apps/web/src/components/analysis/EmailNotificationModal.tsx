'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { MedicalReport } from '../../types/medical';
import { sendReportEmailViaApi, generateReportEmailHtml, EmailApiResponse } from '../../lib/emailService';
import { getCurrentUser } from '../../lib/authStore';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicalReport;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const currentUser = getCurrentUser();
  const { lang, t } = useLanguage();

  const [recipientEmail, setRecipientEmail] = useState(currentUser?.email || 'patient@example.com');
  const [recipientName, setRecipientName] = useState(currentUser?.name || report.patientName);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<EmailApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const { subject, html } = generateReportEmailHtml(report, recipientName);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    setIsSending(true);
    setErrorMessage(null);

    try {
      const res = await sendReportEmailViaApi(report, recipientEmail, recipientName, lang);
      setDispatchResult(res);
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2600);
    } catch (err: any) {
      setIsSending(false);
      setErrorMessage(err.message || 'Failed to dispatch email. Please check network connectivity.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(56,189,248,0.2)] p-6 md:p-8 overflow-hidden text-white space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Email Report Notification</h3>
              <p className="text-xs text-slate-400">
                Dispatch complete clinical summary to patient or attending physician.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Email Dispatched Successfully!</h4>
            <p className="text-xs text-slate-300">
              Analysis notification sent to <strong className="text-cyan-400">{recipientEmail}</strong>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-950 border border-white/10 text-emerald-300">
                Dispatch ID: {dispatchResult?.dispatch_id || 'EML-DISPATCHED'}
              </span>
              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                dispatchResult?.mode === 'smtp'
                  ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              }`}>
                {dispatchResult?.mode === 'smtp' ? 'Outbound SMTP Live' : 'Safe Dev Mode (Logged)'}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Report:</span>
                <span className="font-bold text-white">{report.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Health Score & Risk:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {report.overallHealthScore}/100 • Tier {report.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Subject:</span>
                <span className="text-[11px] text-slate-300 truncate max-w-[280px]">{subject}</span>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              {/* Toggle HTML Preview */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHtmlPreview ? 'Hide Email Preview' : 'Preview Formatted Email Template'}</span>
                </button>

                {showHtmlPreview && (
                  <div className="mt-2 max-h-44 overflow-y-auto rounded-xl bg-slate-950 border border-white/10 p-3 text-[11px] text-slate-300 space-y-2">
                    <p className="font-bold text-white">Hello {recipientName},</p>
                    <p>Your medical report ({report.id}) has been processed. Overall Health Score: <strong>{report.overallHealthScore}/100</strong>.</p>
                    <p className="text-slate-400">{report.executiveSummary}</p>
                    <span className="text-[10px] text-slate-500 block italic border-t border-white/5 pt-1">
                      Includes full abnormal biomarker breakdown & medical disclaimer.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending Email...' : 'Send Notification Email'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
