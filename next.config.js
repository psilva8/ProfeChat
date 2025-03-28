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
        // Keep NextAuth routes handled by Next.js (must come first)
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
        // Forward all other API routes to Flask
        {
          source: '/api/:path*',
          destination: 'http://localhost:5336/api/:path*',
        }
      ];
    }
    
    // In production, no rewrites needed
    return [];
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