export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, logAudit } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Access denied. Administrator privileges required.' }, { status: 403 });
    }

    const { certificateId, certificateNumber, reason } = await req.json();

    const lookupVal = certificateId || certificateNumber;
    if (!lookupVal) {
      return NextResponse.json({ error: 'Certificate ID or Number is required' }, { status: 400 });
    }

    const cert = db.prepare('SELECT id, certificate_number, user_id FROM certificates WHERE id = ? OR certificate_number = ?').get(lookupVal, lookupVal) as any;
    if (!cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE certificates
      SET status = 'revoked',
          revoked_at = datetime('now'),
          revoked_reason = ?
      WHERE id = ?
    `).run(reason || 'Administratively revoked.', cert.id);

    logAudit(user.id, 'CERTIFICATE_REVOKED', 'certificates', certificateId, {
      certificateNumber: cert.certificate_number,
      reason
    });

    return NextResponse.json({
      success: true,
      message: `Certificate ${cert.certificate_number} has been officially revoked.`
    });
  } catch (err: any) {
    console.error('Revocation error:', err);
    return NextResponse.json({ error: 'Failed to revoke certificate' }, { status: 500 });
  }
}

