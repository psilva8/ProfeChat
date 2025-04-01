import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

// Sample rubrics data for testing
const TEST_RUBRICS = [
  {
    id: 'rubric-1',
    title: 'Algebra Problem Solving Rubric',
    grade: '8th Grade',
    created_at: '2023-03-30T14:30:00Z',
    subject: 'Math',
    assignment_type: 'Problem Set',
    content: {
      criteria: [
        {
          name: 'Mathematical Reasoning',
          levels: [
            { name: 'Excellent', points: 4, description: 'Shows complete understanding of the problem and uses logical, efficient strategies.' },
            { name: 'Proficient', points: 3, description: 'Shows substantial understanding of the problem and uses effective strategies.' },
            { name: 'Developing', points: 2, description: 'Shows some understanding of the problem but uses limited strategies.' },
            { name: 'Beginning', points: 1, description: 'Shows minimal understanding of the problem with ineffective strategies.' }
          ]
        },
        {
          name: 'Calculation Accuracy',
          levels: [
            { name: 'Excellent', points: 4, description: 'All calculations are correct and labeled appropriately.' },
            { name: 'Proficient', points: 3, description: 'Most calculations are correct with minor errors.' },
            { name: 'Developing', points: 2, description: 'Several calculation errors that affect the solution.' },
            { name: 'Beginning', points: 1, description: 'Major calculation errors throughout the work.' }
          ]
        },
        {
          name: 'Show Work',
          levels: [
            { name: 'Excellent', points: 4, description: 'All steps are clearly shown with exemplary organization.' },
            { name: 'Proficient', points: 3, description: 'Most steps are shown with good organization.' },
            { name: 'Developing', points: 2, description: 'Some steps are missing or work is disorganized.' },
            { name: 'Beginning', points: 1, description: 'Few steps are shown or work is very difficult to follow.' }
          ]
        }
      ]
    }
  },
  {
    id: 'rubric-2',
    title: 'Water Cycle Diagram Rubric',
    grade: '5th Grade',
    created_at: '2023-03-29T10:15:00Z',
    subject: 'Science',
    assignment_type: 'Diagram',
    content: {
      criteria: [
        {
          name: 'Scientific Accuracy',
          levels: [
            { name: 'Excellent', points: 4, description: 'All components of the water cycle are correctly labeled and accurately depicted.' },
            { name: 'Proficient', points: 3, description: 'Most components are correct with minor inaccuracies.' },
            { name: 'Developing', points: 2, description: 'Some components are missing or incorrectly labeled.' },
            { name: 'Beginning', points: 1, description: 'Many components are missing or incorrect.' }
          ]
        },
        {
          name: 'Diagram Clarity',
          levels: [
            { name: 'Excellent', points: 4, description: 'Diagram is extremely clear, organized, and easy to follow.' },
            { name: 'Proficient', points: 3, description: 'Diagram is clear and organized.' },
            { name: 'Developing', points: 2, description: 'Diagram is somewhat disorganized or unclear.' },
            { name: 'Beginning', points: 1, description: 'Diagram is disorganized and difficult to interpret.' }
          ]
        },
        {
          name: 'Presentation Quality',
          levels: [
            { name: 'Excellent', points: 4, description: 'Exceptional neatness, color usage, and overall visual appeal.' },
            { name: 'Proficient', points: 3, description: 'Good presentation with appropriate use of color and labels.' },
            { name: 'Developing', points: 2, description: 'Adequate presentation but lacks visual clarity.' },
            { name: 'Beginning', points: 1, description: 'Poor presentation with minimal effort in appearance.' }
          ]
        }
      ]
    }
  },
  {
    id: 'rubric-3',
    title: 'Sonnet Analysis Rubric',
    grade: '9th Grade',
    created_at: '2023-03-28T09:45:00Z',
    subject: 'English',
    assignment_type: 'Literary Analysis',
    content: {
      criteria: [
        {
          name: 'Comprehension',
          levels: [
            { name: 'Excellent', points: 4, description: 'Demonstrates thorough understanding of the sonnet\'s meaning and context.' },
            { name: 'Proficient', points: 3, description: 'Shows good understanding of the main meaning and some context.' },
            { name: 'Developing', points: 2, description: 'Shows basic understanding of the literal meaning only.' },
            { name: 'Beginning', points: 1, description: 'Shows confusion or misinterpretation of the sonnet.' }
          ]
        },
        {
          name: 'Analysis of Form',
          levels: [
            { name: 'Excellent', points: 4, description: 'Accurately identifies and analyzes all elements of sonnet structure and form.' },
            { name: 'Proficient', points: 3, description: 'Identifies most elements of structure with good analysis.' },
            { name: 'Developing', points: 2, description: 'Identifies some elements of structure with limited analysis.' },
            { name: 'Beginning', points: 1, description: 'Minimal identification of structural elements.' }
          ]
        },
        {
          name: 'Literary Devices',
          levels: [
            { name: 'Excellent', points: 4, description: 'Identifies and analyzes multiple literary devices with insightful interpretation.' },
            { name: 'Proficient', points: 3, description: 'Identifies several literary devices with appropriate analysis.' },
            { name: 'Developing', points: 2, description: 'Identifies few literary devices with basic analysis.' },
            { name: 'Beginning', points: 1, description: 'Minimal identification of literary devices.' }
          ]
        }
      ]
    }
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
  console.log('Handling GET request to /api/rubrics');
  
  try {
    // Add proper CORS headers
    return NextResponse.json({
      success: true,
      data: TEST_RUBRICS, // Changed from 'rubrics' to 'data' to match frontend expectations
      message: "Test data for diagnostic purposes"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error in rubrics GET endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch rubrics',
      data: [], // Include empty data array to prevent undefined errors
      message: error instanceof Error ? error.message : String(error)
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}

export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/rubrics');
  
  try {
    const requestData = await request.json();
    
    // Log the request for debugging
    console.log('Request data:', requestData);
    
    // In a real app, this would save the data to a database
    
    return NextResponse.json({
      success: true,
      message: "Rubric created successfully",
      data: requestData
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error in rubrics POST endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create rubric',
      data: null, // Include null data to prevent undefined errors
      message: error instanceof Error ? error.message : String(error)
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 