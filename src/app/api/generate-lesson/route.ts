import { NextRequest, NextResponse } from 'next/server';
import { generateLessonPlan } from '@/services/curriculumService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Handler for generating a lesson plan based on curriculum data
 * This endpoint pulls from the local PDF-parsed curriculum data
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Get required parameters
    const { subject, competency, grade, topic } = body;
    
    // Validate required fields
    if (!subject || !competency || !grade || !topic) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: subject, competency, grade, and topic are required' 
      }, { status: 400 });
    }
    
    // Log the request
    console.log(`Generating lesson plan for: ${subject}, ${competency}, ${grade}, ${topic}`);
    
    // Generate the lesson plan using the curriculum service
    const lessonPlan = await generateLessonPlan(subject, competency, grade, topic);
    
    // Return the generated lesson plan
    return NextResponse.json({ 
      success: true, 
      data: lessonPlan 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate lesson plan' 
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