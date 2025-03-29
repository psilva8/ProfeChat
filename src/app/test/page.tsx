'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

interface TestCase {
  name: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'error';
  description: string;
}

const testCases: TestCase[] = [
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    expectedResult: 'success',
    description: 'Valid registration/login'
  },
  {
    name: '',
    email: 'test@example.com',
    password: 'password123',
    expectedResult: 'error',
    description: 'Empty name validation'
  },
  {
    name: 'Test User',
    email: 'invalid-email',
    password: 'password123',
    expectedResult: 'error',
    description: 'Invalid email format'
  },
  {
    name: 'Test User',
    email: 'test2@example.com',
    password: '12345',
    expectedResult: 'error',
    description: 'Password too short'
  }
];

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [result, setResult] = useState<any>(null);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
    console.log(`Test result:`, result);
  };

  const runRegistrationTest = async (testCase: TestCase) => {
    addResult({
      step: `Registration Test: ${testCase.description}`,
      status: 'info',
      message: `Attempting to register user with email: ${testCase.email}`
    });

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testCase.name,
          email: testCase.email,
          password: testCase.password,
        }),
      });

      const registerData = await registerResponse.json();
      
      if (registerResponse.ok) {
        if (testCase.expectedResult === 'success') {
          addResult({
            step: 'Registration',
            status: 'success',
            message: 'User registered successfully',
            details: JSON.stringify(registerData, null, 2)
          });
          return true;
        } else {
          addResult({
            step: 'Registration',
            status: 'error',
            message: 'Registration succeeded when it should have failed',
            details: `Expected failure for: ${testCase.description}`
          });
          return false;
        }
      } else {
        if (testCase.expectedResult === 'error') {
          addResult({
            step: 'Registration',
            status: 'success',
            message: 'Registration failed as expected',
            details: JSON.stringify(registerData, null, 2)
          });
          return false;
        } else if (registerData.error === 'An account with this email already exists') {
          addResult({
            step: 'Registration',
            status: 'info',
            message: 'User already exists, proceeding with login test',
            details: registerData.error
          });
          return true;
        } else {
          addResult({
            step: 'Registration',
            status: 'error',
            message: 'Registration failed unexpectedly',
            details: JSON.stringify(registerData, null, 2)
          });
          return false;
        }
      }
    } catch (error) {
      addResult({
        step: 'Registration',
        status: 'error',
        message: 'Registration request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  const runLoginTest = async (testCase: TestCase) => {
    addResult({
      step: `Login Test: ${testCase.description}`,
      status: 'info',
      message: `Attempting to login with email: ${testCase.email}`
    });

    try {
      const loginResult = await signIn('credentials', {
        email: testCase.email,
        password: testCase.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        if (testCase.expectedResult === 'success') {
          addResult({
            step: 'Login',
            status: 'success',
            message: 'Login successful'
          });
          return true;
        } else {
          addResult({
            step: 'Login',
            status: 'error',
            message: 'Login succeeded when it should have failed',
            details: `Expected failure for: ${testCase.description}`
          });
          return false;
        }
      } else {
        if (testCase.expectedResult === 'error') {
          addResult({
            step: 'Login',
            status: 'success',
            message: 'Login failed as expected',
            details: loginResult?.error || undefined
          });
          return true;
        } else {
          addResult({
            step: 'Login',
            status: 'error',
            message: 'Login failed unexpectedly',
            details: loginResult?.error || 'Unknown error'
          });
          return false;
        }
      }
    } catch (error) {
      addResult({
        step: 'Login',
        status: 'error',
        message: 'Login request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

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

  useEffect(() => {
    async function runNextTest() {
      if (currentTestIndex >= testCases.length) {
        setIsLoading(false);
        addResult({
          step: 'Complete',
          status: 'info',
          message: 'All tests completed'
        });
        return;
      }

      const testCase = testCases[currentTestIndex];
      
      try {
        addResult({
          step: 'Test Case',
          status: 'info',
          message: `Starting test case: ${testCase.description}`
        });

        const registrationSuccess = await runRegistrationTest(testCase);
        if (registrationSuccess || testCase.expectedResult === 'error') {
          await runLoginTest(testCase);
        }

        setCurrentTestIndex(prev => prev + 1);
      } catch (error) {
        console.error('Test execution error:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    }

    if (isLoading && currentTestIndex < testCases.length) {
      runNextTest();
    }
  }, [isLoading, currentTestIndex]);

  const startTests = () => {
    setResults([]);
    setError(null);
    setCurrentTestIndex(0);
    setIsLoading(true);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <button 
        onClick={testLogin}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Testing...' : 'Test Lesson Plans API'}
      </button>

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