import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to get the Flask server port
async function getFlaskPort(): Promise<number> {
  try {
    // First try to read from the .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portStr = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portStr, 10);
      if (!isNaN(port)) {
        console.log(`Found Flask port ${port} from .flask-port file`);
        return port;
      }
    }
  } catch (error) {
    console.error(`Error reading .flask-port file: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Next, try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    const port = parseInt(envPort, 10);
    if (!isNaN(port)) {
      return port;
    }
  }

  // Default to port 5338
  return 5338;
}

// Fallback data for when Flask is unavailable
const FALLBACK_DATA = [
  {
    "content": {
      "activities": "Group work to identify literary devices in assigned poems.",
      "assessment": "Students will write a short analysis of a poem using the techniques learned.",
      "closure": "Class discussion on how poetry analysis skills transfer to other texts.",
      "introduction": "Begin with a reading of 'The Road Not Taken' by Robert Frost.",
      "main_content": "Discuss metaphor, imagery, and symbolism in the poem."
    },
    "created_at": "2023-03-30T14:30:00Z",
    "duration": 60,
    "grade": "8th Grade",
    "id": "test-plan-1",
    "objectives": "Students will learn to identify literary devices in poetry and analyze their effect.",
    "subject": "English",
    "topic": "Poetry Analysis"
  },
  {
    "content": {
      "activities": "Create a scale model of the solar system in the classroom.",
      "assessment": "Quiz on planet names, order, and key facts.",
      "closure": "Discuss how understanding our solar system helps us understand our place in the universe.",
      "introduction": "Show a video clip about space exploration.",
      "main_content": "Present information about each planet with visual aids."
    },
    "created_at": "2023-03-29T10:15:00Z",
    "duration": 45,
    "grade": "5th Grade",
    "id": "test-plan-2",
    "objectives": "Students will be able to identify the planets in our solar system and describe their key characteristics.",
    "subject": "Science",
    "topic": "The Solar System"
  },
  {
    "content": {
      "activities": "Worksheet practice with graduated difficulty levels.",
      "assessment": "Exit ticket with 3 equations to solve independently.",
      "closure": "Discuss how algebraic thinking is used in daily life and various careers.",
      "introduction": "Review the concept of variables with real-world examples.",
      "main_content": "Demonstrate solving for x in various equations."
    },
    "created_at": "2023-03-28T09:45:00Z",
    "duration": 55,
    "grade": "9th Grade",
    "id": "test-plan-3",
    "objectives": "Students will understand how to solve simple equations with one variable.",
    "subject": "Mathematics",
    "topic": "Algebra Basics"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Try to get port and fetch from Flask first
    try {
      const port = await getFlaskPort();
      console.log(`Fetching test lesson plans from Flask server on port ${port}`);
      
      const response = await fetch(`http://localhost:${port}/api/test-lesson-plans`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });

      if (!response.ok) {
        throw new Error(`Flask server responded with status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (flaskError) {
      // Log the Flask error but continue to fallback
      console.error('Error connecting to Flask server for test lesson plans:', flaskError);
      console.log('Using fallback test lesson plans data instead');
      
      // Return the fallback data
      return NextResponse.json(FALLBACK_DATA);
    }
  } catch (error) {
    console.error('Unhandled error in test lesson plans API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    console.log('Received POST request with body:', body);
    
    // Try to get port and forward to Flask first
    try {
      const port = await getFlaskPort();
      console.log(`Forwarding POST to Flask server on port ${port}`);
      
      const response = await fetch(`http://localhost:${port}/api/test-lesson-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });

      if (!response.ok) {
        throw new Error(`Flask server responded with status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (flaskError) {
      // Log the Flask error but continue to fallback response
      console.error('Error connecting to Flask server:', flaskError);
      console.log('Using fallback response instead');
      
      // Return a mock success response
      return NextResponse.json({ 
        success: true, 
        message: 'POST request received (fallback response)',
        received: body
      });
    }
  } catch (error) {
    console.error('Unhandled error in POST API route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 