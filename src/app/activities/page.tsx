'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  title: string;
  grade: string;
  duration: number;
  subject: string;
  content: {
    description: string;
    objectives: string;
    materials: string;
    instructions: string;
    assessment: string;
  };
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Activities data:', data.activities);
        
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  const generateActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Math',
          grade: '5',
          topic: 'Fractions',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error generating activities:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Activities</h1>
        <button
          onClick={generateActivities}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Generate New Activities'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded text-center">
          <p className="text-gray-600">No activities found. Click the button above to generate some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-semibold">{activity.title}</h2>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Grade: {activity.grade}</span>
                  <span>{activity.duration} minutes</span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-md font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600">{activity.content.description}</p>
                </div>
                <div className="mb-3">
                  <h3 className="text-md font-semibold text-gray-700">Objectives</h3>
                  <p className="text-gray-600">{activity.content.objectives}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">Materials</h3>
                    <p className="text-gray-600">{activity.content.materials}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">Assessment</h3>
                    <p className="text-gray-600">{activity.content.assessment}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700">Instructions</h3>
                  <p className="text-gray-600">{activity.content.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 