'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface LessonPlan {
  inicio: {
    duracion: string;
    actividades: string[];
    materiales: string[];
  };
  desarrollo: {
    duracion: string;
    actividades: string[];
    materiales: string[];
  };
  cierre: {
    duracion: string;
    actividades: string[];
    evaluacion: string[];
  };
  adaptaciones: string[];
  tarea: string;
  recursos_adicionales: string[];
}

export default function LessonPlanner() {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      if (!data.openai_key_configured) {
        throw new Error('La clave de API de OpenAI no está configurada correctamente');
      }
      
      if (data.status !== 'healthy') {
        throw new Error('El servidor no está respondiendo correctamente');
      }
      
      return true;
    } catch (error) {
      console.error('Error checking server health:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLessonPlan(null);

    try {
      // Check server health first
      const isHealthy = await checkServerHealth();
      if (!isHealthy) {
        throw new Error('El servidor no está disponible. Por favor, inténtelo de nuevo más tarde.');
      }

      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          objectives,
          duration
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al generar el plan de lección');
      }

      setLessonPlan(data.lesson_plan);
      toast.success('¡Plan de lección generado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Generador de Planes de Lección</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asignatura
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grado
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivos de Aprendizaje
          </label>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (en minutos)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generando...' : 'Generar Plan de Lección'}
        </button>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {lessonPlan && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Plan de Lección Generado</h2>
          
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Inicio ({lessonPlan.inicio.duracion})</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Actividades:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.inicio.actividades.map((actividad, index) => (
                      <li key={index}>{actividad}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Materiales:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.inicio.materiales.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Desarrollo ({lessonPlan.desarrollo.duracion})</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Actividades:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.desarrollo.actividades.map((actividad, index) => (
                      <li key={index}>{actividad}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Materiales:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.desarrollo.materiales.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Cierre ({lessonPlan.cierre.duracion})</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Actividades:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.cierre.actividades.map((actividad, index) => (
                      <li key={index}>{actividad}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Evaluación:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {lessonPlan.cierre.evaluacion.map((criterio, index) => (
                      <li key={index}>{criterio}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Adaptaciones</h3>
              <ul className="list-disc pl-5 space-y-2">
                {lessonPlan.adaptaciones.map((adaptacion, index) => (
                  <li key={index}>{adaptacion}</li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Tarea</h3>
              <p>{lessonPlan.tarea}</p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recursos Adicionales</h3>
              <ul className="list-disc pl-5 space-y-2">
                {lessonPlan.recursos_adicionales.map((recurso, index) => (
                  <li key={index}>{recurso}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
} 