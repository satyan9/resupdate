import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} className="text-primary" />
            Gemini AI API Configuration
          </h3>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <Zap size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              <strong>Optional:</strong> The built-in <strong>Smart Algorithmic Optimizer</strong> works automatically without an API key! If you want custom deep Gemini LLM rewrites, enter your key below.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Google Gemini API Key
          </label>
          <input 
            type="password"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Stored locally in your browser.</span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Get free key from Google AI Studio <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {apiKey && (
            <button className="btn btn-outline" onClick={handleClear}>
              Remove Key
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} className="text-emerald" />
            How to Reach 95%+ ATS Match Safely
          </h3>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card-solid)', borderRadius: 'var(--radius-md)' }}>
            <strong>1. Exact Keyword Density (40% of ATS score)</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              ATS systems scan for exact tech names (e.g. <em>Kubernetes, Kafka, Redis, TypeScript</em>). Our engine places them both in the Skills table and woven into experience bullet points.
            </p>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card-solid)', borderRadius: 'var(--radius-md)' }}>
            <strong>2. Single-Column ATS Format (Zero Parsing Errors)</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Multi-column templates, tables, Canva graphics, and icons often scramble Taleo and Workday parsers. Our exporter guarantees a 100% clean, single-column document.
            </p>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card-solid)', borderRadius: 'var(--radius-md)' }}>
            <strong>3. Truthful STAR / XYZ Bullet Points</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              We do not invent fake degrees or fictional employers. We reframe your real accomplishments using high-impact action verbs and quantified metrics.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
