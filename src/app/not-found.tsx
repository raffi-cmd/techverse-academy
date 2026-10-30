'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 text-[11px] font-mono text-red-400 uppercase tracking-widest mb-6 bg-red-950/20">
          ERROR 404 // ROUTE NOT FOUND
        </div>
        <h1 className="font-display-title text-5xl sm:text-7xl text-white mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          The curriculum pathway or page you requested could not be located in the DEVORA directory.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pathways" className="btn-neo-light text-xs py-3 px-6 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Browse Curriculum Pathways
          </Link>
          <Link href="/" className="btn-neo-outline text-xs py-3 px-6 flex items-center gap-2 text-gray-300">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}