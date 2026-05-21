import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

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
      setError("Supported file format is PDF only.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileDetails(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      setFileDetails({
        filename: data.filename,
        total_chunks: data.total_chunks
      });
      onUploadSuccess(data.filename, data.total_chunks);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Upload process failed.";
      setError(errMsg);
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

  return (
    <div className="w-full border border-border-subtle bg-bg-dark rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Source Document
        </h2>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight bg-zinc-900 border border-border-subtle px-2 py-0.5 rounded">
          ChromaDB Active
        </span>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`border border-dashed rounded flex flex-col items-center justify-center p-8 cursor-pointer transition-colors duration-200 ${
          dragActive 
            ? "border-zinc-400 bg-zinc-900/50" 
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
        }`}
      >
        <input 
          ref={inputRef} 
          type="file" 
          accept=".pdf" 
          className="hidden" 
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-zinc-300">Processing PDF...</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Splitting chapters, generating embeddings, writing index
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <Upload className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-300 font-medium">
                  Select a PDF file or drop it here
                </p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Maximum file size: 20 MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 rounded border border-accent-red/20 bg-accent-red/5 text-xs text-accent-red flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-mono">
                <span className="font-semibold uppercase tracking-wider">[Error]:</span> {error}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {fileDetails && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 rounded border border-accent-emerald/20 bg-accent-emerald/5 text-xs text-accent-emerald flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 font-mono">
                <p className="font-semibold uppercase tracking-wider text-zinc-200">
                  Document Loaded
                </p>
                <p className="text-[11px] text-zinc-300 truncate max-w-[400px]">
                  {fileDetails.filename}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {fileDetails.total_chunks} chunks indexed successfully
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
