import { NextResponse } from "next/server";

// For testing, return a mock CSRF token
export function GET() {
  return NextResponse.json({
    csrfToken: 'mock-csrf-token'
  });
}
