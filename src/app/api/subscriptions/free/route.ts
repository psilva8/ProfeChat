import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'edge';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user already has a subscription
    const existingSubscription = await db.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingSubscription) {
      // Update existing subscription to free plan
      await db.subscription.update({
        where: {
          userId: session.user.id,
        },
        data: {
          stripePriceId: null,
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          status: 'active',
          currentPeriodEnd: null,
        },
      });
    } else {
      // Create new free subscription
      await db.subscription.create({
        data: {
          userId: session.user.id,
          status: 'active',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FREE_SUBSCRIPTION_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 