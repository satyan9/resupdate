import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ScoreGauge({ scoreData, initialScore, isTailored }) {
  const { overallScore, grade, breakdown } = scoreData;

  // Trigger celebration confetti when 95%+ match is achieved
  useEffect(() => {
    if (isTailored && overallScore >= 95) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isTailored, overallScore]);

  // SVG Radial Circle calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  let gaugeColor = 'var(--accent-rose)';
  if (overallScore >= 95) gaugeColor = 'var(--accent-emerald)';
  else if (overallScore >= 80) gaugeColor = 'var(--accent-cyan)';
  else if (overallScore >= 65) gaugeColor = 'var(--accent-amber)';

  return (
    <div className="glass-card score-overview-grid">
      {/* Left Radial Gauge */}
      <div className="score-radial-card">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <circle
              className="gauge-bg"
              cx="80"
              cy="80"
              r={radius}
            />
            <circle
              className="gauge-fill"
              cx="80"
              cy="80"
              r={radius}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                stroke: gaugeColor
              }}
            />
          </svg>

          <div className="gauge-center-content">
            <span className="gauge-score-value" style={{ color: gaugeColor }}>
              {overallScore}%
            </span>
            <span className="gauge-score-label">ATS Match</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', fontWeight: 700, color: gaugeColor }}>
          {grade}
        </div>

        {initialScore && initialScore !== overallScore && (
          <div className="score-delta-badge">
            <TrendingUp size={15} />
            <span>Before: {initialScore}% ➔ After: {overallScore}%</span>
          </div>
        )}
      </div>

      {/* Right Metrics Breakdown */}
      <div className="metrics-list">
        <div className="metric-row">
          <div className="metric-meta">
            <span>🎯 Exact Keyword Match</span>
            <span style={{ color: breakdown.keywordMatch >= 90 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
              {breakdown.keywordMatch}%
            </span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${breakdown.keywordMatch}%`, 
                backgroundColor: breakdown.keywordMatch >= 90 ? 'var(--accent-emerald)' : 'var(--accent-primary)' 
              }} 
            />
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-meta">
            <span>💼 Experience & Action Bullets</span>
            <span style={{ color: breakdown.experienceAlignment >= 90 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
              {breakdown.experienceAlignment}%
            </span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${breakdown.experienceAlignment}%`,
                backgroundColor: breakdown.experienceAlignment >= 90 ? 'var(--accent-emerald)' : 'var(--accent-cyan)' 
              }} 
            />
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-meta">
            <span>📋 ATS Format Compliance (Single-Column & Headings)</span>
            <span style={{ color: 'var(--accent-emerald)' }}>
              {breakdown.formatHealth}%
            </span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill" 
              style={{ width: `${breakdown.formatHealth}%`, backgroundColor: 'var(--accent-emerald)' }} 
            />
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-meta">
            <span>🧩 Architecture & Soft Skills Alignment</span>
            <span style={{ color: breakdown.methodologies >= 90 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
              {breakdown.methodologies}%
            </span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${breakdown.methodologies}%`,
                backgroundColor: breakdown.methodologies >= 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)' 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
