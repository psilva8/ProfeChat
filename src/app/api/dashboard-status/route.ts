import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350, 5351, 5352, 5353, 5354, 5355, 5356, 5357, 5358, 5359, 5360, 5361, 5362, 5363, 5364, 5365, 5366, 5367, 5368, 5369, 5370, 5371, 5372, 5373, 5374, 5375, 5376, 5377, 5378, 5379, 5380, 5381, 5382, 5383, 5384, 5385, 5386, 5387, 5388, 5389, 5390, 5391, 5392, 5393, 5394, 5395, 5396, 5397, 5398, 5399];

// Function to get the Flask port from the file
async function getFlaskPortFromFile(): Promise<number | null> {
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const port = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
      console.log(`Read Flask port ${port} from .flask-port file`);
      return port;
    }
  } catch (error) {
    console.error(`Error reading .flask-port file:`, error);
  }
  return null;
}

async function checkPort(port: number): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const response = await axios.get(`http://localhost:${port}/status`, {
      timeout: 1000
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function findWorkingPort(): Promise<number | null> {
  // First try to get the port from the .flask-port file
  const filePort = await getFlaskPortFromFile();
  if (filePort) {
    try {
      const response = await axios.get(`http://localhost:${filePort}/status`, { 
        timeout: 500 
      });
      if (response.status === 200) {
        return filePort;
      }
    } catch (error) {
      console.error(`Configured port ${filePort} not working`);
    }
  }
  
  // Then try the configured port from env
  const configuredPort = Number(process.env.FLASK_PORT || process.env.FLASK_SERVER_PORT || 5338);
  
  try {
    const response = await axios.get(`http://localhost:${configuredPort}/status`, { 
      timeout: 500 
    });
    if (response.status === 200) {
      return configuredPort;
    }
  } catch (error) {
    console.log(`Environment port ${configuredPort} not working, trying alternatives`);
  }
  
  // Try each port sequentially until one works
  for (const port of POSSIBLE_FLASK_PORTS) {
    if (port === configuredPort || port === filePort) continue; // Skip the ones we already tried
    
    try {
      const response = await axios.get(`http://localhost:${port}/status`, { 
        timeout: 300 // Short timeout for faster checking
      });
      if (response.status === 200) {
        console.log(`Found working Flask port: ${port}`);
        return port;
      }
    } catch (error) {
      // Port not working, try next one
    }
  }
  
  return null; // No working port found
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