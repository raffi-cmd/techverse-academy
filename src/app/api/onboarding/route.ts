export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import db, { generateId } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const {
      learningGoals,
      experienceLevel,
      knownTechnologies,
      preferredActivities,
      learningPreferences,
      equipmentInfo
    } = await req.json();

    // Deterministic recommendation scoring engine
    const allPathways = db.prepare(`
      SELECT id, name, slug, short_description, difficulty_level, category_id
      FROM learning_pathways
      WHERE published_chapters > 0
    `).all() as any[];

    const scored = allPathways.map((p) => {
      let score = 50; // base score

      // Goal matching
      const pName = p.name.toLowerCase();
      if (learningGoals?.includes('ai') && (pName.includes('intelligence') || pName.includes('machine') || pName.includes('prompt'))) score += 40;
      if (learningGoals?.includes('web') && (pName.includes('frontend') || pName.includes('backend') || pName.includes('full-stack'))) score += 40;
      if (learningGoals?.includes('security') && pName.includes('cybersecurity')) score += 45;
      if (learningGoals?.includes('cloud') && (pName.includes('cloud') || pName.includes('devops'))) score += 40;
      if (learningGoals?.includes('fundamentals') && pName.includes('fundamentals')) score += 40;

      // Activity matching
      if (preferredActivities?.includes('building') && (pName.includes('full-stack') || pName.includes('web'))) score += 20;
      if (preferredActivities?.includes('logic') && (pName.includes('programming') || pName.includes('python'))) score += 25;
      if (preferredActivities?.includes('data') && (pName.includes('data') || pName.includes('database'))) score += 30;
      if (preferredActivities?.includes('security') && pName.includes('security')) score += 35;

      // Experience level adjustment
      if (experienceLevel === 'beginner' && p.difficulty_level === 'beginner') score += 20;
      if (experienceLevel === 'intermediate' && p.difficulty_level === 'intermediate') score += 20;

      return {
        ...p,
        score,
        reason: `Matched based on your interest in ${learningGoals?.[0] || 'software'} and preference for ${preferredActivities?.[0] || 'practical application'}.`
      };
    });

    // Sort descending
    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0];
    const alternatives = [scored[1], scored[2]].filter(Boolean);

    const recommendations = {
      primary,
      alternatives,
      generatedAt: new Date().toISOString()
    };

    // Store responses in DB
    db.prepare(`
      INSERT OR REPLACE INTO onboarding_responses (
        user_id, learning_goals, experience_level, known_technologies,
        preferred_activities, learning_preferences, equipment_info,
        recommendations, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      user.id,
      JSON.stringify(learningGoals || []),
      experienceLevel || 'beginner',
      JSON.stringify(knownTechnologies || []),
      JSON.stringify(preferredActivities || []),
      JSON.stringify(learningPreferences || {}),
      JSON.stringify(equipmentInfo || {}),
      JSON.stringify(recommendations)
    );

    // Auto-enroll in primary pathway
    if (primary) {
      db.prepare(`
        INSERT OR IGNORE INTO learning_enrollments (id, user_id, pathway_id, status)
        VALUES (?, ?, ?, 'active')
      `).run(generateId('enr'), user.id, primary.id);
    }

    return NextResponse.json({
      success: true,
      recommendations
    });
  } catch (err: any) {
    console.error('Onboarding error:', err);
    return NextResponse.json({ error: 'Failed to process onboarding responses' }, { status: 500 });
  }
}

