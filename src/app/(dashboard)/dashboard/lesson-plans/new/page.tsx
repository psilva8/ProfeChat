'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewLessonPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const data = {
      subject: formData.get('subject'),
      grade: formData.get('grade'),
      topic: formData.get('topic'),
      objectives: formData.get('objectives'),
      duration: formData.get('duration'),
    };

    try {
      const response = await fetch('/api/lesson-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const result = await response.json();
      router.push(`/dashboard/lesson-plans/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Plan de Lección</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Asignatura
          </label>
          <select
            id="subject"
            name="subject"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
          >
            <option value="">Seleccionar asignatura</option>
            <option value="matematicas">Matemáticas</option>
            <option value="lenguaje">Lenguaje y Comunicación</option>
            <option value="ciencias">Ciencias Naturales</option>
            <option value="historia">Historia y Ciencias Sociales</option>
          </select>
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grado
          </label>
          <select
            id="grade"
            name="grade"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
          >
            <option value="">Seleccionar grado</option>
            <option value="1">1° Básico</option>
            <option value="2">2° Básico</option>
            <option value="3">3° Básico</option>
            <option value="4">4° Básico</option>
            <option value="5">5° Básico</option>
            <option value="6">6° Básico</option>
          </select>
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Tema
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            placeholder="Ej: Multiplicación de fracciones"
          />
        </div>

        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
            Objetivos de Aprendizaje
          </label>
          <textarea
            id="objectives"
            name="objectives"
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            placeholder="Describe los objetivos principales de la lección"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            required
            min="15"
            max="180"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Generando...' : 'Generar Plan de Lección'}
        </button>
      </form>
    </div>
  );
} 