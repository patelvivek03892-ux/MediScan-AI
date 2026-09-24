'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Globe,
  UploadCloud,
  ShieldCheck,
  Bell,
  Camera
} from 'lucide-react';
import { Language } from '../../lib/i18n/translations';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { getCurrentUser, UserProfile } from '../../lib/authStore';

interface TopHeaderProps {
  isSidebarCollapsed: boolean;
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  isSidebarCollapsed,
  onOpenMobileMenu,
}) => {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const updateAuth = () => {
      setUser(getCurrentUser());
    };
    updateAuth();
    window.addEventListener('mediscan_auth_changed', updateAuth);
    return () => window.removeEventListener('mediscan_auth_changed', updateAuth);
  }, []);

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/dashboard':
        return t.nav.dashboard;
      case '/upload':
        return t.nav.upload;
      case '/analysis':
        return t.nav.analysis;
      case '/scanner':
        return t.nav.scanner;
      case '/compare':
        return t.nav.compare;
      case '/chat':
        return t.nav.chat;
      case '/admin':
        return t.nav.admin;
      case '/about':
        return t.nav.aboutMethodology;
      case '/faq':
        return t.nav.helpFaq;
      default:
        return t.nav.brand;
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#090d16]/90 border-b border-slate-800/80 backdrop-blur-md transition-all duration-300 ease-in-out left-0 ${
        isSidebarCollapsed ? 'lg:left-16' : 'lg:left-60'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Trigger & Page Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              MediScan AI
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">/</span>
            <h1 className="text-sm font-bold text-white tracking-tight truncate">
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>

        {/* Right Section: System Status, Language Selector & Quick Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Clinical Security Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-slate-300">
              {t.nav.systemOperational}
            </span>
          </div>

          {/* Centralized Language Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors">
            <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer pr-1 font-medium"
              aria-label={t.nav.selectLanguage}
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (HI)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (GU)</option>
            </select>
          </div>

          {/* Quick Action Button: Upload / Scan */}
          <Link
            href="/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-teal-700 hover:bg-teal-600 transition-colors shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nav.upload}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
