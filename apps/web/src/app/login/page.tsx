'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  ShieldCheck
} from 'lucide-react';
import { loginUser, loginUserWithBackend, UserRole } from '../../lib/authStore';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t.auth.enterEmailPassword);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginUserWithBackend(email, password, 'Patient');
      setIsLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, role: UserRole = 'Patient') => {
    setEmail(demoEmail);
    const passMap: Record<string, string> = {
      'admin@mediscan.ai': 'admin123',
      'dr.mehta@metropolis.med': 'doctor123',
      'rahul.verma@example.com': 'patient123',
      'suresh.patil@diagnostics.lab': 'labtech123'
    };
    const pass = passMap[demoEmail] || 'patient123';
    setPassword(pass);
    setIsLoading(true);

    try {
      await loginUserWithBackend(demoEmail, pass, role);
      setIsLoading(false);
      router.push('/dashboard');
    } catch {
      loginUser(demoEmail, role);
      setIsLoading(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-md mx-auto space-y-5">
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-600/40 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            MediScan <span className="text-teal-400">AI</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-white pt-1">
          {t.auth.loginTitle}
        </h1>
        <p className="text-xs text-slate-400">
          {t.auth.loginSubtitle}
        </p>
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-7 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">{t.auth.emailLabel}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full bg-[#0b111e] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">{t.auth.passwordLabel}</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }} className="text-[11px] text-teal-400 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full bg-[#0b111e] border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-teal-300 text-[11px] leading-relaxed">
            {t.auth.securityNote}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <span>{isLoading ? t.auth.signingIn : t.auth.signInBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Quick Demo Login */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 block font-medium">{t.auth.quickLoginNotice}</span>
          <button
            type="button"
            onClick={() => handleQuickLogin('rahul.verma@example.com', 'Patient')}
            className="w-full py-2 px-3 rounded-lg bg-[#0b111e] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.auth.patientDemo}</span>
          </button>
        </div>
      </div>

      {/* Footer Link to Signup */}
      <p className="text-center text-xs text-slate-400">
        {t.auth.noAccount}{' '}
        <Link href="/signup" className="text-teal-400 font-semibold hover:underline">
          {t.auth.signUpBtn}
        </Link>
      </p>
    </div>
  );
}
