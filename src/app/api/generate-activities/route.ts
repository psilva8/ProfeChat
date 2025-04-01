import { NextRequest, NextResponse } from 'next/server';
import { generateActivities } from '@/services/curriculumService';

export const dynamic = 'force-dynamic';

/**
 * Handler for generating learning activities based on curriculum data
 * This endpoint uses the PDF-parsed curriculum data
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Extract parameters
    const { subject, grade, topic } = body;
    
    // Validate required fields
    if (!subject || !grade || !topic) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: subject, grade, and topic are required' 
      }, { status: 400 });
    }
    
    // Log the request
    console.log(`Generating activities for: ${subject}, ${grade}, ${topic}`);
    
    // Generate activities using the curriculum service
    const activities = await generateActivities(subject, grade, topic);
    
    // Return the generated activities
    return NextResponse.json({ 
      success: true, 
      data: activities
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error generating activities:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate activities' 
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

/**
 * Handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
} 