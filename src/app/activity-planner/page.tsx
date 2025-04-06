'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ActivityPlanner() {
  const searchParams = useSearchParams();
  
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [grade, setGrade] = useState(searchParams.get('grade') || '');
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [activityType, setActivityType] = useState('interactive');
  const [activityDuration, setActivityDuration] = useState(30);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Auto-generate if all required parameters are provided in URL
    if (subject && grade && topic) {
      generateActivities();
    }
  }, []);
  
  const generateActivities = async () => {
    if (!subject || !grade || !topic) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating activities for ${subject}, ${grade}, ${topic}`);
      
      const response = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          activityType,
          duration: activityDuration
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate activities');
      }
      
      const data = await response.json();
      console.log('Activities data:', data);
      
      // Handle different response formats
      if (data.activities && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else if (data.activities && typeof data.activities === 'string') {
        // Handle text format - parse it into activities
        setActivities([{
          title: `${topic} Activities`,
          description: data.activities,
          type: activityType,
          duration: activityDuration,
          subject,
          grade
        }]);
      } else if (data.data && Array.isArray(data.data)) {
        setActivities(data.data);
      } else {
        // Create a default activity with the raw response
        setActivities([{
          title: `${topic} Activities`,
          description: typeof data === 'string' ? data : JSON.stringify(data),
          type: activityType,
          duration: activityDuration,
          subject,
          grade
        }]);
      }
    } catch (err) {
      console.error('Error generating activities:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateActivities();
  };
  
  const printActivity = (index: number) => {
    alert(`Print functionality would be implemented for activity #${index + 1}`);
    // In a real implementation, this would print the activity
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Activity Planner</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Activity Parameters</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., Mathematics"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Grade Level *</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., 3-5"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., Fractions"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="interactive">Interactive</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="assessment">Assessment</option>
                  <option value="project">Project</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={activityDuration}
                  onChange={(e) => setActivityDuration(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                  min="5"
                  max="120"
                />
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                    isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Activities'}
                </button>
                
                <Link 
                  href="/subjects"
                  className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-center font-medium"
                >
                  Back to Subjects
                </Link>
                
                <Link 
                  href="/"
                  className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-center font-medium"
                >
                  Home
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Generated Activities</h2>
            
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-lg">Generating activities...</p>
                <p className="text-gray-500 text-sm mt-2">This may take up to 15-30 seconds.</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-8">
                {activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-medium">{activity.title || `Activity ${index + 1}`}</h3>
                        <button
                          onClick={() => printActivity(index)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Print
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.subject && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {activity.subject}
                          </span>
                        )}
                        {activity.grade && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Grade: {activity.grade}
                          </span>
                        )}
                        {activity.duration && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {activity.duration} min
                          </span>
                        )}
                        {activity.type && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {activity.type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {activity.description && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Description</h4>
                          <div className="pl-3 whitespace-pre-wrap">{activity.description}</div>
                        </div>
                      )}
                      
                      {activity.objectives && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Learning Objectives</h4>
                          {Array.isArray(activity.objectives) ? (
                            <ul className="list-disc pl-6">
                              {activity.objectives.map((obj: string, i: number) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="pl-3">{activity.objectives}</div>
                          )}
                        </div>
                      )}
                      
                      {activity.materials && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Materials</h4>
                          {Array.isArray(activity.materials) ? (
                            <ul className="list-disc pl-6">
                              {activity.materials.map((material: string, i: number) => (
                                <li key={i}>{material}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="pl-3">{activity.materials}</div>
                          )}
                        </div>
                      )}
                      
                      {activity.instructions && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Instructions</h4>
                          {Array.isArray(activity.instructions) ? (
                            <ol className="list-decimal pl-6">
                              {activity.instructions.map((step: string, i: number) => (
                                <li key={i} className="mb-1">{step}</li>
                              ))}
                            </ol>
                          ) : (
                            <div className="pl-3 whitespace-pre-wrap">{activity.instructions}</div>
                          )}
                        </div>
                      )}
                      
                      {activity.assessment && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Assessment</h4>
                          <div className="pl-3">{activity.assessment}</div>
                        </div>
                      )}
                      
                      {activity.modifications && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Modifications/Extensions</h4>
                          <div className="pl-3">{activity.modifications}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No activities generated yet. Fill out the form and click "Generate Activities" to create activities for your classroom.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 