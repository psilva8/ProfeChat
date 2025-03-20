'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function UnitPlanner() {
  const [loading, setLoading] = useState(false);
  const [unitPlan, setUnitPlan] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    mainTopic: '',
    duration: '4 semanas',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/proxy/generate-unit-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUnitPlan(data.unit_plan);
        toast.success('¡Plan de unidad generado exitosamente!');
      } else {
        toast.error(data.error || 'Error al generar el plan de unidad');
      }
    } catch (error) {
      toast.error('Ocurrió un error al generar el plan de unidad');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Planificador de Unidades</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Genera planes de unidad completos alineados con el currículo peruano.
        </p>
      </div>

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
            <label htmlFor="mainTopic" className="block text-sm font-medium leading-6 text-gray-900">
              Tema Principal
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="mainTopic"
                id="mainTopic"
                required
                value={formData.mainTopic}
                onChange={handleInputChange}
                placeholder="ej., Números Decimales, El Cuerpo Humano, Textos Narrativos"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
              Duración
            </label>
            <div className="mt-2">
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="2 semanas">2 semanas</option>
                <option value="4 semanas">4 semanas</option>
                <option value="6 semanas">6 semanas</option>
                <option value="8 semanas">8 semanas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar Plan de Unidad'}
          </button>
        </div>
      </form>

      {unitPlan && (
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Plan de Unidad Generado</h3>
          <div className="mt-4 rounded-md bg-white p-6 shadow">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{unitPlan}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 