import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are protected (requiring authentication)
  const protectedPaths = ['/dashboard', '/dashboard/', '/api/lesson-plans'];
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  // Get the authentication token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const isAuthenticated = !!token;

  // If it's a protected path and not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
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
  ],
}; 