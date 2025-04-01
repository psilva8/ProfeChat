'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Loading fallback for suspense
function LoadingFallback() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

// Lesson plan form component
function LessonPlanForm() {
  const searchParams = useSearchParams();
  
  // Form state
  const [subject, setSubject] = useState(searchParams?.get('subject') || '');
  const [competency, setCompetency] = useState(searchParams?.get('competency') || '');
  const [grade, setGrade] = useState(searchParams?.get('grade') || '');
  const [topic, setTopic] = useState(searchParams?.get('topic') || '');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonPlan, setLessonPlan] = useState<any | null>(null);
  
  // Handle key press for form submission (specifically Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  };
  
  // Submit form to generate lesson plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!subject || !competency || !grade || !topic) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to generate lesson plan
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
        throw new Error(result.error || 'Error al generar plan de lección');
      }
      
      // Set the generated lesson plan
      setLessonPlan(result.data);
      
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Link 
              href="/curriculum" 
              className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm font-medium mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Volver al currículo
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Generador de Planes de Lección</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">Crea planes de lección personalizados y alineados con el currículo nacional peruano en segundos. Adapta a cualquier área curricular y nivel educativo.</p>
          </div>
        </div>
        
        {/* Form Panel */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-xl font-semibold text-white">Configura tu Plan de Lección</h2>
            <p className="text-blue-100 mt-1">Completa los campos a continuación para generar un plan adaptado a tus necesidades</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Área Curricular <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                    required
                  >
                    <option value="">Selecciona un área</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Comunicación">Comunicación</option>
                    <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
                    <option value="Personal Social">Personal Social</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">El área curricular determina el enfoque y objetivos del plan</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="competency" className="block text-sm font-medium text-gray-700">
                  Competencia <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="competency"
                    value={competency}
                    onChange={(e) => setCompetency(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                    required
                  >
                    <option value="">Selecciona una competencia</option>
                    <option value="Resuelve problemas de cantidad">Resuelve problemas de cantidad</option>
                    <option value="Resuelve problemas de regularidad, equivalencia y cambio">Resuelve problemas de regularidad, equivalencia y cambio</option>
                    <option value="Comprende textos escritos">Comprende textos escritos</option>
                    <option value="Indaga mediante métodos científicos">Indaga mediante métodos científicos</option>
                    <option value="Construye interpretaciones históricas">Construye interpretaciones históricas</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">La competencia específica que deseas desarrollar en esta lección</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                  Nivel Educativo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                    required
                  >
                    <option value="">Selecciona un nivel</option>
                    <option value="INICIAL">Inicial</option>
                    <option value="PRIMARIA">Primaria</option>
                    <option value="SECUNDARIA">Secundaria</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Nivel educativo para adaptar la complejidad y actividades</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Tema Específico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: Fracciones, Comprensión lectora..."
                  className="block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                  required
                />
                <p className="text-xs text-gray-500">Especifica el tema concreto que quieres enseñar en esta lección</p>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generando plan de lección...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Generar Plan de Lección</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Error message */}
          {error && (
            <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {/* Display generated lesson plan */}
        {lessonPlan && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white">{lessonPlan.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">{lessonPlan.subject}</span>
                <span className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">{lessonPlan.grade}</span>
                <span className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">{lessonPlan.duration}</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg col-span-1">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Objetivos de Aprendizaje
                  </h3>
                  <ul className="space-y-2">
                    {lessonPlan.objectives.map((objective: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg col-span-1">
                  <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Competencias Principales
                  </h3>
                  <ul className="space-y-2">
                    {lessonPlan.competencies.map((comp: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="h-2 w-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg col-span-1">
                  <h3 className="font-medium text-green-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Materiales Necesarios
                  </h3>
                  <ul className="space-y-2">
                    {lessonPlan.materials.map((material: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Secuencia Didáctica</h3>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      Inicio ({lessonPlan.timeDistribution?.inicio || "15 minutos"})
                    </h4>
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: lessonPlan.activities.inicio.replace(/\n/g, '<br/>') }}></div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Desarrollo ({lessonPlan.timeDistribution?.desarrollo || "25 minutos"})
                    </h4>
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: lessonPlan.activities.desarrollo.replace(/\n/g, '<br/>') }}></div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Cierre ({lessonPlan.timeDistribution?.cierre || "10 minutos"})
                    </h4>
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: lessonPlan.activities.cierre.replace(/\n/g, '<br/>') }}></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluación</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: lessonPlan.evaluation.replace(/\n/g, '<br/>') }}></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Adaptaciones y Diferenciación</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: lessonPlan.differentiation.replace(/\n/g, '<br/>') }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    // In a real app, this would save the lesson plan
                    alert('Plan de lección guardado exitosamente!');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Guardar Plan
                </button>
                
                <button
                  onClick={() => {
                    // In a real app, this would export the lesson plan to PDF
                    alert('Funcionalidad de exportar a PDF en desarrollo');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  Exportar a PDF
                </button>
                
                <button
                  onClick={() => {
                    // In a real app, this would share the lesson plan
                    alert('Compartir plan de lección');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Compartir Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main page component
export default function NewLessonPlanPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LessonPlanForm />
    </Suspense>
  );
} 