import React, { useState } from 'react';
import { Download, FileDown, Copy, Check, Eye, Sparkles, Printer } from 'lucide-react';
import { exportResumeToDocx } from '../utils/docxExporter';

export default function ResumeViewer({ resume, injectedKeywords = [], matchedKeywords = [] }) {
  const [highlightMode, setHighlightMode] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!resume) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = async () => {
    try {
      await exportResumeToDocx(resume);
    } catch (e) {
      console.error("DOCX generation error:", e);
      alert("Error generating Word document. Please try Print to PDF instead.");
    }
  };

  const handleCopyText = () => {
    const lines = [];
    lines.push(resume.fullName || "Candidate");
    if (resume.targetRole) lines.push(resume.targetRole);
    lines.push([resume.email, resume.phone, resume.location, resume.linkedin, resume.github].filter(Boolean).join(' | '));
    lines.push("\n--- PROFESSIONAL SUMMARY ---");
    lines.push(resume.summary || "");
    lines.push("\n--- SKILLS ---");
    if (resume.skills) {
      for (const [cat, sk] of Object.entries(resume.skills)) {
        lines.push(`${cat}: ${Array.isArray(sk) ? sk.join(', ') : sk}`);
      }
    }
    lines.push("\n--- EXPERIENCE ---");
    if (resume.experience) {
      resume.experience.forEach(exp => {
        lines.push(`\n${exp.role} - ${exp.company} (${exp.period || ''})`);
        if (exp.bullets) exp.bullets.forEach(b => lines.push(`• ${b}`));
      });
    }
    lines.push("\n--- EDUCATION ---");
    if (resume.education) {
      resume.education.forEach(ed => lines.push(`${ed.degree} - ${ed.institution} (${ed.year || ''})`));
    }
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with keyword highlights
  const renderHighlightedText = (text) => {
    if (!highlightMode || !text) return text;

    // Build combined regex from injected and matched keywords
    const allKeywords = [...new Set([...injectedKeywords, ...matchedKeywords])].filter(k => k.length > 2);
    if (allKeywords.length === 0) return text;

    const regex = new RegExp(`\\b(${allKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = allKeywords.some(kw => kw.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        const isInjected = injectedKeywords.some(kw => kw.toLowerCase() === part.toLowerCase());
        return (
          <span key={i} className={isInjected ? 'highlight-injected' : 'highlight-keyword'}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="glass-card">
      <div className="card-header-row export-control-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 className="card-title">
            <Sparkles size={20} className="text-emerald" />
            ATS-Standard Resume Preview
          </h2>
          <button 
            className={`chip ${highlightMode ? 'active' : ''}`}
            onClick={() => setHighlightMode(!highlightMode)}
            type="button"
          >
            <Eye size={13} />
            {highlightMode ? 'Keyword Highlights ON' : 'Highlights OFF'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-emerald"
            onClick={handlePrint}
            title="Export clean ATS vector PDF"
          >
            <Printer size={16} />
            Export ATS PDF
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handleDownloadDocx}
            title="Download Word Document"
          >
            <FileDown size={16} />
            Download .DOCX
          </button>

          <button 
            className="btn btn-outline"
            onClick={handleCopyText}
            title="Copy plain text for job application forms"
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Plaintext'}
          </button>
        </div>
      </div>

      {/* The Printable / Viewable Standard ATS Paper */}
      <div className="paper-wrapper" id="ats-resume-paper">
        {/* Header */}
        <div className="resume-header">
          <div className="resume-name">{resume.fullName || "Candidate Name"}</div>
          {resume.targetRole && (
            <div className="resume-target-role">{resume.targetRole}</div>
          )}
          <div className="resume-contact">
            {resume.email && <span>{resume.email}</span>}
            {resume.phone && <span>• {resume.phone}</span>}
            {resume.location && <span>• {resume.location}</span>}
            {resume.linkedin && <span>• {resume.linkedin}</span>}
            {resume.github && <span>• {resume.github}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="resume-section">
            <div className="resume-section-title">Professional Summary</div>
            <p className="resume-summary-text">
              {renderHighlightedText(resume.summary)}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {resume.skills && Object.keys(resume.skills).length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Core Competencies & Technical Skills</div>
            <div className="resume-skills-block">
              {Object.entries(resume.skills).map(([cat, skList], idx) => (
                <div key={idx} className="resume-skills-category">
                  <span className="resume-skills-label">{cat}: </span>
                  <span>{renderHighlightedText(Array.isArray(skList) ? skList.join(', ') : String(skList))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Professional Experience</div>
            {resume.experience.map((job, idx) => (
              <div key={idx} className="resume-experience-item">
                <div className="exp-header-row">
                  <span>{job.company}</span>
                  <span>{job.period}</span>
                </div>
                <div className="exp-sub-row">
                  <span>{job.role}</span>
                  <span>{job.location}</span>
                </div>
                {job.bullets && job.bullets.length > 0 && (
                  <ul className="resume-bullets">
                    {job.bullets.map((b, bIdx) => (
                      <li key={bIdx}>
                        {renderHighlightedText(b)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Education</div>
            {resume.education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '0.25rem' }}>
                <div>
                  <strong>{edu.degree}</strong> – {edu.institution}
                </div>
                <div>{edu.year}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Certifications</div>
            <ul className="resume-bullets">
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>
                  {renderHighlightedText(cert)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
