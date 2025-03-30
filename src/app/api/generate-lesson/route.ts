import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to get the Flask server port
async function getFlaskPort(): Promise<number> {
  try {
    // Try to read from the .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const port = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
      return port;
    }
  } catch (error) {
    console.error('Error reading Flask port file:', error);
  }

  // Try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    return parseInt(envPort, 10);
  }

  // Try common Flask ports
  for (const port of [5336, 5337, 5338, 5339, 5340, 5000]) {
    try {
      // Simple check if anything is listening on the port
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(500) // Timeout after 500ms
      });
      
      if (response.ok) {
        return port;
      }
    } catch (error) {
      // Ignoring errors, just trying next port
      continue;
    }
  }

  // Default fallback
  return 5336;
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const port = await getFlaskPort();
    console.log(`Forwarding lesson plan generation request to Flask on port ${port}`);
    
    const response = await fetch(`http://localhost:${port}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    // Create a test lesson plan entry that can be retrieved via test-lesson-plans
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating lesson plan from Flask API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to Flask API' }, 
      { status: 500 }
    );
  }
} 