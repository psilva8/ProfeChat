'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plan } from '@/config/subscriptions';
import { cn } from '@/lib/utils';

interface SubscriptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  plan: Plan;
  isCurrentPlan: boolean;
}

export function SubscriptionButton({
  plan,
  isCurrentPlan,
  className,
  ...props
}: SubscriptionButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      if (plan.price === 0) {
        // Handle free plan subscription
        const response = await fetch('/api/subscriptions/free', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('No se pudo activar el plan básico. Por favor, intenta nuevamente.');
        }

        router.refresh();
        return;
      }

      // Create Stripe Checkout Session
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      // You might want to show this error to the user through a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading || isCurrentPlan}
      className={cn(
        'rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isCurrentPlan
        ? 'Plan Actual'
        : isLoading
        ? 'Procesando...'
        : plan.price === 0
        ? 'Comenzar Gratis'
        : 'Suscribirse Ahora'}
    </button>
  );
} 