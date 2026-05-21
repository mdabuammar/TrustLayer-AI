import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Layers, RefreshCw, Cpu } from 'lucide-react';

export default function Header({ currentFile, totalChunks }) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4"
    >
      <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow behind logo */}
        <div className="absolute -left-12 -top-12 w-24 h-24 bg-brand-violet/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          {/* Pulsing Shield Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-pink flex items-center justify-center shadow-lg shadow-brand-violet/20"
          >
            <Shield className="w-5 h-5 text-white" />
          </motion.div>
          
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TrustLayer <span className="text-brand-violet">AI</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-brand-cyan" /> Secure RAG Core
            </span>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {currentFile ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-medium font-sans"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="max-w-[150px] sm:max-w-[240px] truncate">
                  {currentFile}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-300 font-mono">
                  {totalChunks} chunks
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-medium font-sans"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-amber-400 shadow-md shadow-amber-400"
                />
                <span>Awaiting Reference PDF</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
