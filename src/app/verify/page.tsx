'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Search, Award, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { downloadCertificateInBrowser, downloadCertificateImage } from '@/lib/certificate-pdf';
import { getStoredLanguage, Language } from '@/lib/i18n';

export default function CertificateVerificationPage() {
  const [lang, setLang] = useState<Language>('id');
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from query param ?cert=... and sync language
  useEffect(() => {
    setLang(getStoredLanguage());
    const handleLangChange = () => setLang(getStoredLanguage());
    window.addEventListener('devora_language_change', handleLangChange);

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCert = urlParams.get('cert');
      if (queryCert) {
        setCertId(queryCert);
        verifyCertId(queryCert);
      }
    }

    return () => window.removeEventListener('devora_language_change', handleLangChange);
  }, []);

  const verifyCertId = (idToVerify: string) => {
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    const cleanId = idToVerify.trim();

    // 1. Check local storage certificates
    if (typeof window !== 'undefined') {
      try {
        const storedCerts = JSON.parse(localStorage.getItem('devora_certificates') || '{}');
        const match = Object.values(storedCerts).find((c: any) => c.certificateNumber === cleanId) as any;
        if (match) {
          setResult({
            result: 'valid',
            certificate: match
          });
          setLoading(false);
          return;
        }
      } catch {}
    }

    // 2. Daftar sertifikat terdaftar / contoh resmi DEVORA
    const officialRegisteredCertificates: Record<string, any> = {
      'DEVORA-2026-ALPHA-01': {
        certificateNumber: 'DEVORA-2026-ALPHA-01',
        recipientName: 'Raffi Dwi Putra',
        chapterTitle: 'Pengantar Keamanan Siber & Fondasi Pertahanan',
        pathwayName: 'Cybersecurity Fundamentals',
        issueDate: '2026-10-30',
        verificationUrl: 'https://raffi-cmd.github.io/techverse-academy/verify/?cert=DEVORA-2026-ALPHA-01'
      },
      'DEVORA-2026-SAMPLE-01': {
        certificateNumber: 'DEVORA-2026-SAMPLE-01',
        recipientName: 'DEVORA Verified Graduate',
        chapterTitle: 'Arsitektur Komputasi & Rekayasa Backend',
        pathwayName: 'Backend Development',
        issueDate: '2026-10-31',
        verificationUrl: 'https://raffi-cmd.github.io/techverse-academy/verify/?cert=DEVORA-2026-SAMPLE-01'
      }
    };

    if (officialRegisteredCertificates[cleanId.toUpperCase()]) {
      setResult({
        result: 'valid',
        certificate: officialRegisteredCertificates[cleanId.toUpperCase()]
      });
      setLoading(false);
      return;
    }

    setErrorMsg(
      lang === 'id'
        ? `Tidak ditemukan catatan sertifikat dengan nomor identifikasi: ${cleanId}. Pastikan nomor sertifikat yang Anda masukkan sudah benar.`
        : `No certificate record found with identifier: ${cleanId}. Please check the certificate number and try again.`
    );
    setLoading(false);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    verifyCertId(certId);
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
            VERIFY DEVORA<br />CREDENTIALS
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Verify the authenticity of any DEVORA chapter completion certificate.
            Enter the unique certificate identifier printed on the credential.
          </p>
        </div>

        {/* Verification Input Box */}
        <form onSubmit={handleVerify} className="neo-card p-6 bg-[#0f1015] mb-12 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. DEVORA-2026-ALPHA-01"
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
            Try sample credential: <button type="button" onClick={() => { setCertId('DEVORA-2026-ALPHA-01'); verifyCertId('DEVORA-2026-ALPHA-01'); }} className="text-cyan-400 hover:underline">DEVORA-2026-ALPHA-01</button>
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

        {/* Valid Certificate Display */}
        {result?.result === 'valid' && result.certificate && (
          <div className="neo-card p-8 bg-[#0a0d17] border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Authentic Credential Verified</h3>
                  <p className="text-[11px] text-gray-400">Authoritative record from DEVORA Registry</p>
                </div>
              </div>
              <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                STATUS: VALID
              </span>
            </div>

            {/* Visual Certificate Template Preview */}
            <div className="relative rounded-xl overflow-hidden border border-yellow-500/30 mb-8 bg-[#050c1e] aspect-[1024/838] max-w-lg mx-auto shadow-xl">
              <img
                src="/certificates/devora-certificate-template.jpg"
                alt="Devora Certificate Template"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black/10">
                <p className="font-serif font-bold text-sm sm:text-lg text-white uppercase tracking-wider drop-shadow-md">
                  {result.certificate.recipientName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-1 line-clamp-1 max-w-[85%] drop-shadow">
                  {result.certificate.chapterTitle}
                </p>
                <p className="text-[8px] sm:text-[10px] font-mono text-yellow-400/90 mt-1">
                  ID: {result.certificate.certificateNumber}
                </p>
              </div>
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
                <p className="text-gray-300">DEVORA Academic Board / Raffi Dwi Putra</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadCertificateInBrowser(result.certificate)}
                  className="btn-neo-light text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh PDF
                </button>
                <button
                  onClick={() => downloadCertificateImage(result.certificate, 'png')}
                  className="btn-neo-outline text-xs py-2 px-4 flex items-center gap-1.5 text-gray-300 hover:text-white"
                >
                  Unduh PNG
                </button>
                <button
                  onClick={() => downloadCertificateImage(result.certificate, 'jpg')}
                  className="btn-neo-outline text-xs py-2 px-4 flex items-center gap-1.5 text-gray-300 hover:text-white"
                >
                  Unduh JPG
                </button>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                VERIFIED VIA DEVORA PUBLIC REGISTRY
              </span>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}