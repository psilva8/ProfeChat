import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ 
    error: "Authentication error",
    message: "There was a problem with the authentication process"
  }, { status: 400 });
} 