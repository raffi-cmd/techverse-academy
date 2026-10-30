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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}) {
  const { slug, chapterSlug } = await params;
  let initialData: any = null;

  try {
    const db = (await import('@/lib/db')).default;
    const chapter = db.prepare(`
      SELECT c.*, p.name as pathway_name, p.slug as pathway_slug
      FROM chapters c
      JOIN learning_pathways p ON c.pathway_id = p.id
      WHERE p.slug = ? AND c.slug = ?
    `).get(slug, chapterSlug) as any;

    if (chapter) {
      const lessons = db.prepare(`
        SELECT id, title, slug, content, content_type, sort_order, estimated_time,
               title_id, title_en, content_id, content_en
        FROM lessons
        WHERE chapter_id = ?
        ORDER BY sort_order ASC
      `).all(chapter.id) as any[];

      const asmt = db.prepare('SELECT * FROM assessments WHERE chapter_id = ?').get(chapter.id) as any;
      let questions: any[] = [];

      if (asmt) {
        questions = db.prepare(`
          SELECT id, question_text, question_type, options, correct_answer, explanation, points, sort_order,
                 question_text_id, question_text_en, explanation_id, explanation_en, hint_id, hint_en
          FROM assessment_questions
          WHERE assessment_id = ?
          ORDER BY sort_order ASC
        `).all(asmt.id) as any[];
      }

      // Convert SQLiteRow objects to pure plain objects for React Server Components serialization
      initialData = JSON.parse(JSON.stringify({
        chapter,
        lessons,
        assessment: asmt ? { ...asmt, questions } : null,
      }));
    }
  } catch (err) {
    console.error('Error fetching chapter data for static export:', err);
  }

  return <ChapterWorkspacePage initialData={initialData} />;
}