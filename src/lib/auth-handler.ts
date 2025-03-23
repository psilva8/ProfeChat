import { NextResponse } from "next/server";
import { handlers } from "./auth";
import type { NextRequest } from "next/server";

export const runtime = 'nodejs';

export const { GET, POST } = handlers;

export async function authHandler(request: NextRequest) {
  try {
    if (request.method === 'GET') {
      return handlers.GET(request);
    } else if (request.method === 'POST') {
      return handlers.POST(request);
    } else {
      return new NextResponse(null, { status: 405 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return new NextResponse(null, { status: 500 });
  }
} 