import { NextRequest, NextResponse } from "next/server";
import { tryFlaskConnection } from '../lesson-plans/generate/route';

// This is a test API that directly calls the Flask API without needing authentication

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

    return NextResponse.json({
      success: true,
      lesson_plan: flaskData.lesson_plan
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
} 