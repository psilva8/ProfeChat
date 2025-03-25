import { NextResponse } from 'next/server';

const FLASK_PORT = process.env.FLASK_PORT || 5336;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

export async function GET() {
  try {
    console.log(`[Health] GET request to Flask API`);
    
    const response = await fetch(`${FLASK_URL}/api/health`);
    console.log(`[Health] Response status: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Health] Failed to reach Flask backend:`, error);
    return NextResponse.json(
      { status: 'unhealthy', error: 'Failed to reach Flask backend' },
      { status: 500 }
    );
  }
} 