export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user enrollments
    const enrollments = db.prepare(`
      SELECT e.*, p.name as pathway_name, p.slug as pathway_slug, p.total_chapters, p.difficulty_level
      FROM learning_enrollments e
      JOIN learning_pathways p ON e.pathway_id = p.id
      WHERE e.user_id = ?
    `).all(user.id) as any[];

    // Fetch user certificates
    const certificates = db.prepare(`
      SELECT c.*, p.name as pathway_name
      FROM certificates c
      JOIN learning_pathways p ON c.pathway_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(user.id) as any[];

    // Fetch chapter completions count
    const completedCount = (db.prepare(`
      SELECT COUNT(*) as c FROM chapter_completions WHERE user_id = ?
    `).get(user.id) as any).c;

    // Fetch recent assessment attempts
    const recentAttempts = db.prepare(`
      SELECT a.*, asmt.title as assessment_title, c.title as chapter_title
      FROM assessment_attempts a
      JOIN assessments asmt ON a.assessment_id = asmt.id
      JOIN chapters c ON asmt.chapter_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.started_at DESC LIMIT 5
    `).all(user.id) as any[];

    // Fetch profile and preferences
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(user.id);
    const preferences = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(user.id);

    return NextResponse.json({
      user,
      profile,
      preferences,
      completedChaptersCount: completedCount,
      certificatesCount: certificates.length,
      enrollments,
      certificates,
      recentAttempts,
    });
  } catch (err: any) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ error: 'Failed to retrieve dashboard data' }, { status: 500 });
  }
}

