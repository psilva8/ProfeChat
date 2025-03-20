import React from 'react';
import { RubricForm } from '@/components/rubrics/rubric-form';

export default function NewRubricPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Crear Rúbrica</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa el formulario a continuación para generar una rúbrica de evaluación personalizada usando IA.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <RubricForm />
        </div>
      </div>
    </div>
  );
} 