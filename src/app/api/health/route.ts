import { NextResponse } from 'next/server';
import { getFlaskUrl, isBuildEnvironment } from '@/app/utils/api';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('Handling GET request to /api/health');
  console.log(`Current Node environment: ${process.env.NODE_ENV}`);
  console.log(`Is build environment according to utils: ${isBuildEnvironment()}`);
  
  const nextVersion = process.env.NEXT_PUBLIC_VERSION || 'unknown';
  console.log(`Next.js version: ${nextVersion}`);
  
  try {
    // Check if .flask-port file exists
    const portFile = path.join(process.cwd(), '.flask-port');
    const hasPortFile = fs.existsSync(portFile);
    let portFileContent = 'not found';
    
    if (hasPortFile) {
      try {
        portFileContent = fs.readFileSync(portFile, 'utf8').trim();
      } catch (err) {
        portFileContent = 'error reading';
      }
    }
    
    console.log(`Flask port file exists: ${hasPortFile}, content: ${portFileContent}`);
  } catch (err) {
    console.error('Error checking port file:', err);
  }
  
  console.log('Checking Flask API status...');
  
  // Get Flask URL
  const flaskUrl = getFlaskUrl();
  console.log(`Using Flask URL: ${flaskUrl}`);
  
  const buildEnv = isBuildEnvironment();
  const services = {
    nextjs: {
      status: 'online',
      message: 'Next.js is running'
    },
    flask: {
      status: buildEnv ? 'skipped' : (flaskUrl ? 'checking' : 'unavailable'),
      message: buildEnv ? 'Flask API check skipped in build environment' : 
              (flaskUrl ? 'Checking Flask API connection' : 'No Flask URL available')
    },
    database: {
      status: buildEnv ? 'skipped' : 'unknown',
      message: buildEnv ? 'Database check skipped (Flask check skipped)' : 'Database status returned by Flask'
    },
    openai: {
      status: buildEnv ? 'skipped' : 'unknown',
      message: buildEnv ? 'OpenAI check skipped (Flask check skipped)' : 'OpenAI status returned by Flask'
    }
  };
  
  if (flaskUrl && !buildEnv) {
    try {
      console.log(`Checking Flask health at: ${flaskUrl}/api/health`);
      const response = await fetch(`${flaskUrl}/api/health`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (response.ok) {
        const data = await response.json();
        services.flask.status = 'online';
        services.flask.message = 'Flask API is running';
        
        if (data.database) {
          services.database = data.database;
        }
        
        if (data.openai) {
          services.openai = data.openai;
        }
      } else {
        services.flask.status = 'error';
        services.flask.message = `Flask API returned ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      services.flask.status = 'error';
      services.flask.message = `Error connecting to Flask API: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  
  const environment = process.env.NODE_ENV || 'unknown';
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    services,
    environment,
    is_build: buildEnv,
    debug: {
      cwd: process.cwd(),
      hasPortFile: fs.existsSync(path.join(process.cwd(), '.flask-port')),
      nextVersion: process.env.NEXT_PUBLIC_VERSION || 'unknown',
      vercelEnv: process.env.VERCEL_ENV || 'not set',
      ci: process.env.CI || 'not set'
    }
  });
} 