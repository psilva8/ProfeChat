'use client';

import { useState, useEffect } from 'react';

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
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones',
          competency: 'Resuelve problemas de cantidad'
        }),
      });
      
      console.log('Response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Response received: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating lesson plan');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error in API response');
      }
      
      const lessonData = data.data || data.lesson_plan;
      console.log('Setting lesson plan:', lessonData);
      setLessonPlan(lessonData);
      setDebugInfo(`Lesson plan set. Title: ${lessonData?.title}`);
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const generateActivities = async () => {
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
        },
        body: JSON.stringify({
          subject: 'Matemática',
          grade: 'PRIMARIA',
          topic: 'Fracciones'
        }),
      });
      
      console.log('Response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Response received: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error generating activities');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error in API response');
      }
      
      const activitiesData = data.data || data.activities || [];
      console.log('Setting activities:', activitiesData);
      setActivities(activitiesData);
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
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(90deg, #6E3CD9 0%, #7A4BE0 100%)',
        padding: '1rem',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            margin: 0
          }}>ProfeChat</h1>
          
          <nav style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            <a href="#" style={{color: 'white', textDecoration: 'none', fontWeight: 500}}>Home</a>
            <a href="#" style={{color: 'white', textDecoration: 'none', fontWeight: 500}}>Resources</a>
            <a href="#" style={{color: 'white', textDecoration: 'none', fontWeight: 500}}>About</a>
          </nav>
        </div>
      </header>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Hero Section */}
        <section style={{
          marginBottom: '3rem',
          textAlign: 'center',
          padding: '3rem 0'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#333',
            marginBottom: '1rem'
          }}>AI-Powered Teaching Assistant</h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#555',
            maxWidth: '800px',
            margin: '0 auto 2rem'
          }}>
            Create lesson plans and activities in seconds, saving you hours of preparation time.
          </p>
          
          {isFlaskRunning === false && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '8px',
              padding: '1rem',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              color: '#856404'
            }}>
              <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem'}}>Flask Server Not Running</h3>
              <p style={{marginBottom: '0.5rem'}}>The Flask backend server appears to be offline. This application requires a running Flask server to function properly.</p>
              <p style={{marginBottom: '0.5rem'}}>If you see "Connection failed" errors, please start the Flask server:</p>
              <ol style={{marginLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.25rem'}}>Open a terminal</li>
                <li style={{marginBottom: '0.25rem'}}>Navigate to your Flask project directory (<code style={{backgroundColor: '#f8f5eb', padding: '2px 4px', borderRadius: '3px'}}>~/Documents/demo-02/api/python</code>)</li>
                <li style={{marginBottom: '0.25rem'}}>Run your Flask server: <code style={{backgroundColor: '#f8f5eb', padding: '2px 4px', borderRadius: '3px'}}>./start_server.sh</code></li>
                <li>Ensure it's running on port 5338 (as configured in your .flask-port file)</li>
              </ol>
              <p>Until then, the application will use test data.</p>
            </div>
          )}
          
          {error && (
            <div style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '1rem',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              color: '#721c24'
            }}>
              <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{error}</p>
              {error.includes('Connection failed') && (
                <p>The Flask server may not be running. The application will use sample data instead.</p>
              )}
            </div>
          )}
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <button 
              onClick={generateLessonPlan}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#6E3CD9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'default' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Lesson Plan'}
            </button>
            
            <button 
              onClick={generateActivities}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'default' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Activities'}
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
                  }}>{lessonPlan.title}</h2>
                  
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
      
      <footer style={{
        background: '#f1f5f9',
        borderTop: '1px solid #e2e8f0',
        padding: '2rem 1rem',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{
            color: '#64748b',
            margin: 0,
            fontSize: '0.875rem'
          }}>© 2023 ProfeChat. All rights reserved.</p>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            <a href="#" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>Privacy Policy</a>
            <a href="#" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>Terms of Service</a>
            <a href="#" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 