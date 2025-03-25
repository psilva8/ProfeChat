import { NextResponse } from 'next/server';

// Get the port from environment or use 5336 as default
const FLASK_PORT = process.env.FLASK_PORT || 5336;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

export async function GET() {
  try {
    console.log(`[Health] Checking Flask API health at ${FLASK_URL}/api/health`);
    
    const response = await fetch(`${FLASK_URL}/api/health`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log(`[Health] Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`Flask API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Health] Error connecting to Flask backend:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Failed to connect to Flask backend',
        details: error instanceof Error ? error.message : String(error),
        flask_url: FLASK_URL
      },
      { status: 500 }
    );
  }
} 