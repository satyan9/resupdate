import React, { useState } from 'react';
import { Download, FileDown, Copy, Check, Eye, Sparkles, Printer, FileText } from 'lucide-react';
import { exportResumeToDocx } from '../utils/docxExporter';

export default function ResumeViewer({ resume, injectedKeywords = [], matchedKeywords = [] }) {
  const [highlightMode, setHighlightMode] = useState(true);
  const [showSummary, setShowSummary] = useState(Boolean(resume?.summary && resume.summary.trim().length > 0));
  const [copied, setCopied] = useState(false);

  if (!resume) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = async () => {
    try {
      await exportResumeToDocx(resume, { showSummary });
    } catch (e) {
      console.error("DOCX generation error:", e);
      alert("Error generating Word document. Please try Export ATS PDF instead.");
    }
  };

  const handleCopyText = () => {
    const lines = [];
    lines.push(resume.fullName || "Candidate");
    if (resume.headline || resume.targetRole) lines.push(resume.headline || resume.targetRole);
    
    const contactParts = [
      resume.phone,
      resume.email,
      resume.location,
      resume.linkedin,
      resume.portfolio,
      resume.github
    ].filter(Boolean);
    if (contactParts.length > 0) lines.push(contactParts.join(' | '));

    if (showSummary && resume.summary) {
      lines.push("\nPROFESSIONAL SUMMARY");
      lines.push(resume.summary);
    }

    if (resume.skills && Object.keys(resume.skills).length > 0) {
      lines.push("\nTECHNICAL SKILLS");
      for (const [cat, sk] of Object.entries(resume.skills)) {
        lines.push(`${cat}: ${Array.isArray(sk) ? sk.join(', ') : sk}`);
      }
    }

    if (resume.experience && resume.experience.length > 0) {
      lines.push("\nWORK EXPERIENCE");
      resume.experience.forEach(exp => {
        lines.push(`\n${exp.role || ''} | ${exp.company || ''} ${exp.period ? `${exp.period}` : ''}`);
        if (exp.bullets) exp.bullets.forEach(b => lines.push(`• ${b}`));
      });
    }

    if (resume.certifications && resume.certifications.length > 0) {
      lines.push("\nCERTIFICATIONS & ACHIEVEMENTS");
      resume.certifications.forEach(cert => lines.push(`• ${cert}`));
    }

    if (resume.education && resume.education.length > 0) {
      lines.push("\nEDUCATION");
      resume.education.forEach(ed => {
        lines.push(`${ed.degree} ${ed.institution ? `\n${ed.institution}` : ''} ${ed.year ? `${ed.year}` : ''}`);
      });
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with keyword highlights
  const renderHighlightedText = (text) => {
    if (!highlightMode || !text) return text;

    const allKeywords = [...new Set([...injectedKeywords, ...matchedKeywords])].filter(k => k && k.length > 2);
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

  const contactList = [
    resume.phone,
    resume.email,
    resume.location,
    resume.linkedin,
    resume.portfolio,
    resume.github
  ].filter(Boolean);

  return (
    <div className="glass-card">
      <div className="card-header-row export-control-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
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
          {resume.summary && (
            <button 
              className={`chip ${showSummary ? 'active' : ''}`}
              onClick={() => setShowSummary(!showSummary)}
              type="button"
              title="Toggle Summary section visibility"
            >
              <FileText size={13} />
              {showSummary ? 'Summary Included' : 'Summary Hidden (1-Page Fit)'}
            </button>
          )}
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
          <div className="resume-name">{resume.fullName || "SATYANARAYANA REDDY KOLAGATLA"}</div>
          {(resume.headline || resume.targetRole) && (
            <div className="resume-target-role">{resume.headline || resume.targetRole}</div>
          )}
          {contactList.length > 0 && (
            <div className="resume-contact">
              {contactList.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span>{item}</span>
                  {idx < contactList.length - 1 && <span style={{ opacity: 0.5, margin: '0 0.35rem' }}>|</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Optional Professional Summary */}
        {showSummary && resume.summary && (
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
            <div className="resume-section-title">Technical Skills</div>
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
            <div className="resume-section-title">Work Experience</div>
            {resume.experience.map((job, idx) => (
              <div key={idx} className="resume-experience-item">
                <div className="exp-header-row">
                  <span>{job.role} {job.company ? `| ${job.company}` : ''}</span>
                  <span>{job.period}</span>
                </div>
                {job.location && (
                  <div className="exp-sub-row">
                    <span>{job.location}</span>
                  </div>
                )}
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

        {/* Certifications & Achievements */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Certifications & Achievements</div>
            <ul className="resume-bullets">
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>
                  {renderHighlightedText(cert)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Education</div>
            {resume.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>
                  <span>{edu.degree}</span>
                  <span>{edu.year}</span>
                </div>
                {edu.institution && (
                  <div style={{ fontSize: '9pt', color: '#4b5563', marginTop: '0.1rem' }}>
                    {edu.institution}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
