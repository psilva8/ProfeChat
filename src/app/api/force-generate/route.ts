import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  console.log('FORCE-GENERATE API called - NO ENVIRONMENT CHECKS');
  
  try {
    // Get request data
    const data = await request.json();
    console.log('Request data:', data);
    
    // Directly use port 5338 - no env checks, no file reading
    const flaskUrl = 'http://localhost:5338';
    console.log(`Direct connection to ${flaskUrl}/api/generate-lesson`);
    
    const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        subject: data.subject || 'General',
        grade: data.grade || 'PRIMARIA',
        topic: data.message || data.topic || '',
        objectives: data.objectives || 'Responder a la consulta del usuario',
        duration: data.duration || '30 minutos'
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Flask API error: ${response.status}`);
      return NextResponse.json({ 
        response: 'Error connecting to Flask API. Status: ' + response.status,
        success: false
      }, { status: 500 });
    }
    
    const responseData = await response.json();
    console.log('Got successful response from Flask!');
    
    // Determine what field to use
    let result;
    if (responseData.lesson_plan) {
      console.log('Using lesson_plan field');
      result = responseData.lesson_plan;
    } else if (responseData.data) {
      console.log('Using data field');
      result = responseData.data;
    } else {
      console.log('Using full response');
      result = JSON.stringify(responseData);
    }
    
    return NextResponse.json({ 
      response: result,
      success: true
    });
  } catch (error) {
    console.error('Error in force-generate API:', error);
    return NextResponse.json({ 
      response: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      success: false
    }, { status: 500 });
  }
} 