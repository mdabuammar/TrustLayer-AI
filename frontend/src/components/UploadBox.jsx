import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
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
      setError("Invalid file format. Only PDF files are allowed.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileDetails(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call the FastAPI backend upload endpoint
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;
      setFileDetails({
        filename: data.filename,
        total_chunks: data.total_chunks,
        message: data.message
      });
      onUploadSuccess(data.filename, data.total_chunks);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "An unexpected error occurred during upload.";
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="glass-panel glass-panel-hover rounded-3xl p-8 relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-violet/10 transition-all duration-700" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-violet font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-brand-violet/10 border border-brand-violet/20">
              Step 01
            </span>
            <h2 className="text-lg font-sans font-bold text-slate-200">
              Configure RAG Reference
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" /> DB: ChromaDB Persistent
          </span>
        </div>

        <motion.div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
            dragActive 
              ? "border-brand-cyan bg-brand-cyan/5 shadow-[0_0_25px_rgba(6,182,212,0.15)]" 
              : "border-slate-800 hover:border-slate-700 hover:bg-white/[0.01]"
          }`}
          whileHover={{ scale: 0.995 }}
          whileTap={{ scale: 0.99 }}
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
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-brand-violet animate-spin" />
                  <motion.div 
                    animate={{ y: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute top-1 left-0 right-0 h-[2px] bg-brand-cyan/80 blur-[1px]"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-200 text-sm font-sans">Ingesting PDF Resource...</h4>
                  <p className="text-xs text-slate-400 max-w-[320px] font-mono leading-relaxed">
                    Splitting pages into chunks, compiling semantic vectors, and indexing ChromaDB collection
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors duration-300 relative">
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-brand-violet transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-sans text-slate-300 font-medium">
                    Drag and drop your PDF here, or <span className="text-brand-violet underline underline-offset-4 group-hover:text-brand-pink transition-colors">browse local files</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Accepts text/scanned document PDFs up to 20MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-brand-rose/5 border border-brand-rose/20 text-brand-rose text-xs font-sans flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-brand-rose shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Ingestion Failure: </span> {error}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Details */}
        <AnimatePresence>
          {fileDetails && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/20 text-brand-emerald text-xs font-sans flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">✓ Ingestion Successful: </span> {fileDetails.filename} indexed!
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Total chunks: {fileDetails.total_chunks} • Embedded on CPU using sentence-transformers/all-MiniLM-L6-v2.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
