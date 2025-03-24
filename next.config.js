/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'images.unsplash.com'
    ]
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        // Keep NextAuth routes handled by Next.js
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
        // Forward all other API routes to Flask
        {
          source: '/api/:path*',
          destination: 'http://localhost:5333/api/:path*',
        }
      ]
    }
    
    // In production, don't rewrite API routes
    return [];
  }
}

module.exports = nextConfig 