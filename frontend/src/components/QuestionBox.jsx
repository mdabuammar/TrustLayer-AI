import React, { useState } from 'react';

export default function QuestionBox({ isDocumentUploaded, onAskQuestion, loading }) {
  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    onAskQuestion(question, topK);
  };

  const handleSuggestionClick = (suggestedText) => {
    setQuestion(suggestedText);
  };

  const suggestions = [
    "What is the main topic of the uploaded document?",
    "Summarize the key findings or takeaways.",
    "Are there any specific definitions or rules outlined?"
  ];

  return (
    <div className="card" style={{
      width: '100%',
      marginBottom: '2rem',
      opacity: isDocumentUploaded ? 1 : 0.6,
      pointerEvents: isDocumentUploaded ? 'auto' : 'none',
      transition: 'opacity 0.3s ease'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        marginBottom: '1rem',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>2.</span> Ask the RAG Engine
      </h2>

      {!isDocumentUploaded && (
        <p style={{
          textAlign: 'left',
          fontSize: '0.9rem',
          color: 'var(--color-warning)',
          marginBottom: '1rem',
          background: 'rgba(245, 158, 11, 0.05)',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid rgba(245, 158, 11, 0.15)'
        }}>
          ⚠️ Upload a reference PDF above to unlock question answering.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          textAlign: 'left'
        }}>
          <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Your Question:
          </label>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            position: 'relative'
          }}>
            <input 
              type="text"
              placeholder="e.g., Explain the security protocols described in section 4..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!isDocumentUploaded || loading}
              style={{
                flexGrow: 1,
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button
              type="submit"
              disabled={!isDocumentUploaded || loading || !question.trim()}
              style={{
                padding: '0 1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: (!isDocumentUploaded || loading || !question.trim()) ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: '120px',
                boxShadow: (!isDocumentUploaded || loading || !question.trim()) ? 'none' : '0 4px 14px rgba(139, 92, 246, 0.3)'
              }}
            >
              {loading ? (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : 'Submit'}
            </button>
          </div>
        </div>

        {/* Top_K Slider Configuration */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Context Documents (top_k)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>How many relevant chunks to retrieve from ChromaDB</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="range" 
              min="1" 
              max="15" 
              value={topK} 
              onChange={(e) => setTopK(parseInt(e.target.value))}
              disabled={loading}
              style={{
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              minWidth: '24px',
              textAlign: 'center'
            }}>{topK}</span>
          </div>
        </div>

        {/* Suggestion tags */}
        {isDocumentUploaded && suggestions.length > 0 && (
          <div style={{
            textAlign: 'left',
            marginTop: '0.25rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
              Suggested queries:
            </span>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.35rem'
            }}>
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(text)}
                  disabled={loading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: '50px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
