import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function WarningList({ warnings }) {
  const hasWarnings = warnings && warnings.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border border-border-subtle bg-bg-dark rounded-lg p-5 flex flex-col justify-between gap-5 min-h-[300px] text-left"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" /> Security Evaluation
        </span>
        <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
          hasWarnings 
            ? "bg-accent-red/5 text-accent-red border-accent-red/20" 
            : "bg-accent-emerald/5 text-accent-emerald border-accent-emerald/20"
        }`}>
          {hasWarnings ? "Anomalies Found" : "Compliant"}
        </span>
      </div>

      <div className="flex-grow flex flex-col justify-center py-2">
        {hasWarnings ? (
          <div className="space-y-2.5">
            {warnings.map((warning, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded bg-accent-red/5 border border-accent-red/10 text-accent-red text-xs font-mono flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                <span>{warning}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded bg-accent-emerald/5 border border-accent-emerald/10 text-zinc-300 text-xs font-mono flex items-start gap-3"
          >
            <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-zinc-200">Factual Alignment Verified</p>
              <p className="text-zinc-400 text-[10px] leading-normal">
                No lexical mismatch or factual contradiction detected. The response is fully anchored in the source material.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="text-[9px] text-zinc-500 font-mono border-t border-zinc-800 pt-3">
        Engine: Cosine & Jaccard Overlap Evaluator v1.0
      </div>
    </motion.div>
  );
}
