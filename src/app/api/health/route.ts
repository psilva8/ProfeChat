import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Function to check if we're in a build environment
const isBuildEnvironment = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview' || 
         process.env.CI === 'true';
};

export async function GET() {
  console.log('Handling GET request to /api/health');
  
  // Initialize service statuses
  const services = {
    nextjs: {
      status: 'online',
      message: 'Next.js is running'
    },
    flask: {
      status: 'unknown',
      message: 'Flask API status not checked yet'
    },
    database: {
      status: 'unknown',
      message: 'Database status not checked yet'
    },
    openai: {
      status: 'unknown',
      message: 'OpenAI status not checked yet'
    }
  };
  
  const isBuild = isBuildEnvironment();
  const environment = process.env.NODE_ENV || 'development';
  
  try {
    // Skip Flask API check in build environments
    if (isBuild) {
      console.log('Skipping Flask API check in build environment');
      
      services.flask.status = 'skipped';
      services.flask.message = 'Flask API check skipped in build environment';
      
      // Simulate other services for consistency
      services.database.status = 'skipped';
      services.database.message = 'Database check skipped (Flask check skipped)';
      
      services.openai.status = 'skipped';
      services.openai.message = 'OpenAI check skipped (Flask check skipped)';
    } else {
      // Try to fetch from the Flask API
      console.log('Checking Flask API status...');
      
      try {
        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('http://localhost:5000/api/health', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          services.flask.status = 'online';
          services.flask.message = 'Flask API is running';
          
          // Update other services based on Flask response
          services.database.status = data.database?.status || 'unknown';
          services.database.message = data.database?.message || 'Database status returned by Flask';
          
          services.openai.status = data.openai?.status || 'unknown';
          services.openai.message = data.openai?.message || 'OpenAI status returned by Flask';
        } else {
          services.flask.status = 'error';
          services.flask.message = `Flask API returned error: ${response.status} ${response.statusText}`;
          
          services.database.status = 'unknown';
          services.database.message = 'Database status unknown (Flask API error)';
          
          services.openai.status = 'unknown';
          services.openai.message = 'OpenAI status unknown (Flask API error)';
        }
      } catch (error) {
        services.flask.status = 'offline';
        services.flask.message = `Failed to connect to Flask API: ${error instanceof Error ? error.message : 'fetch failed'}`;
        
        services.database.status = 'unknown';
        services.database.message = 'Database status unknown (Flask connection failed)';
        
        services.openai.status = 'unknown';
        services.openai.message = 'OpenAI status unknown (Flask connection failed)';
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      services,
      environment,
      is_build: isBuild
    });
  } catch (error) {
    console.error('Error in health endpoint:', error);
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: 'Failed to check health',
      message: error instanceof Error ? error.message : String(error),
      environment,
      is_build: isBuild
    }, { status: 500 });
  }
} 