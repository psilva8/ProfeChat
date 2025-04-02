'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isProduction, setIsProduction] = useState(false);
  
  useEffect(() => {
    // Check if we're in production by looking at the hostname
    const hostname = window.location.hostname;
    setIsProduction(
      hostname.includes('vercel.app') || 
      !hostname.includes('localhost')
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-6xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Página no encontrada</h2>
          <p className="mt-2 text-sm text-gray-600">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
        </div>
        
        {isProduction && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-lg font-medium text-yellow-800">Información para la implementación en Vercel</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Si estás viendo este error en una implementación de Vercel, es posible que las funciones que requieren
              el servidor Flask no estén disponibles. Esta aplicación está diseñada para funcionar completamente
              con el backend Flask en desarrollo local.
            </p>
            <p className="mt-2 text-sm text-yellow-700">
              Para una implementación completa, necesitarás configurar el servidor Flask en un servicio separado.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
} 