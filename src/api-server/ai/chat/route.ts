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

    const { message, context } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Check if AI provider key is configured
    if (!apiKey) {
      return NextResponse.json({
        available: false,
        message: 'The AI Learning Assistant is currently operating in offline mode because an external AI provider API key (OPENAI_API_KEY) has not been configured in the environment. Core platform learning, quizzes, and certificates remain fully operational without AI.'
      });
    }

    // Call external LLM provider with educational prompt safeguards
    const systemPrompt = `You are the TechVerse Academy AI Learning Assistant.
Your goal is to guide IT learners through conceptual clarity, code explanations, and architectural principles.
Educational rules:
1. Prefer explaining mental models over directly handing out answers.
2. If the user asks about an active quiz or assessment, refuse to give direct answers and instead explain the underlying technical principle.
3. Keep answers concise, accurate, and aligned with modern industry best practices.
Context: ${JSON.stringify(context || {})}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('AI provider error:', errText);
      return NextResponse.json({
        available: false,
        message: 'The AI provider returned a service error. Please try again later.'
      }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    // Record AI conversation in database
    const convId = generateId('conv');
    db.prepare(`
      INSERT INTO ai_conversations (id, user_id, context, title)
      VALUES (?, ?, ?, ?)
    `).run(convId, user.id, JSON.stringify(context || {}), message.slice(0, 50));

    db.prepare(`
      INSERT INTO ai_messages (id, conversation_id, role, content, token_count)
      VALUES (?, ?, 'user', ?, ?), (?, ?, 'assistant', ?, ?)
    `).run(
      generateId('msg'), convId, message, data.usage?.prompt_tokens || 0,
      generateId('msg'), convId, reply, data.usage?.completion_tokens || 0
    );

    return NextResponse.json({
      available: true,
      reply
    });
  } catch (err: any) {
    console.error('AI Assistant route error:', err);
    return NextResponse.json({
      available: false,
      message: 'An error occurred while contacting the AI assistance service.'
    }, { status: 500 });
  }
}

