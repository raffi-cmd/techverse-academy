'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Share2,
  Send,
  Loader2,
  FileCheck
} from 'lucide-react';

export default function ChapterWorkspacePage() {
  const params = useParams() as { slug: string; chapterSlug: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz' | 'ai'>('lesson');

  // Quiz state
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  // Certificate claim state
  const [certificateName, setCertificateName] = useState('');
  const [claimingCert, setClaimingCert] = useState(false);
  const [claimedCert, setClaimedCert] = useState<any>(null);
  const [certError, setCertError] = useState('');

  // AI assistant state
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiSending, setAiSending] = useState(false);

  useEffect(() => {
    async function loadChapterData() {
      try {
        const res = await fetch(`/api/chapters/data?pathway=${params.slug}&chapter=${params.chapterSlug}`);
        if (res.ok) {
          const data = await res.json();
          setChapter(data.chapter);
          setLessons(data.lessons || []);
          setAssessment(data.assessment || null);
          if (data.existingCertificate) {
            setClaimedCert(data.existingCertificate);
          }
          if (data.defaultName) {
            setCertificateName(data.defaultName);
          }
        }
      } catch (err) {
        console.error('Failed to load chapter:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChapterData();
  }, [params.slug, params.chapterSlug]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!assessment) return;
    setSubmittingQuiz(true);
    try {
      const responses = Object.entries(selectedAnswers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans
      }));

      const res = await fetch(`/api/assessments/${assessment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses, timeSpent: 120 })
      });

      const data = await res.json();
      if (res.ok) {
        setQuizResult(data);
      } else {
        alert(data.error || 'Quiz submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting quiz.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleClaimCertificate = async () => {
    if (!chapter) return;
    setClaimingCert(true);
    setCertError('');
    try {
      const res = await fetch('/api/certificates/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          recipientName: certificateName
        })
      });

      const data = await res.json();
      if (res.ok && data.certificate) {
        setClaimedCert(data.certificate);
      } else {
        setCertError(data.error || 'Failed to claim certificate.');
      }
    } catch {
      setCertError('Network error issuing certificate.');
    } finally {
      setClaimingCert(false);
    }
  };

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim() || aiSending) return;

    const userText = aiMessage.trim();
    setAiMessage('');
    setAiMessages(prev => [...prev, { role: 'user', content: userText }]);
    setAiSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: {
            chapter: chapter?.title,
            pathway: chapter?.pathway_name,
            currentLesson: lessons[activeLessonIdx]?.title
          }
        })
      });

      const data = await res.json();
      setAiMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply || data.message }
      ]);
    } catch {
      setAiMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection error contacting AI Assistant service.' }
      ]);
    } finally {
      setAiSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-xs text-gray-400 font-mono">INITIALIZING CHAPTER WORKSPACE...</p>
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
              <Link href={`/pathways/${params.slug}`} className="hover:text-white">
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
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
                  key={les.id}
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
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">{les.estimated_time}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Status Card */}
          <div className="neo-card p-5 bg-[#0d0e14] border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase mb-2">
              <Award className="w-4 h-4" />
              Chapter Certification
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
              Pass the chapter quiz with a score of &ge; 80% to generate your verifiable PDF certificate.
            </p>

            {claimedCert ? (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Certificate Earned!
                </p>
                <p className="font-mono text-[10px] text-gray-400 mb-2">{claimedCert.certificateNumber}</p>
                <a
                  href={`/certificates/${claimedCert.certificateNumber}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-neo-light text-[11px] py-1.5 justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" /> Download PDF
                </a>
              </div>
            ) : quizResult?.passed ? (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
                  Quiz passed with {quizResult.percentage}%! Ready to claim.
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Name on Certificate</label>
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter your full name"
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
                  {currentLesson.estimated_time} Minutes Read
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
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous Lesson
                </button>

                {activeLessonIdx < lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                    className="btn-neo-light text-xs py-2 px-5"
                  >
                    Next Lesson <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="btn-neo-light text-xs py-2 px-5 bg-emerald-400 text-black font-bold hover:bg-emerald-300"
                  >
                    Take Quiz <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                  Passing threshold: 80% ΓÇó Attempts recorded authoritatively in database
                </p>
              </div>

              {assessment?.questions?.length > 0 ? (
                <div className="space-y-8">
                  {assessment.questions.map((q: any, qIdx: number) => {
                    const options = JSON.parse(q.options || '[]');
                    const feedback = quizResult?.feedback?.find((f: any) => f.questionId === q.id);

                    return (
                      <div key={q.id} className="p-5 rounded-2xl bg-[#14151e] border border-white/5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <p className="font-semibold text-sm text-white">
                            {qIdx + 1}. {q.question_text}
                          </p>
                          <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-0.5 rounded bg-white/5">
                            {q.points} pt
                          </span>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {options.map((opt: any) => {
                            const isSelected = selectedAnswers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                                  isSelected
                                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-semibold'
                                    : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                                }`}
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
                  <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                    <div>
                      {quizResult && (
                        <p className={`text-sm font-bold ${quizResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Score: {quizResult.score} / {quizResult.maxScore} ({quizResult.percentage}%)
                          {quizResult.passed ? ' ΓÇö PASSED!' : ' ΓÇö Threshold not met. Review lessons and retry.'}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz || Object.keys(selectedAnswers).length < assessment.questions.length}
                      className="btn-neo-light text-xs py-3 px-8 disabled:opacity-40"
                    >
                      {submittingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Assessment'}
                    </button>
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
                  <h3 className="font-bold text-sm text-white">AI Learning Assistant</h3>
                </div>
                <span className="text-[10px] font-mono text-gray-500">CONTEXT: {chapter.title}</span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                <div className="p-3 rounded-2xl bg-white/5 text-xs text-gray-300 max-w-md">
                  Hello! I am your TechVerse AI Learning Assistant. Ask me to clarify any architectural concept, explain difficult code snippets, or provide additional practice exercises for this chapter.
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
