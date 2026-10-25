export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db, { verifyPassword } from '@/lib/db';
import { createSession, logAudit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const stmt = db.prepare('SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = ?');
    const user = stmt.get(email.toLowerCase().trim()) as any;

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.is_active === 0) {
      return NextResponse.json({ error: 'Account has been disabled. Contact support.' }, { status: 403 });
    }

    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      logAudit(null, 'LOGIN_FAILED', 'users', user.id, { email });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await createSession(user.id);
    logAudit(user.id, 'LOGIN_SUCCESS', 'users', user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}

