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
      console.log(`Next.js config using Flask port from file: ${port}`);
      return port;
    }
  } catch (err) {
    console.warn('Error reading .flask-port file:', err);
  }
  
  // Fallback to environment variable or default
  const port = process.env.FLASK_SERVER_PORT || '5000';
  console.log(`Next.js config using Flask port from env/default: ${port}`);
  return port;
};

// Check if we're in a production/build environment
const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' || 
         process.env.VERCEL_ENV === 'preview';
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
    
    return [
      // Proxy API routes to Flask
      {
        source: '/api/:path*',
        destination: `${flaskUrl}/api/:path*`,
      }
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