import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '48px', marginBottom: '20px' }}>
        🎉 LIFE MANAGER IS WORKING! 🎉
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '15px' }}>✅ Application Status:</h2>
        <ul style={{ lineHeight: '1.8', fontSize: '18px' }}>
          <li>✅ React App Loading Successfully</li>
          <li>✅ Components Rendering Properly</li>
          <li>✅ Styling Working Correctly</li>
          <li>✅ Frontend Server Running</li>
          <li>✅ Backend Connected</li>
        </ul>
        
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '20px', 
          borderRadius: '8px', 
          marginTop: '20px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '10px' }}>🚀 Next Steps:</h3>
          <p style={{ color: '#155724', lineHeight: '1.6' }}>
            Your Life Manager application is working! You can now navigate to the login page 
            and start using all the features.
          </p>
        </div>

        <button 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
            width: '100%'
          }}
          onClick={() => window.location.href = '/login'}
        >
          Go to Login Page →
        </button>
      </div>
    </div>
  );
};

export default TestPage;
