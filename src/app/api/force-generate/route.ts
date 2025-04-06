import { NextResponse } from 'next/server';
import { directFlaskConnection } from '@/app/utils/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  console.log('FORCE-GENERATE API called - Using direct HTTP connection method');
  
  try {
    // Get request data
    const data = await request.json();
    console.log('Request data:', data);
    
    // Add timestamp for cache busting
    const timestamp = new Date().getTime();
    data._timestamp = timestamp;
    
    console.log('Using directFlaskConnection to bypass all middleware');
    
    try {
      const response = await directFlaskConnection('generate-lesson', data);
      console.log('Response received:', Object.keys(response).join(', '));
      
      // Determine what field to use
      let result;
      if (response.lesson_plan) {
        console.log('Using lesson_plan field');
        result = response.lesson_plan;
      } else if (response.data) {
        console.log('Using data field');
        result = response.data;
      } else {
        console.log('Using full response');
        result = JSON.stringify(response);
      }
      
      // Check for test messages
      if (result.includes('This is a test response generated when the Flask API is not available')) {
        console.error('ERROR: Still got test response even with direct connection');
      } else {
        console.log('SUCCESS: Got real data, not test response');
      }
      
      return NextResponse.json({ 
        response: result,
        success: true,
        method: 'direct-http'
      });
    } catch (error) {
      console.error('Direct connection failed:', error);
      return NextResponse.json({ 
        response: `Direct connection to Flask failed: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in force-generate API:', error);
    return NextResponse.json({ 
      response: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      success: false
    }, { status: 500 });
  }
} 