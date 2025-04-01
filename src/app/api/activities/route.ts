import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to get the Flask server port
async function getFlaskPort(): Promise<number> {
  try {
    // First try to read from the .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portStr = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portStr, 10);
      if (!isNaN(port)) {
        console.log(`Found Flask port ${port} from .flask-port file`);
        return port;
      }
    }
  } catch (error) {
    console.error(`Error reading .flask-port file: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Next, try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    const port = parseInt(envPort, 10);
    if (!isNaN(port)) {
      return port;
    }
  }

  // Default to port 5338
  return 5338;
}

// Fallback data if Flask is unavailable
const FALLBACK_DATA = [
  {
    "id": "activity-1",
    "title": "Group Discussion on Literary Themes",
    "subject": "English",
    "grade": "High School",
    "duration": 30,
    "description": "Students form groups to discuss major themes in the assigned reading"
  },
  {
    "id": "activity-2",
    "title": "Science Experiment: Plant Growth",
    "subject": "Science",
    "grade": "Elementary",
    "duration": 45,
    "description": "Students observe and record plant growth under different conditions"
  },
  {
    "id": "activity-3",
    "title": "Math Problem Solving Challenge",
    "subject": "Mathematics",
    "grade": "Middle School",
    "duration": 25,
    "description": "Students work in pairs to solve real-world math problems"
  }
];

// Sample activities data for testing
const TEST_ACTIVITIES = [
  {
    id: "activity-1",
    title: "Group Problem Solving",
    grade: "8th Grade",
    duration: 20,
    created_at: "2023-03-30T14:30:00Z",
    subject: "Math",
    content: {
      description: "Students work in groups to solve algebraic equations.",
      objectives: "Develop collaborative problem-solving skills and reinforce algebraic concepts.",
      materials: "Worksheet with 10 algebra problems, calculators",
      instructions: "Divide students into groups of 3-4. Each group must solve all problems and explain their reasoning.",
      assessment: "Groups present solutions to one assigned problem."
    }
  },
  {
    id: "activity-2",
    title: "Water Cycle Diagram",
    grade: "5th Grade",
    duration: 30,
    created_at: "2023-03-29T10:15:00Z",
    subject: "Science",
    content: {
      description: "Students create a labeled diagram of the water cycle.",
      objectives: "Visualize and explain the stages of the water cycle.",
      materials: "Blank paper, colored pencils, water cycle reference",
      instructions: "Students should include evaporation, condensation, precipitation, and collection in their diagrams.",
      assessment: "Accuracy and completeness of labels and processes."
    }
  },
  {
    id: "activity-3",
    title: "Sonnet Analysis Workshop",
    grade: "9th Grade",
    duration: 45,
    created_at: "2023-03-28T09:45:00Z",
    subject: "English",
    content: {
      description: "Small groups analyze the structure, language, and themes of assigned sonnets.",
      objectives: "Identify and interpret literary devices in sonnets.",
      materials: "Copies of Shakespeare's sonnets, annotation guide",
      instructions: "Each group analyzes one sonnet and presents their findings to the class.",
      assessment: "Quality of analysis and presentation."
    }
  }
];

export async function GET(request: NextRequest) {
  console.log('Handling GET request to /api/activities');
  
  // Add proper CORS headers
  return NextResponse.json({
    success: true,
    activities: TEST_ACTIVITIES,
    message: "Test data for diagnostic purposes"
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/activities');
  
  try {
    const data = await request.json();
    
    // Log the request for debugging
    console.log('Request data:', data);
    
    // In a real app, this would save the data to a database
    
    return NextResponse.json({
      success: true,
      message: "Activity created successfully",
      data: data
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error in activities POST endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create activity',
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