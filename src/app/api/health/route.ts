import { NextResponse } from 'next/server';
import { getFlaskUrl, isBuildEnvironment } from '../../../utils/api';

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
        status: 'skipped', 
        message: 'Flask API check skipped in build/production environment' 
      };
      services.database = {
        status: 'simulated',
        message: 'Database connection simulated in build/production environment'
      };
      services.openai = {
        status: 'simulated',
        message: 'OpenAI API connection simulated in build/production environment'
      };
    } else {
      // Try to connect to Flask API for status check
      try {
        const flaskUrl = getFlaskUrl();
        console.log(`Health endpoint: Flask URL = ${flaskUrl || 'not available'}`);
        
        // If Flask URL is empty, skip the check
        if (!flaskUrl) {
          console.log('Flask URL is empty, skipping API check');
          services.flask = { 
            status: 'skipped', 
            message: 'Flask API check skipped (no Flask URL configured)' 
          };
          services.database = {
            status: 'unknown',
            message: 'Database status unknown without Flask'
          };
        } else {
          const statusUrl = `${flaskUrl}/api/status`;
          console.log(`Checking Flask API status at: ${statusUrl}`);
          
          // Add timeout to avoid hanging too long
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          try {
            const response = await fetch(statusUrl, {
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
          } catch (fetchError) {
            clearTimeout(timeoutId);
            console.error(`Error fetching Flask status from ${statusUrl}:`, fetchError);
            throw fetchError; // Re-throw to be caught by the outer try-catch
          }
        }
      } catch (error) {
        console.error('Error connecting to Flask API:', error);
        
        // Update Flask status based on error
        services.flask = {
          status: 'offline',
          message: `Failed to connect to Flask API: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
        
        // Use fallback data
        services.database = {
          status: 'unknown',
          message: 'Database status unknown (Flask connection failed)'
        };
        
        services.openai = {
          status: 'unknown',
          message: 'OpenAI status unknown (Flask connection failed)'
        };
      }
    }
    
    // Return complete health status
    return NextResponse.json({
      success: true,
      timestamp,
      services,
      environment: process.env.NODE_ENV || 'development',
      is_build: isBuildEnvironment()
    });
  } catch (error) {
    console.error('Error in health check:', error);
    
    // Return error response
    return NextResponse.json({
      success: false,
      timestamp,
      error: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      services,
      environment: process.env.NODE_ENV || 'development',
      is_build: isBuildEnvironment()
    }, { status: 500 });
  }
} 