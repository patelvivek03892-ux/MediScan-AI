'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Camera,
  GitCompare,
  MessageSquare,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  UserPlus,
  HelpCircle,
  Info,
  Gamepad2,
  X
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { getCurrentUser, logoutUser, UserProfile } from '../../lib/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
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

  const primaryNav = [
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/upload', label: t.nav.upload, icon: UploadCloud },
    { href: '/analysis', label: t.nav.analysis, icon: FileText },
    { href: '/scanner', label: t.nav.scanner, icon: Camera },
    { href: '/compare', label: t.nav.compare, icon: GitCompare },
    { href: '/chat', label: t.nav.chat, icon: MessageSquare },
    { href: '/admin', label: t.nav.admin, icon: ShieldCheck, adminOnly: true },
  ];

  const secondaryNav = [
    { href: '/about', label: t.nav.aboutMethodology, icon: Info },
    { href: '/faq', label: t.nav.helpFaq, icon: HelpCircle },
  ];

  const handleOpenGames = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_health_games'));
    }
    if (isMobileOpen) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0b111e] border-r border-slate-800/80 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 justify-between border-b border-slate-800/80 shrink-0">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          title="MediScan AI"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-600/40 flex items-center justify-center shrink-0 text-teal-400 group-hover:border-teal-500 transition-colors">
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-bold text-sm tracking-tight text-white truncate">
                MediScan <span className="text-teal-400 font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider">
                {t.nav.tagline}
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Items (Vertical List) */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-6">
        {/* Primary Section */}
        <div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
              {t.nav.patientPortal}
            </div>
          )}
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              // Hide admin link from regular patients if not admin
              if (item.adminOnly && user && user.role !== 'Admin') {
                return null;
              }
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group relative ${
                    isActive
                      ? 'bg-teal-950/60 text-teal-300 border-l-2 border-teal-500 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {/* Subtle active dot in collapsed state */}
                  {isCollapsed && !isMobileOpen && isActive && (
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary / Educational Section */}
        <div className="pt-2 border-t border-slate-800/60">
          {(!isCollapsed || isMobileOpen) && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
              {t.nav.helpFaq}
            </div>
          )}
          <nav className="space-y-1">
            {/* Health Learning Games Launcher */}
            <button
              onClick={handleOpenGames}
              title={isCollapsed && !isMobileOpen ? t.nav.games : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors group"
            >
              <Gamepad2 className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-teal-400 transition-colors" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate">{t.nav.games}</span>
              )}
            </button>

            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group relative ${
                    isActive
                      ? 'bg-teal-950/60 text-teal-300 border-l-2 border-teal-500 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Section & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/80 shrink-0 space-y-2 bg-[#090e18]">
        {user ? (
          <div
            className={`flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800 ${
              isCollapsed && !isMobileOpen ? 'flex-col gap-2' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-teal-900/80 border border-teal-600/40 text-teal-300 font-bold flex items-center justify-center text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-white truncate">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-teal-400/90 font-mono">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => logoutUser()}
              title={t.nav.logout}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              aria-label={t.nav.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Link
              href="/login"
              onClick={onCloseMobile}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
              title={t.nav.login}
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              {(!isCollapsed || isMobileOpen) && <span>{t.nav.login}</span>}
            </Link>
            {(!isCollapsed || isMobileOpen) && (
              <Link
                href="/signup"
                onClick={onCloseMobile}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.nav.signup}</span>
              </Link>
            )}
          </div>
        )}

        {/* Desktop Collapse / Expand Toggle Button */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
          className="hidden lg:flex items-center justify-center gap-2 w-full py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 text-[11px] font-medium transition-colors"
          aria-label={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>{t.nav.collapseSidebar}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
