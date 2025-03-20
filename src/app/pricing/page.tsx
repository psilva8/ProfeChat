import React from 'react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Gratuito',
    id: 'free',
    price: '0',
    description: 'Perfecto para empezar a usar ProfeChat',
    features: [
      '5 planes de lección por mes',
      '3 rúbricas por mes',
      '3 actividades por mes',
      'Acceso a plantillas básicas',
    ],
    cta: 'Comenzar gratis',
    href: '/dashboard',
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '29.90',
    description: 'Ideal para profesores activos',
    features: [
      'Planes de lección ilimitados',
      'Rúbricas ilimitadas',
      'Actividades ilimitadas',
      'Plantillas premium',
      'Prioridad en el soporte',
      'Sin marca de agua',
    ],
    cta: 'Comenzar prueba gratuita',
    href: '/dashboard/subscription',
    featured: true,
  },
  {
    name: 'Equipo',
    id: 'team',
    price: '99.90',
    description: 'Para instituciones educativas',
    features: [
      'Todo lo incluido en Pro',
      'Hasta 5 usuarios',
      'Panel de administración',
      'Análisis y reportes',
      'Soporte prioritario 24/7',
      'Capacitación personalizada',
    ],
    cta: 'Contactar ventas',
    href: '/contact',
  },
];

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-accent-600">Precios</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Planes para cada necesidad
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Elije el plan que mejor se adapte a tus necesidades y comienza a crear contenido educativo de calidad.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                tier.featured ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
              }`}
            >
              <h2
                className={`text-lg font-semibold leading-8 ${
                  tier.featured ? 'text-white' : 'text-gray-900'
                }`}
              >
                {tier.name}
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">S/. {tier.price}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/mes</span>
              </p>
              <Link
                href={tier.href}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.featured
                    ? 'bg-accent-500 text-white hover:bg-accent-400 focus-visible:outline-accent-500'
                    : 'bg-accent-600 text-white hover:bg-accent-500 focus-visible:outline-accent-600'
                }`}
              >
                {tier.cta}
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${tier.featured ? 'text-white' : 'text-accent-600'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 