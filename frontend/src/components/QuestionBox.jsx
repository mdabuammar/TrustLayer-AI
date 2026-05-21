import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sliders, ArrowRight, Lock, MessageSquare } from 'lucide-react';

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
    <div className="w-full relative">
      <div className={`border border-border-subtle bg-bg-dark rounded-lg p-5 relative transition-opacity duration-300 ${
        !isDocumentUploaded ? "opacity-60" : "opacity-100"
      }`}>
        
        {/* Awaiting Document Lock Screen */}
        {!isDocumentUploaded && (
          <div className="absolute inset-0 bg-bg-deep/75 backdrop-blur-[1px] rounded-lg z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="px-3 py-1.5 rounded border border-accent-amber/20 text-accent-amber bg-accent-amber/5 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Awaiting Reference Ingestion
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Verification Query
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight bg-zinc-900 border border-border-subtle px-2 py-0.5 rounded flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Strict Context Mode
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder={isDocumentUploaded ? "Enter your query (e.g. What color is the logo?)..." : "Ingest PDF to enable query engine"}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={!isDocumentUploaded || loading}
                className="w-full pl-3 pr-12 py-2.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-100 text-xs font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-40"
              />
              <div className="absolute right-2.5 flex items-center">
                <button
                  type="submit"
                  disabled={!isDocumentUploaded || loading || !question.trim()}
                  className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-700 transition-colors text-[10px] font-medium font-sans flex items-center gap-1 cursor-pointer"
                >
                  Ask <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Top_K Context Slider */}
          <div className="flex items-center justify-between p-3 rounded border border-zinc-800 bg-zinc-950/40">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-zinc-300 flex items-center gap-1 font-mono">
                <Sliders className="w-3 h-3 text-zinc-400" /> Context Window (top_k)
              </span>
              <p className="text-[9px] text-zinc-500 font-mono">
                Source chunks retrieved for verification
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={topK} 
                onChange={(e) => setTopK(parseInt(e.target.value))}
                disabled={loading || !isDocumentUploaded}
                className="w-24 accent-zinc-300 hover:accent-white cursor-pointer"
              />
              <span className="font-mono text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded min-w-[20px] text-center font-bold">
                {topK}
              </span>
            </div>
          </div>

          {/* Suggestions */}
          {isDocumentUploaded && (
            <div className="space-y-1.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">
                Quick Prompts
              </span>
              <div className="flex flex-col gap-1">
                {suggestions.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(text)}
                    disabled={loading}
                    className="w-full text-left bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-850 rounded px-3 py-1.5 text-[11px] transition-colors font-mono truncate cursor-pointer"
                  >
                    &gt; {text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

