import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import UploadBox from './components/UploadBox';
import QuestionBox from './components/QuestionBox';
import AnswerCard from './components/AnswerCard';
import TrustScoreCard from './components/TrustScoreCard';
import WarningList from './components/WarningList';
import CitationList from './components/CitationList';

export default function App() {
  const [currentFile, setCurrentFile] = useState("");
  const [totalChunks, setTotalChunks] = useState(0);
  
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState(null);
  const [result, setResult] = useState(null);

  const handleUploadSuccess = (filename, chunksCount) => {
    setCurrentFile(filename);
    setTotalChunks(chunksCount);
    setResult(null);
    setAskError(null);
  };

  const handleAskQuestion = async (questionText, topK) => {
    setAskLoading(true);
    setAskError(null);
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask", {
        question: questionText,
        top_k: topK
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Failed to generate answer. Please try again.";
      setAskError(errMsg);
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep relative overflow-hidden flex flex-col pb-16">
      {/* Cinematic Ambient Background Mesh Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-violet/10 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-cyan/5 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-brand-pink/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Dock Navigation */}
      <Header currentFile={currentFile} totalChunks={totalChunks} />

      <main className="max-w-6xl w-full mx-auto px-4 mt-8 flex-grow flex flex-col justify-start gap-8 z-20">
        <AnimatePresence mode="wait">
          {!currentFile ? (
            /* HERO / ONSBOARDING VIEW */
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12 space-y-10"
            >
              {/* Pulsing visual element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-brand-violet/20 rounded-3xl blur-xl" />
                <Sparkles className="w-6 h-6 text-brand-violet relative" />
              </motion.div>

              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent font-sans"
                >
                  Verify LLM Truth <br />
                  <span className="bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan bg-clip-text text-transparent text-glow-violet">
                    In Real Time
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-md sm:text-lg text-slate-400 font-sans max-w-xl mx-auto leading-relaxed"
                >
                  TrustLayer AI enforces context alignment, matches semantic retrieval vectors inside ChromaDB, and flags hallucinated responses on CPU.
                </motion.p>
              </div>

              {/* Upload Dropzone Placement */}
              <div className="w-full max-w-xl">
                <UploadBox onUploadSuccess={handleUploadSuccess} />
              </div>
            </motion.div>
          ) : (
            /* ACTIVE WORKSPACE SPLIT VIEW */
            <motion.div 
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start w-full"
            >
              {/* Left Column: QA, Inputs, Outputs */}
              <div className="lg:col-span-3 space-y-6">
                {/* Micro Uploader (Allows replacing pdf) */}
                <div className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <UploadBox onUploadSuccess={handleUploadSuccess} />
                </div>
                
                <QuestionBox 
                  isDocumentUploaded={!!currentFile} 
                  onAskQuestion={handleAskQuestion} 
                  loading={askLoading} 
                />

                {/* Loading state skeleton */}
                <AnimatePresence>
                  {askLoading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[220px] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-violet to-brand-cyan animate-pulse" />
                      <div className="w-10 h-10 rounded-full border-2 border-brand-violet/20 border-t-brand-violet animate-spin" />
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-200 text-sm font-sans">
                          Querying ChromaDB & OpenRouter...
                        </p>
                        <p className="text-xs text-slate-500 font-mono max-w-[280px]">
                          Computing lexical token overlaps and verifying cosine compliance matrices
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Banner */}
                <AnimatePresence>
                  {askError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-brand-rose/5 border border-brand-rose/25 text-brand-rose text-xs font-sans flex items-start gap-3"
                    >
                      <ShieldCheck className="w-5 h-5 text-brand-rose shrink-0" />
                      <div>
                        <span className="font-semibold">Query Execution Error: </span> {askError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main QA Response display */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <AnswerCard 
                        question={result.question} 
                        answer={result.answer} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Telemetry & Citation accordions */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="wait">
                  {!result ? (
                    /* Inactive telemetry panel placeholder */
                    <motion.div 
                      key="telemetry-idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center text-slate-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-slate-300 font-sans">Verification Standby</h4>
                        <p className="text-xs text-slate-500 font-sans max-w-[200px] leading-relaxed mx-auto">
                          Submit a query to enable vector search matching and truth metric calculations
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* Active telemetry metrics */
                    <motion.div 
                      key="telemetry-active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Metric cards grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                        <TrustScoreCard 
                          score={result.trust_score} 
                          riskLevel={result.risk_level} 
                        />
                        <WarningList 
                          warnings={result.warnings} 
                        />
                      </div>

                      {/* Source grounding chunks list */}
                      <CitationList 
                        retrievedChunks={result.retrieved_chunks} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
