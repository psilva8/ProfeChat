import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Function to check if we're in a build environment
const isBuildEnvironment = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview' || 
         process.env.CI === 'true';
};

// Function to handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function GET() {
  console.log('Handling GET request to /api/direct-test');
  
  const environment = process.env.NODE_ENV || 'development';
  const isBuild = isBuildEnvironment();
  
  try {
    // Try to get the Flask port from file
    let flaskPort: string | null = null;
    let flaskPortSource = 'Not found';
    
    try {
      const portFile = path.join(process.cwd(), '.flask-port');
      if (fs.existsSync(portFile)) {
        flaskPort = fs.readFileSync(portFile, 'utf8').trim();
        flaskPortSource = '.flask-port file';
        console.log(`Found Flask port ${flaskPort} in .flask-port file`);
      } else {
        console.log('No .flask-port file found');
        
        // Try environment variable as fallback
        if (process.env.FLASK_PORT) {
          flaskPort = process.env.FLASK_PORT;
          flaskPortSource = 'FLASK_PORT environment variable';
          console.log(`Using Flask port ${flaskPort} from environment variable`);
        } else {
          console.log('No FLASK_PORT environment variable found');
        }
      }
    } catch (error) {
      console.error('Error determining Flask port:', error);
    }
    
    // Get configured API routes
    const apiRoutes = {
      health: '/api/health',
      curriculum: '/api/curriculum',
      activities: '/api/activities',
      rubrics: '/api/rubrics',
      generate_activities: '/api/generate-activities',
      generate_lesson: '/api/generate-lesson'
    };
    
    // Return status information
    return NextResponse.json({
      success: true,
      message: 'Direct test endpoint is working',
      timestamp: new Date().toISOString(),
      environment,
      is_build: isBuild,
      nextjs: {
        port: process.env.PORT || 3000,
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV || 'Not set'
      },
      flask: {
        configured_port: flaskPort || 'Not configured',
        port_source: flaskPortSource,
        url: flaskPort ? `http://localhost:${flaskPort}` : 'Not available',
        available: isBuild ? 'skipped in build' : (flaskPort ? 'potentially available' : 'not configured')
      },
      apis: apiRoutes
    });
  } catch (error) {
    console.error('Error in direct-test endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to run direct test',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      environment,
      is_build: isBuildEnvironment()
    }, { status: 500 });
  }
} 