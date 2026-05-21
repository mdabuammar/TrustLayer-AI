import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function AnswerCard({ question, answer }) {
  const isRefusal = answer === "I could not find enough evidence in the uploaded documents.";

  return (
    <div className="w-full border border-border-subtle bg-bg-dark rounded-lg p-5">
      <div className="space-y-4">
        {/* Header containing Query */}
        <div className="border-b border-zinc-800 pb-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-600" /> Active Query
          </span>
          <h3 className="text-xs sm:text-sm font-semibold font-mono text-zinc-300 mt-1">
            "{question}"
          </h3>
        </div>

        {/* Answer section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              System Response
            </span>
            <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
              isRefusal 
                ? "bg-accent-amber/5 text-accent-amber border border-accent-amber/20" 
                : "bg-zinc-900 text-zinc-400 border border-border-subtle"
            }`}>
              {isRefusal ? "Refusal (Context Insufficient)" : "Document Supported"}
            </span>
          </div>

          <div className="text-zinc-300 text-xs leading-relaxed font-sans">
            {isRefusal ? (
              <div className="flex items-start gap-2.5 p-3 rounded bg-accent-amber/5 border border-accent-amber/20 text-accent-amber font-mono">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {answer}
                </p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap pl-1 font-sans text-zinc-200">
                {answer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

