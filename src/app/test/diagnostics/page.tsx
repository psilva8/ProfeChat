'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'error' | 'loading';
  message: string;
  timestamp?: string;
  details?: any;
}

export default function DiagnosticsPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Next.js App', status: 'loading', message: 'Checking...' },
    { name: 'Flask API', status: 'loading', message: 'Checking...' },
    { name: 'OpenAI API', status: 'loading', message: 'Checking...' },
    { name: 'Database', status: 'loading', message: 'Checking...' },
    { name: 'Session/Auth', status: 'loading', message: 'Checking...' }
  ]);
  const [flaskPort, setFlaskPort] = useState<number | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  
  // Helper function to add log messages
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  };
  
  // Update service status
  const updateService = (name: string, status: 'healthy' | 'error' | 'loading', message: string, details?: any) => {
    setServices(prev => 
      prev.map(service => 
        service.name === name 
          ? { ...service, status, message, details, timestamp: new Date().toISOString() } 
          : service
      )
    );
  };
  
  // Check Next.js app
  const checkNextJs = async () => {
    setActiveTest('Next.js App');
    updateService('Next.js App', 'loading', 'Checking...');
    addLog('Checking Next.js app...');
    
    try {
      // This is a client-side rendered page, so if we're here, Next.js is working
      updateService('Next.js App', 'healthy', 'Next.js app is running correctly');
      addLog('Next.js app check passed');
    } catch (error) {
      updateService('Next.js App', 'error', `Next.js error: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`Next.js app check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setActiveTest(null);
  };
  
  // Check Flask API
  const checkFlaskApi = async () => {
    setActiveTest('Flask API');
    updateService('Flask API', 'loading', 'Checking...');
    addLog('Checking Flask API...');
    
    try {
      const response = await fetch('/api/config-check');
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`Config check response: ${JSON.stringify(data).substring(0, 100)}...`);
      
      if (data.flask && data.flask.health.includes('Available')) {
        const portMatch = data.flask.health.match(/port (\d+)/);
        if (portMatch && portMatch[1]) {
          setFlaskPort(parseInt(portMatch[1], 10));
          addLog(`Detected Flask port: ${portMatch[1]}`);
        }
        
        updateService('Flask API', 'healthy', 'Flask API is running correctly', data.flask);
        addLog('Flask API check passed');
      } else {
        updateService('Flask API', 'error', 'Flask API is not available', data.flask);
        addLog('Flask API check failed: API not available');
      }
    } catch (error) {
      updateService('Flask API', 'error', `Flask API error: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`Flask API check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setActiveTest(null);
  };
  
  // Check OpenAI API
  const checkOpenAI = async () => {
    setActiveTest('OpenAI API');
    updateService('OpenAI API', 'loading', 'Checking...');
    addLog('Checking OpenAI API...');
    
    try {
      // We need to check through our Flask API
      if (!flaskPort) {
        addLog('Flask port unknown, trying to find it first...');
        await checkFlaskApi();
      }
      
      const response = await fetch('/api/direct-test');
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`Direct test response received`);
      
      // Find a working port from the response
      const workingPort = 
        data.connectionTests.main.success ? data.configuredPort : 
        Object.entries(data.connectionTests.alternates)
          .find(([, status]) => (status as any).success)?.[0]?.replace('port_', '');
      
      if (workingPort) {
        setFlaskPort(parseInt(workingPort, 10));
        addLog(`Using working Flask port: ${workingPort}`);
        
        // Now check OpenAI through this port
        try {
          const openaiResponse = await fetch(`/api/proxy/test-openai-key`);
          if (!openaiResponse.ok) {
            throw new Error(`OpenAI check returned status ${openaiResponse.status}`);
          }
          
          const openaiData = await openaiResponse.json();
          
          if (openaiData.valid) {
            updateService('OpenAI API', 'healthy', 'OpenAI API key is valid', openaiData);
            addLog('OpenAI API check passed');
          } else {
            updateService('OpenAI API', 'error', `OpenAI API key is invalid: ${openaiData.error}`, openaiData);
            addLog(`OpenAI API check failed: ${openaiData.error}`);
          }
        } catch (openaiError) {
          updateService('OpenAI API', 'error', `OpenAI API check error: ${openaiError instanceof Error ? openaiError.message : String(openaiError)}`);
          addLog(`OpenAI API check failed: ${openaiError instanceof Error ? openaiError.message : String(openaiError)}`);
        }
      } else {
        updateService('OpenAI API', 'error', 'No working Flask API found to check OpenAI');
        addLog('OpenAI API check failed: No working Flask API');
      }
    } catch (error) {
      updateService('OpenAI API', 'error', `OpenAI check error: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`OpenAI API check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setActiveTest(null);
  };
  
  // Check Database
  const checkDatabase = async () => {
    setActiveTest('Database');
    updateService('Database', 'loading', 'Checking...');
    addLog('Checking database...');
    
    try {
      if (!flaskPort) {
        addLog('Flask port unknown, trying to find it first...');
        await checkFlaskApi();
      }
      
      // Now check database through the Flask API
      try {
        const dbResponse = await fetch(`/api/proxy/check-db`);
        if (!dbResponse.ok) {
          throw new Error(`Database check returned status ${dbResponse.status}`);
        }
        
        const dbData = await dbResponse.json();
        
        if (dbData.status === 'healthy') {
          updateService('Database', 'healthy', 'Database connection is operational', dbData);
          addLog('Database check passed');
        } else {
          updateService('Database', 'error', `Database error: ${dbData.error}`, dbData);
          addLog(`Database check failed: ${dbData.error}`);
        }
      } catch (dbError) {
        updateService('Database', 'error', `Database check error: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        addLog(`Database check failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
      }
    } catch (error) {
      updateService('Database', 'error', `Database check error: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`Database check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setActiveTest(null);
  };
  
  // Check auth/session
  const checkAuth = async () => {
    setActiveTest('Session/Auth');
    updateService('Session/Auth', 'loading', 'Checking...');
    addLog('Checking auth/session...');
    
    try {
      // Try to access a sample protected endpoint
      const response = await fetch('/api/lesson-plans');
      const data = await response.json();
      
      if (response.status === 401) {
        // This is expected behavior if not logged in
        updateService('Session/Auth', 'healthy', 'Auth system is correctly blocking unauthenticated requests');
        addLog('Auth check passed: Correctly received 401 for unauthenticated request');
      } else if (response.ok) {
        // If we get a success, either we're logged in or auth is bypassed
        updateService('Session/Auth', 'healthy', 'User is authenticated or auth is properly bypassed for test endpoints');
        addLog('Auth check passed: User is authenticated or using test endpoints');
      } else {
        updateService('Session/Auth', 'error', `Unexpected auth response: ${data.error || response.statusText}`, data);
        addLog(`Auth check failed: Unexpected response ${response.status}`);
      }
    } catch (error) {
      updateService('Session/Auth', 'error', `Auth check error: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`Auth check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setActiveTest(null);
  };
  
  // Run all tests
  const runAllTests = async () => {
    addLog('Running all diagnostics...');
    
    try {
      // Use the comprehensive status endpoint first
      const response = await fetch('/api/dashboard-status');
      
      if (response.ok) {
        const data = await response.json();
        addLog(`Dashboard status API responded with ${data.services.length} services`);
        
        // Update the services from the response
        data.services.forEach((serviceInfo: any) => {
          const service = services.find(s => s.name === serviceInfo.service);
          if (service) {
            updateService(
              service.name,
              serviceInfo.status as 'healthy' | 'error' | 'loading',
              serviceInfo.message || 'Status updated from dashboard API',
              serviceInfo
            );
            addLog(`Updated ${service.name} status: ${serviceInfo.status}`);
          }
        });
        
        // Add system info to logs
        if (data.system) {
          addLog(`System Info: Node ${data.system.node}, Uptime: ${Math.floor(data.system.uptime / 60)} minutes`);
        }
        
        // Extract Flask port if available
        const flaskService = data.services.find((s: any) => s.service === 'Flask API');
        if (flaskService && flaskService.workingPort) {
          setFlaskPort(flaskService.workingPort);
          addLog(`Dashboard API reported working Flask port: ${flaskService.workingPort}`);
        }
        
        // For services not properly updated, run individual checks
        if (services.some(s => s.status === 'loading')) {
          addLog('Some services still loading, running individual checks...');
          // Continue with individual checks
          await checkNextJs();
          await checkFlaskApi();
          await checkOpenAI();
          await checkDatabase();
          await checkAuth();
        }
      } else {
        addLog(`Dashboard API failed with status ${response.status}, falling back to individual checks`);
        // Fall back to individual checks
        await checkNextJs();
        await checkFlaskApi();
        await checkOpenAI();
        await checkDatabase();
        await checkAuth();
      }
    } catch (error) {
      addLog(`Dashboard API error: ${error instanceof Error ? error.message : String(error)}`);
      // Fall back to individual checks
      await checkNextJs();
      await checkFlaskApi();
      await checkOpenAI();
      await checkDatabase();
      await checkAuth();
    }
    
    addLog('All diagnostics completed');
  };
  
  // Initialize with basic checks on load
  useEffect(() => {
    checkNextJs();
    checkFlaskApi();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-accent-600 hover:text-accent-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold mt-4">System Diagnostics</h1>
        <p className="text-gray-600">
          Use this page to troubleshoot system connectivity and configuration issues.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status Panel */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Service Status</h2>
              <p className="text-sm text-gray-500">Current status of system components</p>
            </div>
            <button
              onClick={runAllTests}
              disabled={!!activeTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {activeTest ? `Testing ${activeTest}...` : 'Run All Tests'}
            </button>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {services.map((service) => (
                <li key={service.name} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span 
                        className={`h-3 w-3 rounded-full mr-3 ${
                          service.status === 'healthy' ? 'bg-green-500' : 
                          service.status === 'error' ? 'bg-red-500' : 
                          'bg-yellow-500 animate-pulse'
                        }`} 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.message}</p>
                        {service.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last checked: {new Date(service.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (service.name === 'Next.js App') checkNextJs();
                        if (service.name === 'Flask API') checkFlaskApi();
                        if (service.name === 'OpenAI API') checkOpenAI();
                        if (service.name === 'Database') checkDatabase();
                        if (service.name === 'Session/Auth') checkAuth();
                      }}
                      disabled={!!activeTest}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Check
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Activity Log */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
            <p className="text-sm text-gray-500">Latest diagnostic activity</p>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="bg-gray-50 p-3 h-96 overflow-y-auto rounded">
              {logMessages.length > 0 ? (
                <ul className="space-y-2">
                  {logMessages.map((log, i) => (
                    <li key={i} className="text-xs font-mono whitespace-pre-wrap">{log}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No logs yet. Run tests to see results.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Flask Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">System Configuration</h2>
            <p className="text-sm text-gray-500">Details about the current system configuration</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Flask Port</dt>
                <dd className="mt-1 text-sm text-gray-900">{flaskPort || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Next.js Environment</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.env.NODE_ENV || 'development'}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Test Endpoints</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Lesson Plans:</span>{' '}
                      <Link href="/test/lesson-plans" className="text-blue-600 hover:underline">
                        /test/lesson-plans
                      </Link>
                    </div>
                    <div>
                      <span className="font-medium">Create Lesson Plan:</span>{' '}
                      <Link href="/test/create-lesson-plan" className="text-blue-600 hover:underline">
                        /test/create-lesson-plan
                      </Link>
                    </div>
                    <div>
                      <span className="font-medium">Generate With AI:</span>{' '}
                      <Link href="/test/generate-plan" className="text-blue-600 hover:underline">
                        /test/generate-plan
                      </Link>
                    </div>
                    <div>
                      <span className="font-medium">API Tests:</span>{' '}
                      <Link href="/test" className="text-blue-600 hover:underline">
                        /test
                      </Link>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 