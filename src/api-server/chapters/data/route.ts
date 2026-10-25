import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pathwaySlug = searchParams.get('pathway');
    const chapterSlug = searchParams.get('chapter');

    if (!pathwaySlug || !chapterSlug) {
      return NextResponse.json({ error: 'Pathway and chapter slugs are required' }, { status: 400 });
    }

    const chapter = db.prepare(`
      SELECT c.*, p.name as pathway_name, p.slug as pathway_slug
      FROM chapters c
      JOIN learning_pathways p ON c.pathway_id = p.id
      WHERE p.slug = ? AND c.slug = ?
    `).get(pathwaySlug, chapterSlug) as any;

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Fetch lessons
    const lessons = db.prepare(`
      SELECT id, title, slug, content, content_type, sort_order, estimated_time
      FROM lessons
      WHERE chapter_id = ?
      ORDER BY sort_order ASC
    `).all(chapter.id);

    // Fetch assessment and questions (strip isCorrect from options so answer keys aren't sent to browser!)
    const asmt = db.prepare('SELECT * FROM assessments WHERE chapter_id = ?').get(chapter.id) as any;
    let sanitizedQuestions: any[] = [];

    if (asmt) {
      const questions = db.prepare(`
        SELECT id, question_text, question_type, options, points, sort_order
        FROM assessment_questions
        WHERE assessment_id = ?
        ORDER BY sort_order ASC
      `).all(asmt.id) as any[];

      sanitizedQuestions = questions.map((q) => {
        let opts = [];
        try {
          const rawOpts = JSON.parse(q.options || '[]');
          opts = rawOpts.map((o: any) => ({ id: o.id, text: o.text })); // Omits isCorrect!
        } catch {
          opts = [];
        }
        return {
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          points: q.points,
          options: JSON.stringify(opts),
        };
      });
    }

    // Check if user is authenticated and has existing certificate
    const user = await getCurrentUser();
    let existingCert = null;
    let defaultName = null;

    if (user) {
      const cert = db.prepare(`
        SELECT * FROM certificates
        WHERE user_id = ? AND chapter_id = ? AND status = 'valid'
      `).get(user.id, chapter.id) as any;

      if (cert) {
        existingCert = {
          certificateNumber: cert.certificate_number,
          recipientName: cert.recipient_name,
          issueDate: cert.issue_date,
        };
      }

      const profile = db.prepare('SELECT certificate_name FROM user_profiles WHERE user_id = ?').get(user.id) as any;
      defaultName = profile?.certificate_name || user.name;
    }

    return NextResponse.json({
      chapter,
      lessons,
      assessment: asmt ? { ...asmt, questions: sanitizedQuestions } : null,
      existingCertificate: existingCert,
      defaultName,
    });
  } catch (err: any) {
    console.error('Chapter data error:', err);
    return NextResponse.json({ error: 'Failed to fetch chapter data' }, { status: 500 });
  }
}
