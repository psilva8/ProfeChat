import React from 'react';
import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptions';
import { SubscriptionButton } from '@/components/subscription/subscription-button';
import { CheckIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Planes y Precios | ProfeChat - Asistente AI para Profesores Peruanos',
  description: 'Descubre nuestros planes diseñados para profesores peruanos. Desde planificaciones hasta rúbricas, optimiza tu trabajo docente con ProfeChat.',
  keywords: 'ProfeChat, planes de suscripción, profesores peruanos, planificación docente, rúbricas educativas, actividades pedagógicas, CNEB, currículo nacional, SIAGIE',
  openGraph: {
    title: 'Planes y Precios | ProfeChat - Asistente AI para Profesores',
    description: 'Optimiza tu trabajo docente con ProfeChat. Planes diseñados para profesores peruanos con herramientas de planificación, rúbricas y más.',
    type: 'website',
    locale: 'es_PE',
  },
};

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const subscription = await db.subscription.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Planes de Suscripción ProfeChat
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Optimiza tu labor docente con herramientas diseñadas para el Currículo Nacional de Perú
          </p>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = subscription?.stripePriceId === plan.stripePriceId;
            const isFreePlan = plan.price === 0;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                  plan.id === 'pro' ? 'bg-gray-900 ring-gray-900' : 'bg-white'
                }`}
              >
                <h2
                  className={`text-lg font-semibold leading-8 ${
                    plan.id === 'pro' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h2>

                <p
                  className={`mt-4 text-sm leading-6 ${
                    plan.id === 'pro' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>

                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.id === 'pro' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price > 0 ? `S/ ${plan.price.toFixed(2)}` : 'Gratis'}
                  </span>
                  {!isFreePlan && (
                    <span
                      className={`text-sm font-semibold leading-6 ${
                        plan.id === 'pro' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      /mes
                    </span>
                  )}
                </p>

                <ul
                  className={`mt-8 space-y-3 text-sm leading-6 ${
                    plan.id === 'pro' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={`h-6 w-5 flex-none ${
                          plan.id === 'pro' ? 'text-white' : 'text-accent-600'
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <SubscriptionButton
                  plan={plan}
                  isCurrentPlan={isCurrentPlan}
                  className={`mt-8 block w-full ${
                    plan.id === 'pro'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center text-sm text-gray-500">
          <p>
            Todos los precios están en Soles Peruanos (PEN). IGV incluido.
            Al suscribirte, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
} 