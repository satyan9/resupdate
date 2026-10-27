import React, { useState } from 'react';
import { Download, FileDown, Copy, Check, Eye, Sparkles, Printer, FileText, Link, Edit3, X } from 'lucide-react';
import { exportResumeToDocx } from '../utils/docxExporter';

export default function ResumeViewer({ resume, onResumeUpdate, injectedKeywords = [], matchedKeywords = [] }) {
  const [highlightMode, setHighlightMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: resume?.fullName || '',
    headline: resume?.headline || 'Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow',
    summary: resume?.summary || '',
    phone: resume?.phone || '+91 8639822170',
    email: resume?.email || 'satyanarayanareddykolagatla@gmail.com',
    location: resume?.location || 'Hyderabad, India',
    linkedin: resume?.linkedin || 'https://www.linkedin.com/in/satyanarayana-reddy-kolagatla',
    github: resume?.github || 'https://github.com/satyanarayanareddy',
    portfolio: resume?.portfolio || ''
  });

  if (!resume) return null;

  const handlePrint = () => {
    const oldTitle = document.title;
    const cleanFileName = (resume.fullName || "Candidate").replace(/\s+/g, '_') + '_ATS_Resume';
    document.title = cleanFileName;
    window.print();
    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  };

  const handleDownloadDocx = async () => {
    try {
      await exportResumeToDocx(resume, { showSummary: true });
    } catch (e) {
      console.error("DOCX generation error:", e);
      alert("Error generating Word document. Please try Export ATS PDF instead.");
    }
  };

  const handleSaveContact = () => {
    if (onResumeUpdate) {
      onResumeUpdate({
        ...resume,
        fullName: editForm.fullName,
        headline: editForm.headline,
        summary: editForm.summary,
        phone: editForm.phone,
        email: editForm.email,
        location: editForm.location,
        linkedin: editForm.linkedin,
        github: editForm.github,
        portfolio: editForm.portfolio
      });
    }
    setIsEditModalOpen(false);
  };

  const handleCopyText = () => {
    const lines = [];
    lines.push(resume.fullName || "SATYANARAYANA REDDY KOLAGATLA");
    if (resume.headline || resume.targetRole) lines.push(resume.headline || resume.targetRole);
    
    const contactParts = [
      resume.phone,
      resume.email,
      resume.location,
      resume.linkedin ? `LinkedIn: ${resume.linkedin}` : null,
      resume.github ? `GitHub: ${resume.github}` : null,
      resume.portfolio ? `Portfolio: ${resume.portfolio}` : null
    ].filter(Boolean);
    if (contactParts.length > 0) lines.push(contactParts.join(' | '));

    if (resume.summary) {
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

  // Contact items with working URLs
  const phone = resume.phone || "+91 8639822170";
  const email = resume.email || "satyanarayanareddykolagatla@gmail.com";
  const location = resume.location || "Hyderabad, India";
  const linkedin = resume.linkedin || "https://www.linkedin.com/in/satyanarayana-reddy-kolagatla";
  const github = resume.github || "https://github.com/satyanarayanareddy";
  const portfolio = resume.portfolio && !resume.portfolio.includes("gmail.com") ? resume.portfolio : "";

  return (
    <div className="glass-card">
      {/* Control Bar - STRICTLY HIDDEN IN PRINTED PDF */}
      <div className="card-header-row export-control-bar no-print">
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
            {highlightMode ? 'Highlights ON' : 'Highlights OFF'}
          </button>
          
          <button 
            className="chip"
            onClick={() => {
              setEditForm({
                fullName: resume.fullName || '',
                headline: resume.headline || 'Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow',
                summary: resume.summary || '',
                phone: resume.phone || '+91 8639822170',
                email: resume.email || 'satyanarayanareddykolagatla@gmail.com',
                location: resume.location || 'Hyderabad, India',
                linkedin: resume.linkedin || 'https://www.linkedin.com/in/satyanarayana-reddy-kolagatla',
                github: resume.github || 'https://github.com/satyanarayanareddy',
                portfolio: resume.portfolio || ''
              });
              setIsEditModalOpen(true);
            }}
            type="button"
          >
            <Edit3 size={13} />
            Edit Header & Summary
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-emerald"
            onClick={handlePrint}
            title="Export clean single-page ATS vector PDF"
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

      {/* The Printable / Viewable Standard ATS Paper (ONLY THIS PRINTS TO PDF) */}
      <div className="paper-wrapper" id="ats-resume-paper">
        {/* Header */}
        <div className="resume-header">
          <div className="resume-name">{resume.fullName || "SATYANARAYANA REDDY KOLAGATLA"}</div>
          <div className="resume-target-role">
            {resume.headline || "Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow"}
          </div>

          <div className="resume-contact">
            {phone && (
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="resume-contact-link">
                {phone}
              </a>
            )}
            {phone && email && <span className="contact-sep">|</span>}
            {email && (
              <a href={`mailto:${email}`} className="resume-contact-link">
                {email}
              </a>
            )}
            {email && location && <span className="contact-sep">|</span>}
            {location && <span>{location}</span>}
            {linkedin && <span className="contact-sep">|</span>}
            {linkedin && (
              <a 
                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume-contact-link"
              >
                LinkedIn
              </a>
            )}
            {github && <span className="contact-sep">|</span>}
            {github && (
              <a 
                href={github.startsWith('http') ? github : `https://${github}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume-contact-link"
              >
                GitHub
              </a>
            )}
            {portfolio && <span className="contact-sep">|</span>}
            {portfolio && (
              <a 
                href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume-contact-link"
              >
                Portfolio
              </a>
            )}
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

        {/* Work Experience */}
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
              <div key={idx} style={{ marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '9pt', color: '#111827' }}>
                  <span>{edu.degree}</span>
                  <span>{edu.year}</span>
                </div>
                {edu.institution && (
                  <div style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '0.05rem' }}>
                    {edu.institution}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Contact & Links Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} className="text-emerald" />
                Edit Header, Contact & Profile Links
              </h3>
              <button className="btn btn-outline btn-icon" onClick={() => setIsEditModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={editForm.fullName} 
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Headline (Displayed directly below name)
                </label>
                <input 
                  type="text" 
                  value={editForm.headline} 
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Professional Summary
                </label>
                <textarea 
                  rows={3}
                  value={editForm.summary} 
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
                  placeholder="Enter a 2-3 sentence impactful professional summary..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Phone Number
                  </label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Location (City, Country)
                  </label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    LinkedIn URL
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/in/..." 
                    value={editForm.linkedin} 
                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    GitHub URL
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/..." 
                    value={editForm.github} 
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Portfolio / Website URL (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={editForm.portfolio} 
                    onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-emerald" onClick={handleSaveContact}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
