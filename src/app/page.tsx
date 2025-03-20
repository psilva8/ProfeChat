'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  AcademicCapIcon, 
  DocumentCheckIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Planificador de Lecciones',
    description: 'Crea planes de lecciones detallados alineados con el currículo peruano.',
    icon: BookOpenIcon,
    href: '/lesson-planner',
  },
  {
    name: 'Planificador de Unidades',
    description: 'Diseña planes de unidad completos con desgloses semanales y objetivos.',
    icon: ClipboardDocumentListIcon,
    href: '/unit-planner',
  },
  {
    name: 'Generador de Actividades',
    description: 'Genera actividades y ejercicios atractivos para el aula.',
    icon: AcademicCapIcon,
    href: '/activities',
  },
  {
    name: 'Creador de Rúbricas',
    description: 'Crea rúbricas de evaluación detalladas para cualquier tipo de tarea.',
    icon: DocumentCheckIcon,
    href: '/rubrics',
  },
];

export default function Home() {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Asistente de Planificación Educativa
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Genera planes de lección, unidades y rúbricas alineadas con el currículo peruano en minutos
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Herramientas para Docentes
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold mb-4">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} ProfeChat. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 