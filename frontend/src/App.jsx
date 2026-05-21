import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UploadBox from './components/UploadBox';
import QuestionBox from './components/QuestionBox';
import AnswerCard from './components/AnswerCard';
import TrustScoreCard from './components/TrustScoreCard';
import WarningList from './components/WarningList';
import CitationList from './components/CitationList';

export default function App() {
  const [currentFile, setCurrentFile] = useState("");
  const [totalChunks, setTotalChunks] = useState(0);
  
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState(null);
  const [result, setResult] = useState(null);

  const handleUploadSuccess = (filename, chunksCount) => {
    setCurrentFile(filename);
    setTotalChunks(chunksCount);
    // Reset previous answers when a new file is uploaded
    setResult(null);
    setAskError(null);
  };

  const handleAskQuestion = async (questionText, topK) => {
    setAskLoading(true);
    setAskError(null);
    setResult(null);

    try {
      // Call ask endpoint using Axios as required
      const response = await axios.post("http://127.0.0.1:8000/ask", {
        question: questionText,
        top_k: topK
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Failed to generate answer. Please try again.";
      setAskError(errMsg);
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
      animation: 'fadeIn 0.4s ease'
    }}>
      {/* 1. Header Component */}
      <Header currentFile={currentFile} totalChunks={totalChunks} />

      {/* 2. Upload Box Component */}
      <UploadBox onUploadSuccess={handleUploadSuccess} />

      {/* 3. Question Form Component */}
      <QuestionBox 
        isDocumentUploaded={!!currentFile} 
        onAskQuestion={handleAskQuestion} 
        loading={askLoading} 
      />

      {/* 4. Loading indicator for LLM generation */}
      {askLoading && (
        <div className="card" style={{
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.05)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              Retrieving context & generating answer...
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Invoking OpenRouter LLM and computing semantic trust scores...
            </p>
          </div>
        </div>
      )}

      {/* 5. Error banner for LLM QA failures */}
      {askError && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: 'var(--color-danger-bg)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-danger)',
          textAlign: 'left',
          fontSize: '0.95rem'
        }}>
          <strong>Generation Error: </strong> {askError}
        </div>
      )}

      {/* 6. Evaluation Result Cards */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Main Answer display */}
          <AnswerCard 
            question={result.question} 
            answer={result.answer} 
          />

          {/* Trust evaluation columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%'
          }}>
            <TrustScoreCard 
              score={result.trust_score} 
              riskLevel={result.risk_level} 
            />
            <WarningList 
              warnings={result.warnings} 
            />
          </div>

          {/* Source document chunk citations */}
          <CitationList 
            retrievedChunks={result.retrieved_chunks} 
          />
        </div>
      )}
    </div>
  );
}
