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
  User,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { Language } from '../../lib/i18n/translations';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { getCurrentUser, logoutUser, UserProfile } from '../../lib/authStore';

interface NavbarProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLanguageChange
}) => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateAuth = () => {
      setUser(getCurrentUser());
    };
    updateAuth();
    window.addEventListener('mediscan_auth_changed', updateAuth);
    return () => window.removeEventListener('mediscan_auth_changed', updateAuth);
  }, []);

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
  };

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Activity },
    { href: '/scanner', label: t.nav.scanner, icon: Camera },
    { href: '/upload', label: t.nav.upload, icon: UploadCloud },
    { href: '/analysis', label: t.nav.analysis, icon: FileText },
    { href: '/dashboard', label: t.nav.dashboard, icon: BarChart3 },
    { href: '/compare', label: t.nav.compare, icon: GitCompare },
    { href: '/chat', label: t.nav.chat, icon: MessageSquare },
    { href: '/admin', label: t.nav.admin, icon: ShieldCheck }
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
              {t.nav.tagline}
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

        {/* Right Section: Language Selector, Auth & Scanner Action */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => handleLangSelect(e.target.value as Language)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium pr-1"
              aria-label={t.nav.selectLanguage}
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (HI)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (GU)</option>
            </select>
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-extrabold flex items-center justify-center text-[10px]">
                {user.name.charAt(0)}
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <span className="block font-bold text-white text-[11px] truncate max-w-[110px]">{user.name}</span>
                <span className="text-[9px] text-cyan-400 font-mono">{user.role}</span>
              </div>
              <button
                onClick={() => logoutUser()}
                title={t.nav.logout}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/70 border border-white/10 hover:border-cyan-400/30 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.nav.login}</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.nav.signup}</span>
              </Link>
            </div>
          )}

          {/* Quick Scanner Action */}
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:scale-105 active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.hero.ctaScan}</span>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
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

          {/* Mobile Auth Bar */}
          <div className="pt-2 pb-2 border-t border-white/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{user.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{t.nav.selectLanguage}:</span>
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
              {t.hero.ctaScan}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
