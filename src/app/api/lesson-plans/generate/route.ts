import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const FLASK_BASE_PORT = parseInt(process.env.FLASK_PORT || '5336');
const MAX_PORT_ATTEMPTS = 5;

// Function to try multiple ports for Flask server
async function fetchWithPortFallback(path: string, options: RequestInit) {
  let lastError;
  
  for (let portOffset = 0; portOffset < MAX_PORT_ATTEMPTS; portOffset++) {
    const currentPort = FLASK_BASE_PORT + portOffset;
    const url = `http://localhost:${currentPort}${path}`;
    
    try {
      console.log(`Attempting to connect to Flask server at ${url}`);
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(`Failed to connect to Flask server at port ${currentPort}:`, error);
      lastError = error;
    }
  }
  
  throw lastError || new Error('Failed to connect to Flask server on any port');
}

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
    console.log('Generating lesson plan with data:', body);
    
    // Call Flask backend to generate lesson plan with port fallback
    const response = await fetchWithPortFallback('/api/generate-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate lesson plan');
    }

    console.log('Successfully generated lesson plan from Flask API');

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

    console.log('Saved lesson plan to database with ID:', lessonPlan.id);

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