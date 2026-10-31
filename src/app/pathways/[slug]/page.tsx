import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import {
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  Code
} from 'lucide-react';
export async function generateStaticParams() {
  try {
    const pathways = db.prepare('SELECT slug FROM learning_pathways').all() as any[];
    return pathways.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function PathwayDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const pathway = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM learning_pathways p
    JOIN pathway_categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(slug) as any;

  if (!pathway) {
    notFound();
  }

  // Fetch modules and chapters
  const modules = db.prepare(`
    SELECT * FROM pathway_modules
    WHERE pathway_id = ?
    ORDER BY sort_order ASC
  `).all(pathway.id) as any[];

  const chapters = db.prepare(`
    SELECT id, module_id, title, slug, description, estimated_time, sort_order
    FROM chapters
    WHERE pathway_id = ?
    ORDER BY sort_order ASC
  `).all(pathway.id) as any[];

  // Group chapters by module
  const modulesWithChapters = modules.map((m) => ({
    ...m,
    chapters: chapters.filter((c) => c.module_id === m.id)
  }));

  const outcomes = JSON.parse(pathway.learning_outcomes || '[]');
  const techStack = JSON.parse(pathway.technology_stack || '[]');
  const careers = JSON.parse(pathway.career_applications || '[]');

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/pathways" className="hover:text-white">Jalur Belajar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300">{pathway.category_name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400 font-semibold">{pathway.name}</span>
        </div>

        {/* Hero Header */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16 pb-16 border-b border-white/10">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-4 bg-cyan-950/20">
              SILABUS JALUR // {pathway.curriculum_version}
            </div>

            <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
              {pathway.name}
            </h1>

            <p className="text-base text-gray-300 leading-relaxed mb-6">
              {pathway.short_description}
            </p>

            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              {pathway.detailed_description}
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-300">
              <div className="neo-card px-4 py-2.5 flex items-center gap-2 bg-[#12131a]">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Estimasi {pathway.estimated_duration}</span>
              </div>
              <div className="neo-card px-4 py-2.5 flex items-center gap-2 bg-[#12131a]">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>{pathway.total_chapters} Bab Terstruktur</span>
              </div>
              <div className="neo-card px-4 py-2.5 flex items-center gap-2 bg-[#12131a]">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Sertifikat Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="lg:col-span-4 neo-card p-6 bg-[#0f1015]">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-3">
              Ringkasan Kurikulum
            </h3>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <p className="text-gray-500 text-[11px] uppercase mb-1">Prasyarat Belajar</p>
                <p className="text-gray-300">{pathway.recommended_knowledge || 'Terbuka untuk semua tingkatan'}</p>
              </div>

              <div>
                <p className="text-gray-500 text-[11px] uppercase mb-1">Target Profesi IT</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {careers.map((c: string) => (
                    <span key={c} className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-gray-300 border border-white/5">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-[11px] uppercase mb-1">Teknologi & Alat</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {techStack.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-cyan-300 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {chapters.length > 0 ? (
              <Link
                href={`/pathways/${pathway.slug}/${chapters[0].slug}`}
                className="w-full btn-neo-light text-xs py-3 justify-center"
              >
                Mulai Bab 1
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <button disabled className="w-full btn-neo-dark text-xs py-3 justify-center opacity-50 cursor-not-allowed">
                Kurikulum Dalam Pengembangan
              </button>
            )}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mb-16">
          <h2 className="font-bold text-xl text-white mb-6">Kompetensi yang Akan Dikuasai</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {outcomes.map((item: string, i: number) => (
              <div key={i} className="neo-card p-4 flex items-start gap-3 bg-[#0d0e14]">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Structured Syllabus (All 10 Modules & Chapters) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display-title text-2xl sm:text-4xl text-white">
              SILABUS LENGKAP ({chapters.length} BAB)
            </h2>
            <span className="text-xs text-gray-500">
              Progres Belajar Bertahap
            </span>
          </div>

          <div className="space-y-6">
            {modulesWithChapters.map((mod, mIndex) => (
              <div key={mod.id} className="neo-card p-6 bg-[#0f1015]">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      MODUL {mIndex + 1}
                    </span>
                    <h3 className="font-bold text-base text-white">{mod.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {mod.chapters.length} Bab
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mod.chapters.map((ch: any) => (
                    <Link
                      key={ch.id}
                      href={`/pathways/${pathway.slug}/${ch.slug}`}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5 font-mono">
                          <span>BAB {ch.sort_order}</span>
                          <span>{ch.estimated_time}m</span>
                        </div>
                        <p className="font-semibold text-xs text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {ch.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-gray-500 group-hover:text-white mt-3 pt-2 border-t border-white/5">
                        <span>Pelajari Materi & Kuis</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
