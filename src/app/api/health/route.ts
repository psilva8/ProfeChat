import { NextResponse } from 'next/server';
import { getFlaskUrl, isBuildEnvironment as isProductionBuild } from '@/app/utils/api';

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
  
  const isBuild = isProductionBuild();
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
      
      // Get the Flask URL
      const flaskUrl = getFlaskUrl();
      console.log(`Using Flask URL: ${flaskUrl}`);
      
      if (!flaskUrl) {
        console.log('No Flask URL available, Flask server may not be running');
        services.flask.status = 'offline';
        services.flask.message = 'Flask server not running (no Flask port detected)';
        
        services.database.status = 'offline';
        services.database.message = 'Database unavailable (Flask server not running)';
        
        services.openai.status = 'offline';
        services.openai.message = 'OpenAI unavailable (Flask server not running)';
      } else {
        try {
          // Add a timeout to the fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const healthUrl = `${flaskUrl}/api/health`;
          console.log(`Checking Flask health at: ${healthUrl}`);
          
          const response = await fetch(healthUrl, {
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
            // Check if we got a 403 Forbidden, which might indicate a non-Flask service
            if (response.status === 403) {
              services.flask.status = 'conflict';
              services.flask.message = `Port ${flaskUrl.split(':')[2].split('/')[0]} is in use by another service (received 403 Forbidden)`;
            } else {
              services.flask.status = 'error';
              services.flask.message = `Flask API returned error: ${response.status} ${response.statusText}`;
            }
            
            services.database.status = 'offline';
            services.database.message = 'Database unavailable (Flask API error)';
            
            services.openai.status = 'offline';
            services.openai.message = 'OpenAI unavailable (Flask API error)';
          }
        } catch (error) {
          services.flask.status = 'offline';
          services.flask.message = `Failed to connect to Flask API: ${error instanceof Error ? error.message : 'fetch failed'}`;
          
          services.database.status = 'offline';
          services.database.message = 'Database unavailable (Flask connection failed)';
          
          services.openai.status = 'offline';
          services.openai.message = 'OpenAI unavailable (Flask connection failed)';
        }
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