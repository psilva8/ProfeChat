import React from 'react';
import { ActivityForm } from '@/components/activities/activity-form';

export default function NewActivityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Crear Actividad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa el formulario a continuación para generar una actividad educativa personalizada usando IA.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <ActivityForm />
        </div>
      </div>
    </div>
  );
} 