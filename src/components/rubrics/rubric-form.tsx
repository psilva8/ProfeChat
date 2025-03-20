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

export function RubricForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    subject: '',
    criteria: [{ name: '', description: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriteriaChange = (index: number, field: string, value: string) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setFormData((prev) => ({ ...prev, criteria: newCriteria }));
  };

  const addCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { name: '', description: '' }],
    }));
  };

  const removeCriteria = (index: number) => {
    if (formData.criteria.length > 1) {
      const newCriteria = formData.criteria.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, criteria: newCriteria }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/rubrics/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al generar la rúbrica');
      }

      const data = await response.json();
      toast.success('Rúbrica generada exitosamente');
      router.push(`/dashboard/rubrics/${data.id}`);
    } catch (error) {
      toast.error('Ocurrió un error al generar la rúbrica');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título de la Rúbrica
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ej: Evaluación de Presentación Oral"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
          />
        </div>

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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Criterios de Evaluación</h3>
            <button
              type="button"
              onClick={addCriteria}
              className="text-sm font-medium text-accent-600 hover:text-accent-500"
            >
              + Agregar Criterio
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {formData.criteria.map((criterion, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                    placeholder="Nombre del criterio"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    value={criterion.description}
                    onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                    placeholder="Descripción del criterio"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                  />
                </div>
                {formData.criteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCriteria(index)}
                    className="mt-1 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Eliminar criterio</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : 'Generar Rúbrica'}
        </button>
      </div>
    </form>
  );
} 