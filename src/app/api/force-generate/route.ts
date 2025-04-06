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
    
    // Add a timestamp to help with debugging
    const timestamp = new Date().toISOString();
    console.log(`Request timestamp: ${timestamp}`);
    
    // Directly use port 5338 - no env checks, no file reading
    const flaskUrl = 'http://localhost:5338';
    console.log(`Direct connection to ${flaskUrl}/api/generate-lesson`);
    
    // Try to connect with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
    try {
      console.log('Sending request to Flask API...');
      const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({
          subject: data.subject || 'General',
          grade: data.grade || 'PRIMARIA',
          topic: data.message || data.topic || '',
          objectives: data.objectives || 'Responder a la consulta del usuario',
          duration: data.duration || '30 minutos',
          _timestamp: timestamp // Include timestamp for debugging
        }),
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Flask API response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`Flask API error: ${response.status}`);
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        return NextResponse.json({ 
          response: `Error connecting to Flask API. Status: ${response.status}. Details: ${errorText}`,
          success: false
        }, { status: 500 });
      }
      
      // Check if we got a valid JSON response
      const responseText = await response.text();
      console.log(`Response text (first 100 chars): ${responseText.substring(0, 100)}...`);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Successfully parsed JSON response');
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return NextResponse.json({ 
          response: `Error parsing Flask API response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}. Raw response: ${responseText.substring(0, 200)}...`,
          success: false
        }, { status: 500 });
      }
      
      console.log('Response data keys:', Object.keys(responseData).join(', '));
      
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
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Request to Flask API timed out after 15 seconds');
        return NextResponse.json({ 
          response: 'Request to Flask API timed out. Please check if the Flask server is running correctly.',
          success: false
        }, { status: 504 });
      }
      throw fetchError; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Error in force-generate API:', error);
    return NextResponse.json({ 
      response: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      success: false
    }, { status: 500 });
  }
} 