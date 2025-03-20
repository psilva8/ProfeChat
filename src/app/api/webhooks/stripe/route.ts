import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('[STRIPE_WEBHOOK_ERROR]', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new NextResponse('User ID is required', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Create or update subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db.subscription.upsert({
          where: {
            userId: session.metadata.userId,
          },
          create: {
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;

      case 'invoice.payment_succeeded':
        // Update subscription period
        const paidSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db.subscription.update({
          where: {
            stripeSubscriptionId: paidSubscription.id,
          },
          data: {
            status: paidSubscription.status,
            currentPeriodEnd: new Date(paidSubscription.current_period_end * 1000),
          },
        });
        break;

      case 'customer.subscription.deleted':
        // Delete or update subscription when cancelled
        await db.subscription.update({
          where: {
            stripeSubscriptionId: session.subscription as string,
          },
          data: {
            status: 'canceled',
            stripePriceId: null,
            stripeSubscriptionId: null,
          },
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[STRIPE_WEBHOOK_ERROR]', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
} 