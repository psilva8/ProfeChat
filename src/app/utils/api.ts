import fs from 'fs';
import path from 'path';

// Check if we're in a build/production environment
export const isBuildEnvironment = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview' || 
         process.env.CI === 'true';
};

// Get the Flask URL based on current environment
export const getFlaskUrl = (): string => {
  // Always return empty string in production to avoid fetch attempts
  if (isBuildEnvironment()) {
    console.log('Production environment detected, skipping Flask URL setup');
    return '';
  }
  
  return getFlaskUrlInternal();
};

// Function to determine whether to use test data
export const shouldUseTestData = (): boolean => {
  console.log('Checking if we should use test data...');
  
  // Always use test data in production environment
  if (isBuildEnvironment()) {
    console.log('Using test data because we are in a production environment');
    return true;
  }
  
  // Check if we can access the Flask server
  try {
    // Try to read from .flask-port file first
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      // Validate port - should be a number
      const port = parseInt(portContent, 10);
      if (!isNaN(port) && port > 0 && port < 65536) {
        console.log(`Found valid Flask port ${port} in .flask-port file - will use real API`);
        // Flask port is valid, we should use the real API
        return false;
      }
    }
  } catch (error) {
    console.error('Error checking Flask port file:', error);
  }
  
  // If we've reached here without returning, use the fallback method
  // Get Flask URL without logging (to avoid circular logs)
  const flaskUrl = getFlaskUrlInternal();
  const useTestData = !flaskUrl;
  
  if (useTestData) {
    console.log('Using test data because Flask URL is not available');
  } else {
    console.log('Using real API because Flask URL is available');
  }
  
  return useTestData;
};

// Internal helper function to get Flask URL without triggering shouldUseTestData checks
function getFlaskUrlInternal(): string {
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portContent, 10);
      if (!isNaN(port) && port > 0 && port < 65536) {
        return `http://localhost:${port}`;
      }
    }
    
    const flaskPort = process.env.FLASK_PORT || '5000';
    return `http://localhost:${flaskPort}`;
  } catch (error) {
    return '';
  }
} 