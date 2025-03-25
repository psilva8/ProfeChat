import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  // Return an empty CSRF token for now since we're not using CSRF protection
  return NextResponse.json({ csrfToken: '' });
} 