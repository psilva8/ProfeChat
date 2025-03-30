import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to get the Flask server port
async function getFlaskPort(): Promise<number> {
  console.log('Attempting to determine Flask server port');
  
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
    console.error(`Error reading .flask-port file`);
  }

  // Next, try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    const port = parseInt(envPort, 10);
    if (!isNaN(port)) {
      return port;
    }
  }

  // Default to common ports
  return 5336;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
): Promise<NextResponse> {
  try {
    const port = await getFlaskPort();
    const targetPath = pathSegments.join('/');
    
    console.log(`Handling proxy request for path: ${targetPath}`);
    
    // Special handling for endpoints with different paths in Flask vs Next.js
    let url: string;
    if (targetPath === 'activities') {
      url = `http://localhost:${port}/api/activities`;
    } else if (targetPath === 'lesson-plans') {
      url = `http://localhost:${port}/lesson-plans`;
    } else if (targetPath === 'test-lesson-plans') {
      url = `http://localhost:${port}/api/test-lesson-plans`; 
    } else {
      url = `http://localhost:${port}/api/${targetPath}`;
    }
    
    console.log(`Proxying ${method} request to Flask: ${url}`);

    // Forward the request to Flask
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body: method !== 'GET' && method !== 'HEAD' ? await request.text() : undefined,
      cache: 'no-store'
    });

    console.log(`Flask responded with status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`Flask responded with status: ${response.status}`);
      const errorData = await response.json().catch(() => ({ 
        error: `Flask server responded with status ${response.status}` 
      }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to Flask:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Flask API',
        details: error instanceof Error ? error.message : String(error),
        port: await getFlaskPort()
      }, 
      { status: 500 }
    );
  }
} 