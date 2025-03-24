'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function ApiTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testLogin = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Step 1: Login
      const loginResult = await signIn('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });

      if (loginResult?.error) {
        setError(`Login error: ${loginResult.error}`);
        return;
      }

      // Step 2: Fetch lesson plans
      const response = await fetch('/api/lesson-plans');
      
      if (!response.ok) {
        setError(`API error: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestEndpoint = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Fetch from our test endpoint
      const response = await fetch('/api/test-auth');
      
      if (!response.ok) {
        setError(`API error: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={testLogin}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Testing...' : 'Test Lesson Plans API (Auth)'}
        </button>
        
        <button 
          onClick={fetchTestEndpoint}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Testing...' : 'Fetch Test Endpoint (Direct)'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">API Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 