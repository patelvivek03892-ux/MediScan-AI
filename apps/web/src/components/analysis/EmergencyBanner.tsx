'use client';

import React, { useState } from 'react';
import { Bell, BellOff, PhoneCall, ShieldAlert, HeartPulse } from 'lucide-react';
import { EmergencyAlert } from '../../types/medical';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface EmergencyBannerProps {
  alert: EmergencyAlert;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ alert }) => {
  const { t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playAlertTone = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      console.warn('Audio tone could not play:', e);
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      playAlertTone();
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/60 bg-gradient-to-r from-red-950/80 via-red-900/50 to-slate-950 p-6 md:p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-pulse">
      {/* Background glowing heartbeat pulse */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-bounce">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-400">
                  {t.analysis.emergencyBannerTitle}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/30 text-red-200 border border-red-400/40">
                  {t.common.critical}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {alert.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                soundEnabled
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/40'
              }`}
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span>{soundEnabled ? 'Alert Tone: ON' : 'Alert Tone: OFF'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm md:text-base text-red-100/90 leading-relaxed font-medium">
          {alert.message}
        </p>

        {/* Triggered Biomarkers List */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-300 block">
            Critical Out-of-Range Markers:
          </span>
          <div className="flex flex-wrap gap-2">
            {alert.triggeredBiomarkers.map((bm, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-500/20 text-red-200 border border-red-500/40 flex items-center gap-1.5"
              >
                <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                {bm}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Immediate Action Box */}
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="space-y-1">
            <strong className="text-xs font-bold text-white uppercase tracking-wider block">
              Urgent Clinical Recommendation:
            </strong>
            <p className="text-xs text-red-200">{alert.actionRequired}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:112"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-600 font-extrabold text-xs shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency (112 / 911)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
