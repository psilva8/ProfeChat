import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Simple function to check all common ports
async function testAllPorts() {
  const results: Record<string, any> = {};
  const ports = [5336, 5337, 5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350,
                5351, 5352, 5353, 5354, 5355, 5356, 5357, 5358, 5359, 5360, 5361, 5362, 5363, 5364, 5365, 
                5366, 5367, 5368, 5369, 5370, 5371, 5372, 5373, 5374, 5375, 5376, 5377, 5378, 5379, 5380,
                5381, 5382, 5383, 5384, 5385, 5386, 5387, 5388, 5389, 5390, 5391, 5392, 5393, 5394, 5395,
                5396, 5397, 5398, 5399];
  
  // Get port from file if it exists
  let portFromFile: number | null = null;
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      portFromFile = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
      if (!isNaN(portFromFile)) {
        console.log(`Read port ${portFromFile} from file`);
      }
    }
  } catch (error) {
    console.error('Error reading port file:', error);
  }
  
  // Check the port from file first
  if (portFromFile) {
    try {
      const response = await axios.get(`http://localhost:${portFromFile}/status`, { 
        timeout: 1000 
      });
      results[`port_${portFromFile}_from_file`] = {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      results[`port_${portFromFile}_from_file`] = {
        success: false,
        error: error.message
      };
    }
  }
  
  // Check each port
  for (const port of ports) {
    if (port === portFromFile) continue; // Skip if we already checked it
    
    try {
      const response = await axios.get(`http://localhost:${port}/status`, { 
        timeout: 300  // short timeout to avoid long waiting
      });
      results[`port_${port}`] = {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      results[`port_${port}`] = {
        success: false,
        error: error.message
      };
    }
  }
  
  return results;
}

export async function GET() {
  try {
    const portTests = await testAllPorts();
    
    // Find the working ports
    const workingPorts = Object.entries(portTests)
      .filter(([_, result]) => (result as any).success)
      .map(([key]) => {
        const match = key.match(/port_(\d+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    
    // If we found a working port, try the API endpoints
    let apiTests: Record<string, any> = {};
    
    if (workingPorts.length > 0) {
      const testPort = workingPorts[0];
      
      try {
        const statusResponse = await axios.get(`http://localhost:${testPort}/status`, { timeout: 1000 });
        apiTests.status = {
          success: true,
          data: statusResponse.data
        };
      } catch (error: any) {
        apiTests.status = {
          success: false,
          error: error.message
        };
      }
      
      try {
        const healthResponse = await axios.get(`http://localhost:${testPort}/api/health`, { timeout: 1000 });
        apiTests.health = {
          success: true,
          data: healthResponse.data
        };
      } catch (error: any) {
        apiTests.health = {
          success: false,
          error: error.message
        };
      }
      
      try {
        const openaiResponse = await axios.get(`http://localhost:${testPort}/api/check-openai-key`, { timeout: 1000 });
        apiTests.openai = {
          success: true,
          data: openaiResponse.data
        };
      } catch (error: any) {
        apiTests.openai = {
          success: false,
          error: error.message
        };
      }
      
      try {
        const dbResponse = await axios.get(`http://localhost:${testPort}/api/check-db`, { timeout: 1000 });
        apiTests.db = {
          success: true,
          data: dbResponse.data
        };
      } catch (error: any) {
        apiTests.db = {
          success: false,
          error: error.message
        };
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      workingPorts,
      portTests,
      apiTests
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test Flask connections',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 