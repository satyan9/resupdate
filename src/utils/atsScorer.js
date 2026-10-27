// ATS Scoring & Keyword Diagnostic Engine

/**
 * Evaluates an ATS compatibility and keyword match score between a resume object and extracted JD keywords
 * @param {object} resume 
 * @param {Array<object>} jdKeywords 
 * @returns {object} scoreResult
 */
export function calculateATSScore(resume, jdKeywords = []) {
  if (!resume || jdKeywords.length === 0) {
    return {
      overallScore: 0,
      breakdown: {
        keywordMatch: 0,
        experienceAlignment: 0,
        formatHealth: 100,
        methodologies: 0
      },
      matchedKeywords: [],
      missingKeywords: [],
      grade: 'F'
    };
  }

  // Concatenate all resume text for global keyword search
  const resumeTextParts = [
    resume.summary || '',
    resume.targetRole || '',
    JSON.stringify(resume.skills || {}),
    ...(resume.experience || []).flatMap(e => [e.company, e.role, ...(e.bullets || [])]),
    ...(resume.education || []).map(ed => `${ed.degree} ${ed.institution}`),
    ...(resume.certifications || [])
  ];
  const fullResumeText = resumeTextParts.join(' ').toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];

  let earnedKeywordWeight = 0;
  let totalKeywordWeight = 0;

  jdKeywords.forEach(kw => {
    const term = kw.name.toLowerCase();
    // Word boundary or flexible match for acronyms
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9_]|$)`, 'i');
    
    totalKeywordWeight += kw.weight;

    if (regex.test(fullResumeText)) {
      matchedKeywords.push(kw.name);
      earnedKeywordWeight += kw.weight;
    } else {
      missingKeywords.push(kw.name);
    }
  });

  // 1. Keyword Overlap Score (0 - 100)
  const keywordMatchScore = totalKeywordWeight > 0 
    ? Math.round((earnedKeywordWeight / totalKeywordWeight) * 100) 
    : 0;

  // 2. Experience Alignment (Check if target role or keywords appear inside bullet points)
  let bulletKeywordHits = 0;
  const allBullets = (resume.experience || []).flatMap(e => e.bullets || []).join(' ').toLowerCase();
  jdKeywords.forEach(kw => {
    if (allBullets.includes(kw.name.toLowerCase())) {
      bulletKeywordHits++;
    }
  });
  const experienceAlignment = Math.min(100, Math.round((bulletKeywordHits / Math.max(1, jdKeywords.length * 0.42)) * 100));

  // 3. Format Health (ATS Compliance Rules)
  let formatScore = 100;
  if (!resume.email || !resume.phone) formatScore -= 10;
  if (!resume.summary || resume.summary.length < 50) formatScore -= 10;
  if (!resume.skills || Object.keys(resume.skills).length === 0) formatScore -= 15;
  if (!resume.experience || resume.experience.length === 0) formatScore -= 20;

  // 4. Methodologies & Soft Skills Score
  const softKeywords = jdKeywords.filter(k => k.category === "Architecture & Methodologies" || k.category === "Leadership & Collaboration");
  let softHits = 0;
  softKeywords.forEach(kw => {
    if (fullResumeText.includes(kw.name.toLowerCase())) softHits++;
  });
  const methodologiesScore = softKeywords.length > 0 
    ? Math.round((softHits / softKeywords.length) * 100) 
    : 95;

  // Weighted Composite Overall Score
  // 50% Exact Keyword Match + 25% Experience Bullets + 15% Format Compliance + 10% Methodologies
  const rawOverall = (keywordMatchScore * 0.50) + (experienceAlignment * 0.25) + (formatScore * 0.15) + (methodologiesScore * 0.10);
  const overallScore = Math.min(100, Math.max(10, Math.round(rawOverall)));

  let grade = 'C';
  if (overallScore >= 95) grade = 'A+ (Optimal 95%+ ATS Match)';
  else if (overallScore >= 85) grade = 'A (Strong Match)';
  else if (overallScore >= 70) grade = 'B (Average Match)';
  else if (overallScore >= 50) grade = 'C (Needs Tailoring)';
  else grade = 'D (High Rejection Risk)';

  return {
    overallScore,
    grade,
    breakdown: {
      keywordMatch: keywordMatchScore,
      experienceAlignment,
      formatHealth: formatScore,
      methodologies: methodologiesScore
    },
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    totalKeywords: jdKeywords.length,
    matchedKeywords,
    missingKeywords
  };
}
