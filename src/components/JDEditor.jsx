import React from 'react';
import { Briefcase, Sparkles, Trash2, ClipboardPaste } from 'lucide-react';
import { SAMPLE_JD } from '../data/sampleData';

export default function JDEditor({ jdText, setJdText, keywordCount }) {
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJdText(text);
    } catch (err) {
      console.warn("Clipboard access denied or unavailable", err);
    }
  };

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-card">
      <div className="card-header-row">
        <h2 className="card-title">
          <Briefcase size={20} className="text-emerald" />
          2. Paste Target Job Description (JD)
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-outline"
            onClick={() => setJdText(SAMPLE_JD)}
            type="button"
          >
            <Sparkles size={15} />
            Load Sample JD
          </button>
          {jdText && (
            <button 
              className="btn btn-outline btn-icon"
              onClick={() => setJdText('')}
              title="Clear text"
              type="button"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <textarea
        className="jd-input-box"
        placeholder="Paste the full Job Description here (Role, Responsibilities, Qualifications, Technical Stack)..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span><strong>{wordCount}</strong> words</span>
          {keywordCount > 0 && (
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
              🎯 <strong>{keywordCount}</strong> Key Entities Detected
            </span>
          )}
        </div>
        <button 
          className="chip"
          onClick={handlePasteClipboard}
          type="button"
          style={{ cursor: 'pointer' }}
        >
          <ClipboardPaste size={13} />
          Paste from Clipboard
        </button>
      </div>

      <div className="chips-row">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Quick Templates:</span>
        <button 
          type="button"
          className="chip" 
          onClick={() => setJdText(SAMPLE_JD)}
        >
          ☁️ Staff Cloud Architect
        </button>
        <button 
          type="button"
          className="chip" 
          onClick={() => setJdText(`Role: Senior Frontend Engineer (React/TypeScript)\nCompany: FastGrowth SaaS\n\nRequirements:\n• 5+ years React.js, TypeScript, Next.js, Redux, Tailwind CSS\n• Strong mastery in Web Performance Optimization, Core Web Vitals, and responsive UI\n• RESTful & GraphQL APIs, Jest, Cypress automated testing\n• CI/CD with GitHub Actions, Docker, and Agile/Scrum team collaboration.`)}
        >
          ⚛️ Senior React / Frontend
        </button>
        <button 
          type="button"
          className="chip" 
          onClick={() => setJdText(`Role: Senior AI & Python Platform Engineer\nCompany: NextGen Intelligence\n\nRequirements:\n• 4+ years of Python, FastAPI, PyTorch, LangChain, and Vector Databases (Pinecone/Weaviate)\n• Experience building scalable RESTful microservices, Docker, Kubernetes, and AWS\n• Strong fundamentals in Distributed Systems, Redis caching, and PostgreSQL\n• TDD testing, Git workflows, and CI/CD pipelines.`)}
        >
          🤖 Python / AI Engineer
        </button>
      </div>
    </div>
  );
}
