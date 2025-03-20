import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfeChat - Asistente de Planificación Educativa",
  description: "Herramienta de planificación educativa impulsada por IA para docentes peruanos. Genera planes de lección, unidades y rúbricas alineadas con el currículo nacional.",
  keywords: "educación peruana, planificación educativa, planes de lección, unidades didácticas, rúbricas, currículo nacional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
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
                  <Link href="/signup" className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
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
      </body>
    </html>
  );
} 