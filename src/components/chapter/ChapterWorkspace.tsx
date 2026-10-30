'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import {
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  Send,
  Loader2,
  Clock,
  RotateCcw,
  Lock,
  Unlock,
  FileText,
  Image as ImageIcon,
  Lightbulb
} from 'lucide-react';
import {
  CertificateData,
  CertificateType,
  downloadCertificateInBrowser,
  downloadCertificateImage,
  getCertificateTitle
} from '@/lib/certificate-pdf';

interface InitialData {
  chapter: any;
  lessons: any[];
  assessment: any;
}

export default function ChapterWorkspacePage({ initialData }: { initialData?: InitialData }) {
  const params = useParams() as { slug: string; chapterSlug: string };

  const [loading, setLoading] = useState(!initialData?.chapter);
  const [chapter, setChapter] = useState<any>(initialData?.chapter || null);
  const [lessons, setLessons] = useState<any[]>(initialData?.lessons || []);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz' | 'ai'>('lesson');

  // Quiz state
  const [assessment, setAssessment] = useState<any>(initialData?.assessment || null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // Certificate claim state
  const [certificateName, setCertificateName] = useState('');
  const [claimingCert, setClaimingCert] = useState(false);
  const [claimedCert, setClaimedCert] = useState<CertificateData | null>(null);
  const [certError, setCertError] = useState('');

  // Sequential progression & lock state
  const [isLocked, setIsLocked] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // AI assistant state
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiSending, setAiSending] = useState(false);

  // Determine checkpoint & tier
  const sortOrder = chapter?.sort_order || 1;
  const isCheckpoint = sortOrder % 5 === 0;
  const isTrackMastery = sortOrder === 50;
  const certificateType: CertificateType = isTrackMastery
    ? 'TRACK_MASTERY'
    : isCheckpoint
    ? 'CHECKPOINT_EVALUATION'
    : 'CHAPTER_COMPLETION';

  // Load initialData or local storage cache
  useEffect(() => {
    if (initialData?.chapter) {
      setChapter(initialData.chapter);
      setLessons(initialData.lessons || []);
      setAssessment(initialData.assessment || null);
      setLoading(false);
    }

    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('devora_user_name') || '';
      if (storedName) setCertificateName(storedName);

      const chapterId = initialData?.chapter?.id;
      const order = initialData?.chapter?.sort_order || 1;

      // Sequential lock check: Chapter 1 is always unlocked.
      // For Chapter > 1, check if user has completed at least (sort_order - 1) chapters in this pathway
      if (order > 1) {
        const completed = JSON.parse(localStorage.getItem('devora_completed_chapters') || '[]');
        // If chapter itself is completed, it's definitely unlocked
        const isCurrentCompleted = completed.includes(chapterId);
        // User is unlocked if completed contains at least some prior progress or current
        if (!isCurrentCompleted && completed.length < order - 1) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      } else {
        setIsLocked(false);
      }

      if (chapterId) {
        const certs = JSON.parse(localStorage.getItem('devora_certificates') || '{}');
        if (certs[chapterId]) {
          setClaimedCert(certs[chapterId]);
        }

        const attempts = JSON.parse(localStorage.getItem('devora_quiz_attempts') || '{}');
        const lastAttempt = attempts[chapterId];
        if (lastAttempt) {
          if (lastAttempt.passed) {
            setQuizResult(lastAttempt);
          } else {
            const elapsed = Math.floor((Date.now() - lastAttempt.timestamp) / 1000);
            if (elapsed < 60) {
              setCooldownSeconds(60 - elapsed);
            }
          }
        }
      }
    }
  }, [initialData]);

  // Cooldown timer interval
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (cooldownSeconds > 0) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleHint = (questionId: string) => {
    setRevealedHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitQuiz = () => {
    if (!assessment || cooldownSeconds > 0) return;
    setSubmittingQuiz(true);

    try {
      const questions = assessment.questions || [];
      let totalPoints = 0;
      let earnedPoints = 0;
      const feedbackList: any[] = [];

      for (const q of questions) {
        const qPoints = q.points || 1;
        totalPoints += qPoints;

        let options: any[] = [];
        try {
          options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
        } catch {
          options = [];
        }

        const userSelected = selectedAnswers[q.id];
        const correctOpt = options.find((o: any) => o.isCorrect === true || o.id === q.correct_answer);
        const isCorrect = correctOpt ? correctOpt.id === userSelected : false;

        if (isCorrect) {
          earnedPoints += qPoints;
        }

        feedbackList.push({
          questionId: q.id,
          isCorrect,
          selected: userSelected,
          correctOptionId: correctOpt?.id,
          explanation:
            q.explanation ||
            (isCorrect
              ? 'Accurate answer based on DEVORA curriculum standard.'
              : 'Incorrect option selected. Review key concepts in the lesson.')
        });
      }

      const score = earnedPoints;
      const maxScore = totalPoints > 0 ? totalPoints : 1;
      const percentage = Math.round((earnedPoints / maxScore) * 100);
      const passed = percentage >= 70; // 70% passing threshold

      const result = {
        score,
        maxScore,
        percentage,
        passed,
        passingThreshold: 70,
        feedback: feedbackList,
        timestamp: Date.now()
      };

      setQuizResult(result);

      if (typeof window !== 'undefined' && chapter?.id) {
        const attempts = JSON.parse(localStorage.getItem('devora_quiz_attempts') || '{}');
        attempts[chapter.id] = result;
        localStorage.setItem('devora_quiz_attempts', JSON.stringify(attempts));

        if (passed) {
          const completed = JSON.parse(localStorage.getItem('devora_completed_chapters') || '[]');
          if (!completed.includes(chapter.id)) {
            completed.push(chapter.id);
            localStorage.setItem('devora_completed_chapters', JSON.stringify(completed));
          }
          setIsLocked(false);
        }
      }

      if (!passed) {
        setCooldownSeconds(60);
      }
    } catch (err) {
      console.error('Quiz evaluation error:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleClaimCertificate = () => {
    if (!chapter || !certificateName.trim()) return;
    setClaimingCert(true);
    setCertError('');

    try {
      const recipientName = certificateName.trim();
      if (typeof window !== 'undefined') {
        localStorage.setItem('devora_user_name', recipientName);
      }

      const prefix = isTrackMastery ? 'DEVORA-TRACK' : isCheckpoint ? 'DEVORA-CHK' : 'DEVORA-CERT';
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const certNum = `${prefix}-${chapter.id.substring(0, 8).toUpperCase()}-${randomSuffix}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const verificationUrl = `https://raffi-cmd.github.io/techverse-academy/verify/?cert=${certNum}`;

      const certData: CertificateData = {
        certificateNumber: certNum,
        recipientName,
        chapterTitle: chapter.title,
        pathwayName: chapter.pathway_name,
        issueDate,
        verificationUrl,
        type: certificateType
      };

      downloadCertificateInBrowser(certData);
      setClaimedCert(certData);

      if (typeof window !== 'undefined') {
        const certs = JSON.parse(localStorage.getItem('devora_certificates') || '{}');
        certs[chapter.id] = certData;
        localStorage.setItem('devora_certificates', JSON.stringify(certs));
      }
    } catch (err) {
      console.error('Certificate generation error:', err);
      setCertError('Failed to generate certificate.');
    } finally {
      setClaimingCert(false);
    }
  };

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim() || aiSending) return;

    const userText = aiMessage.trim();
    setAiMessage('');
    setAiMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setAiSending(true);

    setTimeout(() => {
      const lessonTitle = lessons[activeLessonIdx]?.title || 'Architecture';
      const botResponse =
        `Mengenai pertanyaan Anda tentang "${userText}" pada bab **${chapter?.title || 'ini'}** (${lessonTitle}):\n\n` +
        `Dalam standar rekayasa kurikulum DEVORA, konsep ini dirancang secara modular dan deterministik. ` +
        `Fokuslah pada isolasi efek samping, penegakan type safety, dan verifikasi kontrak data sebelum implementasi produksi. ` +
        `Pelajari kembali contoh implementasi pada Lesson ${activeLessonIdx + 1} untuk panduan praktis langkah demi langkah.`;

      setAiMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
      setAiSending(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">MEMUAT DEVORA CHAPTER WORKSPACE...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Chapter Tidak Ditemukan</h1>
        <p className="text-sm text-gray-400 mb-6">Materi bab yang diminta tidak dapat ditemukan dalam database kurikulum.</p>
        <Link href="/pathways" className="btn-neo-light text-xs py-2 px-6">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Lock screen view if sequential lock is active and preview mode is not enabled
  if (isLocked && !previewMode) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase text-amber-400 tracking-widest mb-2">
            SEQUENTIAL LEARNING LOCK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Bab {chapter.sort_order} Masih Terkunci
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            DEVORA menerapkan kurikulum bertahap. Untuk membuka bab <strong>{chapter.title}</strong> secara resmi dan mengikuti kuis bersertifikat, Anda perlu menyelesaikan dan lulus kuis pada bab-bab sebelumnya dengan nilai &ge; 70%.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href={`/pathways/${params.slug}`}
              className="btn-neo-light text-xs py-3 px-6 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Buka Jalur Belajar ({chapter.pathway_name})
            </Link>
            <button
              onClick={() => setPreviewMode(true)}
              className="btn-neo-outline text-xs py-3 px-6 flex items-center justify-center gap-2 text-gray-300 hover:text-white"
            >
              <Unlock className="w-4 h-4" /> Baca Mode Pratinjau (Preview)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[activeLessonIdx];

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col">
      <Navbar />

      {/* Top Workspace Header */}
      <div className="bg-[#0c0d12] border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mb-1">
              <Link href={`/pathways/${params.slug}`} className="hover:text-white transition-colors">
                {chapter.pathway_name}
              </Link>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Bab {chapter.sort_order}</span>
              {isCheckpoint && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                  CHECKPOINT EVALUASI
                </span>
              )}
              {isTrackMastery && (
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-[10px]">
                  TRACK MASTERY CAPSTONE
                </span>
              )}
            </div>
            <h1 className="font-bold text-lg text-white truncate max-w-xl">
              {chapter.title}
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'lesson'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Materi ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Kuis Evaluasi
              {quizResult?.passed && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Asisten AI
            </button>
          </div>
        </div>
      </div>

      {previewMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-amber-400" />
            <span>
              <strong>Mode Pratinjau Aktif:</strong> Anda sedang membaca materi tanpa urutan resmi. Selesaikan bab sebelumnya untuk membuka penerbitan sertifikat kuis.
            </span>
          </div>
          <button
            onClick={() => setPreviewMode(false)}
            className="text-amber-400 hover:underline font-mono text-[11px]"
          >
            Tutup Pratinjau
          </button>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid lg:grid-cols-12 gap-8">
        {/* Left Lesson Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="neo-card p-4 bg-[#0f1015]">
            <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">
              Daftar Materi Bab Ini
            </h3>
            <div className="space-y-1.5">
              {lessons.map((les, idx) => (
                <button
                  key={les.id || idx}
                  onClick={() => {
                    setActiveLessonIdx(idx);
                    setActiveTab('lesson');
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeLessonIdx === idx && activeTab === 'lesson'
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-bold'
                      : 'text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">
                    {idx + 1}. {les.title}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">
                    {les.estimated_time || 15}m
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Status Card */}
          <div className={`neo-card p-5 bg-[#0d0e14] ${
            isCheckpoint ? 'border-amber-500/40' : 'border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase mb-2">
              <Award className="w-4 h-4" />
              {getCertificateTitle(certificateType)}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
              Lulus kuis evaluasi dengan skor &ge; 70% untuk mengklaim sertifikat resmi 100% gratis dalam format PDF, PNG, atau JPG.
            </p>

            {claimedCert ? (
              <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Sertifikat Terbit!
                </p>
                <p className="font-mono text-[10px] text-gray-400 mb-3 break-all">
                  {claimedCert.certificateNumber}
                </p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => downloadCertificateInBrowser(claimedCert)}
                    className="w-full btn-neo-light text-[11px] py-1.5 justify-center flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" /> Unduh PDF Landscape
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => downloadCertificateImage(claimedCert, 'png')}
                      className="btn-neo-outline text-[10px] py-1 justify-center flex items-center gap-1 text-gray-300 hover:text-white"
                    >
                      <ImageIcon className="w-3 h-3" /> Unduh PNG
                    </button>
                    <button
                      onClick={() => downloadCertificateImage(claimedCert, 'jpg')}
                      className="btn-neo-outline text-[10px] py-1 justify-center flex items-center gap-1 text-gray-300 hover:text-white"
                    >
                      <ImageIcon className="w-3 h-3" /> Unduh JPG
                    </button>
                  </div>
                </div>
              </div>
            ) : quizResult?.passed ? (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
                  ✓ Lulus dengan nilai {quizResult.percentage}%! Siap klaim.
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    Nama Lengkap pada Sertifikat
                  </label>
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 mb-2"
                  />
                  <button
                    onClick={handleClaimCertificate}
                    disabled={claimingCert || !certificateName.trim()}
                    className="w-full btn-neo-light text-xs py-2 justify-center"
                  >
                    {claimingCert ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Terbitkan Sertifikat (Gratis)'
                    )}
                  </button>
                  {certError && <p className="text-[10px] text-red-400 mt-1">{certError}</p>}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                Ikuti Kuis Bab Ini &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Center Main Stage */}
        <div className="lg:col-span-9">
          {/* TAB 1: LESSON CONTENT */}
          {activeTab === 'lesson' && currentLesson && (
            <div className="neo-card p-8 bg-[#0d0e14] min-h-[500px]">
              <div className="border-b border-white/5 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    MATERI {activeLessonIdx + 1} DARI {lessons.length}
                  </span>
                  <h2 className="font-bold text-2xl text-white mt-1">{currentLesson.title}</h2>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {currentLesson.estimated_time || 15} Menit Baca
                </span>
              </div>

              {/* Lesson Body */}
              <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-10">
                {currentLesson.content}
              </div>

              {/* Bottom Pagination */}
              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <button
                  onClick={() => setActiveLessonIdx(Math.max(0, activeLessonIdx - 1))}
                  disabled={activeLessonIdx === 0}
                  className="btn-neo-outline text-xs py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1 inline" /> Materi Sebelumnya
                </button>

                {activeLessonIdx < lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                    className="btn-neo-light text-xs py-2 px-5"
                  >
                    Materi Selanjutnya <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="btn-neo-light text-xs py-2 px-5 bg-emerald-400 text-black font-bold hover:bg-emerald-300"
                  >
                    Ikuti Kuis Bab <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTER QUIZ */}
          {activeTab === 'quiz' && (
            <div className="neo-card p-8 bg-[#0d0e14]">
              <div className="border-b border-white/5 pb-4 mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">
                    VERIFIKASI KOMPETENSI
                  </span>
                  {isCheckpoint && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      MILESTONE CHECKPOINT
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-2xl text-white mt-1">
                  {assessment?.title || 'Kuis Evaluasi Bab'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Ambang batas kelulusan: 70% • Jeda waktu (cooldown) 60 detik jika belum berhasil
                </p>
              </div>

              {/* Cooldown Alert Banner */}
              {cooldownSeconds > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-medium">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>
                    Jeda pengulangan kuis aktif: Silakan ulas kembali materi pelajaran dan coba lagi dalam{' '}
                    <strong>{cooldownSeconds} detik</strong>.
                  </span>
                </div>
              )}

              {assessment?.questions?.length > 0 ? (
                <div className="space-y-8">
                  {assessment.questions.map((q: any, qIdx: number) => {
                    let options: any[] = [];
                    try {
                      options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
                    } catch {
                      options = [];
                    }

                    const feedback = quizResult?.feedback?.find((f: any) => f.questionId === q.id);
                    const isHintRevealed = revealedHints[q.id];

                    return (
                      <div key={q.id || qIdx} className="p-5 rounded-2xl bg-[#14151e] border border-white/5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <p className="font-semibold text-sm text-white">
                            {qIdx + 1}. {q.question_text}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleHint(q.id)}
                              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-800/40"
                              title="Tampilkan petunjuk konseptual"
                            >
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              {isHintRevealed ? 'Tutup Petunjuk' : 'Petunjuk'}
                            </button>
                            <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-0.5 rounded bg-white/5">
                              {q.points || 1} pt
                            </span>
                          </div>
                        </div>

                        {/* Hint Box */}
                        {isHintRevealed && (
                          <div className="mb-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-start gap-2.5">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-[11px] text-cyan-200">Petunjuk Konseptual:</p>
                              <p className="text-[11px] opacity-90 mt-0.5">
                                {q.hint ||
                                  (q.explanation
                                    ? `Pertimbangkan konsep: ${q.explanation.split('.')[0]}.`
                                    : 'Fokus pada prinsip modularitas, integritas data, dan standar arsitektur industri pada materi bab ini.')}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Options */}
                        <div className="space-y-2">
                          {options.map((opt: any) => {
                            const isSelected = selectedAnswers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                disabled={cooldownSeconds > 0}
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                                  isSelected
                                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-semibold'
                                    : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                                } ${cooldownSeconds > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                              >
                                <span>{opt.text}</span>
                                {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback after submission */}
                        {feedback && (
                          <div
                            className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                              feedback.isCorrect
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-300 border border-red-500/20'
                            }`}
                          >
                            {feedback.isCorrect ? (
                              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-bold">{feedback.isCorrect ? 'Jawaban Benar' : 'Belum Tepat'}</p>
                              <p className="text-[11px] opacity-90 mt-0.5">{feedback.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Submission Box */}
                  <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      {quizResult && (
                        <p
                          className={`text-sm font-bold ${
                            quizResult.passed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          Skor: {quizResult.score} / {quizResult.maxScore} ({quizResult.percentage}%)
                          {quizResult.passed
                            ? ' — LULUS! Ambang batas 70% tercapai.'
                            : ' — Belum mencapai nilai 70%. Ulas kembali materi lalu coba lagi.'}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {cooldownSeconds > 0 ? (
                        <button
                          disabled
                          className="btn-neo-outline text-xs py-3 px-6 flex items-center gap-2 opacity-60 cursor-not-allowed"
                        >
                          <Clock className="w-4 h-4" /> Jeda ({cooldownSeconds}s)
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={submittingQuiz || Object.keys(selectedAnswers).length < assessment.questions.length}
                          className="btn-neo-light text-xs py-3 px-8 disabled:opacity-40"
                        >
                          {submittingQuiz ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Kirim Jawaban Kuis'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada pertanyaan kuis untuk bab ini.</p>
              )}
            </div>
          )}

          {/* TAB 3: AI TUTOR */}
          {activeTab === 'ai' && (
            <div className="neo-card p-6 bg-[#0d0e14] flex flex-col h-[600px]">
              <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white">Asisten AI Belajar DEVORA</h3>
                </div>
                <span className="text-[10px] font-mono text-gray-500">KONTEKS: {chapter.title}</span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                <div className="p-3 rounded-2xl bg-white/5 text-xs text-gray-300 max-w-md">
                  Halo! Saya Asisten AI Belajar DEVORA. Tanyakan konsep arsitektur, penjelasan kode, atau mintalah contoh studi kasus untuk materi pada bab ini.
                </div>

                {aiMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                      m.role === 'user'
                        ? 'ml-auto bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-200 border border-white/10'
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendAi} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajukan pertanyaan teknis mengenai materi ini..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={aiSending || !aiMessage.trim()}
                  className="btn-neo-light text-xs px-5 py-2.5 disabled:opacity-40"
                >
                  {aiSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}