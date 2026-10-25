export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Access denied. Administrator privileges required.' }, { status: 403 });
    }

    const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const pathwayCount = (db.prepare('SELECT COUNT(*) as c FROM learning_pathways WHERE published_chapters > 0').get() as any).c;
    const chapterCount = (db.prepare("SELECT COUNT(*) as c FROM chapters WHERE status = 'published'").get() as any).c;
    const completionCount = (db.prepare('SELECT COUNT(*) as c FROM chapter_completions').get() as any).c;
    const certCount = (db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'valid'").get() as any).c;
    const revokedCount = (db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'revoked'").get() as any).c;

    const recentLogs = db.prepare(`
      SELECT a.*, u.email as actor_email
      FROM audit_logs a
      LEFT JOIN users u ON a.actor_id = u.id
      ORDER BY a.created_at DESC LIMIT 10
    `).all();

    const recentCerts = db.prepare(`
      SELECT c.*, u.email as user_email
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC LIMIT 10
    `).all();

    return NextResponse.json({
      metrics: {
        users: userCount,
        activePathways: pathwayCount,
        publishedChapters: chapterCount,
        completions: completionCount,
        certificatesIssued: certCount,
        certificatesRevoked: revokedCount,
      },
      recentLogs,
      recentCerts,
    });
  } catch (err: any) {
    console.error('Admin metrics error:', err);
    return NextResponse.json({ error: 'Failed to retrieve administrator metrics' }, { status: 500 });
  }
}

