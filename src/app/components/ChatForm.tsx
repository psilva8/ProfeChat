'use client';

import React, { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatForm() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const subjects = [
    'Matemáticas', 'Ciencias', 'Historia', 'Lenguaje', 'Arte', 'Música', 
    'Educación Física', 'Inglés', 'Tecnología'
  ];
  
  const exampleQuestions = [
    '¿Cómo puedo enseñar multiplicaciones a niños de tercero básico?',
    '¿Puedes darme ideas para una clase sobre el sistema solar?',
    '¿Qué actividades puedo hacer para trabajar la comprensión lectora?',
    '¿Cómo evaluar el aprendizaje en una clase de matemáticas?'
  ];
  
  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { 
      role: 'user' as const, 
      content: input 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Use the correct endpoint that works with your Flask backend
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: 'All',
          topic: input
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Use the correct field from the response
      const assistantMessage: ChatMessage = { 
        role: 'assistant' as const, 
        content: data.lesson_plan || data.response || 'No response received'
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant' as const, 
        content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: '2rem',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{
          padding: '2rem',
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#333',
            margin: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#6E3CD9' }}>AI</span> Teaching Assistant
          </h2>
          
          {messages.length === 0 && (
            <>
              <p style={{
                fontSize: '1.1rem',
                color: '#4b5563',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Hola profesor, soy tu asistente IA. Estoy aquí para ayudarte con la planificación de clases, actividades, evaluaciones y más.
              </p>
              
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '1rem'
              }}>Preguntas frecuentes</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {exampleQuestions.map((question, index) => (
                  <div 
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="example-question"
                    style={{
                      padding: '1.25rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '1rem',
                      color: '#4b5563',
                      fontWeight: '500',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {question}
                  </div>
                ))}
              </div>
              
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '1rem'
              }}>Seleccionar asignatura</h3>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '2rem'
              }}>
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: selectedSubject === subject ? '#6E3CD9' : 'white',
                      color: selectedSubject === subject ? 'white' : '#4b5563',
                      border: '2px solid',
                      borderColor: selectedSubject === subject ? '#6E3CD9' : '#e5e7eb',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: selectedSubject === subject ? '600' : '500',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </>
          )}
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            maxHeight: '600px',
            overflowY: 'auto',
            padding: '0.5rem',
            borderRadius: '12px'
          }} className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '1.25rem',
                  background: message.role === 'user' ? '#6E3CD9' : '#f9fafb',
                  color: message.role === 'user' ? 'white' : '#333',
                  borderRadius: '16px',
                  borderBottomRightRadius: message.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: message.role === 'user' ? '16px' : '4px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {message.content}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#9ca3af',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {message.role === 'user' ? 'Tú' : 'Asistente IA'}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                alignSelf: 'flex-start',
                color: '#6E3CD9',
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  border: '2px solid #6E3CD9',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontWeight: '500' }}>Generando respuesta...</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Haz tu pregunta aquí..."
              className="chat-input"
              style={{
                flex: 1,
                padding: '1.25rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                outline: 'none',
                background: '#f9fafb'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '1.25rem 2rem',
                background: isLoading || !input.trim() ? '#9ca3af' : '#6E3CD9',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: isLoading || !input.trim() ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '1rem',
                boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 14px rgba(110, 60, 217, 0.3)'
              }}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .example-question:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        
        .chat-input:focus {
          border-color: #6E3CD9;
          box-shadow: 0 0 0 3px rgba(110, 60, 217, 0.15);
          background: white;
        }
        
        .chat-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
          background-color: transparent;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
        
        .chat-message pre {
          background-color: #1e1e1e;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .chat-message code {
          color: #f8f8f2;
          font-family: 'Courier New', Courier, monospace;
        }
        .chat-message ul, .chat-message ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .chat-message ul {
          list-style-type: disc;
        }
        .chat-message ol {
          list-style-type: decimal;
        }
        .chat-message h1, .chat-message h2, .chat-message h3 {
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .chat-message h1 {
          font-size: 1.5rem;
        }
        .chat-message h2 {
          font-size: 1.25rem;
        }
        .chat-message h3 {
          font-size: 1.1rem;
        }
        .chat-message p {
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
} 