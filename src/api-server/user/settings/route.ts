export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { certificateName, bio, studyTimeGoal } = await req.json();

    if (certificateName) {
      db.prepare(`
        INSERT INTO user_profiles (user_id, certificate_name, bio)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          certificate_name = excluded.certificate_name,
          bio = excluded.bio
      `).run(user.id, certificateName.trim(), bio || '');
    }

    if (studyTimeGoal) {
      db.prepare(`
        INSERT INTO user_preferences (user_id, study_time_goal)
        VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          study_time_goal = excluded.study_time_goal
      `).run(user.id, Number(studyTimeGoal));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Settings error:', err);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}

