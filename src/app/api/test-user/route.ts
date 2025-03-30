import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// WARNING: This endpoint is for development testing only and should be removed in production

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    // Check if test user exists
    let testUser = await db.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    });

    // If not, create one
    if (!testUser) {
      testUser = await db.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'not-a-real-password' // Not a real password, just for testing
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Test user created',
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test user already exists',
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      }
    });
  } catch (error) {
    console.error('Error creating/checking test user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
} 