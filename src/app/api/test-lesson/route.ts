import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    // This is a test route so we don't check authentication
    
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

    return NextResponse.json({
      success: true,
      lesson_plan: data.lesson_plan,
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 