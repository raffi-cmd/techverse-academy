'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Shield,
  Users,
  BookOpen,
  Award,
  AlertTriangle,
  History,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const d = await res.json();
        setData(d);
      } else if (res.status === 403) {
        alert('Access denied. Administrator privileges required.');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?callback=/admin');
      return;
    }

    if (user) {
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }
      fetchMetrics();
    }
  }, [user, authLoading, router]);

  const handleRevoke = async (certId: string, certNumber: string) => {
    const reason = prompt(`Enter administrative reason to revoke certificate ${certNumber}:`);
    if (!reason) return;

    setRevokingId(certId);
    try {
      const res = await fetch('/api/admin/certificates/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: certId, reason })
      });

      if (res.ok) {
        alert(`Certificate ${certNumber} has been revoked.`);
        await fetchMetrics();
      } else {
        alert('Failed to revoke certificate.');
      }
    } catch {
      alert('Error revoking certificate.');
    } finally {
      setRevokingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">LOADING ADMIN CONSOLE...</p>
      </div>
    );
  }

  const m = data?.metrics;

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase mb-2">
              <Shield className="w-4 h-4" />
              SYSTEM GOVERNANCE // AUDIT MONITOR
            </div>
            <h1 className="font-display-title text-3xl sm:text-5xl text-white">
              ADMINISTRATOR CONSOLE
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Real-time platform metrics, cryptographic certificate issuance oversight, and immutable audit logs.
            </p>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Registered Learners</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{m?.users || 0}</p>
            <p className="text-[11px] text-gray-500 mt-1">Authoritative user accounts</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Published Chapters</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{m?.publishedChapters || 0}</p>
            <p className="text-[11px] text-gray-500 mt-1">Across 60 pathways</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Certificates Issued</span>
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{m?.certificatesIssued || 0}</p>
            <p className="text-[11px] text-gray-500 mt-1">Valid credentials</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Revoked Certificates</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{m?.certificatesRevoked || 0}</p>
            <p className="text-[11px] text-gray-500 mt-1">Administrative revocations</p>
          </div>
        </div>

        {/* Section: Certificate Management */}
        <div className="mb-14">
          <h2 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Issued Certificates Oversight
          </h2>

          <div className="neo-card p-6 bg-[#0d0e14] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px]">
                  <th className="pb-3 pr-4">CERTIFICATE ID</th>
                  <th className="pb-3 pr-4">RECIPIENT</th>
                  <th className="pb-3 pr-4">CHAPTER</th>
                  <th className="pb-3 pr-4">DATE</th>
                  <th className="pb-3 pr-4">STATUS</th>
                  <th className="pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentCerts?.map((c: any) => (
                  <tr key={c.id} className="text-gray-300 hover:bg-white/5">
                    <td className="py-3 pr-4 font-mono font-bold text-cyan-400">
                      {c.certificate_number}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-white">
                      {c.recipient_name}
                      <span className="block text-[10px] text-gray-500 font-normal">{c.user_email}</span>
                    </td>
                    <td className="py-3 pr-4 truncate max-w-xs">{c.chapter_title}</td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-gray-400">{c.issue_date}</td>
                    <td className="py-3 pr-4">
                      {c.status === 'valid' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          VALID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          REVOKED
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {c.status === 'valid' ? (
                        <button
                          onClick={() => handleRevoke(c.id, c.certificate_number)}
                          disabled={revokingId === c.id}
                          className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-600">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Live Immutable Audit Trail */}
        <div>
          <h2 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Security & Administrative Audit Log
          </h2>

          <div className="neo-card p-6 bg-[#0d0e14] space-y-3">
            {data?.recentLogs?.map((log: any) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-white/5 flex flex-wrap items-center justify-between text-xs gap-3 font-mono">
                <div>
                  <span className="text-cyan-400 font-bold mr-2">[{log.action}]</span>
                  <span className="text-gray-300">Target: {log.resource} ({log.resource_id || 'system'})</span>
                  <span className="text-gray-500 ml-2">by {log.actor_email || 'System'}</span>
                </div>
                <span className="text-gray-500 text-[10px]">{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
