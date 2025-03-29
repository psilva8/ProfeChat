'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

interface TestResult {
  endpoint: string;
  status: number;
  response: ApiResponse;
}

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (endpoint: string, method: string = 'GET', body?: unknown): Promise<TestResult> => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      return {
        endpoint,
        status: response.status,
        response: data,
      };
    } catch (error) {
      return {
        endpoint,
        status: 500,
        response: {
          success: false,
          message: 'Request failed',
        },
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    const testResults: TestResult[] = [];

    // Test login endpoint
    const loginResult = await runTest('/api/auth/signin', 'POST', {
      email: 'test@example.com',
      password: 'password123',
    });
    testResults.push(loginResult);

    // Test registration endpoint
    const registrationResult = await runTest('/api/auth/register', 'POST', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    testResults.push(registrationResult);

    setResults(testResults);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Tests</h1>
      <button
        onClick={runAllTests}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Running Tests...' : 'Run Tests'}
      </button>

      <div className="mt-8 space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.status === 200 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <h3 className="font-semibold">{result.endpoint}</h3>
            <p>Status: {result.status}</p>
            <p>Response: {JSON.stringify(result.response, null, 2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 