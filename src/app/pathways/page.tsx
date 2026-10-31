import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import PathwaysCatalogClient from '@/components/pathways/PathwaysCatalogClient';

export default function PathwaysCatalogPage() {
  const rawCategories = db.prepare('SELECT * FROM pathway_categories ORDER BY sort_order ASC').all() as any[];
  const rawPathways = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM learning_pathways p
    JOIN pathway_categories c ON p.category_id = c.id
    ORDER BY p.published_chapters DESC, p.name ASC
  `).all() as any[];

  // Convert SQLite null-prototype objects to plain JavaScript objects for React Server Components serialization
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const pathways = JSON.parse(JSON.stringify(rawPathways));

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-3">
            AKADEMI TEKNOLOGI // KATALOG JALUR BELAJAR
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
            SELURUH 60 JALUR<br />PEMBELAJARAN IT
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Setiap jalur kurikulum terstruktur memuat materi bertahap dari fondasi hingga arsitektur produksi, evaluasi pemahaman bab, dan sertifikat kelulusan yang dapat diverifikasi secara publik. Jalur yang sedang dalam kurasi materi ditandai secara transparan.
          </p>
        </div>

        {/* Client Interactive Filter & Search Grid */}
        <PathwaysCatalogClient
          initialCategories={categories}
          initialPathways={pathways}
        />
      </main>

      <Footer />
    </div>
  );
}
