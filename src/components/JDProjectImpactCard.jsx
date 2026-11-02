import React, { useState } from 'react';
import { Target, CheckCircle2, ChevronDown, ChevronUp, Layers, Sparkles, Briefcase } from 'lucide-react';

export default function JDProjectImpactCard({ jdProjectImpacts = [], keyPoints = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Fallback to keyPoints if tailored impacts list is small
  const displayItems = jdProjectImpacts.length > 0 
    ? jdProjectImpacts 
    : keyPoints.map((kp) => ({
        jdPoint: kp.point,
        project: kp.project || "Experience & Project Initiatives",
        theme: kp.theme || "Core Deliverable"
      }));

  if (displayItems.length === 0) return null;

  return (
    <div className="glass-card jd-impact-card no-print">
      <div className="card-header-row" style={{ marginBottom: isExpanded ? '1rem' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="impact-header-icon">
            <Target size={20} className="text-emerald" />
          </div>
          <div>
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>
              🎯 JD Core Responsibilities Woven Into Projects
              <span className="badge-target" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                {displayItems.length} Key Points Addressed
              </span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              What this Job Description is looking for, and how your project bullets directly prove it to hiring managers:
            </p>
          </div>
        </div>

        <button 
          className="btn btn-outline btn-icon"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse" : "Expand"}
          type="button"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="jd-impact-grid">
          {displayItems.map((item, idx) => (
            <div key={idx} className="jd-impact-item">
              <div className="jd-impact-top">
                <span className="impact-theme-badge">
                  <Layers size={12} />
                  {item.theme || "Core Deliverable"}
                </span>
                <span className="impact-project-badge">
                  <Briefcase size={12} />
                  {item.project || "Enterprise Project"}
                </span>
              </div>

              <div className="jd-impact-point">
                <CheckCircle2 size={16} className="text-emerald" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item.jdPoint}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
