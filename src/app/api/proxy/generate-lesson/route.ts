import { NextRequest, NextResponse } from 'next/server';

const FLASK_PORT = process.env.FLASK_PORT || 5336;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(`[Lesson Plan] POST request to Flask API with body:`, body);
    
    const response = await fetch(`${FLASK_URL}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`[Lesson Plan] Response status: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Lesson Plan] Failed to reach Flask backend:`, error);
    return NextResponse.json(
      { error: 'Failed to reach Flask backend' },
      { status: 500 }
    );
  }
} 