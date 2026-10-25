export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getCurrentUser, logAudit } from '@/lib/auth';
import db, { generateId, generateCertificateNumber } from '@/lib/db';
import { generateCertificatePdf } from '@/lib/certificate-pdf';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { chapterId, recipientName } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
    }

    // 1. Fetch Chapter, Pathway & Curriculum Version
    const chapterStmt = db.prepare(`
      SELECT c.id, c.title, c.curriculum_version, c.pathway_id, p.name as pathway_name
      FROM chapters c
      JOIN learning_pathways p ON c.pathway_id = p.id
      WHERE c.id = ?
    `);
    const chapter = chapterStmt.get(chapterId) as any;

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // 2. Authoritative Server-Side Eligibility Recalculation
    // Check if the chapter requires an assessment and if user passed it
    const asmt = db.prepare('SELECT id, passing_score FROM assessments WHERE chapter_id = ?').get(chapterId) as any;

    if (asmt) {
      const bestAttempt = db.prepare(`
        SELECT passed, percentage FROM assessment_attempts
        WHERE user_id = ? AND assessment_id = ? AND passed = 1
        ORDER BY percentage DESC LIMIT 1
      `).get(user.id, asmt.id) as any;

      if (!bestAttempt || bestAttempt.passed !== 1) {
        return NextResponse.json({
          error: 'Eligibility criteria not met. You must pass the chapter assessment with score >= 80% before earning this certificate.',
          isEligible: false
        }, { status: 400 });
      }
    }

    // 3. Check for existing certificate (Idempotency check)
    const existingCert = db.prepare(`
      SELECT * FROM certificates
      WHERE user_id = ? AND chapter_id = ? AND curriculum_version = ?
    `).get(user.id, chapterId, chapter.curriculum_version) as any;

    if (existingCert) {
      const pdfDiskPath = path.join(process.cwd(), 'public', 'certificates', `${existingCert.certificate_number}.pdf`);
      if (!fs.existsSync(pdfDiskPath)) {
        await generateCertificatePdf({
          certificateNumber: existingCert.certificate_number,
          recipientName: existingCert.recipient_name,
          chapterTitle: existingCert.chapter_title,
          pathwayName: existingCert.pathway_name,
          issueDate: existingCert.issue_date,
          verificationUrl: existingCert.verification_url
        });
      }

      return NextResponse.json({
        success: true,
        alreadyIssued: true,
        certificate: {
          id: existingCert.id,
          certificateNumber: existingCert.certificate_number,
          recipientName: existingCert.recipient_name,
          chapterTitle: existingCert.chapter_title,
          pathwayName: existingCert.pathway_name,
          issueDate: existingCert.issue_date,
          status: existingCert.status,
          verificationUrl: existingCert.verification_url,
          pdfUrl: `/certificates/${existingCert.certificate_number}.pdf`,
        }
      });
    }

    // 4. Resolve verified recipient name
    let finalName = recipientName?.trim();
    if (!finalName) {
      const profile = db.prepare('SELECT certificate_name FROM user_profiles WHERE user_id = ?').get(user.id) as any;
      finalName = profile?.certificate_name || user.name || 'Valued Learner';
    }

    // 5. Create immutable chapter completion record
    const completionId = generateId('comp');
    db.prepare(`
      INSERT OR IGNORE INTO chapter_completions (id, user_id, chapter_id, curriculum_version, completed_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(completionId, user.id, chapterId, chapter.curriculum_version);

    // 6. Generate unique certificate number & URLs
    const certNumber = generateCertificateNumber();
    const certId = generateId('cert');
    const origin = req.nextUrl.origin || 'http://localhost:3000';
    const verificationUrl = `${origin}/verify/${certNumber}`;
    const pdfFilename = `${certNumber}.pdf`;

    // 7. Generate Real PDF Certificate
    const now = new Date().toISOString().split('T')[0];
    generateCertificatePdf({
      certificateNumber: certNumber,
      recipientName: finalName,
      chapterTitle: chapter.title,
      pathwayName: chapter.pathway_name,
      issueDate: now,
      verificationUrl,
    });

    // 8. Insert into Authoritative Database
    db.prepare(`
      INSERT INTO certificates (
        id, certificate_number, user_id, chapter_id, pathway_id,
        recipient_name, chapter_title, pathway_name, curriculum_version,
        status, pdf_filename, verification_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'valid', ?, ?)
    `).run(
      certId, certNumber, user.id, chapterId, chapter.pathway_id,
      finalName, chapter.title, chapter.pathway_name, chapter.curriculum_version,
      pdfFilename, verificationUrl
    );

    // 9. Send In-App Notification & Audit Log
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message)
      VALUES (?, ?, 'certificate', 'Certificate Earned!', ?)
    `).run(
      generateId('notif'),
      user.id,
      `Congratulations! You earned your completion certificate for "${chapter.title}".`
    );

    logAudit(user.id, 'CERTIFICATE_ISSUED', 'certificates', certId, { certNumber, chapterId });

    return NextResponse.json({
      success: true,
      certificate: {
        id: certId,
        certificateNumber: certNumber,
        recipientName: finalName,
        chapterTitle: chapter.title,
        pathwayName: chapter.pathway_name,
        issueDate: now,
        status: 'valid',
        verificationUrl,
        pdfUrl: `/certificates/${pdfFilename}`,
      }
    });
  } catch (err: any) {
    console.error('Certificate claim error:', err);
    return NextResponse.json({ error: 'Failed to issue certificate. Server error.' }, { status: 500 });
  }
}

