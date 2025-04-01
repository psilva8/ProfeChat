'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Competency {
  id: string;
  name: string;
  description: string;
  standards: {
    [grade: string]: string[];
  };
}

interface CompetencySection {
  id: string;
  area: string;
  description: string;
  competencies: Competency[];
}

export default function CurriculumPage() {
  const [curriculumData, setCurriculumData] = useState<CompetencySection[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch curriculum data
  useEffect(() => {
    const fetchCurriculum = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/curriculum');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setCurriculumData(data.data);
          if (data.data.length > 0) {
            setSelectedArea(data.data[0].id);
          }
        } else {
          throw new Error('Failed to load curriculum data');
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err);
        setError('No se pudo cargar el currículo. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, []);

  // Filter curriculum data based on search query
  const filteredData = searchQuery
    ? curriculumData.map(section => ({
        ...section,
        competencies: section.competencies.filter(comp => 
          comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.competencies.length > 0)
    : curriculumData;

  // Get current section
  const currentSection = filteredData.find(section => section.id === selectedArea) || null;
  
  // Grade levels
  const gradeLevels = ["INICIAL", "PRIMARIA", "SECUNDARIA"];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Currículo Nacional Peruano
            </h1>
            <p className="mt-3 text-xl text-blue-100 max-w-2xl mx-auto">
              Explora las áreas curriculares, competencias y estándares para diferentes niveles educativos
            </p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white shadow-lg rounded-xl px-6 py-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar competencias, estándares o palabras clave..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Cargando currículo...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xl text-gray-800 font-medium">{error}</p>
            <button 
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Áreas Curriculares</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredData.map((section) => (
                    <button
                      key={section.id}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                        selectedArea === section.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedArea(section.id);
                        setSelectedCompetency(null);
                      }}
                    >
                      <div className="font-medium text-gray-900">{section.area}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {section.competencies.length} competencias
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Levels filter */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Niveles</h2>
                </div>
                <div className="px-4 py-3">
                  <div className="space-y-2">
                    {gradeLevels.map((grade) => (
                      <div key={grade} className="flex items-center">
                        <input
                          id={`grade-${grade}`}
                          name="grade"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={selectedGrade === grade}
                          onChange={() => setSelectedGrade(grade)}
                        />
                        <label htmlFor={`grade-${grade}`} className="ml-3 block text-sm text-gray-700">
                          {grade}
                        </label>
                      </div>
                    ))}
                    {selectedGrade && (
                      <button
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedGrade('')}
                      >
                        Borrar selección
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-3">
              {currentSection && !selectedCompetency ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-900">{currentSection.area}</h2>
                    <p className="mt-2 text-gray-600">{currentSection.description}</p>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {currentSection.competencies.map((competency) => (
                      <div key={competency.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                        <div 
                          className="cursor-pointer"
                          onClick={() => setSelectedCompetency(competency)}
                        >
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{competency.name}</h3>
                          <p className="mt-1 text-gray-600">{competency.description}</p>
                          
                          {/* Standards preview */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {Object.keys(competency.standards)
                              .filter(grade => !selectedGrade || grade === selectedGrade)
                              .map(grade => (
                                <span 
                                  key={grade} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {grade}
                                </span>
                              ))}
                          </div>
                          
                          <button 
                            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCompetency(competency);
                            }}
                          >
                            Ver estándares
                            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedCompetency ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                        onClick={() => setSelectedCompetency(null)}
                      >
                        <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Volver a competencias
                      </button>
                      <Link 
                        href={`/lesson-plans/new?competency=${encodeURIComponent(selectedCompetency.name)}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Crear plan con esta competencia
                      </Link>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-medium text-gray-900">{selectedCompetency.name}</h2>
                    <p className="mt-2 text-gray-600">{selectedCompetency.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentSection && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {currentSection.area}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-6 py-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Estándares por nivel educativo</h3>
                    
                    <div className="space-y-6">
                      {Object.entries(selectedCompetency.standards)
                        .filter(([grade]) => !selectedGrade || grade === selectedGrade)
                        .map(([grade, standards]) => (
                          <div key={grade} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3">{grade}</h4>
                            <ul className="space-y-3">
                              {standards.map((standard, index) => (
                                <li key={index} className="flex">
                                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-3 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700">{standard}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-4 flex justify-end">
                              <Link 
                                href={`/activities/new?grade=${encodeURIComponent(grade)}&competency=${encodeURIComponent(selectedCompetency.name)}`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Generar actividades
                                <svg className="ml-1.5 -mr-0.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Selecciona un área curricular</h3>
                  <p className="mt-2 text-gray-500">Elige un área curricular para ver sus competencias y estándares</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 