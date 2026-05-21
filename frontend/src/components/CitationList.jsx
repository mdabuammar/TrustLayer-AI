import React, { useState } from 'react';

export default function CitationList({ retrievedChunks }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!retrievedChunks || retrievedChunks.length === 0) {
    return null;
  }

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div className="card fade-in" style={{
      width: '100%',
      marginTop: '1.5rem',
      textAlign: 'left'
    }}>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '1rem'
      }}>
        Retrieved Context Chunks & Citations
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {retrievedChunks.map((chunk, index) => {
          const isExpanded = expandedIndex === index;
          // Format score as percentage
          const percentScore = Math.round(chunk.similarity_score * 100);

          return (
            <div 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease'
              }}
            >
              {/* Header section clickable */}
              <div 
                onClick={() => toggleExpand(index)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.2rem',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: 'var(--accent-primary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '600'
                  }}>
                    Chunk #{chunk.chunk_id}
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>
                    {chunk.filename}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    color: percentScore >= 70 ? 'var(--color-success)' : percentScore >= 40 ? 'var(--color-warning)' : 'var(--color-danger)',
                    backgroundColor: percentScore >= 70 ? 'var(--color-success-bg)' : percentScore >= 40 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '600',
                    border: `1px solid rgba(255,255,255,0.05)`
                  }}>
                    Match: {percentScore}%
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: 'var(--text-muted)'
                  }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Text content section */}
              <div style={{
                maxHeight: isExpanded ? '500px' : '75px',
                padding: '0 1.2rem 0.85rem 1.2rem',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                color: isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderTop: isExpanded ? '1px solid var(--border-color)' : '1px solid transparent',
                paddingTop: isExpanded ? '0.85rem' : 0,
                position: 'relative'
              }}>
                {!isExpanded && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '35px',
                    background: 'linear-gradient(to top, rgba(9, 13, 22, 0.8), transparent)',
                    pointerEvents: 'none'
                  }} />
                )}
                {chunk.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
