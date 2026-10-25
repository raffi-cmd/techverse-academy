import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import { Search, ArrowRight, Clock, CheckCircle } from 'lucide-react';

export default function ExplorePage() {
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
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            FIELD EXPLORATION // 60 PATHWAYS
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            EXPLORE IT DISCIPLINES
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Filter through our catalog of software development, artificial intelligence, cybersecurity, cloud, and systems pathways.
          </p>

          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Filter by discipline below..."
              readOnly
              className="w-full bg-[#0f1015] border border-white/15 rounded-full pl-5 pr-12 py-3.5 text-xs text-gray-400 placeholder:text-gray-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((p) => {
            const isComplete = p.published_chapters >= 50;
            return (
              <div key={p.id} className="neo-card p-6 bg-[#0d0e14] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      {p.category_name}
                    </span>
                    {isComplete ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> 50 Chapters
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        In Development
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-base text-white mb-2">{p.name}</h2>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-6">{p.short_description}</p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.estimated_duration}
                  </span>
                  <Link
                    href={`/pathways/${p.slug}`}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    View Curriculum <ArrowRight className="w-3 h-3" />
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
