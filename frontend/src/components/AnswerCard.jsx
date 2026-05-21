import React from 'react';

export default function AnswerCard({ question, answer }) {
  const isRefusal = answer === "I could not find enough evidence in the uploaded documents.";

  return (
    <div className="card fade-in" style={{
      width: '100%',
      marginBottom: '1.5rem',
      textAlign: 'left',
      borderLeft: isRefusal ? '4px solid var(--color-warning)' : '4px solid var(--accent-primary)',
      background: isRefusal ? 'rgba(245, 158, 11, 0.02)' : 'rgba(139, 92, 246, 0.02)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '0.75rem'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }}>
          Query
        </span>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginTop: '0.25rem'
        }}>
          {question}
        </h3>
      </div>

      <div>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }}>
          Generated Answer
        </span>
        <div style={{
          fontSize: '1.05rem',
          lineHeight: '1.6',
          color: 'var(--text-primary)',
          marginTop: '0.5rem',
          whiteSpace: 'pre-line'
        }}>
          {isRefusal ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-warning)',
              background: 'rgba(245, 158, 11, 0.05)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              fontWeight: '500'
            }}>
              <span>⚠️</span>
              <span>{answer}</span>
            </div>
          ) : (
            answer
          )}
        </div>
      </div>
    </div>
  );
}
