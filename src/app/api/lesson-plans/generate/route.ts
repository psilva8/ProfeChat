import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const FLASK_PORT = process.env.FLASK_PORT || 5336;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Call Flask backend to generate lesson plan
    const response = await fetch(`${FLASK_URL}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to generate lesson plan');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate lesson plan');
    }

    // Save the lesson plan to the database
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: session.user.id,
        grade: body.grade,
        subject: body.subject,
        topic: body.topic,
        duration: parseInt(body.duration),
        objectives: body.objectives,
        content: data.lesson_plan,
      },
    });

    return NextResponse.json({
      success: true,
      id: lessonPlan.id,
      content: lessonPlan.content,
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 