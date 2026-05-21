import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function TrustScoreCard({ score, riskLevel }) {
  const getRiskColorClass = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-accent-emerald bg-accent-emerald/5 border-accent-emerald/20';
      case 'medium':
        return 'text-accent-amber bg-accent-amber/5 border-accent-amber/20';
      case 'high':
        return 'text-accent-red bg-accent-red/5 border-accent-red/20';
      default:
        return 'text-zinc-400 bg-zinc-900 border-zinc-800';
    }
  };

  const getProgressBarColorClass = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-accent-emerald';
      case 'medium':
        return 'bg-accent-amber';
      case 'high':
        return 'bg-accent-red';
      default:
        return 'bg-zinc-700';
    }
  };

  const getExplanation = (level, scoreVal) => {
    if (scoreVal === 50 && level.toLowerCase() === 'low') {
      return "Document refusal triggered: Insufficient evidence in uploaded texts. No unsupported facts were generated.";
    }
    if (scoreVal >= 70) {
      return "Strong credibility match. The output matches multiple independent passages in the document.";
    }
    if (scoreVal >= 40) {
      return "Moderate credibility. The output aligns partially, but contains minor terminological additions.";
    }
    return "High hallucination risk. Output contains unsupported keywords and lacks substantial matching source text.";
  };

  return (
    <div className="w-full border border-border-subtle bg-bg-dark rounded-lg p-5">
      <div className="space-y-5">
        
        {/* Title block */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-650" /> Trust Telemetry
          </span>
          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${getRiskColorClass(riskLevel)}`}>
            {riskLevel} Risk
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-tight text-zinc-500 block">
              Confidence Score
            </span>
            <span className="text-3xl font-semibold font-mono tracking-tight text-zinc-100">
              {score}%
            </span>
          </div>

          <div className="space-y-1 flex flex-col justify-end items-end">
            <span className="text-[9px] font-mono uppercase tracking-tight text-zinc-500 block w-full text-right">
              Assessment
            </span>
            <div className="flex items-center gap-1 mt-1 text-zinc-300 text-xs font-mono">
              {riskLevel.toLowerCase() === 'low' ? (
                <ShieldCheck className="w-4 h-4 text-accent-emerald" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-accent-amber" />
              )}
              <span className="font-semibold text-zinc-200">Verified</span>
            </div>
          </div>
        </div>

        {/* Flat Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-850">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColorClass(riskLevel)}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-600">
            <span>0% (UNVERIFIED)</span>
            <span>100% (ALIGNED)</span>
          </div>
        </div>

        {/* Analysis Explanation */}
        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed pt-1">
          {getExplanation(riskLevel, score)}
        </p>

      </div>
    </div>
  );
}
