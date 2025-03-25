import { NextResponse } from "next/server";

// For testing, return a mock session or empty object
export function GET() {
  return NextResponse.json({
    // Return an empty session if not authenticated
    user: null,
    expires: null
  });
} 