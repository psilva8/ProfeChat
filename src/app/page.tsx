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

  const pageStyles = {
    container: {
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: 'black',
    },
    section: {
      marginBottom: '32px',
    },
    subheading: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: 'black',
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    buttonBlue: {
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    buttonGreen: {
      padding: '8px 16px',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'default',
    },
    errorBox: {
      padding: '16px',
      backgroundColor: '#fee2e2',
      border: '1px solid #ef4444',
      color: '#b91c1c',
      borderRadius: '4px',
      marginBottom: '16px',
    },
    resultBox: {
      padding: '16px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
    },
    resultTitle: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '8px',
      color: 'black',
    },
    resultItem: {
      marginBottom: '8px',
      color: 'black',
    },
    objectivesList: {
      listStyleType: 'disc',
      paddingLeft: '20px',
      marginTop: '16px',
      marginBottom: '16px',
    },
    activityBox: {
      padding: '8px',
      backgroundColor: 'white',
      borderRadius: '4px',
      marginBottom: '8px',
    },
  };

  return (
    <main style={pageStyles.container}>
      <h1 style={pageStyles.heading}>API Test Page</h1>
      
      <div style={pageStyles.section}>
        <h2 style={pageStyles.subheading}>Test API Endpoints</h2>
        <div style={pageStyles.buttonContainer}>
          <button 
            onClick={generateLessonPlan}
            style={{
              ...pageStyles.buttonBlue,
              ...(loading ? pageStyles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Lesson Plan'}
          </button>
          
          <button 
            onClick={generateActivities}
            style={{
              ...pageStyles.buttonGreen,
              ...(loading ? pageStyles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Activities'}
          </button>
        </div>
        
        {error && (
          <div style={pageStyles.errorBox}>
            {error}
          </div>
        )}
      </div>
      
      {lessonPlan && (
        <div style={pageStyles.section}>
          <h2 style={pageStyles.subheading}>Lesson Plan</h2>
          <div style={pageStyles.resultBox}>
            <h3 style={pageStyles.resultTitle}>{lessonPlan.title}</h3>
            <p style={pageStyles.resultItem}><strong>Subject:</strong> {lessonPlan.subject}</p>
            <p style={pageStyles.resultItem}><strong>Grade:</strong> {lessonPlan.grade}</p>
            <p style={pageStyles.resultItem}><strong>Topic:</strong> {lessonPlan.topic}</p>
            
            <h4 style={{...pageStyles.resultItem, fontWeight: '500', marginTop: '16px'}}>Objectives:</h4>
            <ul style={pageStyles.objectivesList}>
              {lessonPlan.objectives.map((obj: string, index: number) => (
                <li key={index} style={{color: 'black'}}>{obj}</li>
              ))}
            </ul>
            
            <h4 style={{...pageStyles.resultItem, fontWeight: '500', marginTop: '16px'}}>Activities:</h4>
            <div style={{display: 'grid', gap: '8px'}}>
              {lessonPlan.activities.map((activity: any, index: number) => (
                <div key={index} style={pageStyles.activityBox}>
                  <p style={{color: 'black'}}><strong>{activity.name}</strong> ({activity.duration})</p>
                  <p style={{color: 'black'}}>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activities.length > 0 && (
        <div style={pageStyles.section}>
          <h2 style={pageStyles.subheading}>Activities</h2>
          <div style={{display: 'grid', gap: '16px'}}>
            {activities.map((activity, index) => (
              <div key={index} style={pageStyles.resultBox}>
                <h3 style={pageStyles.resultTitle}>{activity.title}</h3>
                <p style={pageStyles.resultItem}><strong>Subject:</strong> {activity.subject}</p>
                <p style={pageStyles.resultItem}><strong>Grade:</strong> {activity.grade}</p>
                <p style={pageStyles.resultItem}><strong>Duration:</strong> {activity.duration} minutes</p>
                
                <div style={{marginTop: '12px'}}>
                  <p style={pageStyles.resultItem}><strong>Description:</strong> {activity.content.description}</p>
                  <p style={pageStyles.resultItem}><strong>Objectives:</strong> {activity.content.objectives}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 