import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { subject, grade, topic, duration, objectives } = await request.json();

    // Validate required fields
    if (!subject || !grade || !topic || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get test user ID
    const testUser = await db.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    });

    if (!testUser) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Create sample content for the lesson plan
    const lessonPlanContent = `
# ${topic} - Grade ${grade} - ${subject}

## Objectives
${objectives || 'Sample objectives for this lesson plan'}

## Duration
${duration} minutes

## Content
This is a sample lesson plan created for testing purposes.
    `;

    // Create lesson plan in the database
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: testUser.id,
        subject,
        grade,
        topic,
        duration,
        objectives: objectives || 'Sample objectives',
        content: lessonPlanContent,
      },
    });

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error('Error creating test lesson plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
} 