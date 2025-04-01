import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Export dynamic flag to ensure this route is always evaluated dynamically
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Path to the .flask-port file
    const portFilePath = path.join(process.cwd(), '.flask-port');
    
    // Check if the file exists
    if (fs.existsSync(portFilePath)) {
      const port = fs.readFileSync(portFilePath, 'utf8').trim();
      console.log(`Read Flask port ${port} from .flask-port file`);
      
      return NextResponse.json({
        success: true,
        port
      });
    } else {
      console.warn('No .flask-port file found');
      
      return NextResponse.json({
        success: false,
        message: 'No Flask port information available'
      });
    }
  } catch (error) {
    console.error('Error reading Flask port:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 