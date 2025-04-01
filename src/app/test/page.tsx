"use client";

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/proxy/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error testing API:', error);
      setError('Failed to test API: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const testLessonGeneration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Math',
          grade: '5',
          topic: 'Fractions',
          duration: 60,
          objectives: 'Learn to add fractions',
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error generating lesson:', error);
      setError('Failed to generate lesson: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const checkConfiguration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/config-check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error checking configuration:', error);
      setError('Failed to check configuration: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const testDirectConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/direct-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error testing connection:', error);
      setError('Failed to test connection: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-x-4 mb-6">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={testHealthCheck}
          disabled={loading}
        >
          Test Health Check
        </button>
        
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={testLessonGeneration}
          disabled={loading}
        >
          Test Lesson Generation
        </button>
        
        <button 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={checkConfiguration}
          disabled={loading}
        >
          Check Configuration
        </button>
        
        <button 
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          onClick={testDirectConnection}
          disabled={loading}
        >
          Test Direct Connection
        </button>
      </div>
      
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
} 