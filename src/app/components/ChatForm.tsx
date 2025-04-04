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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: input 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          subject: selectedSubject 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const data = await response.json();
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.response || 'Lo siento, no pude procesar tu pregunta.' 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExampleClick = (question: string) => {
    setInput(question);
  };
  
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 0',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#333',
            margin: 0,
            marginBottom: '1rem'
          }}>ChatLPO AI</h2>
          
          {messages.length === 0 && (
            <>
              <p style={{
                fontSize: '1.1rem',
                color: '#555',
                marginBottom: '1.5rem'
              }}>
                ¡Hola! Soy ChatProfe. Estoy aquí para ayudarte con tus tareas y desafíos de enseñanza.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {exampleQuestions.map((question, index) => (
                  <div 
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="example-question"
                    style={{
                      padding: '1rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      color: '#4b5563'
                    }}
                  >
                    {question}
                  </div>
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: selectedSubject === subject ? '#6E3CD9' : '#f9fafb',
                      color: selectedSubject === subject ? 'white' : '#4b5563',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: selectedSubject === subject ? '600' : '400',
                      transition: 'all 0.2s ease',
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
            maxHeight: '500px',
            overflowY: 'auto',
            padding: '0.5rem'
          }}>
            {messages.map((message, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div style={{
                  padding: '1rem',
                  background: message.role === 'user' ? '#6E3CD9' : '#f9fafb',
                  color: message.role === 'user' ? 'white' : '#333',
                  borderRadius: '12px',
                  borderBottomRightRadius: message.role === 'user' ? '0' : '12px',
                  borderBottomLeftRadius: message.role === 'user' ? '12px' : '0',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {message.content}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                  marginTop: '0.25rem',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {message.role === 'user' ? 'Tú' : 'ChatProfe'}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                alignSelf: 'flex-start',
                color: '#6E3CD9'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  border: '2px solid #6E3CD9',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Generando respuesta...</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              className="chat-input"
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '1rem 1.5rem',
                background: isLoading || !input.trim() ? '#9ca3af' : '#6E3CD9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: isLoading || !input.trim() ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
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
        }
        
        .chat-input:focus {
          border-color: #6E3CD9;
          box-shadow: 0 0 0 2px rgba(110, 60, 217, 0.2);
        }
      `}</style>
    </div>
  );
} 