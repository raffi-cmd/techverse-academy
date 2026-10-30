'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock, CheckCircle, Sparkles, Filter } from 'lucide-react';

interface Pathway {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  category_name: string;
  estimated_duration: string;
  published_chapters: number;
  readiness_status?: string;
}

export function ExploreInteractive({ pathways }: { pathways: Pathway[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    pathways.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [pathways]);

  // Filtered pathways
  const filteredPathways = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return pathways.filter((p) => {
      const matchCategory = selectedCategory === 'ALL' || p.category_name === selectedCategory;
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.short_description?.toLowerCase().includes(term) ||
        p.category_name?.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }, [pathways, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari jalur belajar, topik, atau kata kunci..."
            className="w-full bg-[#0f1015] border border-white/15 rounded-full pl-5 pr-12 py-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-white/5 pb-3">
        <span>MENAMPILKAN {filteredPathways.length} DARI {pathways.length} JALUR BELAJAR</span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="text-cyan-400 hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Pathway Cards Grid */}
      {filteredPathways.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((p) => {
            const isComplete = p.published_chapters >= 50;
            return (
              <div
                key={p.id}
                className="neo-card p-6 bg-[#0d0e14] flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      {p.category_name}
                    </span>
                    {p.readiness_status === 'ready' ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> SIAP BELAJAR (50 BAB)
                      </span>
                    ) : p.readiness_status === 'curriculum_ready' ? (
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> KURIKULUM 50 BAB
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        DALAM PENGEMBANGAN
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-base text-white mb-2">{p.name}</h2>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                    {p.short_description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.estimated_duration}
                  </span>
                  <Link
                    href={`/pathways/${p.slug}`}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group"
                  >
                    Buka Kurikulum{' '}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center neo-card bg-[#0d0e14] border-white/5">
          <p className="text-gray-400 text-sm mb-4">
            Tidak ditemukan jalur belajar yang cocok dengan kata kunci &quot;{searchTerm}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="btn-neo-light text-xs py-2 px-5"
          >
            Tampilkan Semua Jalur
          </button>
        </div>
      )}
    </div>
  );
}
