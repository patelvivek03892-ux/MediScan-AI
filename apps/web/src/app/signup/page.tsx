'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { registerUserWithBackend } from '../../lib/authStore';
import { useLanguage } from '../../lib/i18n/LanguageContext';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t.auth.enterAllFields);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the terms of service.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await registerUserWithBackend(
        {
          name,
          email,
          phone,
          role: 'Patient'
        },
        password
      );
      setIsLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-lg mx-auto space-y-5">
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
          {t.auth.signupTitle}
        </h1>
        <p className="text-xs text-slate-400">
          {t.auth.signupSubtitle}
        </p>
      </div>

      {/* Signup Card */}
      <div className="p-6 sm:p-7 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">{t.auth.nameLabel}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.namePlaceholder}
                className="w-full bg-[#0b111e] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">{t.auth.phoneLabel}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.auth.phonePlaceholder}
                  className="w-full bg-[#0b111e] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">{t.auth.passwordLabel}</label>
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">{t.auth.passwordLabel}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full bg-[#0b111e] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-teal-300 text-[11px] leading-relaxed">
            {t.auth.securityNote}
          </div>

          {/* Register Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <span>{isLoading ? t.auth.signingUp : t.auth.signUpBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer Link to Login */}
      <p className="text-center text-xs text-slate-400">
        {t.auth.haveAccount}{' '}
        <Link href="/login" className="text-teal-400 font-semibold hover:underline">
          {t.auth.signInBtn}
        </Link>
      </p>
    </div>
  );
}
