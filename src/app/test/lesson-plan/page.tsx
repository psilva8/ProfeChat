'use client';

import React, { useState, useEffect } from 'react';

export default function TestLessonPlanPage() {
  const [formData, setFormData] = useState({
    subject: 'Mathematics',
    grade: '5',
    topic: 'Fractions',
    objectives: 'Understanding fractions as parts of a whole',
    duration: 45,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [flaskPort, setFlaskPort] = useState<string | null>(null);

  // Fetch Flask port on component mount
  useEffect(() => {
    fetch('/api/flask-port')
      .then(res => res.json())
      .then(data => {
        if (data.port) {
          setFlaskPort(data.port);
          setDebugInfo(`Flask port set to ${data.port}`);
        } else {
          setDebugInfo('Could not determine Flask port');
        }
      })
      .catch(err => {
        setDebugInfo(`Error fetching Flask port: ${err.message}`);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);
    setDebugInfo(`Request started at ${new Date().toISOString()}`);

    try {
      // Direct Flask API connection is now optional and uses dynamic port if available
      if (flaskPort) {
        // Try direct Flask API connection
        setDebugInfo(prev => `${prev}\nAttempting direct Flask API call on port ${flaskPort}`);
        const flaskResponse = await fetch(`http://localhost:${flaskPort}/api/generate-lesson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }).catch(err => {
          setDebugInfo(prev => `${prev}\nDirect Flask API call failed: ${err.message}`);
          return null;
        });

        if (flaskResponse && flaskResponse.ok) {
          const flaskData = await flaskResponse.json();
          setDebugInfo(prev => `${prev}\nDirect Flask API call succeeded: ${flaskData.success}`);
        }
      } else {
        setDebugInfo(prev => `${prev}\nSkipping direct Flask API call (no port available)`);
      }

      // Now test the Next.js test API
      setDebugInfo(prev => `${prev}\nCalling Next.js test API`);
      const response = await fetch('/api/test-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setDebugInfo(prev => `${prev}\nResponse status: ${response.status}`);
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data.lesson_plan);
        setDebugInfo(prev => `${prev}\nNext.js API succeeded: ${data.success}`);
      } else {
        setError(data.error || 'Failed to generate lesson plan');
        setDebugInfo(prev => `${prev}\nAPI error: ${data.error}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setDebugInfo(prev => `${prev}\nException: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Lesson Plan Generation</h1>
      <p className="mb-4 text-gray-600">This page allows you to test the lesson plan generation API without authentication.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Learning Objectives</label>
          <textarea
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="font-bold text-xl mb-4">Generated Lesson Plan</h2>
          <pre className="whitespace-pre-wrap p-4 bg-gray-50 rounded">{result}</pre>
        </div>
      )}
      
      {debugInfo && (
        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h2 className="font-bold mb-2">Debug Information</h2>
          <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
} 