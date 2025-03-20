'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Rubrics() {
  const [loading, setLoading] = useState(false);
  const [rubric, setRubric] = useState('');
  const [formData, setFormData] = useState({
    assignmentType: '',
    gradeLevel: '',
    criteria: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/proxy/generate-rubric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          criteria: formData.criteria.filter(c => c.trim() !== ''),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRubric(data.rubric);
        toast.success('¡Rúbrica generada exitosamente!');
      } else {
        toast.error(data.error || 'Error al generar la rúbrica');
      }
    } catch (error) {
      toast.error('Ocurrió un error al generar la rúbrica');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = value;
    setFormData(prev => ({ ...prev, criteria: newCriteria }));
  };

  const addCriteria = () => {
    setFormData(prev => ({ ...prev, criteria: [...prev.criteria, ''] }));
  };

  const removeCriteria = (index: number) => {
    if (formData.criteria.length > 1) {
      const newCriteria = formData.criteria.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, criteria: newCriteria }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Generador de Rúbricas</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Crea rúbricas de evaluación detalladas para cualquier tipo de tarea.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label htmlFor="assignmentType" className="block text-sm font-medium leading-6 text-gray-900">
              Tipo de Tarea
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="assignmentType"
                id="assignmentType"
                required
                placeholder="ej., Ensayo, Proyecto, Presentación"
                value={formData.assignmentType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium leading-6 text-gray-900">
              Grado
            </label>
            <div className="mt-2">
              <select
                id="gradeLevel"
                name="gradeLevel"
                required
                value={formData.gradeLevel}
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Criterios de Evaluación
              </label>
              <button
                type="button"
                onClick={addCriteria}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                + Agregar Criterio
              </button>
            </div>
            <div className="mt-2 space-y-4">
              {formData.criteria.map((criterion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={criterion}
                    onChange={(e) => handleCriteriaChange(index, e.target.value)}
                    placeholder="ej., Organización del Contenido, Pensamiento Crítico"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formData.criteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriteria(index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Eliminar
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
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar Rúbrica'}
          </button>
        </div>
      </form>

      {rubric && (
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Rúbrica Generada</h3>
          <div className="mt-4 rounded-md bg-white p-6 shadow">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{rubric}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 