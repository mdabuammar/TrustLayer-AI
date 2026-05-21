import React from 'react';

export default function WarningList({ warnings }) {
  const hasWarnings = warnings && warnings.length > 0;

  return (
    <div className="card fade-in" style={{
      flex: 1,
      minWidth: '280px',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignSelf: 'stretch'
    }}>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        margin: 0
      }}>
        System Alerts & Warnings
      </h3>

      {hasWarnings ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {warnings.map((warning, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.15)',
                borderRadius: '8px',
                color: 'var(--color-danger)',
                fontSize: '0.875rem',
                lineHeight: '1.4'
              }}
            >
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          borderRadius: '8px',
          color: 'var(--color-success)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          <span style={{ fontSize: '1.15rem' }}>✓</span>
          <span>Factual alignment checks passed. The answer matches the retrieved passages.</span>
        </div>
      )}
    </div>
  );
}
