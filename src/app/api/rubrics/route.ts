import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

// Fallback data for when Flask is unavailable
const FALLBACK_DATA = [
  {
    "id": "rub-1",
    "title": "Essay Writing Rubric",
    "criteria": [
      {
        "name": "Content",
        "levels": [
          { "name": "Excellent", "description": "Thorough and insightful content", "points": 10 },
          { "name": "Good", "description": "Adequate content with some insight", "points": 8 },
          { "name": "Satisfactory", "description": "Basic content with limited insight", "points": 6 },
          { "name": "Needs Improvement", "description": "Minimal content lacking insight", "points": 4 }
        ]
      },
      {
        "name": "Organization",
        "levels": [
          { "name": "Excellent", "description": "Well-organized with clear structure", "points": 10 },
          { "name": "Good", "description": "Mostly organized with some structural issues", "points": 8 },
          { "name": "Satisfactory", "description": "Basic organization with several issues", "points": 6 },
          { "name": "Needs Improvement", "description": "Poor organization with minimal structure", "points": 4 }
        ]
      },
      {
        "name": "Language",
        "levels": [
          { "name": "Excellent", "description": "Sophisticated language with no errors", "points": 10 },
          { "name": "Good", "description": "Appropriate language with few errors", "points": 8 },
          { "name": "Satisfactory", "description": "Simple language with several errors", "points": 6 },
          { "name": "Needs Improvement", "description": "Inappropriate language with many errors", "points": 4 }
        ]
      }
    ],
    "grade": "10th Grade",
    "subject": "English",
    "created_at": "2023-03-29T14:30:00Z"
  },
  {
    "id": "rub-2",
    "title": "Science Project Rubric",
    "criteria": [
      {
        "name": "Research",
        "levels": [
          { "name": "Excellent", "description": "Thorough research from multiple sources", "points": 10 },
          { "name": "Good", "description": "Adequate research from several sources", "points": 8 },
          { "name": "Satisfactory", "description": "Basic research from limited sources", "points": 6 },
          { "name": "Needs Improvement", "description": "Minimal research from few sources", "points": 4 }
        ]
      },
      {
        "name": "Methodology",
        "levels": [
          { "name": "Excellent", "description": "Well-designed methodology", "points": 10 },
          { "name": "Good", "description": "Appropriate methodology with minor issues", "points": 8 },
          { "name": "Satisfactory", "description": "Basic methodology with several issues", "points": 6 },
          { "name": "Needs Improvement", "description": "Flawed methodology", "points": 4 }
        ]
      },
      {
        "name": "Presentation",
        "levels": [
          { "name": "Excellent", "description": "Engaging and professional presentation", "points": 10 },
          { "name": "Good", "description": "Clear and organized presentation", "points": 8 },
          { "name": "Satisfactory", "description": "Basic but understandable presentation", "points": 6 },
          { "name": "Needs Improvement", "description": "Confusing or incomplete presentation", "points": 4 }
        ]
      }
    ],
    "grade": "8th Grade",
    "subject": "Science",
    "created_at": "2023-03-28T10:15:00Z"
  }
];

// Helper function to get the Flask server port
async function getFlaskPort(): Promise<number> {
  try {
    // Try to read from the .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const port = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
      return port;
    }
  } catch (error) {
    console.error('Error reading Flask port file:', error);
  }

  // Default fallback
  return 5338;
}

export async function GET(request: NextRequest) {
  try {
    // Try to get port and fetch from Flask first
    try {
      const port = await getFlaskPort();
      console.log(`Trying Flask server on port ${port}`);
      
      const response = await fetch(`http://localhost:${port}/api/rubrics`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });

      if (!response.ok) {
        throw new Error(`Flask server responded with status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (flaskError) {
      // Log the Flask error but continue to fallback
      console.error('Error connecting to Flask server:', flaskError);
      console.log('Using fallback rubrics data instead');
      
      // Return the fallback data
      return NextResponse.json(FALLBACK_DATA);
    }
  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 