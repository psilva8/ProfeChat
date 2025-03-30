import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tryFlaskConnection } from '../lesson-plans/generate/route';

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

    // Generate lesson plan using Flask API
    console.log('Attempting to generate lesson plan with Flask API...');
    const flaskUrl = await tryFlaskConnection();
    
    if (!flaskUrl) {
      return NextResponse.json(
        { error: 'Could not connect to Flask API' },
        { status: 500 }
      );
    }

    // Prepare the prompt for Flask API
    const requestData = {
      subject,
      grade,
      topic,
      duration,
      objectives
    };

    // Call Flask API to generate lesson plan
    console.log('Calling Flask API:', `${flaskUrl}/api/generate-lesson`);
    const flaskResponse = await fetch(`${flaskUrl}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!flaskResponse.ok) {
      console.error('Flask API error:', flaskResponse.status);
      const errorData = await flaskResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to generate lesson plan', details: errorData },
        { status: 500 }
      );
    }

    const flaskData = await flaskResponse.json();
    console.log('Flask API responded with lesson plan');

    // Save lesson plan to database
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: testUser.id,
        subject,
        grade,
        topic,
        duration,
        objectives: objectives || 'No objectives provided',
        content: flaskData.lesson_plan,
      },
    });

    return NextResponse.json({
      success: true,
      lesson_plan: flaskData.lesson_plan,
      saved: lessonPlan
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
} 