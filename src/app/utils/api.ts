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
  
  // In development, NEVER use test data - always try to connect to Flask
  if (process.env.NODE_ENV === 'development') {
    console.log('In development mode, always using real API');
    return false;
  }
  
  // This code should never be reached in normal operation
  // But keeping as a fallback just in case
  console.log('Using fallback method to determine if test data should be used');
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