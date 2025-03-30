import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

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

// Helper function to find the Flask server port
async function getFlaskPort(): Promise<number> {
  console.log('Getting Flask server port');
  
  try {
    // First try to read from the .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portStr = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portStr, 10);
      if (!isNaN(port)) {
        console.log(`Found Flask port ${port} from .flask-port file`);
        // Verify the port is reachable
        try {
          const response = await fetch(`http://localhost:${port}/api/health`, { 
            method: 'GET',
            cache: 'no-store',
            signal: AbortSignal.timeout(500) // Timeout after 500ms
          });
          
          if (response.ok) {
            console.log(`Verified Flask server is reachable on port ${port}`);
            return port;
          } else {
            console.log(`Flask server on port ${port} responded with status ${response.status}`);
          }
        } catch (error) {
          console.error(`Error verifying Flask port ${port}: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        console.error(`Invalid port number in .flask-port file: "${portStr}"`);
      }
    } else {
      console.log('No .flask-port file found');
    }
  } catch (error) {
    console.error(`Error reading .flask-port file: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Try the fixed port 5338 first, then fall back to others if needed
  console.log('Trying fixed Flask port 5338 and other common ports...');
  for (const port of [5338, 5336, 5337, 5339, 5340, 5000]) {
    try {
      console.log(`Checking port ${port}...`);
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(750) // Slightly longer timeout for port scanning
      });
      
      if (response.ok) {
        console.log(`Found working Flask server on port ${port}`);
        
        // Write the port to file for future requests
        try {
          fs.writeFileSync(path.join(process.cwd(), '.flask-port'), String(port), 'utf8');
          console.log(`Saved detected port ${port} to .flask-port file`);
        } catch (writeError) {
          console.error(`Error saving port to .flask-port file: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
        }
        
        return port;
      }
    } catch (error) {
      // Ignore errors, just try next port
      console.log(`Port ${port} is not responsive: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // If we get here, no working Flask server was found
  console.error('No working Flask server found on any port');
  throw new Error('No working Flask server found');
}

export async function GET(request: NextRequest) {
  try {
    // Try to get port and fetch from Flask first
    try {
      const port = await getFlaskPort();
      console.log(`Trying Flask server on port ${port}`);
      
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
      console.error('Error connecting to Flask server:', flaskError);
      console.log('Using fallback test data instead');
      
      // Return the fallback data
      return NextResponse.json(FALLBACK_DATA);
    }
  } catch (error) {
    console.error('Unhandled error in API route:', error);
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