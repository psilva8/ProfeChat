import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl } from '@/utils/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(`[Activities] POST request to Flask API with body:`, body);
    
    // Get the Flask URL from the utility function
    const flaskUrl = getFlaskUrl();
    
    if (!flaskUrl) {
      console.warn('[Activities] No Flask URL available, cannot connect to Flask backend');
      return NextResponse.json(
        { 
          success: false,
          data: [], // Empty data array for frontend compatibility
          activities: [], // Legacy format for compatibility
          error: 'Flask backend not available',
          message: 'Unable to connect to the Flask backend. The service may be in maintenance mode.'
        },
        { status: 503 }
      );
    }
    
    console.log(`[Activities] Connecting to Flask API at: ${flaskUrl}/api/generate-activities`);
    
    const response = await fetch(`${flaskUrl}/api/generate-activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`[Activities] Response status: ${response.status}`);
    const data = await response.json();
    
    // Ensure the response has both data and activities properties for compatibility
    if (data.success && !data.activities && data.data) {
      data.activities = data.data;
    } else if (data.success && !data.data && data.activities) {
      data.data = data.activities;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Activities] Failed to reach Flask backend:`, error);
    return NextResponse.json(
      { 
        success: false,
        data: [], // Empty data array for frontend compatibility
        activities: [], // Legacy format for compatibility
        error: 'Failed to reach Flask backend',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 