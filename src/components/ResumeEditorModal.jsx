import React, { useState, useEffect } from 'react';
import { 
  X, Check, Briefcase, User, Wrench, GraduationCap, 
  Plus, Trash2, Sparkles, ChevronDown, ChevronUp, AlertCircle, Award
} from 'lucide-react';
import { RECOMMENDED_TELECOM_PROJECT } from '../data/sampleData';

export default function ResumeEditorModal({ 
  isOpen, 
  onClose, 
  resume, 
  onSave, 
  initialTab = 'experience' 
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (resume) {
      setFormData(JSON.parse(JSON.stringify(resume)));
    }
  }, [resume, isOpen]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen || !formData) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- EXPERIENCE / PROJECTS HANDLERS ---
  const handleProjectFieldChange = (index, field, value) => {
    setFormData(prev => {
      const next = { ...prev };
      next.experience = [...(next.experience || [])];
      next.experience[index] = { ...next.experience[index], [field]: value };
      return next;
    });
  };

  const handleBulletChange = (projIndex, bulletIndex, value) => {
    setFormData(prev => {
      const next = { ...prev };
      next.experience = [...(next.experience || [])];
      const bullets = [...(next.experience[projIndex].bullets || [])];
      bullets[bulletIndex] = value;
      next.experience[projIndex] = { ...next.experience[projIndex], bullets };
      return next;
    });
  };

  const handleAddBullet = (projIndex) => {
    setFormData(prev => {
      const next = { ...prev };
      next.experience = [...(next.experience || [])];
      const bullets = [...(next.experience[projIndex].bullets || []), ""];
      next.experience[projIndex] = { ...next.experience[projIndex], bullets };
      return next;
    });
  };

  const handleRemoveBullet = (projIndex, bulletIndex) => {
    setFormData(prev => {
      const next = { ...prev };
      next.experience = [...(next.experience || [])];
      const bullets = (next.experience[projIndex].bullets || []).filter((_, idx) => idx !== bulletIndex);
      next.experience[projIndex] = { ...next.experience[projIndex], bullets };
      return next;
    });
  };

  const handleApplyRecommendedTelecomProject = (projIndex) => {
    setFormData(prev => {
      const next = { ...prev };
      next.experience = [...(next.experience || [])];
      next.experience[projIndex] = {
        ...next.experience[projIndex],
        company: RECOMMENDED_TELECOM_PROJECT.company,
        role: RECOMMENDED_TELECOM_PROJECT.role,
        period: RECOMMENDED_TELECOM_PROJECT.period,
        location: RECOMMENDED_TELECOM_PROJECT.location,
        bullets: [...RECOMMENDED_TELECOM_PROJECT.bullets]
      };
      return next;
    });
    showToast("✨ Applied recommended PySpark & Databricks Telecom Data Lakehouse project!");
  };

  const handleAddProject = () => {
    setFormData(prev => {
      const next = { ...prev };
      const newProj = {
        company: "New Client / Enterprise",
        role: "Data Engineer",
        period: "2025 – Present",
        location: "Hyderabad, India / Remote",
        bullets: [
          "Architected and deployed end-to-end data processing pipelines ensuring 99.99% SLA availability.",
          "Optimized query performance and data warehouse storage models, cutting processing costs by 35%."
        ]
      };
      next.experience = [...(next.experience || []), newProj];
      return next;
    });
    showToast("Added new experience entry");
  };

  const handleRemoveProject = (projIndex) => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      setFormData(prev => {
        const next = { ...prev };
        next.experience = (next.experience || []).filter((_, idx) => idx !== projIndex);
        return next;
      });
      showToast("Project removed");
    }
  };

  // --- HEADER & SUMMARY HANDLERS ---
  const handleHeaderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- TECHNICAL SKILLS HANDLERS ---
  const handleSkillCategoryNameChange = (oldCatName, newCatName) => {
    if (!newCatName.trim() || oldCatName === newCatName) return;
    setFormData(prev => {
      const next = { ...prev };
      const newSkills = {};
      for (const [k, v] of Object.entries(next.skills || {})) {
        if (k === oldCatName) {
          newSkills[newCatName] = v;
        } else {
          newSkills[k] = v;
        }
      }
      next.skills = newSkills;
      return next;
    });
  };

  const handleSkillsListChange = (catName, textValue) => {
    // Comma-separated list into array of strings
    const list = textValue
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    setFormData(prev => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        [catName]: list
      }
    }));
  };

  const handleAddSkillCategory = () => {
    const newName = prompt("Enter new Skill Category name (e.g. 'Cloud & DevOps', 'Tools & Frameworks'):");
    if (newName && newName.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...(prev.skills || {}),
          [newName.trim()]: []
        }
      }));
    }
  };

  const handleRemoveSkillCategory = (catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      setFormData(prev => {
        const next = { ...prev };
        const newSkills = { ...(next.skills || {}) };
        delete newSkills[catName];
        next.skills = newSkills;
        return next;
      });
    }
  };

  // --- CERTIFICATIONS & EDUCATION HANDLERS ---
  const handleCertChange = (index, value) => {
    setFormData(prev => {
      const next = { ...prev };
      const certs = [...(next.certifications || [])];
      certs[index] = value;
      next.certifications = certs;
      return next;
    });
  };

  const handleAddCert = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), "Google Cloud Certified: Professional Data Engineer"]
    }));
  };

  const handleRemoveCert = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleEduChange = (index, field, value) => {
    setFormData(prev => {
      const next = { ...prev };
      const edu = [...(next.education || [])];
      edu[index] = { ...edu[index], [field]: value };
      next.education = edu;
      return next;
    });
  };

  const handleAddEdu = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: "B.Tech – Computer Science / Engineering", institution: "University / Institute Name", year: "2020 – 2024" }
      ]
    }));
  };

  const handleRemoveEdu = (index) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // --- SAVE ---
  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-large" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Sticky Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Sparkles size={20} className="text-emerald" />
              Comprehensive Resume & Project Editor
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Edit and customize every section of your resume, including project bullet points and skills.
            </p>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="editor-tabs-bar" style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.65rem 1.5rem',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={15} />
            Work Experience & Projects ({formData.experience?.length || 0})
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Wrench size={15} />
            Technical Skills ({Object.keys(formData.skills || {}).length} Categories)
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'header' ? 'active' : ''}`}
            onClick={() => setActiveTab('header')}
          >
            <User size={15} />
            Header, Summary & Contact
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <GraduationCap size={15} />
            Certifications & Education
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            background: 'var(--accent-emerald)',
            color: '#ffffff',
            padding: '0.6rem 1.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} />
            {toastMessage}
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>

          {/* ==================================================== */}
          {/* TAB 1: WORK EXPERIENCE & PROJECTS                    */}
          {/* ==================================================== */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <strong>💡 Pro Tip for 95%+ ATS & Recruiter Selection:</strong> Ensure your projects demonstrate hands-on 
                  <strong> PySpark, Databricks, BigQuery Data Lakehouse, Partitioning, and Docker CI/CD</strong> to back up the skills section!
                </div>
              </div>

              {(formData.experience || []).map((exp, pIdx) => {
                const isTelecomOrProject2 = pIdx === 2 || /telecom|catalog|search/i.test((exp.company || '') + (exp.role || ''));

                return (
                  <div 
                    key={pIdx} 
                    style={{
                      background: 'var(--bg-card-solid)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge-target" style={{ fontSize: '0.75rem' }}>
                          Project #{pIdx + 1}
                        </span>
                        <strong style={{ fontSize: '1rem' }}>
                          {exp.role || 'Project Role'} {exp.company ? `| ${exp.company}` : ''}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {isTelecomOrProject2 && (
                          <button
                            type="button"
                            className="btn btn-emerald btn-sm"
                            onClick={() => handleApplyRecommendedTelecomProject(pIdx)}
                            title="Insert internet-researched PySpark, Databricks & BigQuery Lakehouse bullets"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            <Sparkles size={13} />
                            Load PySpark & Databricks Telecom Lakehouse
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline btn-icon"
                          onClick={() => handleRemoveProject(pIdx)}
                          title="Delete this project"
                          style={{ padding: '0.35rem' }}
                        >
                          <Trash2 size={15} className="text-rose" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Role / Project Title
                        </label>
                        <input 
                          type="text" 
                          value={exp.role || ''} 
                          onChange={(e) => handleProjectFieldChange(pIdx, 'role', e.target.value)}
                          className="editor-input"
                          placeholder="e.g. AI-Powered Enterprise Search & Telecom Data Lakehouse"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Company / Client Name
                        </label>
                        <input 
                          type="text" 
                          value={exp.company || ''} 
                          onChange={(e) => handleProjectFieldChange(pIdx, 'company', e.target.value)}
                          className="editor-input"
                          placeholder="e.g. Telecom Client"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Timeline / Period
                        </label>
                        <input 
                          type="text" 
                          value={exp.period || ''} 
                          onChange={(e) => handleProjectFieldChange(pIdx, 'period', e.target.value)}
                          className="editor-input"
                          placeholder="e.g. Nov 2024 – April 2025"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Location / Work Mode
                        </label>
                        <input 
                          type="text" 
                          value={exp.location || ''} 
                          onChange={(e) => handleProjectFieldChange(pIdx, 'location', e.target.value)}
                          className="editor-input"
                          placeholder="e.g. Hyderabad, India / Remote"
                        />
                      </div>
                    </div>

                    {/* Bullets List */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Bullet Points ({exp.bullets?.length || 0})
                        </span>
                        <button
                          type="button"
                          className="chip"
                          onClick={() => handleAddBullet(pIdx)}
                          style={{ fontSize: '0.72rem', cursor: 'pointer' }}
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', paddingTop: '0.4rem' }}>•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleBulletChange(pIdx, bIdx, e.target.value)}
                              className="editor-textarea"
                              placeholder="Action verb + JD skill + Quantifiable metric (% gain, TB processed, throughput)..."
                              style={{ flex: 1, resize: 'vertical' }}
                            />
                            <button
                              type="button"
                              className="btn btn-outline btn-icon"
                              onClick={() => handleRemoveBullet(pIdx, bIdx)}
                              title="Delete bullet"
                              style={{ padding: '0.35rem', marginTop: '0.2rem' }}
                            >
                              <Trash2 size={13} className="text-rose" />
                            </button>
                          </div>
                        ))}
                        {(!exp.bullets || exp.bullets.length === 0) && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No bullet points in this section yet. Click "+ Add Bullet" or "Load PySpark & Databricks Telecom Lakehouse" above.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAddProject}
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} /> Add New Project / Experience Entry
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: TECHNICAL SKILLS                              */}
          {/* ==================================================== */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Organize your skills by domain category. Enter comma-separated skills in each category.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleAddSkillCategory}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
                >
                  <Plus size={14} /> Add Skill Category
                </button>
              </div>

              {Object.entries(formData.skills || {}).map(([catName, skillList], cIdx) => {
                const textVal = Array.isArray(skillList) ? skillList.join(', ') : String(skillList);

                return (
                  <div 
                    key={cIdx}
                    style={{
                      background: 'var(--bg-card-solid)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input 
                        type="text"
                        defaultValue={catName}
                        onBlur={(e) => handleSkillCategoryNameChange(catName, e.target.value)}
                        className="editor-input"
                        style={{ fontWeight: 700, maxWidth: '280px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-icon"
                        onClick={() => handleRemoveSkillCategory(catName)}
                        title="Delete category"
                        style={{ padding: '0.35rem' }}
                      >
                        <Trash2 size={14} className="text-rose" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={textVal}
                      onChange={(e) => handleSkillsListChange(catName, e.target.value)}
                      className="editor-textarea"
                      placeholder="e.g. PySpark, Databricks, BigQuery, Airflow, Python, SQL, Docker, CI/CD..."
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Separate skills with commas. Items are auto-highlighted in the ATS preview.
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: HEADER, SUMMARY & CONTACT                     */}
          {/* ==================================================== */}
          {activeTab === 'header' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Full Candidate Name
                </label>
                <input 
                  type="text" 
                  value={formData.fullName || ''} 
                  onChange={(e) => handleHeaderChange('fullName', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Headline / Target Role
                </label>
                <input 
                  type="text" 
                  value={formData.headline || ''} 
                  onChange={(e) => handleHeaderChange('headline', e.target.value)}
                  className="editor-input"
                  placeholder="Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Professional Summary
                </label>
                <textarea 
                  rows={4}
                  value={formData.summary || ''} 
                  onChange={(e) => handleHeaderChange('summary', e.target.value)}
                  className="editor-textarea"
                  placeholder="2-3 sentence recruiter-grade professional summary emphasizing GCP data engineering and core competencies..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Phone Number
                  </label>
                  <input 
                    type="text" 
                    value={formData.phone || ''} 
                    onChange={(e) => handleHeaderChange('phone', e.target.value)}
                    className="editor-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={formData.email || ''} 
                    onChange={(e) => handleHeaderChange('email', e.target.value)}
                    className="editor-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Location (City, Country)
                  </label>
                  <input 
                    type="text" 
                    value={formData.location || ''} 
                    onChange={(e) => handleHeaderChange('location', e.target.value)}
                    className="editor-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    LinkedIn URL
                  </label>
                  <input 
                    type="text" 
                    value={formData.linkedin || ''} 
                    onChange={(e) => handleHeaderChange('linkedin', e.target.value)}
                    className="editor-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    GitHub URL
                  </label>
                  <input 
                    type="text" 
                    value={formData.github || ''} 
                    onChange={(e) => handleHeaderChange('github', e.target.value)}
                    className="editor-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Portfolio / Website URL (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={formData.portfolio || ''} 
                    onChange={(e) => handleHeaderChange('portfolio', e.target.value)}
                    className="editor-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: CERTIFICATIONS & EDUCATION                    */}
          {/* ==================================================== */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Certifications */}
              <div style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={16} className="text-emerald" />
                    Certifications & Achievements ({formData.certifications?.length || 0})
                  </h4>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleAddCert}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    <Plus size={12} /> Add Certification
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(formData.certifications || []).map((cert, cIdx) => (
                    <div key={cIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertChange(cIdx, e.target.value)}
                        className="editor-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-icon"
                        onClick={() => handleRemoveCert(cIdx)}
                        title="Delete certification"
                        style={{ padding: '0.35rem' }}
                      >
                        <Trash2 size={14} className="text-rose" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GraduationCap size={16} className="text-primary" />
                    Education ({formData.education?.length || 0})
                  </h4>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleAddEdu}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    <Plus size={12} /> Add Education
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(formData.education || []).map((edu, eIdx) => (
                    <div 
                      key={eIdx}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr auto',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}
                    >
                      <input 
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleEduChange(eIdx, 'degree', e.target.value)}
                        className="editor-input"
                        placeholder="Degree name"
                      />
                      <input 
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleEduChange(eIdx, 'institution', e.target.value)}
                        className="editor-input"
                        placeholder="Institution / College"
                      />
                      <input 
                        type="text"
                        value={edu.year || ''}
                        onChange={(e) => handleEduChange(eIdx, 'year', e.target.value)}
                        className="editor-input"
                        placeholder="Year (e.g. 2020 – 2024)"
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-icon"
                        onClick={() => handleRemoveEdu(eIdx)}
                        title="Delete education"
                        style={{ padding: '0.35rem' }}
                      >
                        <Trash2 size={14} className="text-rose" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)'
        }}>
          <button className="btn btn-outline" onClick={onClose} type="button">
            Cancel
          </button>
          <button 
            className="btn btn-emerald" 
            onClick={handleSave} 
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}
          >
            <Check size={16} />
            Save & Update Resume
          </button>
        </div>
      </div>
    </div>
  );
}
