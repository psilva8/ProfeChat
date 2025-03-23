import React from 'react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Planes y Precios
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Plan Gratuito</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">S/0</p>
            <p className="mt-2 text-gray-500">Por mes</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">5 planes de lección por mes</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">3 rúbricas por mes</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
            <h3 className="text-lg font-medium text-gray-900">Plan Pro</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">S/29.99</p>
            <p className="mt-2 text-gray-500">Por mes</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Planes de lección ilimitados</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Rúbricas ilimitadas</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Planes de unidad</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Plan Institucional</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">Contactar</p>
            <p className="mt-2 text-gray-500">Precio personalizado</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Todo lo incluido en Pro</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Soporte prioritario</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3">Capacitación personalizada</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 