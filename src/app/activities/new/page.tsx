'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';

interface Activity {
  title: string;
  description: string;
  objective: string;
  timeRequired: string;
  materials: string[];
  procedure: string[];
  assessment: string;
  differentiation: string;
}

// Activities form component 
function ActivitiesForm() {
  // Form state
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  
  // Submit form to generate activities
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!subject || !grade || !topic) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to generate activities
      const response = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          grade,
          topic,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate activities');
      }
      
      // Set the generated activities
      setActivities(result.data);
      
    } catch (err) {
      console.error('Error generating activities:', err);
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
      
      <h1 className="text-2xl font-bold mb-6">Generar Actividades Educativas</h1>
      
      {/* Form for activities generation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {loading ? 'Generando...' : 'Generar Actividades'}
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
      
      {/* Display generated activities */}
      {activities && activities.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold">Actividades Generadas</h2>
          
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
              
              <div className="mb-4">
                <p className="text-gray-700">{activity.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Objetivo</h4>
                  <p className="text-gray-700">{activity.objective}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Tiempo Requerido</h4>
                  <p className="text-gray-700">{activity.timeRequired}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-blue-600 mb-2">Materiales</h4>
                <ul className="list-disc list-inside space-y-1">
                  {activity.materials.map((material, i) => (
                    <li key={i} className="text-gray-700">{material}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-blue-600 mb-2">Procedimiento</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {activity.procedure.map((step, i) => (
                    <li key={i} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Evaluación</h4>
                  <p className="text-gray-700">{activity.assessment}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Diferenciación</h4>
                  <p className="text-gray-700">{activity.differentiation}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    // In a real app, this would save the activity to database
                    alert(`Actividad "${activity.title}" guardada exitosamente!`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-3"
                >
                  Guardar Actividad
                </button>
                
                <button
                  onClick={() => {
                    // In a real app, this would export the activity to PDF
                    alert('Funcionalidad de exportar a PDF en desarrollo');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Exportar a PDF
                </button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                // In a real app, this would save all activities to database
                alert('Todas las actividades guardadas exitosamente!');
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Guardar Todas las Actividades
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

// Main page component wrapping everything in Suspense
export default function NewActivitiesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ActivitiesForm />
    </Suspense>
  );
} 