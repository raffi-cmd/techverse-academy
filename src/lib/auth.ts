import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import db, { verifyPassword, generateId } from './db';

const SESSION_COOKIE_NAME = 'techverse_session';
const SESSION_SECRET = process.env.AUTH_SECRET || 'techverse-super-secret-jwt-key-2024';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
}

// Signs session payload with HMAC-SHA256
export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

// Verifies token signature and expiration
export function verifyToken<T>(token: string): T | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload as T;
  } catch {
    return null;
  }
}

// Get the authenticated user from server cookies
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken<{ userId: string }>(token);
    if (!decoded || !decoded.userId) return null;

    const stmt = db.prepare('SELECT id, email, name, role, image, is_active FROM users WHERE id = ?');
    const user = stmt.get(decoded.userId) as any;

    if (!user || user.is_active === 0) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    };
  } catch {
    return null;
  }
}

// Sets the session cookie
export async function createSession(userId: string): Promise<string> {
  const cookieStore = await cookies();
  const token = signToken({
    userId,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return token;
}

// Removes the session cookie
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Log audit action
export function logAudit(actorId: string | null, action: string, resource: string, resourceId?: string, metadata: object = {}) {
  try {
    const id = generateId('audit');
    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, resource, resource_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, actorId, action, resource, resourceId || null, JSON.stringify(metadata));
  } catch (err) {
    console.error('Audit log error:', err);
  }
}
