import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import db from '@/lib/db';
import { ExploreInteractive } from '@/components/explore/ExploreInteractive';

export default function ExplorePage() {
  const rawPathways = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM learning_pathways p
    JOIN pathway_categories c ON p.category_id = c.id
    ORDER BY 
      CASE p.readiness_status
        WHEN 'ready' THEN 1
        WHEN 'curriculum_ready' THEN 2
        ELSE 3
      END ASC,
      p.published_chapters DESC,
      p.name ASC
  `).all() as any[];

  // Normalize plain object to avoid server-client boundary serialization warnings
  const pathways = JSON.parse(JSON.stringify(rawPathways));

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            EKSPLORASI BIDANG TEKNOLOGI // {pathways.length} JALUR BELAJAR
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            JALUR BELAJAR IT
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pilih dari katalog lengkap jalur pembelajaran rekayasa perangkat lunak, kecerdasan buatan, keamanan siber, cloud computing, arsitektur data, dan infrastruktur sistem DEVORA. 100% gratis tanpa batasan.
          </p>
        </div>

        <ExploreInteractive pathways={pathways} />
      </main>

      <Footer />
    </div>
  );
}
