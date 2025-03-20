'use client';

import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-full">
        <nav className="bg-indigo-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
                    ProfeChat
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-8">
                    <Link href="/features" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                      Características
                    </Link>
                    <div className="flex items-baseline space-x-4">
                      <Link href="/lesson-planner" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                        Planificador de Lecciones
                      </Link>
                      <Link href="/unit-planner" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                        Planificador de Unidades
                      </Link>
                      <Link href="/activities" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                        Actividades
                      </Link>
                      <Link href="/rubrics" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                        Rúbricas
                      </Link>
                    </div>
                    <Link href="/pricing" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                      Precios
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/auth/register" className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
                  Empezar
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </SessionProvider>
  );
} 