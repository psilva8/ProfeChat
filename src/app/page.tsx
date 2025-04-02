'use client';

import { useState } from 'react';

export default function Home() {
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateLessonPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones',
          competency: 'Resuelve problemas de cantidad'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating lesson plan');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error in API response');
      }
      
      setLessonPlan(data.data || data.lesson_plan);
      console.log('Lesson plan generated:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error generating lesson plan:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const generateActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating activities');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error in API response');
      }
      
      setActivities(data.data || data.activities || []);
      console.log('Activities generated:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error generating activities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={generateLessonPlan}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Lesson Plan'}
          </button>
          
          <button 
            onClick={generateActivities}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Activities'}
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}
      </div>
      
      {lessonPlan && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Lesson Plan</h2>
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-medium mb-2">{lessonPlan.title}</h3>
            <p><strong>Subject:</strong> {lessonPlan.subject}</p>
            <p><strong>Grade:</strong> {lessonPlan.grade}</p>
            <p><strong>Topic:</strong> {lessonPlan.topic}</p>
            
            <h4 className="font-medium mt-4 mb-2">Objectives:</h4>
            <ul className="list-disc pl-5">
              {lessonPlan.objectives.map((obj: string, index: number) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
            
            <h4 className="font-medium mt-4 mb-2">Activities:</h4>
            <div className="grid gap-2">
              {lessonPlan.activities.map((activity: any, index: number) => (
                <div key={index} className="p-2 bg-white rounded">
                  <p><strong>{activity.name}</strong> ({activity.duration})</p>
                  <p>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <div className="grid gap-4">
            {activities.map((activity, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-medium mb-2">{activity.title}</h3>
                <p><strong>Subject:</strong> {activity.subject}</p>
                <p><strong>Grade:</strong> {activity.grade}</p>
                <p><strong>Duration:</strong> {activity.duration} minutes</p>
                
                <div className="mt-3">
                  <p><strong>Description:</strong> {activity.content.description}</p>
                  <p><strong>Objectives:</strong> {activity.content.objectives}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 