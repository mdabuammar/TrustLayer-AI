import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export default function AnswerCard({ question, answer }) {
  const isRefusal = answer === "I could not find enough evidence in the uploaded documents.";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel rounded-3xl p-8 relative overflow-hidden border ${
        isRefusal 
          ? "border-brand-amber/20 bg-brand-amber/[0.01]" 
          : "border-brand-violet/20 bg-brand-violet/[0.01]"
      }`}
    >
      {/* Decorative vertical line */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${
        isRefusal ? "bg-brand-amber" : "bg-gradient-to-b from-brand-violet to-brand-pink"
      }`} />

      {/* Decorative background glow */}
      <div className={`absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
        isRefusal ? "bg-brand-amber/5" : "bg-brand-violet/5"
      }`} />

      <div className="space-y-6">
        {/* Header containing Query */}
        <div className="border-b border-white/5 pb-4 space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-600" /> Active Verification Vector
          </span>
          <h3 className="text-md sm:text-lg font-bold font-sans text-slate-100 tracking-tight leading-relaxed">
            "{question}"
          </h3>
        </div>

        {/* Answer section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              RAG Answer Output
            </span>
            <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded ${
              isRefusal 
                ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/20" 
                : "bg-brand-violet/10 text-brand-violet border border-brand-violet/20"
            }`}>
              {isRefusal ? "Refusal (No Evidence)" : "Secure Alignment Confirmed"}
            </span>
          </div>

          <div className="text-slate-200 text-sm leading-relaxed tracking-wide font-sans">
            {isRefusal ? (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-brand-amber/5 border border-brand-amber/20 text-brand-amber font-medium"
              >
                <ShieldAlert className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {answer}
                </p>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="whitespace-pre-wrap pl-1"
              >
                {answer}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
