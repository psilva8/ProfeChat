/**
 * Get the Flask API URL based on environment
 * In development, it uses the local Flask server
 * In production, it can be configured via environment variables
 */
export function getFlaskUrl(): string {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    try {
      // Use environment variable or default
      let FLASK_PORT = process.env.FLASK_PORT || 5336;
      
      // Try to read from .flask-port file in development
      if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        const path = require('path');
        try {
          const portFile = path.join(process.cwd(), '.flask-port');
          if (fs.existsSync(portFile)) {
            FLASK_PORT = fs.readFileSync(portFile, 'utf8').trim();
            console.log(`Using Flask port from .flask-port file: ${FLASK_PORT}`);
          }
        } catch (err) {
          console.warn('Error reading .flask-port file:', err);
        }
      }
      
      // For Vercel deployments, this could be a deployed Flask API URL
      const FLASK_API_URL = process.env.FLASK_API_URL || `http://localhost:${FLASK_PORT}`;
      
      return FLASK_API_URL;
    } catch (error) {
      console.error('Error determining Flask URL:', error);
      return 'http://localhost:5336'; // Fallback
    }
  }
  
  // In browser context, always use relative URLs to avoid CORS issues
  // Reusing the same port determination logic would be impossible in the browser
  // So in browser context, we just use the relative URL which will be
  // properly proxied by Next.js rewrites
  return '';
}

/**
 * Check if we're in a build environment (Vercel build or local build)
 */
export function isBuildEnvironment(): boolean {
  return !!process.env.VERCEL || process.env.NODE_ENV === 'production';
}

/**
 * Make an API request with proper error handling
 * @param url The API endpoint to call
 * @param options Request options
 * @returns Promise with response data
 */
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Add cache busting for GET requests
    const finalUrl = url.includes('?') 
      ? `${url}&_=${Date.now()}` 
      : `${url}?_=${Date.now()}`;
    
    const response = await fetch(finalUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let message = `API request failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        message = errorData.error || errorData.message || message;
      } catch (e) {
        // If the response isn't JSON, use the raw text
        if (errorText) message += `: ${errorText}`;
      }
      throw new Error(message);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 