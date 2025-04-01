import { NextResponse } from 'next/server';
import axios from 'axios';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350];

// Function to check if a port is responsive
async function checkPort(port: number): Promise<{ success: boolean, error?: string, data?: any }> {
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

export async function GET() {
  // Get the environment configuration
  const env = process.env.NODE_ENV || 'development';
  const flaskPort = process.env.FLASK_PORT || 5338;
  
  // Check the main Flask port
  const mainPortCheck = await checkPort(Number(flaskPort));
  
  // Create a map of port checks
  const alternateChecks: Record<string, any> = {};
  
  // Check alternative ports in parallel
  const alternatePortPromises = POSSIBLE_FLASK_PORTS
    .filter(port => port !== Number(flaskPort))
    .map(async (port) => {
      alternateChecks[`port_${port}`] = await checkPort(port);
    });
  
  await Promise.all(alternatePortPromises);
  
  // Build the response
  const config = {
    env,
    nextjs: {
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      timestamp: new Date().toISOString()
    },
    flask: {
      configuredPort: flaskPort,
      health: mainPortCheck.success 
        ? `Available on port ${flaskPort}`
        : `Not available on configured port ${flaskPort}. Check alternative ports.`,
      alternativePorts: Object.entries(alternateChecks)
        .filter(([_, check]) => (check as any).success)
        .map(([port]) => port.replace('port_', ''))
    },
    connectionTests: {
      main: mainPortCheck,
      alternates: alternateChecks
    }
  };
  
  return NextResponse.json(config);
} 