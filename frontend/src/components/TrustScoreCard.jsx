import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function TrustScoreCard({ score, riskLevel }) {
  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'rgb(16, 185, 129)'; // Emerald
      case 'medium':
        return 'rgb(245, 158, 11)'; // Amber
      case 'high':
        return 'rgb(244, 63, 94)'; // Rose
      default:
        return 'rgb(148, 163, 184)';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'rgba(16, 185, 129, 0.06)';
      case 'medium':
        return 'rgba(245, 158, 11, 0.06)';
      case 'high':
        return 'rgba(244, 63, 94, 0.06)';
      default:
        return 'rgba(255, 255, 255, 0.03)';
    }
  };

  const getExplanation = (level, scoreVal) => {
    if (scoreVal === 50 && level.toLowerCase() === 'low') {
      return "The model declined to answer due to insufficient text evidence. This refusal is highly trusted, representing low hallucination risk.";
    }
    if (scoreVal >= 70) {
      return "Strong credibility. The answer has high semantic overlap with multiple verified text passages in the document.";
    }
    if (scoreVal >= 40) {
      return "Moderate credibility. The answer aligns with parts of the source text, but check for potential extrapolations or assumptions.";
    }
    return "High hallucination danger. The generated answer diverges significantly from the retrieved context source blocks.";
  };

  const riskColor = getRiskColor(riskLevel);
  const riskBg = getRiskBgColor(riskLevel);
  
  // Circle SVG metrics
  const radius = 60;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-between text-center gap-6 relative overflow-hidden min-h-[340px]"
    >
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-500" /> Trust Telemetry
        </span>
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: riskColor }} />
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg
          height="144"
          width="144"
          className="-rotate-90 origin-center"
        >
          {/* Background Ring */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx="72"
            cy="72"
          />
          {/* Active Progress Ring */}
          <motion.circle
            stroke={riskColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            r={normalizedRadius}
            cx="72"
            cy="72"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Absolute Numeric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tighter leading-none">
            {score}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            Percent
          </span>
        </div>
      </div>

      {/* Risk badge & Details */}
      <div className="space-y-4 w-full">
        <div 
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border"
          style={{ 
            backgroundColor: riskBg, 
            borderColor: `${riskColor}25`, 
            color: riskColor,
            boxShadow: `0 0 15px ${riskColor}05`
          }}
        >
          {riskLevel.toLowerCase() === 'low' ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          <span>{riskLevel} Hallucination Risk</span>
        </div>

        <p className="text-xs text-slate-400 font-sans leading-relaxed px-2">
          {getExplanation(riskLevel, score)}
        </p>
      </div>
    </motion.div>
  );
}
