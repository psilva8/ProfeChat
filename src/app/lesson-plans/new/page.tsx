'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Create a client component that uses useSearchParams
function LessonPlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get any initial values from URL parameters
  const initialSubject = searchParams?.get('subject') || '';
  const initialCompetency = searchParams?.get('competency') || '';
  const initialGrade = searchParams?.get('grade') || '';
  const initialTopic = searchParams?.get('topic') || '';
  
  // Form state
  const [subject, setSubject] = useState(initialSubject);
  const [competency, setCompetency] = useState(initialCompetency);
  const [grade, setGrade] = useState(initialGrade);
  const [topic, setTopic] = useState(initialTopic);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonPlan, setLessonPlan] = useState<any | null>(null);
  
  // Submit form to generate lesson plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!subject || !grade || !topic) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to generate a lesson plan
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          competency,
          grade,
          topic,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al generar el plan de lección');
      }
      
      // Set the generated lesson plan
      setLessonPlan(result.lesson_plan);
      
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle key press for form submission (specifically Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link 
          href="/curriculum" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al currículo
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Generar Plan de Lección</h1>
      
      {/* Form for lesson plan generation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Área Curricular <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecciona un área</option>
                <option value="Matemática">Matemática</option>
                <option value="Comunicación">Comunicación</option>
                <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
                <option value="Personal Social">Personal Social</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="competency" className="block text-sm font-medium text-gray-700 mb-1">
                Competencia 
              </label>
              <input
                type="text"
                id="competency"
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ej: Resuelve problemas de cantidad"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Nivel Educativo <span className="text-red-500">*</span>
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecciona un nivel</option>
                <option value="INICIAL">Inicial</option>
                <option value="PRIMARIA">Primaria</option>
                <option value="SECUNDARIA">Secundaria</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Tema Específico <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ej: Fracciones, Narración de cuentos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Generando...' : 'Generar Plan de Lección'}
            </button>
          </div>
        </form>
        
        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Display generated lesson plan */}
      {lessonPlan && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">{lessonPlan.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-500">Área:</span>
              <p className="font-medium">{lessonPlan.subject}</p>
            </div>
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-500">Nivel:</span>
              <p className="font-medium">{lessonPlan.grade}</p>
            </div>
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-500">Duración:</span>
              <p className="font-medium">{lessonPlan.duration}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              {lessonPlan.objectives.map((objective: string, index: number) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Estándares</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              {lessonPlan.standards.map((standard: string, index: number) => (
                <li key={index}>{standard}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Materiales</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              {lessonPlan.materials.map((material: string, index: number) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Inicio ({lessonPlan.warmup.duration})</h3>
            <p>{lessonPlan.warmup.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Actividades</h3>
            {lessonPlan.activities.map((activity: any, index: number) => (
              <div key={index} className="mb-4 border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">{activity.title} ({activity.duration})</h4>
                <p>{activity.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cierre ({lessonPlan.closure.duration})</h3>
            <p>{lessonPlan.closure.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Evaluación</h3>
            <p>{lessonPlan.assessment.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tarea</h3>
            <p>{lessonPlan.homework.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Diferenciación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-600">Para estudiantes avanzados:</h4>
                <p>{lessonPlan.differentiation.advanced}</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600">Para estudiantes que necesitan apoyo:</h4>
                <p>{lessonPlan.differentiation.support}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Notas adicionales</h3>
            <p>{lessonPlan.notes}</p>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => {
                // In a real app, this would save the lesson plan to database
                alert('Plan de lección guardado exitosamente!');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Guardar Plan
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would export the lesson plan to PDF
                alert('Funcionalidad de exportar a PDF en desarrollo');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Exportar a PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Create a loading fallback
function LoadingFallback() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

// Main page component that wraps everything in Suspense
export default function NewLessonPlanPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LessonPlanForm />
    </Suspense>
  );
} 