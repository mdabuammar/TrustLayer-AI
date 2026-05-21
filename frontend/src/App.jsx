import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen bg-bg-deep flex flex-col pb-16">
      {/* Enterprise Top Header Bar */}
      <Header currentFile={currentFile} totalChunks={totalChunks} />

      <main className="max-w-6xl w-full mx-auto px-4 mt-8 flex-grow flex flex-col justify-start gap-6 z-20">
        <AnimatePresence mode="wait">
          {!currentFile ? (
            /* HERO / ONBOARDING VIEW */
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-20 space-y-8"
            >
              {/* Minimal Terminal Icon Header */}
              <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-sm">
                <Terminal className="w-5 h-5 text-zinc-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-100 font-sans">
                  TrustLayer AI
                </h1>
                
                <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
                  Real-time contextual truth alignment and hallucination evaluation for local retrieval-augmented pipelines.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="w-full max-w-md pt-2">
                <UploadBox onUploadSuccess={handleUploadSuccess} />
              </div>
            </motion.div>
          ) : (
            /* ACTIVE WORKSPACE SPLIT VIEW */
            <motion.div 
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start w-full"
            >
              {/* Left Column: QA inputs and results */}
              <div className="lg:col-span-3 space-y-5">
                <div className="opacity-80 hover:opacity-100 transition-opacity duration-150">
                  <UploadBox onUploadSuccess={handleUploadSuccess} />
                </div>
                
                <QuestionBox 
                  isDocumentUploaded={!!currentFile} 
                  onAskQuestion={handleAskQuestion} 
                  loading={askLoading} 
                />

                {/* Loading state indicator */}
                <AnimatePresence>
                  {askLoading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-border-subtle bg-bg-dark rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[180px] relative overflow-hidden"
                    >
                      <div className="w-5 h-5 rounded-full border border-zinc-800 border-t-zinc-400 animate-spin" />
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-350 text-xs font-mono">
                          QUERYING CHROMADB & OPENROUTER
                        </p>
                        <p className="text-[10px] text-zinc-550 font-mono max-w-[280px]">
                          Computing lexical token overlaps and verifying semantic similarity matrices
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
                      className="p-3 rounded border border-accent-red/20 bg-accent-red/5 text-accent-red text-xs font-mono flex items-start gap-2.5"
                    >
                      <ShieldAlert className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-[10px] block mb-1">Execution Fail</span>
                        {askError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main QA Answer Display */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <AnswerCard 
                        question={result.question} 
                        answer={result.answer} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Telemetry & Citations */}
              <div className="lg:col-span-2 space-y-5">
                <AnimatePresence mode="wait">
                  {!result ? (
                    /* Inactive telemetry panel placeholder */
                    <motion.div 
                      key="telemetry-idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-border-subtle bg-bg-dark rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[280px]"
                    >
                      <div className="w-9 h-9 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-500">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-zinc-300 font-mono">Verification Standby</h4>
                        <p className="text-[10px] text-zinc-500 font-mono max-w-[200px] leading-relaxed mx-auto">
                          Submit a query query to trigger automatic vector match validation and truth telemetry.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* Active telemetry metrics stack */
                    <motion.div 
                      key="telemetry-active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      <TrustScoreCard 
                        score={result.trust_score} 
                        riskLevel={result.risk_level} 
                      />
                      
                      <WarningList 
                        warnings={result.warnings} 
                      />

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
