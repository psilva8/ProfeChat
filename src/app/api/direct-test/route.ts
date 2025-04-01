import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const dynamic = 'force-dynamic';

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

// Function to check if the OpenAI API key is valid
async function checkOpenAIKey(port: number): Promise<{ valid: boolean, error?: string }> {
  try {
    const response = await axios.get(`http://localhost:${port}/api/check-openai-key`, {
      timeout: 5000
    });
    
    if (response.status === 200) {
      return { valid: true };
    } else {
      return { valid: false, error: `Status code: ${response.status}` };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: NextRequest) {
  // Get the environment configuration
  const configuredPort = process.env.FLASK_PORT || 5338;
  
  // Check the main Flask port
  const mainPortCheck = await checkPort(Number(configuredPort));
  
  // Create a map of port checks
  const alternateChecks: Record<string, any> = {};
  
  // Check alternative ports in parallel
  const alternatePortPromises = POSSIBLE_FLASK_PORTS
    .filter(port => port !== Number(configuredPort))
    .map(async (port) => {
      alternateChecks[`port_${port}`] = await checkPort(port);
    });
  
  await Promise.all(alternatePortPromises);
  
  // Find the first working port
  let workingPort = mainPortCheck.success ? Number(configuredPort) : null;
  
  if (!workingPort) {
    for (const port of POSSIBLE_FLASK_PORTS) {
      if (alternateChecks[`port_${port}`]?.success) {
        workingPort = port;
        break;
      }
    }
  }
  
  // Check OpenAI key if we found a working port
  let openAIStatus: { valid: boolean; error?: string } = { valid: false, error: 'No working Flask API found' };
  
  if (workingPort) {
    openAIStatus = await checkOpenAIKey(workingPort);
  }
  
  // Build the response
  const result = {
    timestamp: new Date().toISOString(),
    configuredPort,
    workingPort,
    connectionTests: {
      main: mainPortCheck,
      alternates: alternateChecks
    },
    openAI: openAIStatus
  };
  
  return NextResponse.json(result);
} 