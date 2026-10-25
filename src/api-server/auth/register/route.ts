export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db, { hashPassword, generateId } from '@/lib/db';
import { createSession, logAudit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email address already exists' }, { status: 409 });
    }

    const userId = generateId('usr');
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, ?, ?, ?, 'learner', 1)
    `).run(userId, trimmedEmail, passwordHash, name.trim());

    db.prepare(`
      INSERT INTO user_profiles (user_id, display_name, certificate_name, experience_level)
      VALUES (?, ?, ?, 'beginner')
    `).run(userId, name.trim(), name.trim());

    db.prepare(`
      INSERT INTO user_preferences (user_id, theme, study_time_goal)
      VALUES (?, 'dark', 30)
    `).run(userId);

    await createSession(userId);
    logAudit(userId, 'REGISTER_SUCCESS', 'users', userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: trimmedEmail,
        name: name.trim(),
        role: 'learner',
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

