'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Sparkles, ShieldCheck, Heart, BookOpen, Award, ArrowRight } from 'lucide-react';
import { getStoredLanguage, translations } from '@/lib/i18n';

export default function PricingPage() {
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    setLang(getStoredLanguage());
    const handler = () => setLang(getStoredLanguage());
    window.addEventListener('devora_language_change', handler);
    return () => window.removeEventListener('devora_language_change', handler);
  }, []);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-4 bg-cyan-950/20">
            {t.freeManifesto.tag}
          </div>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
            {t.freeManifesto.title}
          </h1>
          <p className="text-base text-gray-300 leading-relaxed">
            {t.freeManifesto.desc}
          </p>
        </div>

        {/* 4 Pillars of 100% Free Commitment */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="neo-card p-8 bg-[#0d0e14] border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.freeManifesto.point1Title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t.freeManifesto.point1Desc}
              </p>
            </div>
          </div>

          <div className="neo-card p-8 bg-[#0d0e14] border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.freeManifesto.point2Title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t.freeManifesto.point2Desc}
              </p>
            </div>
          </div>

          <div className="neo-card p-8 bg-[#0d0e14] border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.freeManifesto.point3Title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t.freeManifesto.point3Desc}
              </p>
            </div>
          </div>

          <div className="neo-card p-8 bg-[#0d0e14] border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.freeManifesto.point4Title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t.freeManifesto.point4Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Free Comparison Card */}
        <div className="neo-card p-8 bg-[#0f1015] border-cyan-500/30 mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            DEVORA PLATFORM ACCESS
          </span>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-display-title text-5xl sm:text-7xl text-white">0</span>
            <span className="text-2xl font-bold text-cyan-400">Rupiah</span>
          </div>
          <p className="text-sm text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Tidak ada tingkatan Pro, tidak ada biaya langganan bulanan, dan tidak ada kunci materi. Akses penuh ke seluruh 60 jalur pembelajaran, kuis, evaluasi checkpoint, dan sertifikat kelulusan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pathways" className="btn-neo-light text-xs py-3 px-8 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t.hero.startLearning}
            </Link>
            <Link href="/career-finder" className="btn-neo-outline text-xs py-3 px-6 text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {t.nav.careerFinder}
            </Link>
          </div>
        </div>

        {/* Integrity Commitment */}
        <div className="max-w-3xl mx-auto neo-card p-6 bg-[#0a0d17] border border-white/5 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white mb-1">Integritas Sertifikasi & Rekam Jejak Belajar</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Meskipun platform ini 100% gratis, standar evaluasi kelulusan tetap dijaga ketat (minimal 70% pada setiap bab). Setiap sertifikat memiliki kode verifikasi publik unik yang membuktikan ketekunan dan kompetensi teknis Anda secara nyata.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}