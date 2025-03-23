import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const runtime = 'nodejs';
export const preferredRegion = 'home';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5;

interface RateLimit {
  count: number;
  firstRequest: number;
}

const rateLimits = new Map<string, RateLimit>();

function getRateLimit(ip: string): RateLimit {
  const now = Date.now();
  let rateLimit = rateLimits.get(ip);

  // Clean up old rate limit entries
  if (rateLimit && now - rateLimit.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimit = undefined;
  }

  if (!rateLimit) {
    rateLimit = { count: 0, firstRequest: now };
    rateLimits.set(ip, rateLimit);
  }

  return rateLimit;
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    // Get client IP from headers or request
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Check rate limit
    const rateLimit = getRateLimit(clientIp);
    if (rateLimit.count >= MAX_REQUESTS_PER_IP) {
      const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (Date.now() - rateLimit.firstRequest)) / 1000 / 60);
      return NextResponse.json(
        { 
          error: 'Too many registration attempts',
          details: `Please try again in ${timeLeft} minutes`
        },
        { status: 429 }
      );
    }
    rateLimit.count++;

    const body = await req.json();
    console.log('Received registration request:', { ...body, password: '[REDACTED]' });

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Invalid registration data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    try {
      // Test database connection
      console.log('Testing database connection...');
      await db.$connect();
      console.log('Database connection successful');

      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      console.log('Password hashed successfully');

      const user = await db.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });
      console.log('User created successfully:', { id: user.id, email: user.email });

      return NextResponse.json(
        { 
          message: 'User created successfully',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error('Database error details:', {
        name: dbError.name,
        message: dbError.message,
        code: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.code : 'N/A',
        meta: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.meta : 'N/A'
      });

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: 'An account with this email already exists' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { 
          error: 'Database connection error',
          details: dbError.message
        },
        { status: 500 }
      );
    } finally {
      await db.$disconnect();
    }
  } catch (error: any) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Invalid request', details: error.message },
      { status: 400 }
    );
  }
} 