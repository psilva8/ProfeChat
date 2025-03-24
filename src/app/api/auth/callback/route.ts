import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const callbackUrl = url.searchParams.get("callbackUrl") || "/dashboard";
    const session = await auth();
    
    if (session) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
} 