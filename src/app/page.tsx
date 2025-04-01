'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard if necessary
  useEffect(() => {
    // For demo purposes, we'll keep the landing page
    // router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-blue-600">Potencia</span> tu enseñanza con IA
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Plataforma avanzada de inteligencia artificial diseñada específicamente para docentes peruanos, 
                alineada con el currículo nacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Comenzar ahora
                </Link>
                <Link 
                  href="/curriculum" 
                  className="px-8 py-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center"
                >
                  Explorar el currículo
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-lg h-[400px]">
                <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-10 transform rotate-3"></div>
                <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-lg">
                  <div className="p-6 h-full flex flex-col">
                    <div className="bg-white rounded-md p-4 shadow-sm mb-4">
                      <h3 className="font-medium mb-2">Matemática - PRIMARIA</h3>
                      <p className="text-sm text-gray-600">Generando plan de lección sobre fracciones equivalentes...</p>
                      <div className="mt-3 w-4/5 h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md p-4 shadow-sm mb-4">
                      <h3 className="font-medium text-green-600">Plan Generado ✓</h3>
                      <p className="text-sm">Introducción a las fracciones equivalentes</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">45 min</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Materiales incluidos</span>
                      </div>
                    </div>
                    <div className="mt-auto flex justify-end gap-2">
                      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">Guardar</button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Ver plan completo</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Herramientas diseñadas para docentes peruanos</h2>
            <p className="mt-4 text-xl text-gray-600">Todo lo que necesitas para potenciar tu enseñanza, ahorrar tiempo y mejorar el aprendizaje</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Planes de Lección</h3>
              <p className="text-gray-600 mb-4">Genera planes de lección completos alineados con el currículo nacional peruano en minutos.</p>
              <Link href="/lesson-plans/new" className="text-blue-600 font-medium hover:underline">
                Crear plan de lección →
              </Link>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H2a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Actividades Interactivas</h3>
              <p className="text-gray-600 mb-4">Diseña actividades educativas creativas que mantengan a tus estudiantes motivados y comprometidos.</p>
              <Link href="/activities/new" className="text-purple-600 font-medium hover:underline">
                Crear actividades →
              </Link>
            </div>
            
            <div className="bg-green-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rúbricas de Evaluación</h3>
              <p className="text-gray-600 mb-4">Crea rúbricas detalladas para evaluar el desempeño de tus estudiantes de manera objetiva y constructiva.</p>
              <Link href="/rubrics" className="text-green-600 font-medium hover:underline">
                Explorar rúbricas →
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lo que dicen los docentes</h2>
            <p className="mt-4 text-xl text-gray-600">Profesores de todo el Perú están transformando su enseñanza</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">María Sánchez</h4>
                  <p className="text-sm text-gray-500">Profesora de Primaria, Lima</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Esta plataforma ha cambiado por completo mi forma de preparar clases. Ahora puedo crear planes de lección en minutos que antes me tomaban horas."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">José Contreras</h4>
                  <p className="text-sm text-gray-500">Profesor de Matemáticas, Cusco</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Las actividades interactivas han aumentado notablemente la participación de mis estudiantes. Es sorprendente ver cómo disfrutan aprendiendo."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  L
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Laura Mendoza</h4>
                  <p className="text-sm text-gray-500">Directora de Colegio, Arequipa</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Hemos implementado esta plataforma en toda nuestra escuela y los resultados son evidentes. Nuestros docentes están más motivados y los estudiantes muestran mejor rendimiento."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comienza a transformar tu enseñanza hoy</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de docentes peruanos que ya están utilizando nuestra plataforma para potenciar su enseñanza y el aprendizaje de sus estudiantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Acceder a la plataforma
            </Link>
            <Link 
              href="/test/diagnostics" 
              className="px-8 py-4 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Probar diagnóstico
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ProfeChat</h3>
              <p className="text-gray-400">
                Plataforma de IA para docentes peruanos, diseñada para transformar la educación en el Perú.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="/curriculum" className="text-gray-400 hover:text-white">Currículo Nacional</Link></li>
                <li><Link href="/lesson-plans" className="text-gray-400 hover:text-white">Planes de Lección</Link></li>
                <li><Link href="/activities" className="text-gray-400 hover:text-white">Actividades</Link></li>
                <li><Link href="/rubrics" className="text-gray-400 hover:text-white">Rúbricas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><Link href="/test/diagnostics" className="text-gray-400 hover:text-white">Diagnóstico</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 ProfeChat. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 