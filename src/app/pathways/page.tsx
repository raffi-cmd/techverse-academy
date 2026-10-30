import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import { BookOpen, CheckCircle, Clock, Filter, ArrowRight, Layers } from 'lucide-react';



export default function PathwaysCatalogPage() {
  const categories = db.prepare('SELECT * FROM pathway_categories ORDER BY sort_order ASC').all() as any[];
  const pathways = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM learning_pathways p
    JOIN pathway_categories c ON p.category_id = c.id
    ORDER BY p.published_chapters DESC, p.name ASC
  `).all() as any[];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-3">
            TECHNICAL ACADEMY // CATALOG
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
            ALL 60 LEARNING<br />PATHWAYS
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every published pathway contains at least 50 structured chapters, code exercises, and verifiable completion certification.
            Pathways currently in development are clearly labeled.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 text-xs font-semibold">
          <span className="px-4 py-2 rounded-full bg-white text-black shrink-0">
            All Disciplines ({pathways.length})
          </span>
          {categories.map((c) => (
            <span
              key={c.id}
              className="px-4 py-2 rounded-full bg-[#14151b] border border-white/10 text-gray-300 shrink-0 hover:border-white/30 cursor-pointer"
            >
              {c.name}
            </span>
          ))}
        </div>

        {/* Pathway Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((p) => {
            const isComplete = p.published_chapters >= 50;
            return (
              <div
                key={p.id}
                className="neo-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all bg-[#0d0e14]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {p.category_name}
                    </span>
                    {p.readiness_status === 'ready' ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> SIAP BELAJAR (50 BAB)
                      </span>
                    ) : p.readiness_status === 'curriculum_ready' ? (
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> KURIKULUM 50 BAB
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        DALAM PENGEMBANGAN
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {p.name}
                  </h2>

                  <p className="text-xs text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {p.short_description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.estimated_duration}
                    </span>
                    <span className="capitalize">{p.difficulty_level}</span>
                  </div>

                  <Link
                    href={`/pathways/${p.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                  >
                    View Curriculum
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
