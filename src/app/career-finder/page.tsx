'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import rawQuestions from '@/data/career-questions.json';

interface Question {
  id: number;
  question: string;
  category: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

const CAREER_QUESTIONS = rawQuestions as unknown as Question[];

interface TrackProfile {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  whySuits: string;
  starterSkills: string[];
  dayInLife: string;
}

const TRACK_PROFILES: Record<string, TrackProfile> = {
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence & Machine Learning Engineering',
    slug: 'ai-and-llm-engineering',
    tagline: 'Membangun Masa Depan Sistem Komputasi Cerdas',
    description: 'Anda memiliki kecenderungan analitis yang kuat, ketertarikan pada pemodelan matematika, penalaran logis, dan rasa ingin tahu mendalam tentang bagaimana algoritma belajar dari data.',
    whySuits: 'Jawaban Anda menunjukkan kombinasi ketertarikan tinggi pada algoritma cerdas, eksperimen berbasis data, dan ambisi untuk menciptakan teknologi cerdas otonom.',
    starterSkills: ['Python Fundamentals', 'Linear Algebra & Statistics', 'PyTorch / TensorFlow', 'Neural Networks', 'Prompt & RAG Architecture'],
    dayInLife: 'Menganalisis dataset pelatihan, melatih dan menyempurnakan model neural network, mengevaluasi metrik presisi, serta mengintegrasikan model cerdas ke dalam sistem produksi.'
  },
  web: {
    id: 'web',
    name: 'Full-Stack Software Engineering',
    slug: 'full-stack-web-development',
    tagline: 'Membangun Aplikasi Web Skalabel End-to-End',
    description: 'Anda menyukai pemecahan masalah praktis, merangkai logika backend yang kokoh, serta menyajikan antarmuka web interaktif yang dapat diakses jutaan pengguna.',
    whySuits: 'Profil jawaban Anda sangat seimbang antara pemikiran arsitektural terstruktur dan keinginan kuat untuk melihat hasil produk nyata yang dapat langsung dipakai orang lain.',
    starterSkills: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js Backend APIs', 'Relational Databases (SQL)', 'Git & Modular Architecture'],
    dayInLife: 'Menulis endpoint REST/GraphQL, mendesain skema database relasional, menghubungkan frontend responsif, dan memastikan performa loading aplikasi berjalan optimal.'
  },
  cyber: {
    id: 'cyber',
    name: 'Cybersecurity & Defensive Operations',
    slug: 'cybersecurity-fundamentals',
    tagline: 'Menjaga Integritas dan Benteng Pertahanan Digital',
    description: 'Anda memiliki rasa ingin tahu investigatif yang tinggi, kehati-hatian terhadap risiko, serta dorongan kuat untuk melindungi data dan privasi dari ancaman jahat.',
    whySuits: 'Jawaban Anda mencerminkan pola pikir defensif yang teliti, tertarik pada cara kerja enkripsi, mitigasi celah eksploitasi, dan keamanan infrastruktur.',
    starterSkills: ['Computer Networking (TCP/IP)', 'Linux Security & Hardening', 'Cryptography Basics', 'Web Vulnerabilities (OWASP Top 10)', 'Penetration Testing Mindset'],
    dayInLife: 'Melakukan security audit pada kode, menganalisis log traffic untuk mendeteksi intrusi mencurigakan, mengonfigurasi firewall, dan menyusun mitigasi kerentanan.'
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Computing & DevOps Architecture',
    slug: 'cloud-and-devops-engineering',
    tagline: 'Otomasi dan Skalabilitas Infrastruktur Digital Global',
    description: 'Anda menyukai sistem berskala besar, automasi alur kerja, stabilitas server, dan keandalan sistem agar tidak pernah down di bawah beban berat.',
    whySuits: 'Pilihan Anda menunjukkan ketertarikan pada pipeline CI/CD, kontainerisasi, manajemen sistem Linux, dan arsitektur cluster data center.',
    starterSkills: ['Linux Systems Administration', 'Docker Containerization', 'Kubernetes Orchestration', 'CI/CD Automation Pipelines', 'Terraform (Infrastructure as Code)'],
    dayInLife: 'Merancang konfigurasi cloud cluster, memonitor metrik latency server, mengotomasi deployment aplikasi baru, dan memastikan uptime sistem 99.99%.'
  },
  data: {
    id: 'data',
    name: 'Data Analytics & Data Science Systems',
    slug: 'data-analytics',
    tagline: 'Mengubah Tumpukan Data Mentah Menjadi Keputusan Strategis',
    description: 'Anda memiliki ketajaman analitis untuk melihat pola tersembunyi di balik angka-angka, menyukai validasi fakta, dan tertarik pada visualisasi wawasan bisnis.',
    whySuits: 'Jawaban Anda menunjukkan kepuasan dalam menganalisis korelasi data, ketelitian statistik, dan minat menghubungkan temuan data dengan pengambilan keputusan.',
    starterSkills: ['SQL & Data Warehousing', 'Python Data Science (Pandas, NumPy)', 'Exploratory Data Analysis', 'Statistical Inference', 'Data Visualization (Tableau/Metabase)'],
    dayInLife: 'Menulis query analitik kompleks, membersihkan data yang kotor, membangun model prediksi tren bisnis, dan menyusun dashboard laporan eksekutif.'
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile Application Engineering',
    slug: 'mobile-development',
    tagline: 'Menciptakan Pengalaman Mobile Halus di Genggaman Tangan',
    description: 'Anda menyukai interaksi fisik perangkat genggam, performa responsif 60fps, dan kenyamanan pengguna saat mengoperasikan aplikasi di ponsel pintar.',
    whySuits: 'Pilihan Anda memprioritaskan platform smartphone, mengoptimalkan interaksi sentuh, efisiensi memori, dan penyusunan aplikasi mobile native/cross-platform.',
    starterSkills: ['Dart & Flutter / React Native', 'Mobile UI State Management', 'REST API Integration', 'Offline Data Caching', 'App Store / Play Store Deployment'],
    dayInLife: 'Mengembangkan komponen UI mobile, menguji responsivitas di berbagai ukuran layar smartphone, menghubungkan API backend, dan mengoptimalkan performa rendering.'
  },
  qa: {
    id: 'qa',
    name: 'Software Testing & Quality Assurance Engineering',
    slug: 'software-testing-and-qa',
    tagline: 'Penjaga Standar Kualitas Mutu dan Keandalan Perangkat Lunak',
    description: 'Anda memiliki ketelitian tinggi, berpikir kritis terhadap edge case, dan merasa puas ketika berhasil menemukan dan mendokumentasikan bug sebelum rilis.',
    whySuits: 'Jawaban Anda menunjukkan dedikasi luar biasa terhadap pengujian otomatis, pencegahan regresi, dan penegakan standar kode perangkat lunak kelas dunia.',
    starterSkills: ['Test Planning & Test Cases Design', 'Automated Testing (Playwright, Jest)', 'API Testing & Contract Testing', 'Continuous Integration Testing', 'Bug Root Cause Analysis'],
    dayInLife: 'Menulis automated test scripts, mengeksekusi uji regresi sebelum deployment, menganalisis kegagalan alur pengguna, dan berkolaborasi erat dengan developer.'
  },
  uiux: {
    id: 'uiux',
    name: 'UI/UX Design & Frontend Architecture',
    slug: 'full-stack-web-development',
    tagline: 'Memadukan Estetika Visual dengan Pengalaman Pengguna yang Intuitif',
    description: 'Anda sangat peka terhadap keindahan visual, kenyamanan interaksi pengguna, keselarasan tata letak, dan kemudahan navigasi perangkat lunak.',
    whySuits: 'Jawaban Anda condong ke arah psikologi pengguna, hierarki tipografi, kehalusan interaksi mikro, dan estetika visual antarmuka modern.',
    starterSkills: ['Figma Wireframing & Prototyping', 'User Research & Usability Testing', 'HTML5 & Modern CSS / Tailwind', 'Design Systems Architecture', 'Micro-interactions & Accessibility'],
    dayInLife: 'Merancang user flow dan mockup high-fidelity di Figma, melakukan usability testing dengan pengguna nyata, dan menyusun spesifikasi token design.'
  }
};

export default function CareerFinderPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Restore draft or completed result from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('devora_career_draft_answers');
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch {}
      }

      const savedResult = localStorage.getItem('devora_career_recommendation');
      if (savedResult) {
        try {
          setResult(JSON.parse(savedResult));
          setCompleted(true);
        } catch {}
      }
    }
  }, []);

  // Save draft answers to localStorage
  const handleSelectOption = (questionId: number, optionIdx: number) => {
    const updated = { ...answers, [questionId]: optionIdx };
    setAnswers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('devora_career_draft_answers', JSON.stringify(updated));
    }
  };

  const handleCalculateResult = () => {
    const trackScores: Record<string, number> = {
      ai: 0,
      web: 0,
      cyber: 0,
      cloud: 0,
      data: 0,
      mobile: 0,
      qa: 0,
      uiux: 0
    };

    CAREER_QUESTIONS.forEach((q) => {
      const selectedOptIdx = answers[q.id];
      if (selectedOptIdx !== undefined && q.options[selectedOptIdx]) {
        const option = q.options[selectedOptIdx];
        Object.entries(option.scores).forEach(([track, pts]) => {
          if (trackScores[track] !== undefined) {
            trackScores[track] += pts;
          }
        });
      }
    });

    const sorted = Object.entries(trackScores).sort((a, b) => b[1] - a[1]);
    const primaryKey = sorted[0][0];
    const altKeys = sorted.slice(1, 4).map(s => s[0]);

    const maxPossibleScore = 40;
    const primaryScore = sorted[0][1];
    const matchPercentage = Math.min(98, Math.max(68, Math.round((primaryScore / maxPossibleScore) * 100)));

    const calculatedResult = {
      primary: TRACK_PROFILES[primaryKey] || TRACK_PROFILES.ai,
      alternatives: altKeys.map(k => ({
        ...TRACK_PROFILES[k],
        matchPercentage: Math.min(92, Math.max(50, Math.round((trackScores[k] / maxPossibleScore) * 100)))
      })),
      matchPercentage,
      completedDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setResult(calculatedResult);
    setCompleted(true);
    setShowConfirm(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('devora_career_recommendation', JSON.stringify(calculatedResult));
      localStorage.removeItem('devora_career_draft_answers');
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setCompleted(false);
    setCurrentIdx(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devora_career_draft_answers');
      localStorage.removeItem('devora_career_recommendation');
    }
  };

  const totalQuestions = CAREER_QUESTIONS.length;
  const currentQ = CAREER_QUESTIONS[currentIdx];
  const progressPercent = Math.round(((Object.keys(answers).length) / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Results Screen */}
        {completed && result ? (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                HASIL EVALUASI KARIER IT // 30 PERTANYAAN LENGKAP
              </span>
              <h1 className="font-display-title text-3xl sm:text-5xl text-white mb-4">
                REKOMENDASI JALUR KARIER ANDA
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Berdasarkan evaluasi minat, gaya berpikir, dan preferensi pemecahan masalah Anda.
              </p>
            </div>

            {/* Primary Recommendation Card */}
            <div className="neo-card p-8 bg-gradient-to-b from-[#0f121d] to-[#0a0c14] border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                    REKOMENDASI UTAMA // {result.matchPercentage}% KECOCOKAN
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    {result.primary.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">{result.primary.tagline}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Cpu className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-6 text-xs text-gray-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px] mb-1">Mengapa Jalur Ini Cocok Untuk Anda?</h4>
                  <p className="text-gray-300">{result.primary.whySuits}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase text-[11px] mb-2">Keterampilan Awal Yang Akan Anda Kuasai</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.primary.starterSkills.map((sk: string) => (
                      <span key={sk} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 font-mono text-[11px]">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase text-[11px] mb-1">Gambaran Aktivitas di Bidang Ini</h4>
                  <p className="text-gray-400">{result.primary.dayInLife}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-6 mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/pathways/${result.primary.slug}`}
                  className="btn-neo-light text-xs py-3 px-8 font-bold flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Mulai Belajar Jalur Ini
                </Link>
                <Link
                  href="/pathways"
                  className="btn-neo-outline text-xs py-3 px-6 text-gray-300 flex items-center gap-2"
                >
                  Lihat Semua Kurikulum
                </Link>
                <button
                  onClick={handleRetake}
                  className="text-xs text-gray-400 hover:text-white underline ml-auto flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Ulangi Tes
                </button>
              </div>
            </div>

            {/* Alternative Tracks Section */}
            <div>
              <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Alternatif Bidang Lain Yang Relevan
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {result.alternatives.map((alt: any) => (
                  <div key={alt.id} className="neo-card p-6 bg-[#0f1015] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-gray-400">ALTERNATIF</span>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">{alt.matchPercentage}%</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mb-2">{alt.name}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{alt.description}</p>
                    </div>

                    <Link
                      href={`/pathways/${alt.slug}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-3 border-t border-white/5"
                    >
                      Buka Kurikulum <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Step-by-Step Question Wizard */
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                <span className="uppercase text-cyan-400 font-bold">
                  IT CAREER PATH FINDER // SOAL {currentIdx + 1} DARI {totalQuestions}
                </span>
                <span>{progressPercent}% TERJAWAB</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="neo-card p-8 bg-[#0f1015] mb-8 shadow-2xl">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                KATEGORI: {currentQ.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-snug">
                {currentQ.id}. {currentQ.question}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-semibold shadow-lg'
                          : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="btn-neo-outline text-xs py-2.5 px-5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    disabled={answers[currentQ.id] === undefined}
                    className="btn-neo-light text-xs py-2.5 px-6 font-bold disabled:opacity-40 flex items-center gap-1.5"
                  >
                    Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={Object.keys(answers).length < totalQuestions}
                    className="btn-neo-light text-xs py-2.5 px-8 font-bold bg-emerald-400 text-black hover:bg-emerald-300 disabled:opacity-40"
                  >
                    Selesaikan & Lihat Rekomendasi &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="neo-card p-8 bg-[#0f1015] border border-white/20 max-w-md w-full text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Konfirmasi Pengumpulan</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Anda telah menjawab seluruh 30 pertanyaan evaluasi. Siap untuk menganalisis dan melihat jalur karier IT yang paling cocok untuk Anda?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-neo-outline text-xs py-2.5 px-5 text-gray-300"
                >
                  Periksa Kembali
                </button>
                <button
                  onClick={handleCalculateResult}
                  className="btn-neo-light text-xs py-2.5 px-6 font-bold bg-cyan-400 text-black"
                >
                  Analisis Hasil &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}