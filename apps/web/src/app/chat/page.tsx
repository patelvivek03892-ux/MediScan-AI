'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Globe,
  FileText,
  Download,
  Mail,
  GitCompare,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Check,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Language } from '../../lib/i18n/translations';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import {
  processAssistantCommand,
  executeConfirmedEmailDispatch,
  ActionResult,
  ActionButton,
  detectIntent
} from '../../lib/assistantEngine';
import { getCurrentUser } from '../../lib/authStore';
import { exportReportToPdf } from '../../lib/pdfExport';
import { MedicalReport } from '../../types/medical';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionResult?: ActionResult;
  isAnalyzing?: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: t.chat.welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionResult: {
        intent: 'HELP',
        type: 'text',
        reply: '',
        actions: [
          { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
          { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' },
          { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' },
          { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' },
          { label: t.chat.actionCompare, action: 'ACTION:COMPARE', variant: 'secondary' }
        ]
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // When language changes, keep initial message aligned
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0 && prev[0].id === 'm-welcome') {
        return [
          {
            ...prev[0],
            text: t.chat.welcomeText,
            actionResult: {
              ...prev[0].actionResult!,
              actions: [
                { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
                { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' },
                { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' },
                { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' },
                { label: t.chat.actionCompare, action: 'ACTION:COMPARE', variant: 'secondary' }
              ]
            }
          },
          ...prev.slice(1)
        ];
      }
      return prev;
    });
  }, [lang, t]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-To-Speech Output
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API Voice Recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      console.warn('SpeechRecognition error:', e);
      setIsListening(false);
    }
  };

  // Dispatches User Query to the Assistant Engine
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isProcessing) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: userTimestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    const intent = detectIntent(query);

    // If it's an analysis request, show realistic multistep animation
    if (intent === 'ANALYZE_REPORT') {
      const analyzingMsgId = `msg-analyzing-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: analyzingMsgId,
          sender: 'assistant',
          text: t.chat.analyzingReport,
          timestamp: userTimestamp,
          isAnalyzing: true
        }
      ]);

      setTimeout(() => {
        const actionRes = processAssistantCommand(query, lang);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === analyzingMsgId
              ? {
                  ...m,
                  text: actionRes.reply,
                  actionResult: actionRes,
                  isAnalyzing: false,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              : m
          )
        );
        speakText(actionRes.reply);
        setIsProcessing(false);

        if (actionRes.navigationUrl) {
          setTimeout(() => {
            router.push(actionRes.navigationUrl!);
          }, 900);
        }
      }, 1000);
      return;
    }

    // Fast action dispatch
    setTimeout(() => {
      const actionRes = processAssistantCommand(query, lang);
      const assistantMsg: Message = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: actionRes.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResult: actionRes
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(actionRes.reply);
      setIsProcessing(false);

      // If action is download, trigger pdf export
      if (actionRes.intent === 'DOWNLOAD_REPORT' && actionRes.report) {
        try {
          exportReportToPdf(actionRes.report);
        } catch (e) {
          console.warn('PDF export error:', e);
        }
      }

      // Auto-navigate for explicit navigation-targeted actions
      const autoNavigateIntents = [
        'VIEW_RESULT',
        'VIEW_HISTORY',
        'COMPARE_REPORTS',
        'SCAN_REPORT',
        'UPLOAD_REPORT'
      ];
      if (actionRes.navigationUrl && autoNavigateIntents.includes(actionRes.intent)) {
        setTimeout(() => {
          router.push(actionRes.navigationUrl!);
        }, 900);
      }
    }, 400);
  };

  // Interactive Action Button Handler
  const handleActionButton = (actionStr: string, activeReport?: MedicalReport) => {
    // 1. Dynamic route navigation (handles 'NAVIGATE:/analysis', 'NAVIGATE:ANALYSIS', 'NAVIGATE:/upload', etc.)
    if (actionStr.startsWith('NAVIGATE:')) {
      let targetPath = actionStr.replace('NAVIGATE:', '').trim();
      if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath.toLowerCase();
      }
      router.push(targetPath);
      return;
    }

    // 2. Core Action commands (routes to handleSendMessage so both buttons and typed text share identical flow)
    if (actionStr === 'ACTION:ANALYZE') {
      handleSendMessage(t.chat.actionAnalyze);
      return;
    }

    if (actionStr === 'ACTION:EXPLAIN') {
      handleSendMessage(t.chat.actionExplain);
      return;
    }

    if (actionStr === 'ACTION:COMPARE') {
      handleSendMessage(t.chat.actionCompare);
      return;
    }

    if (actionStr === 'ACTION:DOWNLOAD') {
      if (activeReport) {
        try {
          exportReportToPdf(activeReport);
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-pdf-${Date.now()}`,
              sender: 'assistant',
              text: `Clinical PDF for report ${activeReport.id} generated successfully. Check your browser downloads.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } catch (e) {
          alert('Could not export PDF.');
        }
      } else {
        handleSendMessage(t.chat.actionDownload);
      }
      return;
    }

    if (actionStr === 'ACTION:EMAIL_CONFIRM') {
      handleSendMessage(t.chat.actionEmail);
      return;
    }

    if (actionStr === 'ACTION:ASK_DIET') {
      handleSendMessage(lang === 'hi' ? 'मुझे क्या खाना चाहिए?' : lang === 'gu' ? 'મારે શું ખાવું જોઈએ?' : 'What should I eat based on my report?');
      return;
    }

    if (actionStr === 'ACTION:ASK_DOCTOR') {
      handleSendMessage(lang === 'hi' ? 'डॉक्टर से क्या पूछें?' : lang === 'gu' ? 'ડૉક્ટરને શું પૂછવું?' : 'What doctor questions should I ask?');
      return;
    }

    if (actionStr === 'EXECUTE:SEND_EMAIL') {
      const user = getCurrentUser();
      const reportToSend = activeReport || (messages.find(m => m.actionResult?.report)?.actionResult?.report);
      if (!user || !reportToSend) {
        alert('Active user or report not found. Please log in to dispatch email.');
        return;
      }
      const sentResult = executeConfirmedEmailDispatch(reportToSend, user, lang);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-eml-${Date.now()}`,
          sender: 'assistant',
          text: sentResult.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: sentResult
        }
      ]);
      return;
    }

    if (actionStr === 'ACTION:CANCEL') {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-cnl-${Date.now()}`,
          sender: 'assistant',
          text: lang === 'hi'
            ? 'ईमेल भेजना रद्द कर दिया गया है। क्या आप कोई अन्य कार्रवाई करना चाहते हैं?'
            : lang === 'gu'
            ? 'ઇમેઇલ મોકલવાનું રદ કર્યું છે.'
            : 'Email dispatch cancelled. Let me know if you would like to perform any other clinical actions.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }
  };

  const quickPrompts = [
    t.chat.actionAnalyze,
    t.chat.actionExplain,
    t.chat.actionDownload,
    t.chat.actionEmail,
    t.chat.actionCompare
  ];

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.chat.badgeAssistant}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.chat.title}
          </h1>
          <p className="text-xs text-slate-400">
            {t.chat.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
              aria-label={t.nav.selectLanguage}
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી</option>
            </select>
          </div>

          {/* Speech Toggle */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              speechEnabled
                ? 'bg-teal-950/60 border-teal-700 text-teal-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={t.chat.speechToggle}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chat Feed Frame */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 h-[580px] flex flex-col justify-between overflow-hidden shadow-sm">
        {/* Scrollable Messages Area */}
        <div className="overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-600/40 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs space-y-2.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-teal-700 text-white font-medium rounded-br-none'
                    : 'bg-[#0b111e] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message body */}
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Dynamic Progress indicator during live analysis */}
                {m.isAnalyzing && (
                  <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 flex items-center gap-2.5">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                    <span className="text-teal-300 font-mono text-[11px] font-semibold">
                      {t.chat.analyzingReport}
                    </span>
                  </div>
                )}

                {/* Contextual Smart Action Buttons */}
                {m.actionResult?.actions && m.actionResult.actions.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap gap-1.5">
                    {m.actionResult.actions.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionButton(btn.action, m.actionResult?.report)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          btn.variant === 'primary'
                            ? 'bg-teal-700 hover:bg-teal-600 text-white'
                            : btn.variant === 'accent'
                            ? 'bg-sky-700 hover:bg-sky-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>{btn.label}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Structured Interactive Action Results Card */}
                {m.actionResult && m.actionResult.type === 'report_summary' && m.actionResult.report && (
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5 mt-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-white text-xs block">{m.actionResult.report.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.actionResult.report.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950/60 border border-teal-800 text-teal-300">
                          Score: {m.actionResult.report.overallHealthScore}/100
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3">
                      {m.actionResult.report.executiveSummary}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] pt-1">
                      {m.actionResult.report.biomarkers.slice(0, 4).map((bm, bIdx) => (
                        <div key={bIdx} className="p-2 rounded bg-[#0b111e] border border-slate-800/80">
                          <span className="text-slate-400 block truncate">{bm.name}</span>
                          <span className="font-mono font-bold text-slate-200">{bm.value} {bm.unit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => router.push('/analysis?source=chat&type=metabolic')}
                        className="px-3 py-1 rounded-md bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>View Full Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Dispatch Preview Card */}
                {m.actionResult && (m.actionResult.type === 'email_preview' || m.actionResult.type === 'email_prompt') && (
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-teal-800/40 space-y-2.5 mt-2">
                    <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
                      <Mail className="w-4 h-4" />
                      <span>{t.chat.emailConfirmTitle}</span>
                    </div>
                    <div className="text-xs text-slate-300 bg-[#0b111e] p-2.5 rounded-md border border-slate-800 font-mono space-y-1">
                      <div>To: <span className="text-white">{m.actionResult.recipientEmail || getCurrentUser()?.email || 'user@example.com'}</span></div>
                      <div>Report: <span className="text-white">{m.actionResult.report?.title || 'Clinical Analysis'} ({m.actionResult.report?.id || 'Active'})</span></div>
                      <div>Attachment: <span className="text-teal-400 font-bold">Encrypted_Lab_Dossier.pdf</span></div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleActionButton('EXECUTE:SEND_EMAIL', m.actionResult?.report)}
                        className="px-3 py-1.5 rounded-md bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                      >
                        {t.chat.btnConfirmSend}
                      </button>
                      <button
                        onClick={() => handleActionButton('ACTION:CANCEL')}
                        className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        {t.common.cancel}
                      </button>
                    </div>
                  </div>
                )}

                {/* Comparison Preview Card */}
                {m.actionResult && (m.actionResult.type === 'compare_summary' || m.actionResult.type === 'comparison') && (
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2 mt-2">
                    <span className="font-semibold text-white text-xs block">
                      Longitudinal Biomarker Comparison (Baseline vs Current)
                    </span>
                    <div className="text-xs text-slate-300 leading-relaxed bg-[#0b111e] p-2.5 rounded-md border border-slate-800">
                      {m.actionResult.comparisonData ? (
                        <>
                          Baseline: <strong className="text-white">{m.actionResult.comparisonData.baselineReport.title}</strong> → Current: <strong className="text-white">{m.actionResult.comparisonData.currentReport.title}</strong>
                          <div className="mt-1 text-slate-400 space-y-0.5">
                            {m.actionResult.comparisonData.deltas.map((d, idx) => (
                              <div key={idx}>
                                • {d.name}: {d.prev} → {d.curr} {d.unit} ({d.difference}) [{d.status}]
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          Baseline: <strong className="text-white">Metabolic Panel (3 mos ago)</strong> → Current: <strong className="text-white">Active Lab (Today)</strong>
                          <div className="mt-1 text-slate-400">
                            • Glucose: 138 → 142 mg/dL (+4 mg/dL)<br />
                            • HbA1c: 7.4% → 7.6% (+0.2%)<br />
                            • LDL: 154 → 169 mg/dL (+15 mg/dL)
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => router.push('/compare')}
                      className="px-3 py-1 rounded-md bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                    >
                      Open Full Comparison Matrix
                    </button>
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right ${
                    m.sender === 'user' ? 'text-teal-100/75' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Bottom Control Bar */}
        <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
          {/* Quick Action Commands Carousel */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 bg-[#0b111e] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
            />

            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg border transition-colors ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isListening ? t.common.close : t.chat.speak}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="p-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="text-center text-[11px] text-slate-500">
        {t.analysis.disclaimer}
      </div>
    </div>
  );
}
