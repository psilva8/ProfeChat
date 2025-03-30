import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Define the Flask server address with fallback options
const FLASK_BASE_PORT = parseInt(process.env.FLASK_PORT || '5336');
const FLASK_HOST = process.env.FLASK_HOST || 'localhost';

// Function to attempt connection on multiple Flask ports
// Exported for reuse in other modules
export async function tryFlaskConnection(path = '', options: RequestInit = {}) {
  let ports = [];
  
  // First try the environment variable port if available
  const envPort = process.env.FLASK_SERVER_PORT ? parseInt(process.env.FLASK_SERVER_PORT) : null;
  if (envPort) {
    ports.push(envPort);
  }
  
  // Then try reading from the .flask-port file if it exists
  try {
    // Use dynamic import to avoid Node.js API usage in the browser
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');
    
    const portFilePath = join(process.cwd(), '.flask-port');
    if (existsSync(portFilePath)) {
      const portFromFile = parseInt(readFileSync(portFilePath, 'utf8').trim());
      if (!isNaN(portFromFile) && !ports.includes(portFromFile)) {
        console.log(`Found Flask port ${portFromFile} from .flask-port file`);
        ports.push(portFromFile);
      }
    }
  } catch (error) {
    console.error('Error reading port file:', error);
    // Continue with other methods if file reading fails
  }
  
  // Finally, add the range of default ports to try
  const defaultPorts = [FLASK_BASE_PORT, FLASK_BASE_PORT + 1, FLASK_BASE_PORT + 2, FLASK_BASE_PORT + 3, FLASK_BASE_PORT + 4];
  for (const port of defaultPorts) {
    if (!ports.includes(port)) {
      ports.push(port);
    }
  }
  
  let lastError = null;
  
  for (const port of ports) {
    const url = `http://${FLASK_HOST}:${port}`;
    const fullUrl = path ? `${url}${path}` : url;
    
    try {
      console.log(`Trying Flask connection on ${fullUrl}`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per attempt
      
      const fetchOptions = {
        ...options,
        signal: controller.signal
      };
      
      if (path) {
        const response = await fetch(fullUrl, fetchOptions);
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Successfully connected to Flask on port ${port}`);
          return response;
        }
        
        // If we get a response but it's not OK, save the status
        lastError = new Error(`Flask server responded with status ${response.status}`);
      } else {
        // If no path specified, just check if the server is up
        const response = await fetch(`${url}/api/health`, { 
          method: 'GET',
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Successfully found Flask on port ${port}`);
          return url; // Just return the base URL if no path specified
        }
      }
    } catch (error) {
      console.error(`Failed to connect to Flask on port ${port}:`, error);
      lastError = error;
    }
  }
  
  // If we've tried all ports and none succeeded, throw or return null
  if (path) {
    throw lastError || new Error('Could not connect to Flask server on any port');
  } else {
    console.error('Could not connect to Flask server on any port');
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get the user session to check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Generating lesson plan with:', body);
    
    // Call Flask backend with multiple port attempts
    const flaskUrl = await tryFlaskConnection();
    
    if (!flaskUrl) {
      return NextResponse.json(
        { error: 'Could not connect to Flask API' },
        { status: 500 }
      );
    }
    
    const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Flask API returned status:', response.status);
      return NextResponse.json(
        { error: `Flask API error: ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('Flask API returned error:', data.error);
      throw new Error(data.error || 'Failed to generate lesson plan');
    }

    console.log('Successfully generated lesson plan from Flask API');

    // Save the lesson plan to the database
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: session.user.id,
        grade: body.grade,
        subject: body.subject,
        topic: body.topic,
        duration: parseInt(body.duration),
        objectives: body.objectives || '',
        content: data.lesson_plan,
      },
    });

    return NextResponse.json({
      success: true,
      id: lessonPlan.id,
      content: lessonPlan.content,
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 