import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Shield, ShieldAlert } from 'lucide-react';

export default function WarningList({ warnings }) {
  const hasWarnings = warnings && warnings.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-3xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden min-h-[340px] text-left"
    >
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" /> Security Evaluation
        </span>
        <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded ${
          hasWarnings 
            ? "bg-brand-rose/10 text-brand-rose border border-brand-rose/20" 
            : "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20"
        }`}>
          {hasWarnings ? "Anomalies Found" : "Compliant"}
        </span>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {hasWarnings ? (
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3.5 rounded-xl bg-brand-rose/5 border border-brand-rose/15 text-brand-rose text-xs font-sans leading-relaxed flex items-start gap-3 shadow-[0_4px_12px_rgba(244,63,94,0.02)]"
              >
                <AlertTriangle className="w-4.5 h-4.5 text-brand-rose shrink-0 mt-0.5 animate-pulse" />
                <span>{warning}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/15 text-brand-emerald text-xs font-sans leading-relaxed flex items-start gap-3 shadow-[0_4px_12px_rgba(16,185,129,0.02)]"
          >
            <CheckCircle className="w-4.5 h-4.5 text-brand-emerald shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">Factual Alignment Verified</p>
              <p className="text-slate-400 font-mono text-[10px] leading-normal">
                No lexical mismatch or factual contradiction detected. The response is fully anchored in the source material.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3">
        Engine: Jaccard & Cosine Overlap Evaluator
      </div>
    </motion.div>
  );
}
