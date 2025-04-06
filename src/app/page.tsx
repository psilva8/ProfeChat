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

  // Add this function to reset the environment
  const resetEnvironment = () => {
    console.log('Forcing development environment...');
    // Reset any stored environment values in localStorage
    localStorage.removeItem('next-env');
    localStorage.removeItem('flask-env');
    localStorage.removeItem('is_build');
    localStorage.removeItem('environment');
    
    // Force refreshing the page to reset state
    window.location.reload();
  };

  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '1.25rem 1.5rem',
        color: '#333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span style={{ color: '#6E3CD9' }}>Profe</span>Chat
          </h1>
          
          <nav style={{
            display: 'flex',
            gap: '2rem'
          }}>
            <a href="#" style={{color: '#6E3CD9', textDecoration: 'none', fontWeight: 600}}>Inicio</a>
            <a href="#" style={{color: '#555', textDecoration: 'none', fontWeight: 500}}>Herramientas</a>
            <a href="#" style={{color: '#555', textDecoration: 'none', fontWeight: 500}}>Recursos</a>
            <a href="#" style={{color: '#555', textDecoration: 'none', fontWeight: 500}}>Acerca de</a>
          </nav>
        </div>
      </header>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem 4rem'
      }}>
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
      </main>
      
      {/* Add this at the very bottom of your page, just before the closing footer */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <button
          onClick={resetEnvironment}
          style={{
            background: '#6E3CD9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          Reset Environment
        </button>
      </div>
      
      <footer style={{
        background: 'white',
        borderTop: '1px solid #f1f5f9',
        padding: '4rem 1.5rem',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              margin: '0 0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ color: '#6E3CD9' }}>Profe</span>Chat
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#4b5563',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              maxWidth: '300px'
            }}>
              La plataforma de IA más completa para educadores, diseñada para ayudarte a ahorrar tiempo y mejorar tus clases.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#333' }}>Soluciones</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Para Profesores</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Para Escuelas</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Para Estudiantes</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Privacidad y Seguridad</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#333' }}>Recursos</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Soporte</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Recursos para Desarrollo</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Cursos de Certificación</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#333' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Política de Privacidad</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Términos</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Accesibilidad</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
            © 2023 ProfeChat. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#6E3CD9' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#" style={{ color: '#6E3CD9' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
            <a href="#" style={{ color: '#6E3CD9' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 