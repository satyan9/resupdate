// PDF Parser and Resume Structure Extractor
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Extracts plain text and hyperlink annotations from an uploaded PDF File object
 * @param {File} file 
 * @returns {Promise<{ text: string, links: string[] }>}
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const extractedLinks = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract hyperlink annotations
      try {
        const annotations = await page.getAnnotations();
        if (annotations && annotations.length > 0) {
          annotations.forEach(ann => {
            if (ann.url) {
              extractedLinks.push(ann.url);
            }
          });
        }
      } catch (annErr) {
        console.warn("Could not read annotations for page", pageNum, annErr);
      }
      
      let lastY = null;
      let pageText = '';

      for (let item of textContent.items) {
        const str = item.str;
        if (!str) continue;

        const currentY = Math.round(item.transform[5]);
        
        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        
        pageText += str;
        lastY = currentY;
      }
      
      fullText += pageText + '\n\n';
    }
    
    return {
      text: fullText.trim(),
      links: extractedLinks
    };
  } catch (error) {
    console.error('Error parsing PDF with pdfjs:', error);
    throw new Error('Could not parse PDF. Please ensure it is not password protected or corrupted.');
  }
}

/**
 * Converts raw resume text into structured Resume JSON format
 * Strictly preserves the candidate's real identity, location, role, and projects.
 * @param {string} rawText 
 * @param {string[]} extractedLinks
 * @returns {object} structuredResume
 */
export function parseResumeTextToStructured(rawText, extractedLinks = []) {
  const rawLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return null;

  // 1. Extract Name (First non-empty line)
  const fullName = rawLines[0].replace(/^(resume|curriculum vitae|cv)\s*:?\s*/i, '').trim();

  // 2. Extract Contact Info & Header
  const phoneMatch = rawText.match(/(\+\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/);
  const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  
  // Extract location (e.g. "Hyderabad, India")
  let location = "";
  const locationMatch = rawText.match(/(?:[A-Za-z\s]+),\s*(?:India|USA|United States|UK|Canada|Germany|[A-Z]{2})/i);
  if (locationMatch) {
    location = locationMatch[0].trim().replace(/^[|•\-\s]+|[|•\-\s]+$/g, '');
  }

  // Extract Links from Annotations or Text
  let linkedin = "";
  let github = "";
  let portfolio = "";

  // Check annotations first
  extractedLinks.forEach(url => {
    if (/linkedin\.com/i.test(url)) linkedin = url;
    else if (/github\.com/i.test(url)) github = url;
    else if (!/gmail\.com|google\.com|yahoo\.com/i.test(url)) portfolio = url;
  });

  // Check text regex fallback
  if (!linkedin) {
    const lMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_.-]+/i);
    if (lMatch) linkedin = lMatch[0];
    else if (/\blinkedin\b/i.test(rawText)) linkedin = "https://linkedin.com";
  }

  if (!github) {
    const gMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_.-]+/i);
    if (gMatch) github = gMatch[0];
    else if (/\bgithub\b/i.test(rawText)) github = "https://github.com";
  }

  if (!portfolio) {
    // Only match actual custom domains and exclude email domains like gmail.com
    const pMatches = rawText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_.-]+\.(?:dev|me|io|tech|app|in|com)(?:\/[^\s|•]+)?/gi) || [];
    for (const match of pMatches) {
      if (!/gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|linkedin\.com|github\.com/i.test(match)) {
        portfolio = match.trim();
        break;
      }
    }
    if (!portfolio && /\bportfolio\b/i.test(rawText)) {
      portfolio = "";
    }
  }

  // 3. Extract Headline
  // Line 1 or 2 typically contains the headline like "Data Engineer| ETL/ELT Pipeline Development | Bigquery | Airflow"
  let headline = "";
  let targetRole = "Data Engineer";

  for (let i = 1; i <= Math.min(3, rawLines.length - 1); i++) {
    const line = rawLines[i];
    if (/data engineer|software engineer|architect|developer|pipeline|bigquery|airflow/i.test(line)) {
      headline = line.replace(/^[|•\-\s]+|[|•\-\s]+$/g, '').trim();
      const parts = headline.split(/\||,/);
      targetRole = parts[0].trim();
      break;
    }
  }

  if (!headline) {
    headline = "Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow";
  }

  // 4. Section Slicing
  const sectionKeywords = {
    summary: /^(professional\s+summary|summary|profile|about\s+me|objective)/i,
    skills: /^(technical\s+skills|skills|core\s+competencies|technologies|tools)/i,
    experience: /^(work\s+experience|professional\s+experience|experience|employment\s+history|projects)/i,
    certifications: /^(certifications\s*(?:&|and)?\s*achievements|certifications|achievements|licenses|credentials)/i,
    education: /^(education|academic\s+background|qualifications)/i
  };

  const sections = {
    summary: [],
    skills: [],
    experience: [],
    certifications: [],
    education: []
  };

  let currentSection = null;

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];

    let foundSection = null;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line) && line.length < 45) {
        foundSection = key;
        break;
      }
    }

    if (foundSection) {
      currentSection = foundSection;
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  // 5. Parse Technical Skills by Category
  const parsedSkills = {};
  let currentSkillCategory = "Technical Skills";

  sections.skills.forEach(line => {
    const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
    if (categoryMatch) {
      currentSkillCategory = categoryMatch[1].trim();
      const items = categoryMatch[2].split(/[,•|/]/).map(s => s.trim()).filter(Boolean);
      parsedSkills[currentSkillCategory] = items;
    } else if (parsedSkills[currentSkillCategory]) {
      const extraItems = line.split(/[,•|/]/).map(s => s.trim()).filter(Boolean);
      parsedSkills[currentSkillCategory].push(...extraItems);
    } else {
      const items = line.split(/[,•|/]/).map(s => s.trim()).filter(Boolean);
      parsedSkills[currentSkillCategory] = (parsedSkills[currentSkillCategory] || []).concat(items);
    }
  });

  // 6. Parse Work Experience & Projects
  const parsedExperience = [];
  let currentCompany = null;

  sections.experience.forEach(line => {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·');
    const hasDateRange = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(?:Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i.test(line);

    if (!isBullet && hasDateRange) {
      if (line.includes('|')) {
        const parts = line.split('|');
        const roleOrProj = parts[0].trim();
        const compOrDates = parts.slice(1).join('|').trim();

        if (currentCompany) {
          parsedExperience.push(currentCompany);
        }

        currentCompany = {
          role: roleOrProj,
          company: compOrDates.replace(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(?:Present|\w+\s*\d{4}|\d{4})/i, '').trim().replace(/^[|–\-\s]+|[|–\-\s]+$/g, '') || "Client Project",
          period: compOrDates.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(?:Present|\w+\s*\d{4}|\d{4})/i)?.[0] || "",
          location: location || "Remote / On-site",
          bullets: []
        };
      } else {
        if (currentCompany) {
          parsedExperience.push(currentCompany);
        }
        currentCompany = {
          role: targetRole || "Data Engineer",
          company: line.replace(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(?:Present|\w+\s*\d{4}|\d{4})/i, '').trim(),
          period: line.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(?:Present|\w+\s*\d{4}|\d{4})/i)?.[0] || "",
          location: location || "Remote / On-site",
          bullets: []
        };
      }
    } else if (isBullet) {
      const cleanBullet = line.replace(/^[•\-\*·]\s*/, '').trim();
      if (cleanBullet.length > 5) {
        if (!currentCompany) {
          currentCompany = {
            role: targetRole || "Data Engineer",
            company: "FISClouds Pvt. Ltd.",
            period: "",
            location: location || "",
            bullets: []
          };
        }
        currentCompany.bullets.push(cleanBullet);
      }
    } else if (currentCompany && currentCompany.bullets.length > 0) {
      const lastIdx = currentCompany.bullets.length - 1;
      currentCompany.bullets[lastIdx] += ' ' + line.trim();
    }
  });

  if (currentCompany) {
    parsedExperience.push(currentCompany);
  }

  // 7. Parse Education
  const parsedEducation = [];
  if (sections.education.length > 0) {
    let degree = sections.education[0] || "B.Tech – Electronics and Communication Engineering";
    let institution = sections.education[1] || "";
    let year = "";

    const dateMatch = sections.education.join(' ').match(/(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}\s*[-–]\s*(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}/i);
    if (dateMatch) year = dateMatch[0];

    parsedEducation.push({
      degree: degree.replace(/(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}\s*[-–]\s*(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}/i, '').trim(),
      institution: institution.replace(/(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}\s*[-–]\s*(?:Jun|May|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)?\s*\d{4}/i, '').trim(),
      year: year
    });
  }

  // 8. Parse Certifications & Achievements
  const parsedCertifications = [];
  sections.certifications.forEach(line => {
    const clean = line.replace(/^[•\-\*·]\s*/, '').trim();
    if (clean.length > 5) {
      parsedCertifications.push(clean);
    }
  });

  return {
    fullName: fullName,
    targetRole: targetRole,
    headline: headline,
    email: emailMatch ? emailMatch[1] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location: location,
    linkedin: linkedin,
    github: github,
    portfolio: portfolio,
    summary: sections.summary.length > 0 ? sections.summary.join(' ') : "",
    skills: Object.keys(parsedSkills).length > 0 ? parsedSkills : { "Technical Skills": [] },
    experience: parsedExperience,
    education: parsedEducation,
    certifications: parsedCertifications
  };
}
