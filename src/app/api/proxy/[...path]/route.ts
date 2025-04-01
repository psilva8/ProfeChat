import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Function to find a working Flask port
async function findWorkingPort(): Promise<number | null> {
  // First try the configured port
  const configuredPort = Number(process.env.FLASK_PORT || 5338);
  
  try {
    const response = await axios.get(`http://localhost:${configuredPort}/status`, { 
      timeout: 1000 
    });
    if (response.status === 200) {
      return configuredPort;
    }
  } catch (error) {
    // Configured port not working, try alternatives
  }
  
  // Try each port sequentially until one works
  for (const port of POSSIBLE_FLASK_PORTS) {
    if (port === configuredPort) continue; // Skip the one we already tried
    
    try {
      const response = await axios.get(`http://localhost:${port}/status`, { 
        timeout: 1000
      });
      if (response.status === 200) {
        return port;
      }
    } catch (error) {
      // Port not working, try next one
    }
  }
  
  return null; // No working port found
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
) {
  const path = pathSegments.join('/');
  const workingPort = await findWorkingPort();
  
  if (!workingPort) {
    return NextResponse.json(
      { error: 'No working Flask API server found. Please check if the Flask server is running.' },
      { status: 503 }
    );
  }
  
  const url = `http://localhost:${workingPort}/${path}`;
  const requestHeaders = Object.fromEntries(request.headers);
  let requestBody = null;
  
  try {
    if (['POST', 'PUT'].includes(method)) {
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        requestBody = await request.json();
      } else {
        requestBody = await request.text();
      }
    }
    
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers: {
        ...requestHeaders,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1',
      },
      data: requestBody,
      responseType: 'arraybuffer',
      timeout: 30000,
      validateStatus: () => true, // Return the response regardless of status code
    });
    
    // Convert the arraybuffer to a Buffer
    const data = Buffer.from(response.data);
    
    // Create a Response with the appropriate status and headers
    const headers = new Headers();
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      }
    });
    
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    
    return NextResponse.json(
      { 
        error: 'Error proxying request to Flask API', 
        details: error instanceof Error ? error.message : String(error),
        path,
        url
      }, 
      { status: 500 }
    );
  }
} 