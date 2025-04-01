import { NextResponse } from 'next/server';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

// List of all possible Flask API ports to check
const POSSIBLE_FLASK_PORTS = [5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350];

// Function to check if a port is responsive
async function checkPort(port: number): Promise<{ success: boolean, error?: string, data?: any }> {
  try {
    console.log(`Checking port ${port}...`);
    const response = await axios.get(`http://localhost:${port}/status`, {
      timeout: 2000
    });
    
    console.log(`Port ${port} responded with status ${response.status}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.log(`Port ${port} check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

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

export async function GET() {
  // Get the environment configuration
  const env = process.env.NODE_ENV || 'development';
  const configuredPort = process.env.FLASK_PORT || 5338;
  
  // Try to get the port from the file first
  const filePort = await getFlaskPortFromFile();
  
  // Check the file port if available
  let mainPortCheck: { success: boolean; error?: string; data?: any } = { success: false, error: 'Port file not found' };
  if (filePort) {
    mainPortCheck = await checkPort(filePort);
  }
  
  // If file port didn't work, check the configured port
  if (!mainPortCheck.success && filePort !== Number(configuredPort)) {
    mainPortCheck = await checkPort(Number(configuredPort));
  }
  
  // Create a map of port checks
  const alternateChecks: Record<string, any> = {};
  
  // Check alternative ports in parallel
  const alternatePortPromises = POSSIBLE_FLASK_PORTS
    .filter(port => port !== Number(configuredPort) && port !== filePort)
    .map(async (port) => {
      alternateChecks[`port_${port}`] = await checkPort(port);
    });
  
  await Promise.all(alternatePortPromises);
  
  // Find all working ports
  const alternativePorts = Object.entries(alternateChecks)
    .filter(([_, check]) => (check as any).success)
    .map(([port]) => port.replace('port_', ''));
  
  // Build the response
  const config = {
    env,
    nextjs: {
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      timestamp: new Date().toISOString()
    },
    flask: {
      configuredPort: configuredPort,
      filePort: filePort || 'Not found',
      health: mainPortCheck.success 
        ? `Available on port ${filePort || configuredPort}`
        : `Not available on configured port ${configuredPort}. Check alternative ports.`,
      alternativePorts
    },
    connectionTests: {
      main: mainPortCheck,
      alternates: alternateChecks
    }
  };
  
  return NextResponse.json(config);
} 