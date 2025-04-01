import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { isTestRoute } from "@/lib/utils";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are protected (requiring authentication)
  const protectedPaths = [
    '/dashboard', 
    '/dashboard/', 
    '/api/lesson-plans',
    '/api/rubrics',
    '/api/activities'
  ];
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Skip authentication check for test routes
  if (isTestRoute(pathname)) {
    console.log(`Bypassing auth for test route: ${pathname}`);
    return NextResponse.next();
  }

  // Get the authentication token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const isAuthenticated = !!token;

  // If it's a protected path and not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    console.log(`Redirecting unauthenticated user from ${pathname} to login`);
    
    // For API requests, return unauthorized instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and accessing login/register, redirect to dashboard
  if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/lesson-plans/:path*',
    '/api/rubrics/:path*',
    '/api/activities/:path*',
    '/api/test-:path*',
    '/api/proxy/:path*',
    '/api/generate-lesson',
    '/api/direct-test',
    '/api/config-check',
  ],
}; 