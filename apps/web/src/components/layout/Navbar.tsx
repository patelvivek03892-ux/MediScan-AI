'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Camera,
  UploadCloud,
  FileText,
  BarChart3,
  GitCompare,
  MessageSquare,
  ShieldCheck,
  Globe,
  Sparkles,
  Menu,
  X,
  PhoneCall
} from 'lucide-react';
import { translations, Language } from '../../lib/i18n/translations';

interface NavbarProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang = 'en',
  onLanguageChange
}) => {
  const [lang, setLang] = useState<Language>(currentLang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLangSelect = (newLang: Language) => {
    setLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediscan_lang', newLang);
      window.dispatchEvent(new Event('language_changed'));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mediscan_lang') as Language;
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'gu')) {
        setLang(stored);
      }
    }
  }, []);

  const navLinks = [
    { href: '/', label: t.home, icon: Activity },
    { href: '/scanner', label: t.scanner, icon: Camera },
    { href: '/upload', label: t.upload, icon: UploadCloud },
    { href: '/analysis', label: t.analysis, icon: FileText },
    { href: '/dashboard', label: t.dashboard, icon: BarChart3 },
    { href: '/compare', label: t.compare, icon: GitCompare },
    { href: '/chat', label: t.chat, icon: MessageSquare },
    { href: '/admin', label: t.admin, icon: ShieldCheck }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-slate-950/30 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with glowing medical pulse */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MediScan <span className="text-cyan-400">AI</span>
            </span>
            <span className="block text-[10px] font-medium tracking-wider text-cyan-400/80 uppercase">
              Clinical Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-md">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Selector & Emergency Triage Badge */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => handleLangSelect(e.target.value as Language)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium pr-1"
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (HI)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (GU)</option>
            </select>
          </div>

          {/* Quick Scanner Action */}
          <Link
            href="/scanner"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>AI Scan</span>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Language:</span>
              <select
                value={lang}
                onChange={(e) => handleLangSelect(e.target.value as Language)}
                className="bg-slate-900 text-white rounded px-2 py-1 text-xs border border-white/10"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              Launch Scanner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
