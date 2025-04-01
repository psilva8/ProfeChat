import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl } from '@/utils/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(`[Unit Plan] POST request to Flask API with body:`, body);
    
    // Get the Flask URL from the utility function
    const flaskUrl = getFlaskUrl();
    
    if (!flaskUrl) {
      console.warn('[Unit Plan] No Flask URL available, cannot connect to Flask backend');
      return NextResponse.json(
        { 
          success: false,
          error: 'Flask backend not available',
          message: 'Unable to connect to the Flask backend. The service may be in maintenance mode.'
        },
        { status: 503 }
      );
    }
    
    console.log(`[Unit Plan] Connecting to Flask API at: ${flaskUrl}/api/generate-unit-plan`);
    
    const response = await fetch(`${flaskUrl}/api/generate-unit-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`[Unit Plan] Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`Flask API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Unit Plan] Failed to reach Flask backend:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reach Flask backend',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 