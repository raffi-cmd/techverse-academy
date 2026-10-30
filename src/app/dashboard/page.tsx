'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  Loader2,
  Sparkles
} from 'lucide-react';
import { downloadCertificateInBrowser } from '@/lib/certificate-pdf';

export default function LearnerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?callback=/dashboard');
      return;
    }

    if (user) {
      const loadDashboard = async () => {
        let remoteData = null;
        try {
          const res = await fetch('/api/user/dashboard');
          if (res.ok) {
            remoteData = await res.json();
          }
        } catch {}

        if (remoteData && remoteData.enrollments) {
          setData(remoteData);
          setLoading(false);
          return;
        }

        // Local storage data
        let localCerts: any[] = [];
        let completedCount = 0;
        if (typeof window !== 'undefined') {
          try {
            const certMap = JSON.parse(localStorage.getItem('devora_certificates') || '{}');
            localCerts = Object.values(certMap);
            const completed = JSON.parse(localStorage.getItem('devora_completed_chapters') || '[]');
            completedCount = completed.length;
          } catch {}
        }

        setData({
          enrollments: [
            {
              id: 'enr_web_dev',
              pathway_name: 'Full-Stack Web Development',
              pathway_slug: 'full-stack-web-development',
              difficulty_level: 'Core',
              total_chapters: 50
            },
            {
              id: 'enr_ai_eng',
              pathway_name: 'AI & Large Language Model Engineering',
              pathway_slug: 'ai-and-llm-engineering',
              difficulty_level: 'Advanced',
              total_chapters: 50
            }
          ],
          completedChaptersCount: completedCount,
          certificatesCount: localCerts.length,
          certificates: localCerts,
          preferences: {
            study_time_goal: 30
          }
        });
        setLoading(false);
      };

      loadDashboard();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">LOADING DEVORA LEARNER DASHBOARD...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              DEVORA LEARNER PORTAL // ACTIVE SESSION
            </span>
            <h1 className="font-display-title text-3xl sm:text-5xl text-white">
              WELCOME BACK, {user?.name?.toUpperCase() || 'LEARNER'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Track your DEVORA curriculum progress, assess your technical competencies, and inspect your verifiable credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pathways" className="btn-neo-light text-xs py-2.5 px-5">
              Explore Pathways
            </Link>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Active Pathways</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {data?.enrollments?.length || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Guided curriculum</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Chapters Completed</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {data?.completedChaptersCount || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Verified completions</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Certificates Earned</span>
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {data?.certificatesCount || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Verifiable credentials</p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold">Daily Study Goal</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {data?.preferences?.study_time_goal || 30}m
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Target active learning</p>
          </div>
        </div>

        {/* Section: Active Enrollments */}
        <div className="mb-14">
          <h2 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            My Active Learning Pathways
          </h2>

          {data?.enrollments?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {data.enrollments.map((enr: any) => (
                <div key={enr.id} className="neo-card p-6 bg-[#0d0e14] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      {enr.difficulty_level} TRACK
                    </span>
                    <h3 className="font-bold text-lg text-white mt-1 mb-2">
                      {enr.pathway_name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Complete structured chapters to earn chapter certificates and achieve full pathway mastery.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">
                      {enr.total_chapters} Total Chapters
                    </span>
                    <Link
                      href={`/pathways/${enr.pathway_slug}`}
                      className="btn-neo-light text-xs py-2 px-5"
                    >
                      Continue Learning <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card p-8 text-center bg-[#0d0e14]">
              <p className="text-sm text-gray-400 mb-4">You have not enrolled in any pathways yet.</p>
              <Link href="/pathways" className="btn-neo-light text-xs py-2.5 px-6">
                Explore Curriculum Pathways
              </Link>
            </div>
          )}
        </div>

        {/* Section: Earned Certificates */}
        <div>
          <h2 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            My Issued Certificates
          </h2>

          {data?.certificates?.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {data.certificates.map((cert: any, i: number) => (
                <div key={cert.certificateNumber || i} className="neo-card p-6 bg-[#0a0d17] border-yellow-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">
                      DEVORA CREDENTIAL
                    </span>
                    <h3 className="font-bold text-base text-white mt-1 mb-1">
                      {cert.chapterTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{cert.pathwayName}</p>
                    <p className="font-mono text-[10px] text-gray-500 mb-6 break-all">ID: {cert.certificateNumber}</p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{cert.issueDate}</span>
                    <button
                      onClick={() => downloadCertificateInBrowser(cert)}
                      className="btn-neo-light text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card p-8 text-center bg-[#0d0e14]">
              <p className="text-sm text-gray-400 mb-3">No certificates earned yet.</p>
              <p className="text-xs text-gray-500 mb-6">Complete any chapter and score &ge; 70% on the quiz to unlock and download your landscape A4 certificate.</p>
              <Link href="/pathways" className="btn-neo-light text-xs py-2 px-6">
                Browse Pathways & Take Quizzes
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}