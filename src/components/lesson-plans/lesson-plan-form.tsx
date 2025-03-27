'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const gradeOptions = [
  { value: '1', label: '1° Primaria' },
  { value: '2', label: '2° Primaria' },
  { value: '3', label: '3° Primaria' },
  { value: '4', label: '4° Primaria' },
  { value: '5', label: '5° Primaria' },
  { value: '6', label: '6° Primaria' },
];

const subjectOptions = [
  { value: 'matematicas', label: 'Matemáticas' },
  { value: 'comunicacion', label: 'Comunicación' },
  { value: 'ciencias', label: 'Ciencias' },
  { value: 'sociales', label: 'Ciencias Sociales' },
];

export function LessonPlanForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    duration: '60',
    objectives: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/lesson-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan de lección');
      }

      const data = await response.json();
      toast.success('Plan de lección generado exitosamente');
      router.push(`/dashboard/lesson-plans/${data.id}`);
    } catch {
      toast.error('Ocurrió un error al generar el plan de lección');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grado
          </label>
          <select
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          >
            <option value="">Selecciona un grado</option>
            {gradeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Asignatura
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          >
            <option value="">Selecciona una asignatura</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Tema
          </label>
          <input
            type="text"
            name="topic"
            id="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="Ej: Fracciones equivalentes"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="30"
            max="180"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
            Objetivos de Aprendizaje
          </label>
          <textarea
            id="objectives"
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            rows={3}
            placeholder="Describe los objetivos principales de la lección"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : 'Generar Plan de Lección'}
        </button>
      </div>
    </form>
  );
} 