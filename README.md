# 🎯 ATS 95% Matcher — AI Resume Tailor & Keyword Optimizer

An ATS (Applicant Tracking System) optimization application that converts PDF resumes to match Job Descriptions with **95%+ keyword compatibility** in a single-column, ATS-verified format.

---

## 🌟 Key Features

- **📄 PDF Ingestion & Parsing**: Extracts clean vector text and section structures from PDF resumes using `pdfjs-dist`.
- **📋 JD Entity & Keyword Extractor**: Scans pasted Job Descriptions for technical skills, methodologies, cloud infrastructure, and leadership qualifications.
- **📊 Real-time ATS Scorer**: Evaluates Exact Keyword Overlap (40%), Experience Alignment (25%), ATS Format Health (15%), and Architecture & Soft Skills (20%).
- **⚡ 95%+ Tailoring Engine**:
  - Automatically aligns target role and rephrases summary to match JD core themes.
  - Groups skills into standardized ATS categories.
  - Rewrites bullet points using the **STAR / XYZ formula** (*Accomplished [X] measured by [Y] by doing [Z]*).
  - Works client-side without an API key, with an optional **Google Gemini AI** toggle for deep custom LLM rewrites.
- **📑 Multi-Format ATS Export**:
  - **ATS PDF**: Single-column, universal typography, zero-parsing-error print stylesheet.
  - **Microsoft Word (.docx)**: Clean single-column `.docx` generated using the `docx` library.
  - **Plaintext Clipboard**: For online application forms that request raw text.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://127.0.0.1:3000/](http://127.0.0.1:3000/)** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App branding, theme toggle, API modal trigger
│   │   ├── Stepper.jsx         # 3-step workflow progress indicator
│   │   ├── ResumeDropzone.jsx  # Drag-and-drop PDF uploader with sample loader
│   │   ├── JDEditor.jsx        # Job description editor with word & entity counter
│   │   ├── ScoreGauge.jsx      # Animated SVG radial ATS score gauge & metric bars
│   │   ├── KeywordDrawer.jsx   # Matched vs missing keyword tags
│   │   ├── ResumeViewer.jsx    # ATS paper preview, keyword diff view, export controls
│   │   └── Modals.jsx          # Gemini API Key configuration and ATS guidance modals
│   ├── utils/
│   │   ├── pdfParser.js        # PDF.js text extractor & section chunker
│   │   ├── keywordExtractor.js # NLP JD keyword & entity extractor
│   │   ├── atsScorer.js        # ATS match percentage & format health calculator
│   │   ├── tailorEngine.js     # 95%+ smart keyword injection & Gemini API integration
│   │   └── docxExporter.js     # ATS single-column Word document (.docx) exporter
│   ├── data/
│   │   └── sampleData.js       # Pre-configured sample resume & senior cloud JD
│   ├── App.jsx                 # Master application controller
│   ├── index.css               # Design system, dark/light theme, and ATS print styles
│   └── main.jsx                # React root entry point
├── package.json
└── vite.config.js
```
