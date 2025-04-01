import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350, 5351, 5352, 5353, 5354, 5355, 5356, 5357, 5358, 5359, 5360, 5361, 5362, 5363, 5364, 5365, 5366, 5367, 5368, 5369, 5370, 5371, 5372, 5373, 5374, 5375, 5376, 5377, 5378, 5379, 5380, 5381, 5382, 5383, 5384, 5385, 5386, 5387, 5388, 5389, 5390, 5391, 5392, 5393, 5394, 5395, 5396, 5397, 5398, 5399];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// In-memory cache to store the working port
let cachedWorkingPort: number | null = null;
let lastPortCheckTime = 0;
const PORT_CACHE_TTL = 60000; // 1 minute

// Function to get the Flask server port from the stored file
async function getFlaskPortFromFile(): Promise<number | null> {
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const port = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
      console.log(`Read Flask port ${port} from .flask-port file`);
      return port;
    }
  } catch (error) {
    console.error(`Error reading .flask-port file:`, error);
  }
  return null;
}

// Function to find a working Flask port
async function findWorkingPort(): Promise<number | null> {
  // Check if there's a recent cached port
  const now = Date.now();
  if (cachedWorkingPort && (now - lastPortCheckTime < PORT_CACHE_TTL)) {
    return cachedWorkingPort;
  }
  
  // First try to get the port from the .flask-port file
  const filePort = await getFlaskPortFromFile();
  if (filePort) {
    try {
      const response = await axios.get(`http://localhost:${filePort}/status`, { 
        timeout: 500 
      });
      if (response.status === 200) {
        cachedWorkingPort = filePort;
        lastPortCheckTime = now;
        return filePort;
      }
    } catch (error: any) {
      console.error(`Configured port ${filePort} not working:`, error.message);
    }
  }
  
  // Then try the configured port from env
  const configuredPort = Number(process.env.FLASK_PORT || process.env.FLASK_SERVER_PORT || 5338);
  
  try {
    const response = await axios.get(`http://localhost:${configuredPort}/status`, { 
      timeout: 500 
    });
    if (response.status === 200) {
      cachedWorkingPort = configuredPort;
      lastPortCheckTime = now;
      return configuredPort;
    }
  } catch (error) {
    console.log(`Environment port ${configuredPort} not working, trying alternatives`);
  }
  
  // Try each port sequentially until one works
  for (const port of POSSIBLE_FLASK_PORTS) {
    if (port === configuredPort || port === filePort) continue; // Skip the ones we already tried
    
    try {
      const response = await axios.get(`http://localhost:${port}/status`, { 
        timeout: 300 // Short timeout for faster checking
      });
      if (response.status === 200) {
        console.log(`Found working Flask port: ${port}`);
        cachedWorkingPort = port;
        lastPortCheckTime = now;
        return port;
      }
    } catch (error) {
      // Port not working, try next one
    }
  }
  
  console.error('No working Flask port found');
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
  console.log(`Handling proxy request for path: ${path}, method: ${method}`);
  
  const workingPort = await findWorkingPort();
  
  if (!workingPort) {
    return NextResponse.json(
      { 
        error: 'No working Flask API server found',
        message: 'Please make sure the Flask server is running and check the diagnostics page',
        help: 'Visit /test/diagnostics for troubleshooting'
      },
      { status: 503 }
    );
  }
  
  // Construct URL to Flask with appropriate path prefix
  let url;
  if (path.startsWith('api/')) {
    url = `http://localhost:${workingPort}/${path}`;
  } else {
    url = `http://localhost:${workingPort}/api/${path}`;
  }
  
  console.log(`Proxying ${method} request to Flask: ${url}`);
  
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
    
    // Make the request to Flask
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
    
    // Log the response status and size
    console.log(`Flask responded with status: ${response.status}, size: ${response.data?.length || 0} bytes`);
    
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
    
    // Clear our cached port if we get certain error codes
    if (response.status >= 500) {
      cachedWorkingPort = null;
    }
    
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    
    // Clear the cached port on connection errors
    cachedWorkingPort = null;
    
    return NextResponse.json(
      { 
        error: 'Error proxying request to Flask API', 
        details: error instanceof Error ? error.message : String(error),
        path,
        url,
        suggestion: 'Visit /test/diagnostics to check the system status'
      }, 
      { status: 500 }
    );
  }
} 