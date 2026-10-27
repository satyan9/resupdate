import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Filter } from 'lucide-react';

export default function KeywordDrawer({ matchedKeywords = [], missingKeywords = [], injectedKeywords = [] }) {
  const [filter, setFilter] = useState('all');

  return (
    <div className="glass-card">
      <div className="card-header-row">
        <h3 className="card-title">
          <Sparkles size={18} className="text-primary" />
          ATS Keyword Gap Analysis
        </h3>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            className={`chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({matchedKeywords.length + missingKeywords.length})
          </button>
          <button 
            className={`chip ${filter === 'matched' ? 'active' : ''}`}
            onClick={() => setFilter('matched')}
            style={{ color: '#34d399' }}
          >
            ✓ Matched ({matchedKeywords.length})
          </button>
          <button 
            className={`chip ${filter === 'missing' ? 'active' : ''}`}
            onClick={() => setFilter('missing')}
            style={{ color: '#fb7185' }}
          >
            ✗ Missing ({missingKeywords.length})
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', padding: '0.25rem' }}>
        {/* Matched Keywords */}
        {(filter === 'all' || filter === 'matched') && matchedKeywords.map((kw, idx) => {
          const wasInjected = injectedKeywords.includes(kw);
          return (
            <span 
              key={`match-${idx}`} 
              className={`keyword-tag ${wasInjected ? 'injected' : 'matched'}`}
              title={wasInjected ? 'Keyword injected by 95% optimizer' : 'Already present in resume'}
            >
              <CheckCircle2 size={13} />
              {kw}
              {wasInjected && <small style={{ fontSize: '0.65rem', opacity: 0.85 }}>(Tailored)</small>}
            </span>
          );
        })}

        {/* Missing Keywords */}
        {(filter === 'all' || filter === 'missing') && missingKeywords.map((kw, idx) => (
          <span key={`miss-${idx}`} className="keyword-tag missing">
            <XCircle size={13} />
            {kw}
          </span>
        ))}

        {matchedKeywords.length === 0 && missingKeywords.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No keywords analyzed yet. Upload a resume and paste a Job Description.
          </p>
        )}
      </div>
    </div>
  );
}
