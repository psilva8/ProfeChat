'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NewLessonPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [subject, setSubject] = useState(searchParams?.get('subject') || '');
  const [competency, setCompetency] = useState(searchParams?.get('competency') || '');
  const [grade, setGrade] = useState(searchParams?.get('grade') || '');
  const [topic, setTopic] = useState('');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonPlan, setLessonPlan] = useState<any | null>(null);
  
  // Submit form to generate lesson plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!subject || !competency || !grade || !topic) {
      setError('Please fill in all fields');
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
        throw new Error(result.error || 'Failed to generate lesson plan');
      }
      
      // Set the generated lesson plan
      setLessonPlan(result.data);
      
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
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
      
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Plan de Lección</h1>
      
      {/* Form for lesson plan generation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Área Curricular
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Nivel Educativo
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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
              <label htmlFor="competency" className="block text-sm font-medium text-gray-700 mb-1">
                Competencia
              </label>
              <select
                id="competency"
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecciona una competencia</option>
                {subject === 'Matemática' && (
                  <>
                    <option value="Resuelve problemas de cantidad">Resuelve problemas de cantidad</option>
                    <option value="Resuelve problemas de regularidad, equivalencia y cambio">Resuelve problemas de regularidad, equivalencia y cambio</option>
                  </>
                )}
                {subject === 'Comunicación' && (
                  <>
                    <option value="Se comunica oralmente en su lengua materna">Se comunica oralmente en su lengua materna</option>
                    <option value="Lee diversos tipos de textos escritos en su lengua materna">Lee diversos tipos de textos escritos en su lengua materna</option>
                  </>
                )}
                {subject === 'Ciencia y Tecnología' && (
                  <>
                    <option value="Indaga mediante métodos científicos para construir sus conocimientos">Indaga mediante métodos científicos</option>
                    <option value="Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía">Explica el mundo físico</option>
                  </>
                )}
                {subject === 'Personal Social' && (
                  <>
                    <option value="Construye su identidad">Construye su identidad</option>
                    <option value="Convive y participa democráticamente en la búsqueda del bien común">Convive y participa democráticamente</option>
                  </>
                )}
              </select>
            </div>
            
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Tema Específico
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Área Curricular</p>
              <p className="font-medium">{lessonPlan.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nivel</p>
              <p className="font-medium">{lessonPlan.grade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Competencia</p>
              <p className="font-medium">{lessonPlan.competency}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Estándar de Aprendizaje</h3>
            <p className="bg-blue-50 p-3 rounded">{lessonPlan.learningStandard}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
            <ul className="list-disc list-inside space-y-1">
              {lessonPlan.objectives.map((objective: string, index: number) => (
                <li key={index} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Materiales</h3>
            <ul className="list-disc list-inside space-y-1">
              {lessonPlan.materials.map((material: string, index: number) => (
                <li key={index} className="text-gray-700">{material}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Actividades</h3>
            <div className="space-y-3">
              {lessonPlan.activities.map((activity: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                  <p className="font-medium">{activity.title} <span className="text-gray-500 text-sm">({activity.duration})</span></p>
                  <p className="text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Evaluación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Formativa</h4>
                <ul className="list-disc list-inside space-y-1">
                  {lessonPlan.assessment.formative.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Sumativa</h4>
                <ul className="list-disc list-inside space-y-1">
                  {lessonPlan.assessment.summative.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Criterios de Evaluación</h3>
            <ul className="list-disc list-inside space-y-1">
              {lessonPlan.standardsCriteria.map((criterion: string, index: number) => (
                <li key={index} className="text-gray-700">{criterion}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Extensiones</h3>
            <ul className="list-disc list-inside space-y-1">
              {lessonPlan.extensions.map((extension: string, index: number) => (
                <li key={index} className="text-gray-700">{extension}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                // In a real app, this would save to database
                alert('Plan de lección guardado exitosamente!');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Guardar Plan
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would generate a PDF
                alert('Funcionalidad de exportar PDF en desarrollo');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Exportar PDF
            </button>
            
            <Link
              href="/activities/new"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Generar Actividades
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 