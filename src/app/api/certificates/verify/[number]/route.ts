import { NextRequest, NextResponse } from 'next/server';
import db, { generateId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params;
    if (!number) {
      return NextResponse.json({ result: 'not_found' }, { status: 404 });
    }

    const certStmt = db.prepare(`
      SELECT
        c.id, c.certificate_number, c.recipient_name, c.chapter_title,
        c.pathway_name, c.issue_date, c.curriculum_version, c.status,
        c.revoked_at, c.revoked_reason, c.pdf_filename, c.verification_url
      FROM certificates c
      WHERE c.certificate_number = ?
    `);
    const cert = certStmt.get(number.toUpperCase().trim()) as any;

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!cert) {
      return NextResponse.json({
        result: 'not_found',
        message: 'No certificate exists with this identification number.'
      }, { status: 404 });
    }

    // Log verification event
    db.prepare(`
      INSERT INTO certificate_verifications (id, certificate_id, ip_address, user_agent, result)
      VALUES (?, ?, ?, ?, ?)
    `).run(generateId('veri'), cert.id, ip, userAgent, cert.status);

    if (cert.status === 'revoked') {
      return NextResponse.json({
        result: 'revoked',
        certificate: {
          certificateNumber: cert.certificate_number,
          chapterTitle: cert.chapter_title,
          pathwayName: cert.pathway_name,
          status: 'revoked',
          revokedAt: cert.revoked_at,
          revokedReason: cert.revoked_reason || 'Administratively revoked.',
        }
      });
    }

    // Return authoritative public verification payload (No private email or passwords exposed)
    return NextResponse.json({
      result: 'valid',
      certificate: {
        certificateNumber: cert.certificate_number,
        recipientName: cert.recipient_name,
        chapterTitle: cert.chapter_title,
        pathwayName: cert.pathway_name,
        issueDate: cert.issue_date,
        curriculumVersion: cert.curriculum_version,
        status: 'valid',
        issuingPlatform: 'TechVerse Academy',
        verificationUrl: cert.verification_url,
        pdfUrl: `/certificates/${cert.pdf_filename}`,
      }
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Verification service error' }, { status: 500 });
  }
}
