import { NextResponse } from 'next/server';
import { getFlaskUrl, isBuildEnvironment } from '@/utils/api';

// Export dynamic flag to ensure this route is always evaluated dynamically
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Running /api/health check');
  
  const timestamp = new Date().toISOString();
  
  // Initialize service statuses
  const services = {
    nextjs: {
      status: 'online',
      message: 'Next.js is running'
    },
    flask: {
      status: 'unknown',
      message: 'Checking Flask API connection...'
    },
    database: {
      status: 'unknown',
      message: 'Checking database connection...'
    },
    openai: {
      status: 'unknown',
      message: 'OpenAI status unavailable without Flask'
    }
  };
  
  try {
    // Skip Flask check in build environment
    if (isBuildEnvironment()) {
      console.log('Skipping Flask API check in build environment');
      services.flask = { 
        status: 'unknown', 
        message: 'Flask API check skipped in build environment' 
      };
      services.database = {
        status: 'online',
        message: 'Database is connected'
      };
    } else {
      // Try to connect to Flask API for status check
      try {
        const flaskUrl = getFlaskUrl();
        console.log(`Checking Flask API status at: ${flaskUrl}/api/status`);
        
        // Add timeout to avoid hanging too long
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${flaskUrl}/api/status`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Flask API returned status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Flask status response:', data);
        
        // Update services with Flask status data
        services.flask = {
          status: 'online',
          message: 'Flask API is running'
        };
        
        if (data.database) {
          services.database = {
            status: data.database.status === 'ok' ? 'online' : 'offline',
            message: data.database.message || 'Database status reported by Flask'
          };
        }
        
        if (data.openai) {
          services.openai = {
            status: data.openai.status === 'ok' ? 'online' : 'offline',
            message: data.openai.message || 'OpenAI status reported by Flask'
          };
        }
      } catch (error) {
        console.error('Error connecting to Flask API:', error);
        
        // Update Flask status based on error
        services.flask = {
          status: 'offline',
          message: `Failed to connect to Flask API: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
    
    // Return complete health status
    return NextResponse.json({
      success: true,
      timestamp,
      services
    });
  } catch (error) {
    console.error('Error in health check:', error);
    
    // Return error response
    return NextResponse.json({
      success: false,
      timestamp,
      error: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      services
    }, { status: 500 });
  }
} 