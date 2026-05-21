import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown, Award, ExternalLink } from 'lucide-react';

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
      className="glass-panel rounded-3xl p-8 space-y-6 text-left w-full relative"
    >
      {/* Background glow */}
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="border-b border-white/5 pb-4">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-brand-cyan" /> Grounding Context
        </span>
        <h3 className="text-md sm:text-lg font-bold font-sans text-slate-100 tracking-tight leading-relaxed mt-1">
          ChromaDB Retrievability Index
        </h3>
      </div>

      <div className="space-y-3">
        {retrievedChunks.map((chunk, index) => {
          const isExpanded = expandedIndex === index;
          const percentScore = Math.round(chunk.similarity_score * 100);

          return (
            <motion.div 
              key={index}
              layout
              className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-300 hover:border-white/[0.08]"
            >
              {/* Clicking this area toggles the accordion */}
              <div 
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between p-4 cursor-pointer select-none bg-white/[0.005] hover:bg-white/[0.02] transition-colors duration-200"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-brand-violet/10 text-brand-violet border border-brand-violet/20 px-2 py-0.5 rounded">
                    Chunk #{chunk.chunk_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 font-sans truncate max-w-[200px] sm:max-w-xs">
                    {chunk.filename}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span 
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      percentScore >= 70 
                        ? "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20" 
                        : percentScore >= 40 
                          ? "bg-brand-amber/10 text-brand-amber border-brand-amber/20" 
                          : "bg-brand-rose/10 text-brand-rose border-brand-rose/20"
                    }`}
                  >
                    Match: {percentScore}%
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                </div>
              </div>

              {/* Collapsible content section */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="border-t border-white/[0.04]"
                  >
                    <div className="p-4 bg-slate-950/20 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {chunk.text}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preview mask when collapsed */}
              {!isExpanded && (
                <div className="px-4 pb-3 text-xs text-slate-500 font-sans line-clamp-1 truncate select-none opacity-80">
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
