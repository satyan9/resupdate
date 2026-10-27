import React from 'react';
import { Target, Sun, Moon, Key, HelpCircle, FileCheck2 } from 'lucide-react';

export default function Header({ theme, toggleTheme, onOpenApiKey, apiKey, onOpenHelp }) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Target size={26} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>
            ATS 95% Matcher
            <span className="badge-target">95% Target</span>
          </h1>
          <p className="brand-tagline">AI Resume Tailor & Keyword Optimization Engine</p>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className={`btn btn-secondary ${apiKey ? 'border-emerald' : ''}`}
          onClick={onOpenApiKey}
          title="Configure Gemini API Key"
        >
          <Key size={16} className={apiKey ? 'text-emerald' : ''} />
          <span>{apiKey ? 'API Key Active' : 'Gemini AI Key'}</span>
        </button>

        <button 
          className="btn btn-secondary btn-icon"
          onClick={onOpenHelp}
          title="How it Works & ATS Tips"
        >
          <HelpCircle size={18} />
        </button>

        <button 
          className="btn btn-secondary btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
