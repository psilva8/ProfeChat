'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  AcademicCapIcon, 
  DocumentCheckIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Planificador de Lecciones',
    description: 'Crea planes de lecciones detallados alineados con el currículo peruano.',
    icon: BookOpenIcon,
    href: '/lesson-planner',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'Planificador de Unidades',
    description: 'Diseña planes de unidad completos con desgloses semanales y objetivos.',
    icon: ClipboardDocumentListIcon,
    href: '/unit-planner',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Generador de Actividades',
    description: 'Genera actividades y ejercicios atractivos para el aula.',
    icon: AcademicCapIcon,
    href: '/activities',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Creador de Rúbricas',
    description: 'Crea rúbricas de evaluación detalladas para cualquier tipo de tarea.',
    icon: DocumentCheckIcon,
    href: '/rubrics',
    color: 'from-orange-500 to-pink-500'
  },
];

const faqs = [
  {
    question: '¿Cómo funciona ProfeChat?',
    answer: 'ProfeChat utiliza inteligencia artificial avanzada para generar contenido educativo personalizado. Solo necesitas ingresar información básica como el grado, asignatura y tema, y el sistema generará el contenido adaptado a tus necesidades.',
  },
  {
    question: '¿El contenido está alineado con el currículo nacional?',
    answer: 'Sí, todo el contenido generado está alineado con el Currículo Nacional de la Educación Básica (CNEB) del Perú.',
  },
  {
    question: '¿Puedo editar el contenido generado?',
    answer: 'Sí, todo el contenido generado puede ser editado y adaptado según tus necesidades específicas.',
  },
  {
    question: '¿Qué niveles educativos cubre?',
    answer: 'Actualmente cubrimos todos los grados de educación primaria (1° a 6° grado).',
  },
  {
    question: '¿Necesito una cuenta para usar ProfeChat?',
    answer: 'No, ProfeChat es de acceso libre para todos los docentes peruanos.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-blue-500/90" />
        </div>
        <div className="relative">
          <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Tu Asistente de</span>
                <span className="block text-indigo-200">Planificación Educativa</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
                Genera planes de lección, unidades y rúbricas alineadas con el currículo peruano en minutos
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 md:py-4 md:px-10"
                >
                  Comenzar
                </Link>
                <Link
                  href="#features"
                  className="rounded-md bg-indigo-500 bg-opacity-20 px-8 py-3 text-base font-medium text-white hover:bg-opacity-30 md:py-4 md:px-10"
                >
                  Conoce más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Herramientas para Docentes
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Todo lo que necesitas para planificar tus clases de manera eficiente
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <feature.icon className="h-12 w-12 text-indigo-600 mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-700">
                      <span className="text-sm font-medium">Explorar</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Encuentra respuestas a las preguntas más comunes sobre ProfeChat
            </p>
          </div>
          <div className="mt-16 max-w-3xl mx-auto">
            <dl className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <dt className="text-lg font-semibold text-gray-900 mb-4">
                    {faq.question}
                  </dt>
                  <dd className="text-gray-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} ProfeChat. Todos los derechos reservados.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-gray-500">
                Términos de uso
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 