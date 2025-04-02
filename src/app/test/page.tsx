export default function TestPage() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', color: 'black'}}>
        Test Page
      </h1>
      <p style={{marginTop: '10px', color: 'black'}}>
        This is a simple test page with inline styles to check if basic rendering works.
      </p>
      <button 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Test Button
      </button>
    </div>
  );
} 