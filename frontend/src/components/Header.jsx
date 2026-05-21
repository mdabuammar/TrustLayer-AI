import React from 'react';

export default function Header({ currentFile, totalChunks }) {
  return (
    <header style={{
      textAlign: 'center',
      marginBottom: '3rem',
      animation: 'fadeIn 0.5s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
        }}>
          T
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>TrustLayer AI</h1>
      </div>
      
      <p style={{
        maxWidth: '600px',
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        margin: '0 auto 1.5rem auto'
      }}>
        Lightweight RAG engine with real-time trust evaluation and hallucination detection.
      </p>

      {currentFile ? (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '50px',
          fontSize: '0.875rem',
          color: 'var(--color-success)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
            boxShadow: '0 0 8px var(--color-success)'
          }}></span>
          <span>Active Document: <strong>{currentFile}</strong> ({totalChunks} chunks stored)</span>
        </div>
      ) : (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '50px',
          fontSize: '0.875rem',
          color: 'var(--color-warning)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-warning)',
            animation: 'pulse-ring 2s infinite'
          }}></span>
          <span>No document uploaded yet. Please upload a PDF to query.</span>
        </div>
      )}
    </header>
  );
}
