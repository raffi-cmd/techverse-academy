'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { Award, Download, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function LearnerCertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/user/dashboard')
        .then(res => res.json())
        .then(data => {
          setCerts(data.certificates || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">LOADING CERTIFICATES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest block mb-2">
            CREDENTIAL PORTFOLIO // VERIFIED
          </span>
          <h1 className="font-display-title text-3xl sm:text-5xl text-white">
            MY CHAPTER CERTIFICATES
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Official verifiable completion certificates earned across all completed curriculum chapters.
          </p>
        </div>

        {certs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {certs.map(c => (
              <div key={c.id} className="neo-card p-6 bg-[#0a0d17] border-yellow-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                      {c.certificate_number}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">
                    {c.chapter_title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">{c.pathway_name}</p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">Date: {c.issue_date}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/certificates/${c.pdf_filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-neo-light text-[11px] py-1.5 px-3 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </a>
                    <Link
                      href={`/verify/${c.certificate_number}`}
                      className="px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-[11px] text-gray-300"
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-card p-12 text-center bg-[#0d0e14]">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-2">No Certificates Yet</h3>
            <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
              Pass chapter assessments with a score of 80% or higher to automatically generate your certificates.
            </p>
            <Link href="/pathways" className="btn-neo-light text-xs py-2.5 px-6">
              Browse Pathways Catalog
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
