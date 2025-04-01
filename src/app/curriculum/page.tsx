'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CompetencySection {
  title: string;
  description: string;
  grade: string;
  competencies: Competency[];
}

interface Competency {
  name: string;
  description: string;
  standards: Standard[];
}

interface Standard {
  gradeLevel: string;
  description: string;
  criteria: string[];
}

export default function CurriculumPage() {
  const [curriculumData, setCurriculumData] = useState<CompetencySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  
  // Load curriculum data on page load
  useEffect(() => {
    fetchCurriculumData();
  }, []);
  
  // Fetch curriculum data from API
  const fetchCurriculumData = async (query = '', grade = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (query) queryParams.append('query', query);
      if (grade) queryParams.append('grade', grade);
      
      const response = await fetch(`/api/curriculum?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error fetching curriculum data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setCurriculumData(data.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching curriculum data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCurriculumData(searchQuery, selectedGrade);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Currículo Nacional de Educación Básica</h1>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por competencia o área
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: matemática, comunicación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="md:w-1/4">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Nivel educativo
            </label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos los niveles</option>
              <option value="INICIAL">Inicial</option>
              <option value="PRIMARIA">Primaria</option>
              <option value="SECUNDARIA">Secundaria</option>
            </select>
          </div>
          
          <div className="md:self-end">
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Curriculum sections */
        <div className="space-y-8">
          {curriculumData.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron resultados para tu búsqueda. Intenta con otros términos.
            </p>
          ) : (
            curriculumData.map((section, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                <div className="bg-blue-600 text-white p-4">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="text-sm mt-1">{section.grade}</p>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-2">Competencias</h3>
                  <div className="space-y-4">
                    {section.competencies.map((competency, cIndex) => (
                      <div key={cIndex} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="text-md font-semibold">{competency.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{competency.description}</p>
                        
                        {competency.standards && competency.standards.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-sm font-semibold">Estándares de Aprendizaje - {competency.standards[0].gradeLevel}</h5>
                            <p className="text-sm mb-2">{competency.standards[0].description}</p>
                            
                            <h5 className="text-sm font-semibold mt-2">Criterios:</h5>
                            <ul className="list-disc list-inside text-sm">
                              {competency.standards[0].criteria.map((criterion, crIndex) => (
                                <li key={crIndex} className="text-gray-700">{criterion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <Link 
                            href={`/lesson-plans/new?competency=${encodeURIComponent(competency.name)}&subject=${encodeURIComponent(section.title)}&grade=${encodeURIComponent(section.grade)}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Crear plan de lección basado en esta competencia
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 