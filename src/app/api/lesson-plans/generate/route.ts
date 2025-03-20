import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { subject, grade, topic, objectives, duration } = body;

    // Validate required fields
    if (!subject || !grade || !topic || !objectives || !duration) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create a new lesson plan in the database
    const lessonPlan = await db.lessonPlan.create({
      data: {
        subject: String(subject),
        grade: String(grade),
        topic: String(topic),
        objectives: String(objectives),
        duration: Number(duration),
        userId: session.user.id,
        content: '', // Will be populated later by AI service
      },
    });

    // Here you would typically call your AI service to generate the lesson plan content
    // For now, we'll just return the created plan
    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 