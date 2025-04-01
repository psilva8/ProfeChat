import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function testFlaskConnection(port: number) {
  try {
    const startTime = Date.now();
    const response = await fetch(`http://localhost:${port}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const endTime = Date.now();
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        statusCode: response.status,
        responseTime: `${endTime - startTime}ms`,
        data
      };
    } else {
      return {
        success: false,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime: `${endTime - startTime}ms`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

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
  const flaskPort = await getFlaskPort();
  
  // Test the main Flask port
  const mainPortResult = await testFlaskConnection(flaskPort);
  
  // Test alternate ports in case the main one isn't working
  const results = {
    main: mainPortResult,
    alternates: {} as Record<string, any>
  };
  
  for (const port of [5336, 5337, 5338, 5339, 5340, 5000]) {
    if (port === flaskPort) continue; // Skip the main port we already tested
    
    results.alternates[`port_${port}`] = await testFlaskConnection(port);
  }
  
  return NextResponse.json({
    configuredPort: flaskPort,
    connectionTests: results,
    timestamp: new Date().toISOString()
  });
} 