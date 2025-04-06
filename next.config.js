/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// Function to get Flask port from file or environment variable
const getFlaskPort = () => {
  try {
    // Try to read from .flask-port file
    const portFile = path.join(__dirname, '.flask-port');
    if (fs.existsSync(portFile)) {
      const port = fs.readFileSync(portFile, 'utf8').trim();
      if (!port || isNaN(parseInt(port, 10))) {
        console.warn('Invalid port in .flask-port file, falling back to default');
      } else {
        console.log(`Next.js config using Flask port from file: ${port}`);
        return port;
      }
    }
  } catch (err) {
    console.warn('Error reading .flask-port file:', err);
  }
  
  // Fallback to environment variable or default
  const port = process.env.FLASK_SERVER_PORT || '5000';
  console.log(`Next.js config using Flask port from env/default: ${port}`);
  return port;
};

// Function to check if the Flask server is running
const checkFlaskServer = async (port) => {
  try {
    if (process.env.NODE_ENV !== 'production' && process.env.SKIP_FLASK_CHECK !== 'true') {
      console.log(`Checking if Flask server is running on port ${port}...`);
      const response = await fetch(`http://localhost:${port}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      if (response.ok) {
        console.log('Flask server is running correctly');
        return true;
      }
      
      console.warn(`Flask server check failed with status: ${response.status}`);
      return false;
    }
    return true; // Skip check in production
  } catch (error) {
    console.warn(`Unable to connect to Flask server: ${error.message}`);
    return false;
  }
};

// Check if we're in a production/build environment
const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview' ||
         process.cwd() === '/var/task'; // Vercel serverless environment
};

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async rewrites() {
    // Skip adding Flask proxying in production
    if (isProduction()) {
      console.log('Production environment detected, skipping Flask API rewrites');
      return [];
    }

    const flaskPort = getFlaskPort();
    const flaskUrl = `http://localhost:${flaskPort}`;
    
    console.log(`Setting up API proxy to Flask at: ${flaskUrl}`);
    
    // Try to verify Flask is running (but don't block startup)
    await checkFlaskServer(flaskPort).catch(() => {});
    
    return [
      // Proxy API routes to Flask
      {
        source: '/api/:path*',
        destination: `${flaskUrl}/api/:path*`,
      }
    ];
  },
  async headers() {
    return [
      {
        // Apply CORS headers to all routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  eslint: {
    // Warning ESLint errors don't fail the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 