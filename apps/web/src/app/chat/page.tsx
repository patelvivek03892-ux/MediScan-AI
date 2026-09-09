'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Globe
} from 'lucide-react';
import { Language } from '../../lib/i18n/translations';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello, I am your MediScan AI Health Assistant. You can ask me to explain medical report terms, lab values (like CBC, HbA1c, or Lipid profiles), diet and lifestyle recommendations, or questions to prepare for your doctor visit. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
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

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      console.warn(e);
      setIsListening(false);
    }
  };

  // Handle Text to Speech
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate intelligent AI clinical response
    setTimeout(() => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('hba1c') || lower.includes('sugar') || lower.includes('diabetes')) {
        replyText = lang === 'hi'
          ? 'HbA1c आपके पिछले 2-3 महीनों के औसत ब्लड शुगर को मापता है। सामान्य स्तर 5.7% से कम होता है। 7.6% का स्तर बताता है कि रक्त शर्करा अधिक है, जिसे कम करने के लिए कम ग्लाइसेमिक आहार, प्रतिदिन 30 मिनट का व्यायाम और डॉक्टर की सलाह आवश्यक है।'
          : lang === 'gu'
          ? 'HbA1c છેલ્લા 2 થી 3 મહિનાના બ્લડ સુગરનું સરેરાશ પ્રમાણ દર્શાવે છે. સામાન્ય રીતે 5.7% થી ઓછું હોવું જોઈએ. 7.6% પ્રમાણ દર્શાવે છે કે યોગ્ય આહાર અને ડૉક્ટરની સલાહ જરૂરી છે.'
          : 'HbA1c measures the percentage of hemoglobin glycated with sugar over the past 90 days. Normal is < 5.7%. A reading of 7.6% indicates suboptimal glycemic control, commonly managed with dietary carbohydrate reduction, daily physical activity, and physician-prescribed medication.';
      } else if (lower.includes('ldl') || lower.includes('cholesterol') || lower.includes('lipid')) {
        replyText = 'LDL is known as "bad" cholesterol because excess amounts can deposit in artery walls. An optimal level is below 100 mg/dL. An LDL of 169 mg/dL indicates elevated cardiovascular risk, typically addressed with soluble fiber (chia seeds, oats), reducing saturated fats, and discussing statin therapy with your physician.';
      } else if (lower.includes('doctor') || lower.includes('questions') || lower.includes('ask')) {
        replyText = 'Great question! When meeting your physician, consider asking: 1) "What target HbA1c should I aim for over the next 3 months?", 2) "Do my LDL and triglyceride levels warrant medication or dietary management first?", and 3) "Should we check a urine microalbumin test to evaluate kidney health?"';
      } else if (lower.includes('kidney') || lower.includes('creatinine') || lower.includes('egfr')) {
        replyText = 'Serum creatinine is a waste product filtered by your kidneys. A normal range is 0.7 - 1.2 mg/dL. When creatinine rises mildly (e.g. 1.32 mg/dL) and eGFR is around 64 mL/min, it indicates mild filtration decline. Staying well hydrated, avoiding chronic NSAID painkillers, and keeping blood pressure controlled protects kidney nephrons.';
      } else {
        replyText = `Thank you for asking about "${query}". In clinical medicine, this parameter interacts closely with overall metabolic regulation. Remember that MediScan AI provides educational insights; always share these findings with your healthcare provider for an individualized treatment plan.`;
      }

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      if (speechEnabled) {
        speakText(replyText);
      }
    }, 600);
  };

  const quickPrompts = [
    'Explain my HbA1c of 7.6%',
    'What diet helps lower high LDL?',
    'What questions should I ask my doctor?',
    'How do I protect my kidney health?'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Medical QA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Clinical Health Assistant
            </h1>
            <p className="text-xs text-slate-400">
              Conversational lab report explanations, biomarker clarifications, and physician visit prep.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Picker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-slate-200 outline-none text-xs"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="hi" className="bg-slate-900">हिन्दी</option>
                <option value="gu" className="bg-slate-900">ગુજરાતી</option>
              </select>
            </div>

            {/* Speech Toggle */}
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                speechEnabled
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
              title="Toggle Text-to-Speech Output"
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chat Feed Frame */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl h-[480px] flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Scrollable Messages Area */}
          <div className="overflow-y-auto space-y-4 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-lg rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium'
                      : 'bg-slate-950/80 border border-white/10 text-slate-200'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block text-right ${
                      m.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-white/10 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about lab metrics, HbA1c, cholesterol, or doctor advice..."
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 transition-colors"
              />

              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-slate-950/80 border-white/10 text-slate-300 hover:text-white'
                }`}
                title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="text-center text-xs text-slate-500">
          Medical Disclaimer: MediScan AI answers are for educational purposes and do not constitute clinical diagnosis or prescribing.
        </div>
      </div>
    </div>
  );
}
