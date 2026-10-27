import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { extractTextFromPDF, parseResumeTextToStructured } from '../utils/pdfParser';
import { SAMPLE_RESUME } from '../data/sampleData';

export default function ResumeDropzone({ resume, setResume, setRawResumeText }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg("Please upload a PDF file (.pdf)");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    try {
      const extractedText = await extractTextFromPDF(file);
      setRawResumeText(extractedText);
      const structured = parseResumeTextToStructured(extractedText);
      setResume(structured);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to parse PDF text. Using standard parser fallback.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const loadSample = () => {
    setFileName("alex_rivera_resume.pdf");
    setFileSize("142 KB (Preloaded)");
    setResume(SAMPLE_RESUME);
    setRawResumeText(JSON.stringify(SAMPLE_RESUME));
    setErrorMsg(null);
  };

  return (
    <div className="glass-card">
      <div className="card-header-row">
        <h2 className="card-title">
          <FileText size={20} className="text-primary" />
          1. Upload PDF Resume
        </h2>
        <button 
          className="btn btn-outline" 
          onClick={loadSample}
          type="button"
        >
          <Sparkles size={15} />
          Load Sample Resume
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileProcess(e.target.files[0])} 
        accept=".pdf" 
        style={{ display: 'none' }} 
      />

      <div 
        className={`dropzone ${isDragging ? 'drag-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <RefreshCw size={36} className="animate-spin text-primary" />
            <p className="dropzone-title">Extracting PDF Sections & Vector Text...</p>
          </div>
        ) : resume ? (
          <div className="file-loaded-badge">
            <CheckCircle2 size={28} className="text-emerald" />
            <div className="file-info">
              <div className="file-name">{fileName || `${resume.fullName || 'Candidate'}_Resume.pdf`}</div>
              <div className="file-meta">
                ✓ Ready • {resume.experience?.length || 0} Jobs • {Object.keys(resume.skills || {}).length} Skill Categories
              </div>
            </div>
            <button 
              className="btn btn-secondary btn-icon"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              title="Replace file"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="dropzone-icon">
              <UploadCloud size={30} />
            </div>
            <div className="dropzone-title">Click to upload or drag & drop PDF</div>
            <div className="dropzone-subtitle">Standard single or multi-page resumes (max 10MB)</div>
          </>
        )}
      </div>

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
