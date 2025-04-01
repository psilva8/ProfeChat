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
      console.log(`Found Flask port ${port} in .flask-port file`);
      return port;
    }
  } catch (error) {
    console.error('Error reading Flask port file:', error);
  }

  // Try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    console.log(`Found Flask port ${envPort} in environment variable`);
    return parseInt(envPort, 10);
  }

  // Try common Flask ports
  for (const port of [5336, 5337, 5338, 5339, 5340, 5000]) {
    try {
      console.log(`Trying Flask port ${port}...`);
      // Simple check if anything is listening on the port
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(500) // Timeout after 500ms
      });
      
      if (response.ok) {
        console.log(`Found active Flask server on port ${port}`);
        return port;
      }
    } catch (error) {
      console.log(`Port ${port} check failed: ${error instanceof Error ? error.message : String(error)}`);
      // Ignoring errors, just trying next port
      continue;
    }
  }

  // Default fallback
  console.log(`No Flask server found, defaulting to port 5338`);
  return 5338;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Generate lesson route called');
    const requestData = await request.json();
    console.log(`Request data:`, requestData);
    
    const port = await getFlaskPort();
    console.log(`Forwarding lesson plan generation request to Flask on port ${port}`);
    
    const url = `http://localhost:${port}/api/generate-lesson`;
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log(`Flask API response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = JSON.stringify(errorData);
      } catch (e) {
        errorMessage = response.statusText;
      }
      console.error(`Error from Flask API: ${errorMessage}`);
      return NextResponse.json(
        { success: false, error: `API Error: ${errorMessage}` }, 
        { status: response.status }
      );
    }

    try {
      const data = await response.json();
      console.log('Successfully received response from Flask API');
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('Error parsing JSON from Flask API:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON response from API' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('Error generating lesson plan from Flask API:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to Flask API',
        details: errorMessage,
        stack: errorStack
      }, 
      { status: 500 }
    );
  }
} 