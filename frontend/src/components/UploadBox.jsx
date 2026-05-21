import React, { useState, useRef } from 'react';

export default function UploadBox({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Invalid file format. Only PDF files are allowed.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileDetails(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call the real backend upload endpoint
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed. Please verify the document is valid.");
      }

      setFileDetails({
        filename: data.filename,
        total_chunks: data.total_chunks,
        message: data.message
      });
      onUploadSuccess(data.filename, data.total_chunks);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="card" style={{
      width: '100%',
      marginBottom: '2rem',
      position: 'relative'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        marginBottom: '1rem',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>1.</span> Upload Reference Document
      </h2>

      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(139, 92, 246, 0.04)' : 'rgba(255, 255, 255, 0.01)',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef} 
          type="file" 
          accept=".pdf" 
          style={{ display: 'none' }} 
          onChange={handleChange}
        />

        {/* PDF Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: 'var(--text-secondary)'
        }}>
          📄
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className="spinner" style={{
              width: '24px',
              height: '24px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTop: '3px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Extracting text, generating embeddings and updating ChromaDB...
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Drag and drop your PDF here, or <span style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>browse</span>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Supports standard vector/scanned PDFs up to 20MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-danger-bg)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-danger)',
          textAlign: 'left',
          fontSize: '0.875rem'
        }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {fileDetails && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-success-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-success)',
          textAlign: 'left',
          fontSize: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div>
            <strong>✓ Success: </strong> {fileDetails.filename} has been successfully processed!
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
            Total Chunks created: {fileDetails.total_chunks} • Embedded using all-MiniLM-L6-v2 on CPU.
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
