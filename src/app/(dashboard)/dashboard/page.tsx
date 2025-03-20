import React from 'react';
import Link from 'next/link';
import { DocumentTextIcon, ClipboardDocumentListIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Crear Plan de Lección',
    description: 'Genera un nuevo plan de lección alineado con el currículo',
    href: '/dashboard/lesson-plans/new',
    icon: DocumentTextIcon,
    color: 'bg-accent-500',
  },
  {
    name: 'Crear Rúbrica',
    description: 'Diseña una nueva rúbrica de evaluación',
    href: '/dashboard/rubrics/new',
    icon: ClipboardDocumentListIcon,
    color: 'bg-navy-600',
  },
  {
    name: 'Generar Actividad',
    description: 'Crea una actividad educativa personalizada',
    href: '/dashboard/activities/new',
    icon: BookOpenIcon,
    color: 'bg-accent-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido a ProfeChat. ¿Qué deseas crear hoy?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="relative flex items-center space-x-4 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}>
              <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="truncate text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
        <div className="mt-4 rounded-lg border border-gray-300 bg-white shadow">
          <div className="p-6 text-center text-gray-500">
            No hay actividad reciente para mostrar.
          </div>
        </div>
      </div>
    </div>
  );
} 