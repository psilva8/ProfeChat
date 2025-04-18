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
  const port = process.env.FLASK_SERVER_PORT || '5336';
  console.log(`Next.js config using Flask port from env/default: ${port}`);
  return port;
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
    const flaskPort = getFlaskPort();
    const flaskUrl = `http://localhost:${flaskPort}`;
    
    console.log(`Setting up API proxy to Flask at: ${flaskUrl}`);
    
    return [
      // Exclude Next.js API routes from being proxied to Flask
      {
        source: '/api/health',
        destination: '/api/health',
      },
      {
        source: '/api/flask-port',
        destination: '/api/flask-port',
      },
      {
        source: '/api/proxy/:path*',
        destination: '/api/proxy/:path*',
      },
      {
        source: '/api/generate-activities',
        destination: '/api/generate-activities',
      },
      {
        source: '/api/generate-lesson',
        destination: '/api/generate-lesson',
      },
      {
        source: '/api/test-lesson',
        destination: '/api/test-lesson',
      },
      // Default rule to proxy everything else to Flask
      {
        source: '/api/:path*',
        destination: `${flaskUrl}/api/:path*`,
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