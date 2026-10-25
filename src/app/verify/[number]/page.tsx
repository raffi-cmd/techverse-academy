import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import { CheckCircle, AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CertificatePermalinkPage({
  params
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params;

  const cert = db.prepare(`
    SELECT * FROM certificates WHERE certificate_number = ?
  `).get(number.toUpperCase().trim()) as any;

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/verify" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
        </Link>

        {!cert ? (
          <div className="neo-card p-12 text-center bg-[#0d0e14]">
            <h1 className="text-2xl font-bold mb-2">Credential Not Found</h1>
            <p className="text-sm text-gray-400 mb-6">No matching certificate record was located in the registry.</p>
            <Link href="/verify" className="btn-neo-light text-xs py-2.5 px-6">Try Another Search</Link>
          </div>
        ) : cert.status === 'revoked' ? (
          <div className="neo-card p-8 bg-amber-950/20 border-amber-500/40 text-amber-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h1 className="text-xl font-bold text-amber-300">Certificate Revoked</h1>
                <p className="text-sm text-gray-300 mt-2">
                  Certificate <span className="font-mono">{cert.certificate_number}</span> has been revoked.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Reason: {cert.revoked_reason || 'Administrative action'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="neo-card p-8 bg-[#0a0d17] border-yellow-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-base text-white">Authentic Credential Verified</h1>
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
                <p className="font-bold text-base text-white">{cert.recipient_name}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Certificate Number</p>
                <p className="font-mono text-sm text-cyan-400 font-bold">{cert.certificate_number}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Completed Chapter</p>
                <p className="font-semibold text-gray-200">{cert.chapter_title}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Specialization Pathway</p>
                <p className="font-semibold text-gray-200">{cert.pathway_name}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Issue Date</p>
                <p className="font-mono text-gray-300">{cert.issue_date}</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Issuing Authority</p>
                <p className="text-gray-300">TechVerse Academy Academic Board</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
              <a
                href={`/certificates/${cert.pdf_filename}`}
                target="_blank"
                rel="noreferrer"
                className="btn-neo-light text-xs py-2.5 px-6 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Download Authoritative PDF
              </a>

              <p className="text-[11px] text-gray-500 max-w-sm">
                Educational completion certificate. Authoritative cryptographic record verified at techverse.academy.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
