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
  try {
    // Skip Flask in build/production
    if (isBuildEnvironment()) {
      console.log('Build environment detected, skipping Flask URL setup');
      return '';
    }

    // Try to read from .flask-port file first
    try {
      const portFile = path.join(process.cwd(), '.flask-port');
      if (fs.existsSync(portFile)) {
        const portContent = fs.readFileSync(portFile, 'utf8').trim();
        // Validate port - should be a number
        const port = parseInt(portContent, 10);
        if (!isNaN(port) && port > 0 && port < 65536) {
          console.log(`Found valid Flask port ${port} in .flask-port file`);
          return `http://localhost:${port}`;
        } else {
          console.warn(`Invalid port "${portContent}" in .flask-port file, falling back to default`);
        }
      } else {
        console.log('No .flask-port file found, Flask server may not be running');
      }
    } catch (error) {
      console.error('Error reading .flask-port file:', error);
    }

    // Fallback to environment variable
    const flaskPort = process.env.FLASK_PORT || '5000';
    console.log(`Using Flask port ${flaskPort} from environment variable`);
    
    // Check if the port is already in use by non-Flask service
    return `http://localhost:${flaskPort}`;
  } catch (error) {
    console.error('Error determining Flask URL:', error);
    return '';
  }
};

// Function to determine whether to use test data
export const shouldUseTestData = (): boolean => {
  // Always use test data in build environments
  if (isBuildEnvironment()) {
    console.log('Using test data in build environment');
    return true;
  }
  
  // Use test data if Flask URL is empty
  const flaskUrl = getFlaskUrl();
  const useTestData = !flaskUrl;
  
  if (useTestData) {
    console.log('Flask URL not available, using test data');
  } else {
    console.log('Flask URL available, using live API');
  }
  
  return useTestData;
}; 