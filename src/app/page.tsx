'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChatForm from './components/ChatForm';

export default function Home() {
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isFlaskRunning, setIsFlaskRunning] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('lessonPlan');
  
  // Function to reset environment variables
  const resetEnvironment = () => {
    console.log('Forcing development environment...');
    // Reset any stored environment values in localStorage
    localStorage.removeItem('next-env');
    localStorage.removeItem('flask-env');
    localStorage.removeItem('is_build');
    localStorage.removeItem('environment');
    localStorage.removeItem('isProduction');
    localStorage.removeItem('isBuildEnvironment');
    
    // Force refreshing the page to reset state
    window.location.reload();
  };

  // Add debugging information and check Flask status
  useEffect(() => {
    console.log('Component mounted');
    setDebugInfo('Component initialized');
    
    // Check if Flask server is running
    const checkFlaskStatus = async () => {
      try {
        const response = await fetch('/api/health', {
          // Add cache busting parameter to prevent browser caching
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        const flaskStatus = data.services?.flask?.status;
        const isOnline = flaskStatus === 'online' || flaskStatus === 'skipped';
        
        console.log('Flask status from health check:', flaskStatus, data);
        setDebugInfo(prev => 
          `${prev}\nFlask status: ${flaskStatus || 'unknown'}\nRaw health data: ${JSON.stringify(data.services)}`
        );
        
        // Force the status to true if we detect it's online or skipped
        if (isOnline) {
          console.log('Setting Flask running state to true');
          setIsFlaskRunning(true);
        } else if (flaskStatus === 'offline' || flaskStatus === 'error') {
          console.log('Setting Flask running state to false');
          setIsFlaskRunning(false);
        }
      } catch (err) {
        console.error('Error checking Flask status:', err);
        setIsFlaskRunning(false);
        setDebugInfo(prev => `${prev}\nFlask status check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    // Initial check
    checkFlaskStatus();
    
    // Set up periodic checking (every 2 seconds)
    const intervalId = setInterval(checkFlaskStatus, 2000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Remove isFlaskRunning from dependency array
  
  const generateLessonPlan = async () => {
    console.log('Generate lesson plan button clicked');
    setLoading(true);
    setError(null);
    setDebugInfo('Generating lesson plan...');
    setActiveTab('lessonPlan');
    
    try {
      console.log('Sending request to generate lesson plan');
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones',
          competency: 'Resuelve problemas de cantidad'
        }),
        cache: 'no-store'
      });
      
      console.log('Response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Response received: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating lesson plan');
      }
      
      // Handle both structured data and markdown content
      if (data.lesson_plan) {
        console.log('Setting lesson plan from lesson_plan field');
        // Check if it's markdown content or already structured
        if (typeof data.lesson_plan === 'string') {
          console.log('Lesson plan is string format, converting to object with isMarkdown=true');
          setLessonPlan({
            title: 'Lesson Plan: Fractions',
            subject: 'Matemática',
            grade: 'PRIMARIA',
            topic: 'Fracciones',
            duration: 60,
            content: data.lesson_plan,
            isMarkdown: true
          });
        } else {
          console.log('Lesson plan is already structured object');
          setLessonPlan(data.lesson_plan);
        }
      } else if (data.data) {
        console.log('Setting lesson plan from data field');
        setLessonPlan(data.data);
      } else {
        console.log('No recognized data format, using raw response');
        setLessonPlan({
          title: 'Generated Lesson Plan',
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones',
          duration: 60,
          content: JSON.stringify(data),
          isMarkdown: false
        });
      }
      
      console.log('Final lesson plan state:', lessonPlan);
      setDebugInfo(`Lesson plan set successfully.`);
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const generateActivities = async () => {
    console.log('Generate activities button clicked');
    setLoading(true);
    setError(null);
    setDebugInfo('Generating activities...');
    setActiveTab('activities');
    
    try {
      console.log('Sending request to generate activities');
      const response = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones'
        }),
        cache: 'no-store'
      });
      
      console.log('Response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Response received: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating activities');
      }
      
      // Handle activities data from different fields
      let activitiesData = [];
      if (data.activities && Array.isArray(data.activities)) {
        console.log('Using activities field from response');
        activitiesData = data.activities;
      } else if (data.data && Array.isArray(data.data)) {
        console.log('Using data field from response');
        activitiesData = data.data;
      } else if (typeof data.activities === 'string') {
        console.log('Activities is a string, creating activity object');
        activitiesData = [{
          id: 'generated-1',
          title: 'Generated Activities',
          grade: 'PRIMARIA',
          duration: 45,
          subject: 'Matemática',
          content: {
            description: data.activities,
            objectives: 'See description',
            materials: 'See description',
            instructions: 'See description',
            assessment: 'See description'
          }
        }];
      } else if (typeof data.data === 'string') {
        console.log('Data is a string, creating activity object');
        activitiesData = [{
          id: 'generated-1',
          title: 'Generated Activities',
          grade: 'PRIMARIA',
          duration: 45,
          subject: 'Matemática',
          content: {
            description: data.data,
            objectives: 'See description',
            materials: 'See description',
            instructions: 'See description',
            assessment: 'See description'
          }
        }];
      } else {
        console.log('Could not find expected activities array, creating placeholder');
        activitiesData = [{
          id: 'placeholder-1',
          title: 'Sample Activity',
          grade: 'PRIMARIA',
          duration: 45,
          subject: 'Matemática',
          content: {
            description: 'Placeholder activity description.',
            objectives: 'Sample objectives',
            materials: 'Sample materials',
            instructions: 'Sample instructions',
            assessment: 'Sample assessment'
          }
        }];
      }
      
      console.log('Setting activities:', activitiesData);
      setActivities(activitiesData);
      console.log('Final activities state:', activities);
      setDebugInfo(`Activities set. Count: ${activitiesData.length}`);
    } catch (err) {
      console.error('Error generating activities:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">ProfeChat</h1>
        <p className="text-xl text-gray-600">AI-powered tools for educators</p>
      </div>

      {/* Navigation Menu */}
      <div className="w-full max-w-6xl mb-12">
        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Educational Tools and Resources</h2>
          <p className="mb-6">
            Use our AI-powered tools to generate comprehensive lesson plans and 
            engaging classroom activities for any subject and grade level.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Plan & Create</h3>
              <div className="space-y-3">
                <Link 
                  href="/lesson-planner" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Lesson Planner
                </Link>
                <Link 
                  href="/activity-planner" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Activity Generator
                </Link>
                <Link 
                  href="/subjects" 
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Browse Subjects
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Resources & Information</h3>
              <div className="space-y-3">
                <Link 
                  href="/resources" 
                  className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Educational Resources
                </Link>
                <Link 
                  href="/about" 
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  About ProfeChat
                </Link>
                <button 
                  onClick={resetEnvironment}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Reset Environment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Original content starts here */}
      <div className="w-full max-w-6xl mb-12">
        {/* Hero Section */}
        <section style={{
          marginBottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4rem 0 2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#333',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            maxWidth: '800px'
          }}>
            El poder de la <span style={{ color: '#6E3CD9' }}>IA</span> para ayudar a los <span style={{ color: '#6E3CD9' }}>educadores</span>
          </h1>
          <p style={{
            fontSize: '1.35rem',
            color: '#4b5563',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Crea planes de lecciones y actividades en segundos, ahorrando horas de preparación y enfocándote más en tus estudiantes.
          </p>
          
          {isFlaskRunning === false && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '12px',
              padding: '1.25rem',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              color: '#856404'
            }}>
              <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem'}}>Servidor IA No Disponible</h3>
              <p style={{marginBottom: '0.5rem'}}>El servidor backend de IA parece estar desconectado. Esta aplicación requiere un servidor Flask en funcionamiento para operar correctamente.</p>
              <p style={{marginBottom: '0.5rem'}}>La aplicación utilizará datos de prueba mientras tanto.</p>
            </div>
          )}
          
          {error && (
            <div style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '12px',
              padding: '1.25rem',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              color: '#721c24'
            }}>
              <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{error}</p>
              {error.includes('Connection failed') && (
                <p>El servidor IA puede no estar funcionando. La aplicación usará datos de muestra.</p>
              )}
            </div>
          )}
          
          <div style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                console.log('Generate lesson plan button clicked directly');
                generateLessonPlan();
              }}
              style={{
                padding: '1rem 2rem',
                background: loading ? '#9ca3af' : '#6E3CD9',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: loading ? 'default' : 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(110, 60, 217, 0.25)'
              }}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Plan de Lección'}
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                console.log('Generate activities button clicked directly');
                generateActivities();
              }}
              style={{
                padding: '1rem 2rem',
                background: loading ? '#9ca3af' : 'white',
                color: loading ? 'white' : '#6E3CD9',
                border: '2px solid #6E3CD9',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: loading ? 'default' : 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease'
              }}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Actividades'}
            </button>
          </div>
          
          {/* Debug Box - Only shown in development */}
          {process.env.NODE_ENV !== 'production' && (
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '1rem',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left',
              color: '#0c4a6e',
              fontSize: '0.75rem',
              whiteSpace: 'pre-wrap'
            }}>
              <h4 style={{marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem'}}>Debug Info:</h4>
              {debugInfo}
            </div>
          )}
        </section>
        
        {/* Chat Form */}
        <ChatForm />
        
        {/* Tabs for Results */}
        {(lessonPlan || activities.length > 0) && (
          <section style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button 
                onClick={() => setActiveTab('lessonPlan')}
                style={{
                  padding: '1rem 1.5rem',
                  background: activeTab === 'lessonPlan' ? '#6E3CD9' : 'transparent',
                  color: activeTab === 'lessonPlan' ? 'white' : '#333',
                  border: 'none',
                  borderBottom: activeTab === 'lessonPlan' ? '2px solid #6E3CD9' : 'none',
                  fontWeight: activeTab === 'lessonPlan' ? '600' : '400',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '1rem'
                }}
              >
                Lesson Plan
              </button>
              <button 
                onClick={() => setActiveTab('activities')}
                style={{
                  padding: '1rem 1.5rem',
                  background: activeTab === 'activities' ? '#16a34a' : 'transparent',
                  color: activeTab === 'activities' ? 'white' : '#333',
                  border: 'none',
                  borderBottom: activeTab === 'activities' ? '2px solid #16a34a' : 'none',
                  fontWeight: activeTab === 'activities' ? '600' : '400',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '1rem'
                }}
              >
                Activities
              </button>
            </div>
            
            <div style={{padding: '2rem'}}>
              {activeTab === 'lessonPlan' && lessonPlan && (
                <div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#333',
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid #f3f4f6',
                    paddingBottom: '0.75rem'
                  }}>{lessonPlan.title || 'Lesson Plan'}</h2>
                  
                  {/* For markdown content */}
                  {lessonPlan.isMarkdown ? (
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      {lessonPlan.content}
                    </div>
                  ) : (
                    <>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{
                          background: '#f9fafb',
                          padding: '1rem',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            margin: '0 0 0.5rem',
                            color: '#6E3CD9',
                            fontSize: '1rem'
                          }}>Subject</h4>
                          <p style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}>{lessonPlan.subject}</p>
                        </div>
                        
                        <div style={{
                          background: '#f9fafb',
                          padding: '1rem',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            margin: '0 0 0.5rem',
                            color: '#6E3CD9',
                            fontSize: '1rem'
                          }}>Grade</h4>
                          <p style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}>{lessonPlan.grade}</p>
                        </div>
                        
                        <div style={{
                          background: '#f9fafb',
                          padding: '1rem',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            margin: '0 0 0.5rem',
                            color: '#6E3CD9',
                            fontSize: '1rem'
                          }}>Topic</h4>
                          <p style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}>{lessonPlan.topic}</p>
                        </div>
                        
                        <div style={{
                          background: '#f9fafb',
                          padding: '1rem',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            margin: '0 0 0.5rem',
                            color: '#6E3CD9',
                            fontSize: '1rem'
                          }}>Duration</h4>
                          <p style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}>{lessonPlan.duration} minutes</p>
                        </div>
                      </div>
                      
                      <div style={{marginBottom: '2rem'}}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '0.75rem'
                        }}>Objectives</h3>
                        <ul style={{
                          listStyleType: 'disc',
                          paddingLeft: '1.5rem',
                          marginTop: 0
                        }}>
                          {lessonPlan.objectives && lessonPlan.objectives.map((obj: string, index: number) => (
                            <li key={index} style={{
                              marginBottom: '0.5rem',
                              color: '#4b5563'
                            }}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '0.75rem'
                        }}>Activities</h3>
                        <div style={{
                          display: 'grid',
                          gap: '1rem'
                        }}>
                          {lessonPlan.activities && lessonPlan.activities.map((activity: any, index: number) => (
                            <div key={index} style={{
                              background: 'white',
                              borderRadius: '8px',
                              padding: '1rem',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                              }}>
                                <h4 style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  color: '#333',
                                  margin: 0
                                }}>{activity.name}</h4>
                                <span style={{
                                  background: '#f3f4f6',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  color: '#4b5563'
                                }}>{activity.duration}</span>
                              </div>
                              <p style={{
                                margin: 0,
                                color: '#4b5563',
                                lineHeight: '1.5'
                              }}>{activity.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'activities' && activities.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#333',
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid #f3f4f6',
                    paddingBottom: '0.75rem'
                  }}>Classroom Activities</h2>
                  
                  <div style={{
                    display: 'grid',
                    gap: '1.5rem'
                  }}>
                    {activities.map((activity, index) => (
                      <div key={index} style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{
                          padding: '1rem',
                          borderBottom: '1px solid #e5e7eb',
                          background: '#f9fafb'
                        }}>
                          <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#333',
                            margin: 0
                          }}>{activity.title}</h3>
                        </div>
                        
                        <div style={{
                          padding: '1rem'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <h4 style={{
                                margin: '0 0 0.25rem',
                                color: '#16a34a',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}>Subject</h4>
                              <p style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: '500'
                              }}>{activity.subject}</p>
                            </div>
                            
                            <div>
                              <h4 style={{
                                margin: '0 0 0.25rem',
                                color: '#16a34a',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}>Grade</h4>
                              <p style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: '500'
                              }}>{activity.grade}</p>
                            </div>
                            
                            <div>
                              <h4 style={{
                                margin: '0 0 0.25rem',
                                color: '#16a34a',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}>Duration</h4>
                              <p style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: '500'
                              }}>{activity.duration} minutes</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 style={{
                              margin: '1rem 0 0.5rem',
                              color: '#333',
                              fontSize: '1rem',
                              fontWeight: '600'
                            }}>Description</h4>
                            <p style={{
                              margin: 0,
                              color: '#4b5563',
                              lineHeight: '1.5'
                            }}>{activity.content && activity.content.description}</p>
                          </div>
                          
                          <div>
                            <h4 style={{
                              margin: '1rem 0 0.5rem',
                              color: '#333',
                              fontSize: '1rem',
                              fontWeight: '600'
                            }}>Objectives</h4>
                            <p style={{
                              margin: 0,
                              color: '#4b5563',
                              lineHeight: '1.5'
                            }}>{activity.content && activity.content.objectives}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
} 