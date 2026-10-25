import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db, { generateId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id: assessmentId } = await params;
    const { responses, timeSpent } = await req.json();

    const asmt = db.prepare(`
      SELECT a.*, c.id as chapter_id, c.pathway_id
      FROM assessments a
      JOIN chapters c ON a.chapter_id = c.id
      WHERE a.id = ?
    `).get(assessmentId) as any;

    if (!asmt) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check maximum attempts
    const attemptCount = (db.prepare(`
      SELECT COUNT(*) as c FROM assessment_attempts
      WHERE user_id = ? AND assessment_id = ?
    `).get(user.id, assessmentId) as any).c;

    if (attemptCount >= asmt.max_attempts) {
      return NextResponse.json({
        error: `Maximum attempts (${asmt.max_attempts}) reached for this assessment.`
      }, { status: 403 });
    }

    // Fetch questions and correct answers for deterministic grading
    const questions = db.prepare(`
      SELECT id, question_text, question_type, options, correct_answer, explanation, points
      FROM assessment_questions
      WHERE assessment_id = ?
    `).all(assessmentId) as any[];

    let totalPoints = 0;
    let earnedPoints = 0;
    const feedbackList = [];

    for (const q of questions) {
      totalPoints += q.points;
      const userResp = responses?.find((r: any) => r.questionId === q.id);
      const userAns = userResp?.answer;

      let isCorrect = false;

      if (q.question_type === 'single_choice' || q.question_type === 'true_false') {
        const options = JSON.parse(q.options || '[]');
        const correctOpt = options.find((o: any) => o.isCorrect === true);
        if (correctOpt && userAns === correctOpt.id) {
          isCorrect = true;
          earnedPoints += q.points;
        }
      } else if (q.question_type === 'short_answer') {
        if (q.correct_answer && userAns?.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
          isCorrect = true;
          earnedPoints += q.points;
        }
      }

      feedbackList.push({
        questionId: q.id,
        isCorrect,
        explanation: q.explanation || 'Verified through standard technical specification.'
      });
    }

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= asmt.passing_score ? 1 : 0;
    const attemptId = generateId('atm');

    // Insert attempt into DB
    db.prepare(`
      INSERT INTO assessment_attempts (
        id, user_id, assessment_id, score, max_score, percentage, passed,
        time_spent, completed_at, responses_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
    `).run(
      attemptId, user.id, assessmentId, earnedPoints, totalPoints,
      percentage, passed, timeSpent || 0, JSON.stringify(responses || [])
    );

    // If passed, update chapter progress
    if (passed === 1) {
      db.prepare(`
        INSERT INTO chapter_progress (id, user_id, chapter_id, status, percentage, updated_at)
        VALUES (?, ?, ?, 'completed', 100, datetime('now'))
        ON CONFLICT(user_id, chapter_id) DO UPDATE SET
          status = 'completed',
          percentage = 100,
          updated_at = datetime('now')
      `).run(generateId('cpr'), user.id, asmt.chapter_id);
    }

    return NextResponse.json({
      success: true,
      score: earnedPoints,
      maxScore: totalPoints,
      percentage: Math.round(percentage),
      passingScore: asmt.passing_score,
      passed: passed === 1,
      feedback: feedbackList,
      attemptsRemaining: Math.max(0, asmt.max_attempts - (attemptCount + 1)),
    });
  } catch (err: any) {
    console.error('Assessment submit error:', err);
    return NextResponse.json({ error: 'Assessment submission failed' }, { status: 500 });
  }
}
