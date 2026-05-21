import React from 'react';

export default function TrustScoreCard({ score, riskLevel }) {
  // Get color based on risk level
  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'var(--color-success)';
      case 'medium':
        return 'var(--color-warning)';
      case 'high':
        return 'var(--color-danger)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'var(--color-success-bg)';
      case 'medium':
        return 'var(--color-warning-bg)';
      case 'high':
        return 'var(--color-danger-bg)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
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
  
  // Circle SVG math
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card fade-in" style={{
      flex: 1,
      minWidth: '280px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      textAlign: 'center'
    }}>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        alignSelf: 'flex-start',
        margin: 0
      }}>
        Trust Evaluation
      </h3>

      {/* Circle Gauge */}
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg
          height="120"
          width="120"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        >
          {/* Background circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="60"
            cy="60"
          />
          {/* Animated active progress circle */}
          <circle
            stroke={riskColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
            r={normalizedRadius}
            cx="60"
            cy="60"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score number inside */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: '1.85rem',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            lineHeight: 1
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.15rem'
          }}>
            Score
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div style={{
        padding: '0.4rem 1rem',
        borderRadius: '50px',
        backgroundColor: riskBg,
        border: `1px solid ${riskColor}40`,
        color: riskColor,
        fontWeight: '700',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {riskLevel} Hallucination Risk
      </div>

      <p style={{
        fontSize: '0.85rem',
        lineHeight: '1.5',
        color: 'var(--text-secondary)',
        margin: 0
      }}>
        {getExplanation(riskLevel, score)}
      </p>
    </div>
  );
}
