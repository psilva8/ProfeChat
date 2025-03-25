import { NextResponse } from 'next/server';

const FLASK_PORT = process.env.FLASK_PORT || 5336;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

export async function GET() {
  try {
    const response = await fetch(`${FLASK_URL}/api/health`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Health] Error connecting to Flask backend:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: 'Failed to connect to Flask backend' },
      { status: 500 }
    );
  }
} 