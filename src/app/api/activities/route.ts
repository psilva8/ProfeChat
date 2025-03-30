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

// Fallback data if Flask is unavailable
const FALLBACK_DATA = [
  {
    "id": "activity-1",
    "title": "Group Discussion on Literary Themes",
    "subject": "English",
    "grade": "High School",
    "duration": 30,
    "description": "Students form groups to discuss major themes in the assigned reading"
  },
  {
    "id": "activity-2",
    "title": "Science Experiment: Plant Growth",
    "subject": "Science",
    "grade": "Elementary",
    "duration": 45,
    "description": "Students observe and record plant growth under different conditions"
  },
  {
    "id": "activity-3",
    "title": "Math Problem Solving Challenge",
    "subject": "Mathematics",
    "grade": "Middle School",
    "duration": 25,
    "description": "Students work in pairs to solve real-world math problems"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Try to get port and fetch from Flask first
    try {
      const port = await getFlaskPort();
      console.log(`Fetching activities from Flask server on port ${port}`);
      
      const response = await fetch(`http://localhost:${port}/api/activities`, {
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
      console.error('Error connecting to Flask server for activities:', flaskError);
      console.log('Using fallback activities data instead');
      
      // Return the fallback data
      return NextResponse.json(FALLBACK_DATA);
    }
  } catch (error) {
    console.error('Unhandled error in activities API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 