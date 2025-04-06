import fs from 'fs';
import path from 'path';

/**
 * Gets the Flask server URL for the API to use
 * @returns {string} The Flask URL, or empty string if not available
 */
export function getFlaskUrl(): string {
  // Never attempt to connect to Flask in production
  if (isBuildEnvironment()) {
    console.log('In production, not using Flask URL');
    return '';
  }

  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    console.log(`Looking for Flask port file at ${portFile}`);
    
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portContent, 10);
      
      if (!isNaN(port) && port > 0 && port < 65536) {
        console.log(`Found valid Flask port ${port} in .flask-port file`);
        return `http://localhost:${port}`;
      } else {
        console.warn(`Invalid port found in .flask-port: ${portContent}`);
      }
    } else {
      console.log('No .flask-port file found');
    }
    
    // If we reach here, try environment variable or default
    const envPort = process.env.FLASK_SERVER_PORT;
    if (envPort) {
      console.log(`Using FLASK_SERVER_PORT from environment: ${envPort}`);
      return `http://localhost:${envPort}`;
    }
    
    // Last fallback
    console.log('No valid Flask port found, using default 5338');
    return 'http://localhost:5338';
  } catch (error) {
    console.error('Error reading Flask port:', error);
    return '';
  }
}

/**
 * Determines if the code is running in a build/production environment
 * @returns {boolean} True if running in production/build environment
 */
export function isBuildEnvironment(): boolean {
  // Check various ways to detect a production/build environment
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercelProd = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview';
  const isServerless = process.cwd() === '/var/task'; // Common in Vercel/AWS Lambda
  const isPrerendering = typeof window === 'undefined';
  
  const result = isProduction || isVercelProd || isServerless;
  
  if (isProduction) console.log('Build check: NODE_ENV is production');
  if (isVercelProd) console.log('Build check: VERCEL_ENV is production or preview');
  if (isServerless) console.log('Build check: Current directory is /var/task (serverless)');
  
  return result;
}

/**
 * Determines if we should use test data instead of calling Flask
 * @returns {boolean} True if test data should be used
 */
export function shouldUseTestData(): boolean {
  // In development, always use real API - NEVER use test data
  if (process.env.NODE_ENV === 'development') {
    console.log('In development mode, always using real API');
    return false;
  }
  
  // Check if we're in a build/production environment
  if (isBuildEnvironment()) {
    console.log('In production, using test data');
    return true;
  }
  
  // If Flask URL isn't available, use test data
  const flaskUrl = getFlaskUrl();
  if (!flaskUrl) {
    console.log('Flask URL not available, using test data');
    return true;
  }
  
  // Always log the decision
  console.log('Flask URL available, using live API');
  return false;
}

/**
 * Makes an API call to the Flask server or returns test data in production
 * @param {string} endpoint - The API endpoint without leading slash
 * @param {any} data - The data to send in the request body
 * @param {any} testData - The test data to return in production
 * @returns {Promise<any>} The API response or test data
 */
export async function callApi(endpoint: string, data: any, testData: any): Promise<any> {
  // In build/production environments, always return test data
  if (shouldUseTestData()) {
    console.log(`Using test data for ${endpoint}`);
    return Promise.resolve(testData);
  }
  
  try {
    const flaskUrl = getFlaskUrl();
    if (!flaskUrl) {
      console.log(`No Flask URL available for ${endpoint}, using test data`);
      return Promise.resolve(testData);
    }
    
    console.log(`Calling Flask API: ${flaskUrl}/api/${endpoint}`);
    const response = await fetch(`${flaskUrl}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(20000) // 20 seconds timeout
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}) from ${endpoint}:`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
    }
    
    const responseData = await response.json();
    console.log(`Received response from ${endpoint}`);
    return responseData;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    return Promise.resolve(testData);
  }
}

/**
 * This is a last resort option that uses Node.js http module to directly connect
 * to Flask, bypassing all possible middleware, proxies, and environment checks
 * @param endpoint API endpoint without leading slash
 * @param data Request data
 * @returns Promise with the API response
 */
export function directFlaskConnection(endpoint: string, data: any): Promise<any> {
  console.log(`DIRECT HTTP CONNECTION to Flask API: ${endpoint}`);
  
  return new Promise((resolve, reject) => {
    try {
      // Use Node's native http module
      const http = require('http');
      
      const requestBody = JSON.stringify(data || {});
      
      const options = {
        hostname: '127.0.0.1',  // Always use loopback, not localhost
        port: 5338,             // Hardcoded for reliability
        path: `/api/${endpoint}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        timeout: 30000 // 30 second timeout
      };
      
      console.log('Making direct HTTP request...');
      
      const req = http.request(options, (res: any) => {
        console.log(`HTTP Status: ${res.statusCode}`);
        
        let responseData = '';
        
        res.on('data', (chunk: any) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`HTTP error: ${res.statusCode}`);
            reject(new Error(`HTTP error: ${res.statusCode}, ${responseData}`));
            return;
          }
          
          try {
            const response = JSON.parse(responseData);
            console.log('Successfully parsed JSON response');
            resolve(response);
          } catch (err) {
            console.error('Failed to parse JSON:', err);
            reject(new Error(`Invalid JSON response: ${responseData.substring(0, 100)}...`));
          }
        });
      });
      
      req.on('error', (error: any) => {
        console.error('HTTP request error:', error);
        reject(error);
      });
      
      req.write(requestBody);
      req.end();
      
      console.log('Direct HTTP request sent');
    } catch (error) {
      console.error('Error setting up direct HTTP request:', error);
      reject(error);
    }
  });
} 