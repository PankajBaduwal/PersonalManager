import React from 'react';

const TestDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', fontSize: '32px' }}>Test Dashboard Working!</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>If you can see this, React is working.</p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h2>Features:</h2>
        <ul>
          <li>✅ React Components Loading</li>
          <li>✅ Routing Working</li>
          <li>✅ CSS Styling Applied</li>
          <li>✅ Dashboard Display</li>
        </ul>
      </div>
      <button 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
        onClick={() => alert('Button working!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestDashboard;
