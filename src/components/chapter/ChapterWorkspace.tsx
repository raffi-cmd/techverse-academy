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
  RotateCcw
} from 'lucide-react';
import { downloadCertificateInBrowser } from '@/lib/certificate-pdf';

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

  // Certificate claim state
  const [certificateName, setCertificateName] = useState('');
  const [claimingCert, setClaimingCert] = useState(false);
  const [claimedCert, setClaimedCert] = useState<any>(null);
  const [certError, setCertError] = useState('');

  // AI assistant state
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiSending, setAiSending] = useState(false);

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
      setCooldownSeconds(prev => {
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
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
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
          options = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
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
          explanation: q.explanation || (isCorrect ? 'Accurate answer based on DEVORA curriculum standard.' : 'Incorrect option selected. Review key concepts in the lesson.')
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

      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const certNum = `DEVORA-${chapter.id.substring(0, 10).toUpperCase()}-${randomSuffix}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const verificationUrl = `https://raffi-cmd.github.io/techverse-academy/verify/?cert=${certNum}`;

      const certData = {
        certificateNumber: certNum,
        recipientName,
        chapterTitle: chapter.title,
        pathwayName: chapter.pathway_name,
        issueDate,
        verificationUrl
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
    setAiMessages(prev => [...prev, { role: 'user', content: userText }]);
    setAiSending(true);

    setTimeout(() => {
      const lessonTitle = lessons[activeLessonIdx]?.title || 'Architecture';
      const botResponse = `Regarding "${userText}" in **${chapter?.title || 'this topic'}** (${lessonTitle}):\n\n` +
        `In DEVORA curriculum engineering standards, this concept is designed to be modular and deterministic. Focus on isolating side effects, following strict type safety, and verifying data contracts before deployment. Review the code sample in Lesson ${activeLessonIdx + 1} for direct implementation patterns.`;

      setAiMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      setAiSending(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">LOADING DEVORA CHAPTER WORKSPACE...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
        <p className="text-sm text-gray-400 mb-6">The requested chapter could not be located in the curriculum database.</p>
        <Link href="/pathways" className="btn-neo-light text-xs py-2 px-6">Return to Catalog</Link>
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
              <span className="text-cyan-400 font-semibold">{chapter.title}</span>
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
                activeTab === 'lesson' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lessons ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'quiz' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Chapter Quiz
              {quizResult?.passed && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'ai' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid lg:grid-cols-12 gap-8">
        {/* Left Lesson Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="neo-card p-4 bg-[#0f1015]">
            <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">
              Lessons in Chapter
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
                  <span className="truncate pr-2">{idx + 1}. {les.title}</span>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">{les.estimated_time || 15}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Status Card */}
          <div className="neo-card p-5 bg-[#0d0e14] border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase mb-2">
              <Award className="w-4 h-4" />
              DEVORA Certification
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
              Pass the chapter assessment with a score of &ge; 70% to claim your verifiable landscape A4 PDF certificate.
            </p>

            {claimedCert ? (
              <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Certificate Issued!
                </p>
                <p className="font-mono text-[10px] text-gray-400 mb-3 break-all">{claimedCert.certificateNumber}</p>
                <button
                  onClick={() => downloadCertificateInBrowser(claimedCert)}
                  className="w-full btn-neo-light text-[11px] py-1.5 justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" /> Download PDF
                </button>
              </div>
            ) : quizResult?.passed ? (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
                  ✓ Passed with {quizResult.percentage}%! Ready to claim.
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Name on Certificate</label>
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter your full legal name"
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 mb-2"
                  />
                  <button
                    onClick={handleClaimCertificate}
                    disabled={claimingCert || !certificateName.trim()}
                    className="w-full btn-neo-light text-xs py-2 justify-center"
                  >
                    {claimingCert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Issue Certificate'}
                  </button>
                  {certError && <p className="text-[10px] text-red-400 mt-1">{certError}</p>}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                Take Chapter Quiz &rarr;
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
                    LESSON {activeLessonIdx + 1} OF {lessons.length}
                  </span>
                  <h2 className="font-bold text-2xl text-white mt-1">{currentLesson.title}</h2>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {currentLesson.estimated_time || 15} Minutes Read
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
                  <ArrowLeft className="w-3.5 h-3.5 mr-1 inline" /> Previous Lesson
                </button>

                {activeLessonIdx < lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                    className="btn-neo-light text-xs py-2 px-5"
                  >
                    Next Lesson <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="btn-neo-light text-xs py-2 px-5 bg-emerald-400 text-black font-bold hover:bg-emerald-300"
                  >
                    Take Quiz <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTER QUIZ */}
          {activeTab === 'quiz' && (
            <div className="neo-card p-8 bg-[#0d0e14]">
              <div className="border-b border-white/5 pb-4 mb-8">
                <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">
                  KNOWLEDGE VERIFICATION
                </span>
                <h2 className="font-bold text-2xl text-white mt-1">
                  {assessment?.title || 'Chapter Assessment'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Passing threshold: 70% • 60s cooldown on failure
                </p>
              </div>

              {/* Cooldown Alert Banner */}
              {cooldownSeconds > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-medium">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>
                    Reattempt cooldown active: Please review the lessons and retry in <strong>{cooldownSeconds}s</strong>.
                  </span>
                </div>
              )}

              {assessment?.questions?.length > 0 ? (
                <div className="space-y-8">
                  {assessment.questions.map((q: any, qIdx: number) => {
                    let options: any[] = [];
                    try {
                      options = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
                    } catch {
                      options = [];
                    }

                    const feedback = quizResult?.feedback?.find((f: any) => f.questionId === q.id);

                    return (
                      <div key={q.id || qIdx} className="p-5 rounded-2xl bg-[#14151e] border border-white/5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <p className="font-semibold text-sm text-white">
                            {qIdx + 1}. {q.question_text}
                          </p>
                          <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-0.5 rounded bg-white/5">
                            {q.points || 1} pt
                          </span>
                        </div>

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
                          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                            feedback.isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'
                          }`}>
                            {feedback.isCorrect ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            <div>
                              <p className="font-bold">{feedback.isCorrect ? 'Correct Answer' : 'Incorrect'}</p>
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
                        <p className={`text-sm font-bold ${quizResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Score: {quizResult.score} / {quizResult.maxScore} ({quizResult.percentage}%)
                          {quizResult.passed ? ' — PASSED! Threshold (70%) achieved.' : ' — Threshold (70%) not met. Review lessons and retry.'}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {cooldownSeconds > 0 ? (
                        <button
                          disabled
                          className="btn-neo-outline text-xs py-3 px-6 flex items-center gap-2 opacity-60 cursor-not-allowed"
                        >
                          <Clock className="w-4 h-4" /> Cooldown ({cooldownSeconds}s)
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={submittingQuiz || Object.keys(selectedAnswers).length < assessment.questions.length}
                          className="btn-neo-light text-xs py-3 px-8 disabled:opacity-40"
                        >
                          {submittingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Assessment'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No quiz questions configured for this chapter.</p>
              )}
            </div>
          )}

          {/* TAB 3: AI TUTOR */}
          {activeTab === 'ai' && (
            <div className="neo-card p-6 bg-[#0d0e14] flex flex-col h-[600px]">
              <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white">DEVORA AI Learning Assistant</h3>
                </div>
                <span className="text-[10px] font-mono text-gray-500">CONTEXT: {chapter.title}</span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                <div className="p-3 rounded-2xl bg-white/5 text-xs text-gray-300 max-w-md">
                  Hello! I am your DEVORA AI Assistant. Ask me to clarify any architectural concept, explain difficult code snippets, or provide additional practice exercises for this chapter.
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
                  placeholder="Ask a technical question about this lesson..."
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