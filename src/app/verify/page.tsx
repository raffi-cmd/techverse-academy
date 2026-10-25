'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Search, Award, Download, AlertTriangle, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

export default function CertificateVerificationPage() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certId.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setErrorMsg(data.message || 'No certificate found with that identifier.');
      }
    } catch {
      setErrorMsg('Failed to connect to verification registry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-4 bg-cyan-950/20">
            CRYPTOGRAPHIC REGISTRY // AUDIT VERIFICATION
          </div>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            VERIFY LEARNING<br />CREDENTIALS
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Verify the authenticity of any TechVerse Academy chapter completion certificate.
            Enter the unique certificate number printed on the document.
          </p>
        </div>

        {/* Verification Input Box */}
        <form onSubmit={handleVerify} className="neo-card p-6 bg-[#0f1015] mb-12 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. TV-2024-ALPHA-7721"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !certId.trim()}
              className="btn-neo-light text-xs py-3.5 px-8 justify-center disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Authenticity'}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-mono">
            Try sample credential: <button type="button" onClick={() => setCertId('TV-2024-ALPHA-7721')} className="text-cyan-400 hover:underline">TV-2024-ALPHA-7721</button>
          </p>
        </form>

        {/* Error State */}
        {errorMsg && (
          <div className="neo-card p-6 bg-red-950/20 border-red-500/30 text-red-300 text-xs flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-red-200">Verification Failed</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Valid Certificate Display matching reference Navy/Gold */}
        {result?.result === 'valid' && result.certificate && (
          <div className="neo-card p-8 bg-[#0a0d17] border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Authentic Credential Verified</h3>
                  <p className="text-[11px] text-gray-400">Authoritative record from TechVerse Registry</p>
                </div>
              </div>
              <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                STATUS: VALID
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-xs mb-8">
              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Recipient Name</p>
                <p className="font-bold text-base text-white">{result.certificate.recipientName}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Certificate Number</p>
                <p className="font-mono text-sm text-cyan-400 font-bold">{result.certificate.certificateNumber}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Completed Chapter</p>
                <p className="font-semibold text-gray-200">{result.certificate.chapterTitle}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Specialization Pathway</p>
                <p className="font-semibold text-gray-200">{result.certificate.pathwayName}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Issue Date</p>
                <p className="font-mono text-gray-300">{result.certificate.issueDate}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Issuing Authority</p>
                <p className="text-gray-300">TechVerse Academy Academic Board</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
              <a
                href={result.certificate.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-neo-light text-xs py-2.5 px-6 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Download Authoritative PDF
              </a>

              <p className="text-[11px] text-gray-500 max-w-sm">
                Educational completion certificate. Does not substitute for accredited governmental degree or university credit.
              </p>
            </div>
          </div>
        )}

        {/* Revoked Certificate Display */}
        {result?.result === 'revoked' && (
          <div className="neo-card p-6 bg-amber-950/20 border-amber-500/40 text-amber-200 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-300">Certificate Has Been Revoked</p>
                <p className="mt-1 text-gray-300">
                  This credential was officially invalidated by administrators on {result.certificate?.revokedAt || 'record'}.
                </p>
                <p className="mt-2 text-[11px] text-gray-400">
                  Reason: {result.certificate?.revokedReason || 'Administrative audit revocation.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
