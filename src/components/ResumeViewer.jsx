import React, { useState } from 'react';
import { Download, FileDown, Copy, Check, Eye, Sparkles, Printer, FileText, Link, Edit3, X, Zap } from 'lucide-react';
import { exportResumeToDocx } from '../utils/docxExporter';
import ResumeEditorModal from './ResumeEditorModal';
import { RECOMMENDED_TELECOM_PROJECT } from '../data/sampleData';

// Data normalization and text artifact cleaning helpers
function cleanText(str) {
  if (!str || typeof str !== 'string') return str || '';
  let res = str
    // Fix broken year tokens from PDF (e.g. "202 5" -> "2025")
    .replace(/\b(19\d|20\d)\s+(\d)\b/g, '$1$2')
    // Fix compound words with spaces: e.g. "On - the - Spot" -> "On-the-Spot"
    .replace(/\bOn\s*[-–—]\s*the\s*[-–—]\s*Spot\b/gi, 'On-the-Spot')
    .replace(/\b(\d+)\s*[-–—]\s*Star\b/gi, '$1-Star')
    .replace(/\bAI\s*[-–—]\s*Powered\b/gi, 'AI-Powered')
    .replace(/\b([a-zA-Z0-9]+)\s+[-–—]\s+(driven|premises|time|powered|based|native|scale|tier|level|centric)\b/gi, '$1-$2')
    .replace(/\b(on|real|multi|cross|end|well)\s+[-–—]\s+([a-zA-Z0-9]+)\b/gi, '$1-$2')
    // Fix split words from PDF extraction
    .replace(/\bSynce\s+d\b/gi, 'Synced')
    .replace(/\btransforma\s+tion\b/gi, 'transformation')
    .replace(/\bCur\s+ated\b/gi, 'Curated')
    .replace(/\bBigQuer\s+y\b/gi, 'BigQuery')
    .replace(/\bleast\s*[-–—]\s*privilege\b/gi, 'least-privilege')
    // Remove space before punctuation
    .replace(/\s+([,.:;!?])/g, '$1')
    // Remove space inside parentheses
    .replace(/\s+\)/g, ')')
    .replace(/\(\s+/g, '(')
    // Strip trailing ". link" or " link"
    .replace(/\s*\.?\s*link\s*$/i, '')
    // Fix date ranges without spaces: e.g. "Nov 2024-July 2026", "2020-2024" -> "Nov 2024 – July 2026"
    .replace(/(\b\d{4})\s*[-–—]\s*([a-zA-Z]{3,}|\d{4}|Present|Current)/g, '$1 – $2')
    .replace(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*[-–—]\s*([a-zA-Z]{3,}|\d{4}|Present|Current)/g, '$1 – $2')
    // Fix title dashes without spaces: e.g. "Client-Financial" -> "Client – Financial", "B.Tech-Electronics" -> "B.Tech – Electronics"
    .replace(/(\b[a-zA-Z]{3,})\s*[-–—]\s*([A-Z][a-zA-Z]{3,}\b)/g, (match, p1, p2) => {
      const lower2 = p2.toLowerCase();
      if (/^(driven|premises|time|powered|based|native|scale|tier|level|centric)$/.test(lower2)) {
        return `${p1}-${p2}`;
      }
      return `${p1} – ${p2}`;
    })
    .replace(/\bB\.Tech\s*[-–—]\s*/gi, 'B.Tech – ')
    // Re-check On-the-Spot and compound words
    .replace(/\bOn\s*[-–—\s]*the\s*[-–—\s]*Spot\b/gi, 'On-the-Spot')
    .replace(/\b(\d+)\s*[-–—\s]*Star\b/gi, '$1-Star')
    .replace(/\bAI\s*[-–—\s]*Powered\b/gi, 'AI-Powered')
    // Collapse whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();

  return res;
}

function sanitizeJob(job) {
  if (!job) return job;
  let company = cleanText(job.company);
  let period = cleanText(job.period);
  let role = cleanText(job.role);
  let location = cleanText(job.location);

  // If company ends with month (e.g. "Banking Client – Financial Sector May" or "Telecom Client Nov")
  const monthMatch = company.match(/\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)$/i);
  if (monthMatch) {
    company = company.replace(/\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)$/i, '').trim();
    if (!period.toLowerCase().includes(monthMatch[1].toLowerCase())) {
      period = `${monthMatch[1]} ${period}`.trim();
    }
  }

  const roleMatch = role.match(/\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)$/i);
  if (roleMatch) {
    role = role.replace(/\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)$/i, '').trim();
    if (!period.toLowerCase().includes(roleMatch[1].toLowerCase())) {
      period = `${roleMatch[1]} ${period}`.trim();
    }
  }

  const bullets = (job.bullets || []).map(b => cleanText(b));
  return { ...job, company, role, period, location, bullets };
}

export default function ResumeViewer({ resume, onResumeUpdate, injectedKeywords = [], matchedKeywords = [] }) {
  const [highlightMode, setHighlightMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState('experience');

  const openEditor = (tab = 'experience') => {
    setEditModalTab(tab);
    setIsEditModalOpen(true);
  };

  if (!resume) return null;

  // Real-time sanitized data to fix stray spaces, broken years, attached months, and ". link"
  const sanitizedExperience = (resume.experience || []).map(sanitizeJob);
  const sanitizedCertifications = (resume.certifications || []).map(cleanText);
  const sanitizedSummary = cleanText(resume.summary || '');
  const sanitizedSkills = {};
  if (resume.skills) {
    for (const [cat, skList] of Object.entries(resume.skills)) {
      const cleanedCat = cleanText(cat);
      if (Array.isArray(skList)) {
        sanitizedSkills[cleanedCat] = skList.map(cleanText);
      } else {
        sanitizedSkills[cleanedCat] = cleanText(String(skList));
      }
    }
  }

  // Check if second project or telecom project is missing PySpark from the JD
  const telecomNeedsUpgrade = sanitizedExperience.some(
    e => /telecom|catalog/i.test((e.company || '') + (e.role || '')) &&
         !JSON.stringify(e.bullets || []).toLowerCase().includes('pyspark')
  );

  const handleQuickUpgradeTelecom = () => {
    if (!resume || !onResumeUpdate) return;
    const updatedExp = (resume.experience || []).map((exp, idx) => {
      if (idx === 2 || /telecom|catalog/i.test((exp.company || '') + (exp.role || ''))) {
        return {
          ...exp,
          company: RECOMMENDED_TELECOM_PROJECT.company,
          role: RECOMMENDED_TELECOM_PROJECT.role,
          period: RECOMMENDED_TELECOM_PROJECT.period,
          location: RECOMMENDED_TELECOM_PROJECT.location,
          bullets: [...RECOMMENDED_TELECOM_PROJECT.bullets]
        };
      }
      return exp;
    });
    onResumeUpdate({ ...resume, experience: updatedExp });
  };

  const handlePrint = () => {
    const oldTitle = document.title;
    // Clear document title during print dialog to eliminate browser printing the title at top
    document.title = '';
    window.print();
    setTimeout(() => {
      document.title = oldTitle;
    }, 1500);
  };

  const handleDownloadDocx = async () => {
    try {
      const cleanResume = {
        ...resume,
        summary: sanitizedSummary,
        skills: sanitizedSkills,
        experience: sanitizedExperience,
        certifications: sanitizedCertifications
      };
      await exportResumeToDocx(cleanResume, { showSummary: true });
    } catch (e) {
      console.error("DOCX generation error:", e);
      alert("Error generating Word document. Please try Export ATS PDF instead.");
    }
  };

  const handleCopyText = () => {
    const lines = [];
    lines.push(cleanText(resume.fullName) || "SATYANARAYANA REDDY KOLAGATLA");
    if (resume.headline || resume.targetRole) lines.push(cleanText(resume.headline || resume.targetRole));
    
    const contactParts = [
      resume.phone,
      resume.email,
      resume.location,
      resume.linkedin ? `LinkedIn: ${resume.linkedin}` : null,
      resume.github ? `GitHub: ${resume.github}` : null,
      resume.portfolio ? `Portfolio: ${resume.portfolio}` : null
    ].filter(Boolean);
    if (contactParts.length > 0) lines.push(contactParts.join(' | '));

    if (sanitizedSummary) {
      lines.push("\nPROFESSIONAL SUMMARY");
      lines.push(sanitizedSummary);
    }

    if (Object.keys(sanitizedSkills).length > 0) {
      lines.push("\nTECHNICAL SKILLS");
      for (const [cat, sk] of Object.entries(sanitizedSkills)) {
        lines.push(`${cat}: ${Array.isArray(sk) ? sk.join(', ') : sk}`);
      }
    }

    if (sanitizedExperience.length > 0) {
      lines.push("\nWORK EXPERIENCE");
      sanitizedExperience.forEach(exp => {
        lines.push(`\n${exp.role || ''} | ${exp.company || ''} ${exp.period ? `${exp.period}` : ''}`);
        if (exp.bullets) exp.bullets.forEach(b => lines.push(`• ${b}`));
      });
    }

    if (sanitizedCertifications.length > 0) {
      lines.push("\nCERTIFICATIONS & ACHIEVEMENTS");
      sanitizedCertifications.forEach(cert => lines.push(`• ${cert}`));
    }

    if (resume.education && resume.education.length > 0) {
      lines.push("\nEDUCATION");
      resume.education.forEach(ed => {
        lines.push(`${cleanText(ed.degree)} ${ed.institution ? `\n${cleanText(ed.institution)}` : ''} ${ed.year ? `${cleanText(ed.year)}` : ''}`);
      });
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with keyword highlights
  const renderHighlightedText = (rawStr) => {
    const text = cleanText(rawStr);
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
            className="chip active"
            onClick={() => openEditor('experience')}
            type="button"
            style={{ fontWeight: 600, color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            title="Edit all sections: Projects, Bullets, Skills, Header, Certifications"
          >
            <Edit3 size={13} />
            Edit Resume & Projects
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

      {/* Quick Upgrade Notification Banner if Telecom project lacks PySpark */}
      {telecomNeedsUpgrade && (
        <div className="telecom-upgrade-banner no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Zap size={18} className="text-emerald" style={{ flexShrink: 0 }} />
            <div>
              <strong>Telecom Project Optimization:</strong> Your 2nd project is currently missing key JD skills (<strong>PySpark, Databricks & BigQuery Lakehouse</strong>).
            </div>
          </div>
          <button 
            className="btn btn-emerald btn-sm" 
            onClick={handleQuickUpgradeTelecom} 
            type="button"
            style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
          >
            <Sparkles size={13} />
            Upgrade 2nd Project Now
          </button>
        </div>
      )}

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
        {sanitizedSummary && (
          <div className="resume-section">
            <div className="resume-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Professional Summary</span>
              <button 
                type="button" 
                onClick={() => openEditor('header')} 
                className="section-edit-btn no-print"
                title="Edit professional summary and contact"
              >
                <Edit3 size={11} /> Edit Summary
              </button>
            </div>
            <p className="resume-summary-text">
              {renderHighlightedText(sanitizedSummary)}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {Object.keys(sanitizedSkills).length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Technical Skills</span>
              <button 
                type="button" 
                onClick={() => openEditor('skills')} 
                className="section-edit-btn no-print"
                title="Edit technical skill categories and items"
              >
                <Edit3 size={11} /> Edit Skills
              </button>
            </div>
            <div className="resume-skills-block">
              {Object.entries(sanitizedSkills).map(([cat, skList], idx) => (
                <div key={idx} className="resume-skills-category">
                  <span className="resume-skills-label">{cat}: </span>
                  <span>{renderHighlightedText(Array.isArray(skList) ? skList.join(', ') : String(skList))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {sanitizedExperience && sanitizedExperience.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Work Experience</span>
              <button 
                type="button" 
                onClick={() => openEditor('experience')} 
                className="section-edit-btn no-print"
                title="Edit project roles, companies, and bullet points"
              >
                <Edit3 size={11} /> Edit Projects
              </button>
            </div>
            {sanitizedExperience.map((job, idx) => (
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
        {sanitizedCertifications && sanitizedCertifications.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Certifications & Achievements</div>
            <ul className="resume-bullets">
              {sanitizedCertifications.map((cert, idx) => (
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
              <div key={idx} className="resume-education-item">
                <div className="edu-header-row">
                  <span>{cleanText(edu.degree)}</span>
                  <span>{cleanText(edu.year)}</span>
                </div>
                {edu.institution && (
                  <div className="edu-sub-row">
                    {cleanText(edu.institution)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Resume & Projects Editor Modal */}
      <ResumeEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resume={resume}
        onSave={(updated) => {
          if (onResumeUpdate) onResumeUpdate(updated);
          setIsEditModalOpen(false);
        }}
        initialTab={editModalTab}
      />
    </div>
  );
}
