'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refresh();
        router.push('/onboarding');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Network error. Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-6 py-16">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            REGISTRATION // NEW LEARNER
          </span>
          <h1 className="font-display-title text-3xl sm:text-4xl text-white">
            START YOUR JOURNEY
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Create your account to unlock 60 pathways and earn verifiable certificates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="neo-card p-8 bg-[#0f1015] shadow-2xl space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Full Name (As printed on certificates)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Jordan Lee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="jordan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Password (Min 8 characters)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-neo-light text-xs py-3 justify-center mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account & Proceed'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
