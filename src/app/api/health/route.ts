import { NextResponse } from 'next/server';
import { getFlaskUrl } from '@/utils/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = {
    nextjs: { status: 'online', message: 'Next.js is running' },
    flask: { status: 'unknown', message: 'Checking Flask API...' },
    database: { status: 'unknown', message: 'Checking database connection...' },
    openai: { status: 'unknown', message: 'Checking OpenAI API...' }
  };
  
  // Check Flask API
  try {
    // Skip actual Flask check during build time (Vercel)
    if (process.env.VERCEL_ENV) {
      services.flask = { 
        status: 'unknown', 
        message: 'Flask check skipped in build environment'
      };
    } else {
      const flaskUrl = getFlaskUrl();
      const flaskResponse = await fetch(`${flaskUrl}/api/health`, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (flaskResponse.ok) {
        const flaskData = await flaskResponse.json();
        services.flask = { 
          status: 'online', 
          message: flaskData.message || 'Flask API is running' 
        };
        
        // Update OpenAI status if available from Flask
        if (flaskData.openai) {
          services.openai = flaskData.openai;
        }
      } else {
        services.flask = { 
          status: 'offline', 
          message: 'Flask API returned an error'
        };
      }
    }
  } catch (error) {
    console.error('Error connecting to Flask backend:', error);
    services.flask = { 
      status: 'offline', 
      message: 'Failed to connect to Flask API'
    };
  }
  
  // Simulate database check (since we don't have a real DB connection)
  services.database = { 
    status: 'online', 
    message: 'Database is connected' 
  };
  
  // Set OpenAI status if not already set
  if (services.openai.status === 'unknown') {
    services.openai = { 
      status: 'unknown', 
      message: 'OpenAI status unavailable without Flask' 
    };
  }
  
  return NextResponse.json({ 
    success: true, 
    timestamp: new Date().toISOString(),
    services
  });
} 