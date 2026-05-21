import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown } from 'lucide-react';

export default function CitationList({ retrievedChunks }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!retrievedChunks || retrievedChunks.length === 0) {
    return null;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border border-border-subtle bg-bg-dark rounded-lg p-5 space-y-4 text-left"
    >
      <div className="border-b border-zinc-800 pb-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-zinc-500" /> Grounding Context
        </span>
        <h3 className="text-xs font-semibold font-mono text-zinc-300 tracking-tight leading-relaxed mt-1">
          ChromaDB Retrievability Index
        </h3>
      </div>

      <div className="space-y-2">
        {retrievedChunks.map((chunk, index) => {
          const isExpanded = expandedIndex === index;
          const percentScore = Math.round(chunk.similarity_score * 100);

          return (
            <motion.div 
              key={index}
              layout
              className="rounded border border-zinc-800 bg-zinc-950/40 overflow-hidden"
            >
              <div 
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between p-2.5 cursor-pointer select-none bg-zinc-950/20 hover:bg-zinc-900/40 transition-colors duration-150"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    Chunk #{chunk.chunk_id}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
                    {chunk.filename}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span 
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      percentScore >= 70 
                        ? "bg-accent-emerald/5 text-accent-emerald border-accent-emerald/20" 
                        : percentScore >= 40 
                          ? "bg-accent-amber/5 text-accent-amber border-accent-amber/20" 
                          : "bg-accent-red/5 text-accent-red border-accent-red/20"
                    }`}
                  >
                    Match: {percentScore}%
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="border-t border-zinc-900"
                  >
                    <div className="p-3 bg-zinc-950 text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap select-text">
                      {chunk.text}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isExpanded && (
                <div className="px-3 py-1.5 text-[10px] text-zinc-650 font-mono truncate select-none border-t border-zinc-900/50">
                  {chunk.text}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
