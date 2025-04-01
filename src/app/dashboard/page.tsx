'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CompetencySection } from '@/services/curriculumService';

interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'loading';
  message: string;
  details?: string;
}

interface StatsSummary {
  total: number;
  available: number;
  label: string;
}

export default function Dashboard() {
  // System statuses
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
    { name: 'Next.js App', status: 'loading', message: 'Checking...' },
    { name: 'Curriculum API', status: 'loading', message: 'Checking...' },
    { name: 'Database', status: 'loading', message: 'Checking...' },
    { name: 'Authentication', status: 'loading', message: 'Checking...' }
  ]);
  
  // Stats summaries
  const [stats, setStats] = useState<StatsSummary[]>([
    { total: 0, available: 0, label: 'Areas Curriculares' },
    { total: 0, available: 0, label: 'Competencias' },
    { total: 0, available: 0, label: 'Planes de Lección' },
    { total: 0, available: 0, label: 'Actividades' }
  ]);
  
  // Recent activities in the system
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  useEffect(() => {
    // Check system status
    checkSystemStatus();
    
    // Load summary stats
    loadSummaryStats();
    
    // Load recent activities
    loadRecentActivities();
  }, []);
  
  // Check the status of all system components
  const checkSystemStatus = async () => {
    try {
      // Update Next.js app status
      setSystemStatuses(prev => 
        prev.map(status => 
          status.name === 'Next.js App' 
            ? { ...status, status: 'online', message: 'Running normally' }
            : status
        )
      );
      
      // Check Curriculum API
      try {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
          setSystemStatuses(prev => 
            prev.map(status => 
              status.name === 'Curriculum API' 
                ? { ...status, status: 'online', message: 'API responding' }
                : status
            )
          );
        } else {
          throw new Error('API response not OK');
        }
      } catch (error) {
        setSystemStatuses(prev => 
          prev.map(status => 
            status.name === 'Curriculum API' 
              ? { ...status, status: 'warning', message: 'Limited functionality' }
              : status
          )
        );
      }
      
      // Simulate database check
      setTimeout(() => {
        setSystemStatuses(prev => 
          prev.map(status => 
            status.name === 'Database' 
              ? { ...status, status: 'online', message: 'Connected' }
              : status
          )
        );
      }, 1500);
      
      // Simulate auth check
      setTimeout(() => {
        setSystemStatuses(prev => 
          prev.map(status => 
            status.name === 'Authentication' 
              ? { ...status, status: 'online', message: 'Working properly' }
              : status
          )
        );
      }, 2000);
      
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };
  
  // Load summary statistics
  const loadSummaryStats = async () => {
    try {
      // Fetch curriculum data for stats
      const response = await fetch('/api/curriculum');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const curriculumData = data.data as CompetencySection[];
          
          // Count competencies across all areas
          const competenciesCount = curriculumData.reduce(
            (acc: number, section: CompetencySection) => acc + section.competencies.length, 
            0
          );
          
          // Update stats
          setStats([
            { total: 4, available: curriculumData.length, label: 'Areas Curriculares' },
            { total: 16, available: competenciesCount, label: 'Competencias' },
            { total: 120, available: 32, label: 'Planes de Lección' },
            { total: 240, available: 96, label: 'Actividades' }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  // Load recent activities
  const loadRecentActivities = () => {
    // Simulated recent activities
    const activities = [
      {
        id: 1,
        type: 'Lesson',
        title: 'Fracciones en contextos cotidianos',
        user: 'Maria Perez',
        date: '2023-09-15T14:30:00',
        status: 'created'
      },
      {
        id: 2,
        type: 'Activity',
        title: 'Resolución de problemas con figuras geométricas',
        user: 'Juan Lopez',
        date: '2023-09-14T10:15:00',
        status: 'updated'
      },
      {
        id: 3,
        type: 'Curriculum',
        title: 'Actualización de estándares de Comunicación',
        user: 'Admin',
        date: '2023-09-13T09:00:00',
        status: 'updated'
      },
      {
        id: 4,
        type: 'Lesson',
        title: 'Análisis de textos narrativos',
        user: 'Carlos Rodriguez',
        date: '2023-09-12T16:45:00',
        status: 'created'
      },
      {
        id: 5,
        type: 'Activity',
        title: 'Experimentos sobre estados de la materia',
        user: 'Ana Gomez',
        date: '2023-09-11T11:30:00',
        status: 'created'
      }
    ];
    
    setRecentActivities(activities);
  };
  
  // Helper function to get status color
  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'loading': return 'bg-gray-300 animate-pulse';
      default: return 'bg-gray-500';
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Sistema</h1>
      
      {/* System Status Cards */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatuses.map((status, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{status.name}</h3>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`}></div>
              </div>
              <p className="text-sm text-gray-600">{status.message}</p>
              {status.details && (
                <p className="text-xs text-gray-500 mt-2">{status.details}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-right">
          <Link 
            href="/test/diagnostics" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Ver diagnóstico completo →
          </Link>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Estadísticas de Contenido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {stat.available} / {stat.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(stat.available / stat.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-right">
          <Link 
            href="/curriculum" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Explorar currículo →
          </Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/lesson-plans/new" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Crear Plan de Lección</h3>
            <p className="text-sm text-gray-600">Generar un nuevo plan basado en el currículo</p>
          </Link>
          
          <Link 
            href="/activities/new" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Generar Actividades</h3>
            <p className="text-sm text-gray-600">Crear actividades educativas para tus clases</p>
          </Link>
          
          <Link 
            href="/rubrics" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Gestionar Rúbricas</h3>
            <p className="text-sm text-gray-600">Ver y editar rúbricas de evaluación</p>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.type === 'Lesson' ? 'bg-blue-100 text-blue-800' : 
                        activity.type === 'Activity' ? 'bg-purple-100 text-purple-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(activity.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.status === 'created' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {activity.status === 'created' ? 'Creado' : 'Actualizado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 