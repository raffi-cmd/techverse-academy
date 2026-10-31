'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, ArrowRight, Search, Layers } from 'lucide-react';

interface PathwayItem {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name: string;
  short_description: string;
  difficulty_level: string;
  estimated_duration: string;
  published_chapters: number;
  readiness_status: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialCategories: CategoryItem[];
  initialPathways: PathwayItem[];
}

export default function PathwaysCatalogClient({ initialCategories, initialPathways }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPathways = useMemo(() => {
    return initialPathways.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialPathways, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalur pembelajaran, topik, atau kata kunci..."
            className="w-full bg-[#0f1015] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs text-gray-400 font-mono self-center">
          Menampilkan {filteredPathways.length} dari {initialPathways.length} Jalur
        </span>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-xs font-semibold scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-white text-black font-bold shadow'
              : 'bg-[#14151b] border border-white/10 text-gray-300 hover:border-white/30'
          }`}
        >
          Semua Bidang ({initialPathways.length})
        </button>
        {initialCategories.map((c) => {
          const count = initialPathways.filter((p) => p.category_id === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full shrink-0 transition-colors ${
                selectedCategory === c.id
                  ? 'bg-cyan-400 text-black font-bold shadow'
                  : 'bg-[#14151b] border border-white/10 text-gray-300 hover:border-white/30'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Pathway Grid */}
      {filteredPathways.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((p) => {
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
                    Buka Kurikulum Lengkap
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="neo-card p-12 text-center bg-[#0d0e14] max-w-md mx-auto">
          <Layers className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Tidak Ada Jalur Ditemukan</h3>
          <p className="text-xs text-gray-400 mb-4">
            Tidak ada jalur pembelajaran yang cocok dengan filter atau kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="btn-neo-light text-xs py-2 px-4"
          >
            Reset Filter & Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
