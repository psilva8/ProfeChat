import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350];

async function checkPort(port: number): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const response = await axios.get(`http://localhost:${port}/status`, {
      timeout: 2000
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function findWorkingPort(): Promise<number | null> {
  // First try the configured port
  const configuredPort = Number(process.env.FLASK_PORT || 5338);
  
  const mainPortCheck = await checkPort(configuredPort);
  if (mainPortCheck.success) {
    return configuredPort;
  }
  
  // Try each alternative port in parallel
  const portChecks = await Promise.all(
    POSSIBLE_FLASK_PORTS
      .filter(port => port !== configuredPort)
      .map(async port => ({ port, check: await checkPort(port) }))
  );
  
  const workingPortInfo = portChecks.find(p => p.check.success);
  return workingPortInfo ? workingPortInfo.port : null;
}

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check Next.js status
    const nextjsStatus = {
      service: 'Next.js App',
      status: 'healthy',
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
    
    // Find working Flask port
    const workingPort = await findWorkingPort();
    
    // Check Flask API status
    let flaskStatus;
    if (workingPort) {
      flaskStatus = {
        service: 'Flask API',
        status: 'healthy',
        message: `Running on port ${workingPort}`,
        configuredPort: process.env.FLASK_PORT || 5338,
        workingPort
      };
    } else {
      flaskStatus = {
        service: 'Flask API',
        status: 'error',
        message: 'No running Flask API found',
        configuredPort: process.env.FLASK_PORT || 5338
      };
    }
    
    // Check OpenAI API through Flask
    let openaiStatus;
    if (workingPort) {
      try {
        const response = await axios.get(`http://localhost:${workingPort}/api/check-openai-key`, {
          timeout: 5000
        });
        
        openaiStatus = {
          service: 'OpenAI API',
          status: response.data.valid ? 'healthy' : 'error',
          message: response.data.valid ? 'API key is valid' : response.data.error || 'API key is invalid',
          details: response.data
        };
      } catch (error) {
        openaiStatus = {
          service: 'OpenAI API',
          status: 'error',
          message: `Failed to check: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    } else {
      openaiStatus = {
        service: 'OpenAI API',
        status: 'error',
        message: 'Cannot check - No running Flask API'
      };
    }
    
    // Check database connection
    let databaseStatus;
    if (workingPort) {
      try {
        const response = await axios.get(`http://localhost:${workingPort}/api/check-db`, {
          timeout: 5000
        });
        
        databaseStatus = {
          service: 'Database',
          status: response.data.status === 'healthy' ? 'healthy' : 'error',
          message: response.data.status === 'healthy' ? 'Connected to database' : response.data.error || 'Database connection failed',
          details: response.data
        };
      } catch (error) {
        databaseStatus = {
          service: 'Database',
          status: 'error',
          message: `Failed to check: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    } else {
      databaseStatus = {
        service: 'Database',
        status: 'error',
        message: 'Cannot check - No running Flask API'
      };
    }
    
    // Check auth system (basic check)
    let authStatus;
    try {
      const response = await fetch('/api/auth/session', {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        authStatus = {
          service: 'Auth System',
          status: 'healthy',
          message: data.user ? 'User is authenticated' : 'Auth system is running',
          authenticated: !!data.user,
          details: data.user ? { userId: data.user.id, email: data.user.email } : null
        };
      } else {
        authStatus = {
          service: 'Auth System',
          status: 'error',
          message: `Auth API returned status ${response.status}`,
          statusCode: response.status
        };
      }
    } catch (error) {
      authStatus = {
        service: 'Auth System',
        status: 'error',
        message: `Failed to check: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      services: [
        nextjsStatus,
        flaskStatus,
        openaiStatus,
        databaseStatus,
        authStatus
      ],
      system: {
        node: process.version,
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to gather system status',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 