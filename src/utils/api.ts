/**
 * Get the Flask API URL based on environment
 * In development, it uses the local Flask server
 * In production, it can be configured via environment variables
 */
export function getFlaskUrl(): string {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    // Use environment variable or default to localhost:5336
    const FLASK_PORT = process.env.FLASK_PORT || 5336;
    
    // For Vercel deployments, this could be a deployed Flask API URL
    const FLASK_API_URL = process.env.FLASK_API_URL || `http://localhost:${FLASK_PORT}`;
    
    return FLASK_API_URL;
  }
  
  // In browser context, always use relative URLs to avoid CORS issues
  return '';
}

/**
 * Check if we're in a build environment (Vercel build or local build)
 */
export function isBuildEnvironment(): boolean {
  return !!process.env.VERCEL || process.env.NODE_ENV === 'production';
} 