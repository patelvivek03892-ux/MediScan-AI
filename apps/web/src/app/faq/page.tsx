'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does MediScan AI extract biomarkers from my medical report?',
      a: 'MediScan AI utilizes an advanced OCR and document vision pipeline combining Surya OCR, PaddleOCR, and DocTR models. It performs edge detection, perspective deskewing, noise filtering, and table boundary extraction before recognizing text and parsing numerical laboratory biomarkers against clinical reference dictionaries.'
    },
    {
      q: 'Does MediScan AI replace a physician or pathologist diagnosis?',
      a: 'No. MediScan AI is strictly an informational and educational analysis tool. It assists patients and clinicians in interpreting parameters, identifying potential risk factors, and preparing relevant consultation questions, but cannot formulate clinical diagnoses or prescribe treatments.'
    },
    {
      q: 'How is patient privacy protected under HIPAA / GDPR?',
      a: 'All processing can be performed in zero-knowledge client-side memory or through private on-premise container clusters. We do not sell or store Protected Health Information (PHI) without explicit cryptographic consent, and all network transmissions adhere to AES-256 standards.'
    },
    {
      q: 'What happens when a critical emergency value is detected?',
      a: 'The platform activates an immediate red pulse emergency alert banner and audio notification recommending urgent evaluation at an emergency department or immediate physician contact.'
    },
    {
      q: 'Which laboratory tests are supported?',
      a: 'Over 60+ biomarkers are parsed, including Complete Blood Count (CBC), Lipid Profiles, Diabetic & Glycemic Indices (HbA1c), Renal Function Tests (KFT), Liver Function Tests (LFT), Thyroid Axis (TSH, T3, T4), Vitamin D3 & B12, and Urinalysis.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Healthcare & Technical FAQ
          </h1>
          <p className="text-sm text-slate-400">
            Answers to common questions regarding accuracy, safety, privacy, and clinical interpretations.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
