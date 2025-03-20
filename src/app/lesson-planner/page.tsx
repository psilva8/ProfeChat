'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LessonPlanner() {
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLessonPlan('');
    
    try {
      // First check if the Flask server is running
      const healthCheck = await fetch('/api/proxy/health');
      const healthStatus = await healthCheck.json();
      
      if (healthStatus.status !== 'healthy') {
        throw new Error('El servidor Flask no está funcionando correctamente. Por favor, intente nuevamente.');
      }
      
      if (!healthStatus.openai_key_configured) {
        throw new Error('La clave de API de OpenAI no está configurada correctamente.');
      }

      const response = await fetch('/api/proxy/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `¡Error HTTP! estado: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lesson_plan);
        toast.success('¡Plan de lección generado exitosamente!');
      } else {
        throw new Error(data.error || 'Error al generar el plan de lección');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Planificador de Lecciones</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Genera planes de lecciones detallados alineados con el currículo peruano.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
              Asignatura
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="subject"
                id="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="ej., Matemáticas, Ciencias, Comunicación"
              />
            </div>
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium leading-6 text-gray-900">
              Grado
            </label>
            <div className="mt-2">
              <select
                id="grade"
                name="grade"
                required
                value={formData.grade}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Seleccionar grado</option>
                {[1, 2, 3, 4, 5, 6].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}° Grado
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium leading-6 text-gray-900">
              Tema
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="topic"
                id="topic"
                required
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="ej., Fracciones, Sistema Solar, Producción de Textos"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </span>
            ) : (
              'Generar Plan de Lección'
            )}
          </button>
        </div>
      </form>

      {lessonPlan && (
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Plan de Lección Generado</h3>
          <div className="mt-4 rounded-md bg-white p-6 shadow">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{lessonPlan}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 