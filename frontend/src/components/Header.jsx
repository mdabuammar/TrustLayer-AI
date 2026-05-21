import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Cpu, AlertCircle } from 'lucide-react';

export default function Header({ currentFile, totalChunks }) {
  return (
    <header className="w-full border-b border-border-subtle bg-bg-deep/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Side: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-border-subtle flex items-center justify-center bg-bg-dark">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-sm tracking-tight text-white">
              TrustLayer
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              /
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              Verification Engine
            </span>
          </div>
        </div>

        {/* Right Side: Status Badge */}
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {currentFile ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                className="flex items-center gap-2 px-3 py-1 rounded bg-accent-emerald/5 border border-accent-emerald/20 text-accent-emerald text-xs font-mono"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="max-w-[150px] sm:max-w-[240px] truncate text-zinc-300">
                  {currentFile}
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">
                  {totalChunks} chunks
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                className="flex items-center gap-2 px-3 py-1 rounded bg-accent-amber/5 border border-accent-amber/20 text-accent-amber text-xs font-mono"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-zinc-300">Awaiting Reference Document</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

