'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Activities() {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[] | string>('');
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    activityType: 'individual',
    duration: '30 minutos',
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/proxy/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActivities(typeof data.activities === 'string' ? data.activities : JSON.stringify(data.activities, null, 2));
        toast.success('¡Actividades generadas exitosamente!');
      } else {
        toast.error(data.error || 'Error al generar las actividades');
      }
    } catch (error) {
      toast.error('Ocurrió un error al generar las actividades');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setActivities(data);
        } else if (typeof data === 'object') {
          setActivities(JSON.stringify(data, null, 2));
        } else {
          setActivities(String(data));
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Generador de Actividades</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Crea actividades educativas atractivas y ejercicios para tus estudiantes.
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
                placeholder="ej., Matemáticas, Ciencias, Comunicación"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                placeholder="ej., Multiplicación, Ecosistemas, Comprensión Lectora"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="activityType" className="block text-sm font-medium leading-6 text-gray-900">
              Tipo de Actividad
            </label>
            <div className="mt-2">
              <select
                id="activityType"
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="individual">Individual</option>
                <option value="group">Grupal</option>
                <option value="pairs">En Parejas</option>
                <option value="whole-class">Clase Completa</option>
              </select>
            </div>
          </div>

          <div>
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
                <option value="15 minutos">15 minutos</option>
                <option value="30 minutos">30 minutos</option>
                <option value="45 minutos">45 minutos</option>
                <option value="60 minutos">60 minutos</option>
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
            {loading ? 'Generando...' : 'Generar Actividades'}
          </button>
        </div>
      </form>

      {activities && (
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actividades Generadas</h3>
          <div className="mt-4 rounded-md bg-white p-6 shadow">
            {typeof activities === 'string' ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{activities}</pre>
            ) : Array.isArray(activities) ? (
              <ul className="list-disc pl-5 space-y-2">
                {activities.map((activity, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {typeof activity === 'object' ? 
                      JSON.stringify(activity, null, 2) : 
                      String(activity)}
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {JSON.stringify(activities, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 