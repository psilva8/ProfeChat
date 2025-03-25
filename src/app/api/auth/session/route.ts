import { NextResponse } from "next/server";

// For testing, return a mock session
export function GET() {
  return NextResponse.json({
    // Return a mock user session for testing
    user: {
      id: "1",
      name: "Usuario de Prueba",
      email: "test@example.com"
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
} 