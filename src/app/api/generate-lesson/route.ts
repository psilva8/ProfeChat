import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData, callApi } from '@/app/utils/api';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Function to handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Helper function to generate a test lesson plan
function generateTestLessonPlan(subject: string, grade: string, topic: string, competency?: string) {
  return {
    lesson_plan: `# Lesson Plan: ${topic} for ${grade} ${subject}

## Overview
This is a sample lesson plan generated for teaching ${topic} to ${grade} students in ${subject}.

## Objectives
- Students will understand the key concepts of ${topic}
- Students will be able to apply these concepts in practical exercises
- Students will develop critical thinking skills related to ${topic}

## Materials
- Textbooks
- Worksheets
- Interactive materials
- Digital resources

## Lesson Structure
1. **Introduction (10 minutes)**
   - Begin with an engaging activity to introduce ${topic}
   - Connect to students' prior knowledge

2. **Main Lesson (25 minutes)**
   - Present key concepts using visual aids
   - Guide students through examples

3. **Practice Activities (15 minutes)**
   - Students work in pairs or small groups
   - Teacher provides support and guidance

4. **Assessment (5 minutes)**
   - Quick check for understanding
   - Exit ticket with key questions

5. **Closure (5 minutes)**
   - Summarize key learning points
   - Preview next lesson

## Assessment Methods
- Formative assessment during practice activities
- Exit ticket responses
- Homework assignment

## Differentiation
- For advanced students: Additional challenging problems
- For students needing support: Simplified examples and additional guidance

Note: This is a test response generated when the Flask API is not available.`,
    success: true
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Generate-lesson API called');
    
    const data = await request.json();
    const { subject, grade, topic, objectives, duration } = data;

    console.log(`Generate request for: ${subject}, ${grade}, ${topic}`);

    // Use the callApi utility function to handle the request
    const testData = generateTestLessonPlan(
      subject || 'General', 
      grade || 'All Grades', 
      topic || 'General Subject'
    );

    const responseData = await callApi('generate-lesson', {
      subject: subject || 'General',
      grade: grade || 'PRIMARIA',
      topic: topic || '',
      objectives: objectives || 'Responder a la consulta del usuario',
      duration: duration || '30 minutos'
    }, testData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in generate-lesson API:', error);
    return NextResponse.json({ 
      lesson_plan: `# Error generating lesson plan\n\nWe encountered an error while generating your lesson plan. Please try again later.`,
      success: false
    }, { status: 200 }); // Return 200 with error message instead of 500
  }
}

// Get Flask URL directly from .flask-port file without any logic
function getFlaskUrlDirect(): string {
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portContent, 10);
      if (!isNaN(port) && port > 0 && port < 65536) {
        console.log(`Found Flask port ${port} in .flask-port file`);
        return `http://localhost:${port}`;
      }
    }
    
    console.log('No valid port in .flask-port, using default 5338');
    return 'http://localhost:5338';
  } catch (error) {
    console.error('Error reading .flask-port:', error);
    return '';
  }
} 