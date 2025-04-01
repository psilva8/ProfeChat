import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get information about the environment
    const nodeEnv = process.env.NODE_ENV || 'development';
    const nextVersion = process.env.NEXT_VERSION || 'unknown';
    
    // Check for Flask port configuration
    let flaskPort;
    try {
      const portFile = path.join(process.cwd(), '.flask-port');
      if (fs.existsSync(portFile)) {
        flaskPort = fs.readFileSync(portFile, 'utf8').trim();
      } else {
        flaskPort = 'File not found';
      }
    } catch (error) {
      flaskPort = `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    // Check Flask API availability
    let flaskHealth = 'Not checked';
    try {
      for (const port of [flaskPort, '5338', '5336', '5337', '5000']) {
        if (!port || port === 'File not found' || port.startsWith('Error')) continue;
        
        try {
          const timeout = 1000;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          const response = await fetch(`http://localhost:${port}/api/health`, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            flaskHealth = `Available on port ${port}: ${JSON.stringify(data)}`;
            break;
          }
        } catch (portError) {
          console.error(`Error checking port ${port}:`, portError);
          // Continue to next port
        }
      }
    } catch (error) {
      flaskHealth = `Error checking health: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    // Get request headers for troubleshooting
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const host = headersList.get('host') || 'Unknown';
    
    // Get Next.js configuration
    const nextConfig = {
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
      apiBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || '',
    };
    
    return NextResponse.json({
      nextjs: {
        version: nextVersion,
        nodeEnv,
        config: nextConfig
      },
      flask: {
        configuredPort: flaskPort,
        health: flaskHealth
      },
      request: {
        userAgent,
        host
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get configuration', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }, 
      { status: 500 }
    );
  }
} 