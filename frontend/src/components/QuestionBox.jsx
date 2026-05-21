import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sliders, ChevronRight, CornerDownLeft, Sparkles, MessageSquare } from 'lucide-react';

export default function QuestionBox({ isDocumentUploaded, onAskQuestion, loading }) {
  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || loading || !isDocumentUploaded) return;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative"
    >
      <div className={`glass-panel glass-panel-hover rounded-3xl p-8 transition-all duration-500 relative ${
        !isDocumentUploaded ? "opacity-50" : "opacity-100"
      }`}>
        {/* Absolute locked backdrop helper */}
        {!isDocumentUploaded && (
          <div className="absolute inset-0 bg-bg-deep/10 backdrop-blur-[2px] rounded-3xl z-10 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.02, 0.9] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="px-4 py-2 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
            >
              Awaiting Document Ingestion
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-cyan font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/20">
              Step 02
            </span>
            <h2 className="text-lg font-sans font-bold text-slate-200">
              Verify with QA Agent
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-brand-violet" /> Prompt: Context Enforced
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
              Enter Verification Query
            </label>
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder={isDocumentUploaded ? "Ask a question about the document... (Press Enter ↵)" : "Upload PDF to enable querying..."}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={!isDocumentUploaded || loading}
                className="w-full pl-5 pr-14 py-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 text-sm font-sans placeholder-slate-600 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                  <CornerDownLeft className="w-3 h-3 text-slate-600" />
                </kbd>
                <button
                  type="submit"
                  disabled={!isDocumentUploaded || loading || !question.trim()}
                  className="p-2 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-pink text-white disabled:from-slate-900 disabled:to-slate-900 disabled:text-slate-700 disabled:border-slate-800 border border-white/5 transition-all duration-300 disabled:shadow-none hover:shadow-lg hover:shadow-brand-violet/20 hover:scale-105 active:scale-95 disabled:scale-100 shrink-0 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Top_K Context Range Slider */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-sans">
                <Sliders className="w-3.5 h-3.5 text-brand-cyan" /> Retrieval Window Width (top_k)
              </span>
              <p className="text-[10px] text-slate-500 font-mono">
                Number of relevant context blocks to extract from ChromaDB
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="15" 
                value={topK} 
                onChange={(e) => setTopK(parseInt(e.target.value))}
                disabled={loading || !isDocumentUploaded}
                className="w-32 accent-brand-cyan hover:accent-brand-violet cursor-pointer transition-colors"
              />
              <span className="font-mono text-xs text-brand-cyan bg-brand-cyan/10 px-2.5 py-1 border border-brand-cyan/20 rounded font-semibold min-w-8 text-center">
                {topK}
              </span>
            </div>
          </div>

          {/* Suggested Queries */}
          {isDocumentUploaded && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Suggested Verification Vectors
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((text, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(text)}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-slate-900 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700/60 rounded-full px-3.5 py-1.5 text-xs transition-all duration-300 font-sans cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-brand-violet" />
                    {text}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
