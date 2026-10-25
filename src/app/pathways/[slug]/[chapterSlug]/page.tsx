import ChapterWorkspacePage from '@/components/chapter/ChapterWorkspace';

export async function generateStaticParams() {
  try {
    const db = (await import('@/lib/db')).default;
    const query = 'SELECT p.slug as slug, c.slug as chapterSlug FROM chapters c JOIN learning_pathways p ON c.pathway_id = p.id';
    const rows = db.prepare(query).all() as any[];
    return rows.map((r) => ({ slug: r.slug, chapterSlug: r.chapterSlug }));
  } catch {
    return [];
  }
}

export default function Page() {
  return <ChapterWorkspacePage />;
}
