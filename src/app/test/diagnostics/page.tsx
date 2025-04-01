'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface ServiceStatus {
  status: 'online' | 'offline' | 'unknown';
  message: string;
}

export default function DiagnosticsPage() {
  const [serviceStatuses, setServiceStatuses] = useState({
    nextjs: { status: 'unknown', message: 'Checking Next.js...' },
    flask: { status: 'unknown', message: 'Checking Flask API...' },
    database: { status: 'unknown', message: 'Checking database connection...' },
    openai: { status: 'unknown', message: 'Checking OpenAI connection...' },
    auth: { status: 'unknown', message: 'Checking authentication...' }
  });
  
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Add a log message
  const addLog = (message: string) => {
    setLogMessages(prev => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev
    ]);
  };
  
  // Update service status
  const updateStatus = (service: string, status: ServiceStatus) => {
    setServiceStatuses(prev => ({
      ...prev,
      [service]: status
    }));
  };
  
  // Check Next.js service
  const checkNextJs = () => {
    addLog('Checking Next.js status...');
    // Next.js is always running if this page loads
    updateStatus('nextjs', { 
      status: 'online', 
      message: 'Next.js is running correctly' 
    });
    return true;
  };
  
  // Check Flask API service
  const checkFlaskApi = async () => {
    addLog('Checking Flask API status...');
    try {
      const response = await fetch('/api/health', { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`Flask API response: ${JSON.stringify(data.services.flask)}`);
      
      updateStatus('flask', data.services.flask);
      return data.services.flask.status === 'online';
      
    } catch (error) {
      console.error('Flask API check failed:', error);
      addLog(`Flask API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      updateStatus('flask', { 
        status: 'offline', 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      return false;
    }
  };
  
  // Check OpenAI service
  const checkOpenAI = async () => {
    addLog('Checking OpenAI API connection...');
    try {
      // We check OpenAI via the Flask health endpoint if it's available
      const response = await fetch('/api/health', { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`OpenAI status from health check: ${JSON.stringify(data.services.openai)}`);
      
      updateStatus('openai', data.services.openai);
      return data.services.openai.status === 'online';
      
    } catch (error) {
      console.error('OpenAI check failed:', error);
      addLog(`OpenAI check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      updateStatus('openai', { 
        status: 'unknown', 
        message: 'Could not check OpenAI status due to Flask API connection failure' 
      });
      return false;
    }
  };
  
  // Check Database service
  const checkDatabase = async () => {
    addLog('Checking database connection...');
    try {
      // We check database via the health endpoint
      const response = await fetch('/api/health', { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`Database status from health check: ${JSON.stringify(data.services.database)}`);
      
      updateStatus('database', data.services.database);
      return data.services.database.status === 'online';
      
    } catch (error) {
      console.error('Database check failed:', error);
      addLog(`Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      updateStatus('database', { 
        status: 'unknown', 
        message: 'Could not check database status due to API connection failure' 
      });
      return false;
    }
  };
  
  // Check Authentication service
  const checkAuth = async () => {
    addLog('Checking authentication service...');
    try {
      // Try to fetch a protected endpoint that requires authentication
      const response = await fetch('/api/rubrics', { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          addLog('Authentication required - this is expected for protected endpoints');
          updateStatus('auth', { 
            status: 'online', 
            message: 'Authentication service is working (401 received as expected)' 
          });
          return true;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      // If we get here, the endpoint didn't require auth
      addLog('Endpoint accessible without authentication - test data mode');
      updateStatus('auth', { 
        status: 'online', 
        message: 'Authentication bypassed (test data mode)' 
      });
      return true;
      
    } catch (error) {
      console.error('Auth check failed:', error);
      addLog(`Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      updateStatus('auth', { 
        status: 'offline', 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      return false;
    }
  };
  
  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    addLog('--- Starting System Diagnostics ---');
    
    // Reset all statuses
    setServiceStatuses({
      nextjs: { status: 'unknown', message: 'Checking Next.js...' },
      flask: { status: 'unknown', message: 'Checking Flask API...' },
      database: { status: 'unknown', message: 'Checking database connection...' },
      openai: { status: 'unknown', message: 'Checking OpenAI connection...' },
      auth: { status: 'unknown', message: 'Checking authentication...' }
    });
    
    // Run tests in sequence with short delays to see progress
    checkNextJs();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await checkFlaskApi();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await checkDatabase();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await checkOpenAI();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await checkAuth();
    
    addLog('--- Diagnostics Complete ---');
    setIsRunningTests(false);
  };
  
  // Run tests on initial load
  useEffect(() => {
    runAllTests();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver al dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Diagnóstico del Sistema</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Statuses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Estado de los Servicios</h2>
          
          <div className="space-y-4">
            {Object.entries(serviceStatuses).map(([service, { status, message }]) => (
              <div key={service} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div 
                    className={`h-3 w-3 rounded-full mr-3 ${
                      status === 'online' ? 'bg-green-500' : 
                      status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  <span className="capitalize">{service}</span>
                </div>
                <div className="text-sm text-gray-600 max-w-xs text-right">{message}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button 
              onClick={runAllTests}
              disabled={isRunningTests}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isRunningTests ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isRunningTests ? 'Ejecutando...' : 'Ejecutar diagnóstico nuevamente'}
            </button>
          </div>
        </div>
        
        {/* System Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Registro de Actividad</h2>
          
          <div className="bg-gray-100 p-3 rounded-lg h-[400px] overflow-y-auto font-mono text-sm">
            {logMessages.length > 0 ? (
              <ul className="space-y-1">
                {logMessages.map((log, index) => (
                  <li key={index} className="break-all">{log}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No hay mensajes de registro...</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Solución de Problemas</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Error de conexión a Flask API</h3>
            <p className="text-gray-600">
              Si ves errores de conexión en el Flask API, asegúrate de que el servidor Flask esté 
              ejecutándose correctamente. Puedes reiniciar el servidor con <code>npm run dev</code> desde 
              la carpeta raíz del proyecto.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">OpenAI API no responde</h3>
            <p className="text-gray-600">
              Si OpenAI API no responde, verifica que tu clave API esté configurada correctamente en 
              el archivo <code>.env</code>. Esta API es necesaria para generar contenido.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Problemas de autenticación</h3>
            <p className="text-gray-600">
              Si ves errores de autenticación, es posible que necesites iniciar sesión nuevamente. 
              En el modo de prueba, algunos endpoints funcionan sin autenticación para facilitar el diagnóstico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 