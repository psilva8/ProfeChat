import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
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
        // Verify the port is reachable
        try {
          const response = await fetch(`http://localhost:${port}/api/health`, { 
            method: 'GET',
            cache: 'no-store',
            signal: AbortSignal.timeout(500) // Timeout after 500ms
          });
          
          if (response.ok) {
            console.log(`Verified Flask server is reachable on port ${port}`);
            return port;
          } else {
            console.log(`Flask server on port ${port} responded with status ${response.status}`);
          }
        } catch (error) {
          console.error(`Error verifying Flask port ${port}: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        console.error(`Invalid port number in .flask-port file: "${portStr}"`);
      }
    } else {
      console.log('No .flask-port file found');
    }
  } catch (error) {
    console.error(`Error reading .flask-port file: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Next, try environment variable
  const envPort = process.env.FLASK_SERVER_PORT;
  if (envPort) {
    const port = parseInt(envPort, 10);
    if (!isNaN(port)) {
      console.log(`Found Flask port ${port} from environment variable`);
      try {
        // Verify the port is reachable
        const response = await fetch(`http://localhost:${port}/api/health`, { 
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(500) // Timeout after 500ms
        });
        
        if (response.ok) {
          console.log(`Verified Flask server is reachable on port ${port}`);
          return port;
        } else {
          console.log(`Flask server on port ${port} responded with status ${response.status}`);
        }
      } catch (error) {
        console.error(`Error verifying Flask port ${port}: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.error(`Invalid port number in environment variable: "${envPort}"`);
    }
  } else {
    console.log('No FLASK_SERVER_PORT environment variable found');
  }

  // Finally, try scanning common ports
  console.log('Trying common Flask ports...');
  for (const port of [5336, 5337, 5338, 5339, 5340, 5000]) {
    try {
      console.log(`Checking port ${port}...`);
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(750) // Slightly longer timeout for port scanning
      });
      
      if (response.ok) {
        console.log(`Found working Flask server on port ${port}`);
        
        // Write the port to file for future requests
        try {
          fs.writeFileSync(path.join(process.cwd(), '.flask-port'), String(port), 'utf8');
          console.log(`Saved detected port ${port} to .flask-port file`);
        } catch (writeError) {
          console.error(`Error saving port to .flask-port file: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
        }
        
        return port;
      }
    } catch (error) {
      // Ignore errors, just try next port
      console.log(`Port ${port} is not responsive: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // If we get here, no working Flask server was found
  console.error('No working Flask server found on any port');
  return 5336; // Default fallback
}

export async function GET(request: NextRequest) {
  try {
    const port = await getFlaskPort();
    console.log(`Trying Flask server on port ${port}`);
    
    const response = await fetch(`http://localhost:${port}/api/test-lesson-plans`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lesson plans from Flask API:', error);
    return NextResponse.json({ error: 'Failed to connect to Flask API' }, { status: 500 });
  }
} 