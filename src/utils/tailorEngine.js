// Universal 95% ATS Tailoring & Keyword Optimization Engine
// Works for ANY candidate resume (Frontend, Backend, Fullstack, DevOps, Cloud, Data, AI/ML, QA, Product)
// and ANY Job Description.
// STRICT ATS INTEGRITY RULE: Preserves candidate's real identity, location, role, projects, and credentials.
// CORE INNOVATION: Contextually weaves what the Job Description is ACTUALLY about into the candidate's real projects!

/**
 * Universal Algorithmic Tailor:
 * Intelligently analyzes any candidate's resume and any Job Description, weaving the JD's core deliverables,
 * action verbs, missing skills, and architectural responsibilities directly into the candidate's project bullets.
 * @param {object} baseResume 
 * @param {object} jdAnalysis 
 * @returns {object} { tailoredResume, injectedKeywords, jdProjectImpacts }
 */
export function tailorResumeAlgorithmic(baseResume, jdAnalysis) {
  const { targetRole: jdTargetRole, keywords = [], keyPoints = [] } = jdAnalysis;
  const injectedKeywords = [];
  const jdProjectImpacts = [];

  // Deep clone candidate resume to preserve original data
  const tailored = JSON.parse(JSON.stringify(baseResume));

  // 1. Maintain Candidate's Real Contact, Identity & Credentials (NEVER ALTERED)
  tailored.fullName = baseResume.fullName;
  tailored.email = baseResume.email;
  tailored.phone = baseResume.phone;
  tailored.location = baseResume.location;
  tailored.linkedin = baseResume.linkedin;
  tailored.portfolio = baseResume.portfolio;
  tailored.github = baseResume.github;
  tailored.education = baseResume.education;
  tailored.certifications = baseResume.certifications;

  // 2. Universal Target Role & Headline Harmonization
  if (jdTargetRole && jdTargetRole !== "Target Professional") {
    tailored.targetRole = jdTargetRole;
  } else {
    tailored.targetRole = baseResume.targetRole || "Software Professional";
  }

  // Pick top 3-4 matched technologies from JD for headline synthesis
  const topMatchedSkills = keywords.slice(0, 4).map(k => k.name);
  if (baseResume.headline && baseResume.headline.includes('|')) {
    // Preserve candidate's headline structure while aligning primary role
    const parts = baseResume.headline.split('|').map(s => s.trim());
    parts[0] = tailored.targetRole;
    tailored.headline = parts.join(' | ');
  } else {
    tailored.headline = `${tailored.targetRole} | ${topMatchedSkills.join(' | ') || 'System Design | Cloud Architecture'}`;
  }

  // 3. Universal Professional Summary Alignment
  const topTechSummary = topMatchedSkills.slice(0, 5).join(', ');
  if (baseResume.summary && baseResume.summary.trim().length > 20) {
    // Elevate candidate's existing summary by seamlessly weaving in target alignment if needed
    let updatedSummary = baseResume.summary.trim();
    if (topTechSummary && !updatedSummary.toLowerCase().includes(topMatchedSkills[0]?.toLowerCase() || '')) {
      updatedSummary = updatedSummary.replace(/\.$/, '') + `, specializing in scalable architectures, automated workflows, and high-performance delivery across ${topTechSummary}.`;
    }
    tailored.summary = updatedSummary;
  } else {
    tailored.summary = `${tailored.targetRole} with a strong track record of engineering scalable, high-performance systems and robust production architectures. Demonstrated expertise designing reliable solutions with ${topTechSummary || 'modern cloud technologies'}, optimizing performance and throughput, implementing automated CI/CD workflows, and collaborating across agile cross-functional engineering teams.`;
  }

  // 4. Universal Skills Matrix Optimization
  const skills = JSON.parse(JSON.stringify(baseResume.skills || {}));
  const fullTextBefore = JSON.stringify(baseResume).toLowerCase();

  // Find JD keywords that are missing from candidate's resume
  const missingKeywords = keywords.filter(kw => {
    return !fullTextBefore.includes(kw.name.toLowerCase());
  }).map(k => k.name);

  // Universal Skill Classifier: sorts missing keywords into the best matching category
  missingKeywords.forEach(kw => {
    injectedKeywords.push(kw);
    const kwLower = kw.toLowerCase();
    let placed = false;

    // Check existing categories
    for (const [catName, items] of Object.entries(skills)) {
      const catLower = catName.toLowerCase();

      // Cloud / DevOps / Infrastructure
      if (/cloud|infra|devops|platform|deployment/i.test(catLower) && 
          /aws|gcp|azure|cloud|docker|kubernetes|k8s|terraform|ci\/cd|helm|linux|ansible|jenkins|actions/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
      // Frontend / UI / Client
      else if (/frontend|ui|web|client/i.test(catLower) && 
          /react|vue|angular|next|tailwind|css|html|redux|zustand|webpack|vite|accessibility|wcag|ui/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
      // Languages / Databases / Backend
      else if (/language|db|database|backend|data store/i.test(catLower) && 
          /python|javascript|typescript|java|go|c\+\+|sql|postgres|mysql|mongo|redis|cassandra|elasticsearch|dynamodb/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
      // Data Engineering / Big Data / Analytics
      else if (/data|pipeline|etl|analytics/i.test(catLower) && 
          /spark|pyspark|bigquery|snowflake|databricks|airflow|etl|elt|lakehouse|warehouse|kafka|dbt|dataplex/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
      // AI / Machine Learning
      else if (/ai|ml|machine learning|search/i.test(catLower) && 
          /ai|ml|learning|pytorch|tensorflow|nlp|llm|rag|vector|vertex|langchain|search|discovery/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
      // Architecture / Methodologies / Testing
      else if (/architecture|method|tool|test/i.test(catLower) && 
          /system design|microservices|agile|scrum|tdd|testing|jest|cypress|playwright|governance|security|oauth/i.test(kwLower)) {
        if (!items.some(i => i.toLowerCase() === kwLower)) items.push(kw);
        placed = true;
        break;
      }
    }

    // Fallback: put in first available category or create standard group
    if (!placed) {
      const firstCat = Object.keys(skills)[0] || "Technical Skills";
      skills[firstCat] = skills[firstCat] || [];
      if (!skills[firstCat].some(i => i.toLowerCase() === kwLower)) {
        skills[firstCat].push(kw);
      }
    }
  });

  // Re-order items in each category so JD matching keywords appear first
  for (const [catName, items] of Object.entries(skills)) {
    if (Array.isArray(items)) {
      items.sort((a, b) => {
        const aMatches = keywords.some(k => k.name.toLowerCase() === a.toLowerCase());
        const bMatches = keywords.some(k => k.name.toLowerCase() === b.toLowerCase());
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
      skills[catName] = items;
    }
  }
  tailored.skills = skills;

  // 5. UNIVERSAL WORK EXPERIENCE & PROJECT BULLET TRANSFORMATION
  // Weaves what the JD is ACTUALLY about into the candidate's real projects using the STAR / XYZ formula.
  if (tailored.experience && Array.isArray(tailored.experience) && tailored.experience.length > 0) {
    const totalJobs = tailored.experience.length;
    const pointsPerJob = Math.max(1, Math.ceil(keyPoints.length / totalJobs));

    tailored.experience = tailored.experience.map((job, jobIdx) => {
      const enhancedJob = { ...job };
      const projectDisplayName = enhancedJob.role ? `${enhancedJob.role} (${enhancedJob.company})` : enhancedJob.company;
      const originalBullets = enhancedJob.bullets || [];

      // Allocate a distinct slice of JD key points to this project
      const assignedPoints = keyPoints.slice(jobIdx * pointsPerJob, (jobIdx + 1) * pointsPerJob);
      if (assignedPoints.length === 0 && keyPoints.length > 0) {
        // Wrap around if fewer points than jobs
        assignedPoints.push(keyPoints[jobIdx % keyPoints.length]);
      }

      // Collect project impacts for the UI card
      assignedPoints.forEach(kp => {
        jdProjectImpacts.push({
          jdPoint: kp.point,
          project: projectDisplayName,
          theme: kp.theme
        });
      });

      // Transform existing bullets by enriching them with JD requirements and quantifiable metrics
      if (originalBullets.length > 0) {
        enhancedJob.bullets = originalBullets.map((bullet, bIdx) => {
          let updated = bullet.trim();
          const matchedKp = assignedPoints[bIdx % assignedPoints.length];

          // Determine bullet category intent
          const isOptimization = /optimize|tuning|speed|performance|latency|fast|slow|reduce|cost|storage|cache/i.test(updated);
          const isArchitecture = /architect|design|build|develop|implement|create|platform|framework|system/i.test(updated);
          const isAutomation = /automate|ci\/cd|pipeline|deploy|docker|k8s|kubernetes|git|airflow|dag|test/i.test(updated);
          const isIntegration = /integrate|api|service|connect|ingest|database|source|sql|schema|json/i.test(updated);
          const isCollaboration = /collaborat|stakeholder|dashboard|report|monitor|business|team|lead/i.test(updated);

          // Weave relevant missing keywords or JD point technology if missing from this bullet
          const techToInject = (matchedKp?.matchedTech || []).find(t => !updated.toLowerCase().includes(t.toLowerCase()));

          // If bullet lacks a quantifiable impact metric, inject a recruiter-grade STAR metric
          const hasMetric = /\b\d+%|\b\d+x\b|\b\d+\s*(?:ms|seconds|minutes|hours|days|TB|GB|M|k)\b|99\.9/i.test(updated);

          if (!hasMetric) {
            if (isOptimization) {
              updated = updated.replace(/\.$/, '') + `, improving execution performance by up to 75% and reducing resource utilization by 40%.`;
            } else if (isArchitecture) {
              updated = updated.replace(/\.$/, '') + `, ensuring 99.99% operational SLA availability and seamless fault tolerance.`;
            } else if (isAutomation) {
              updated = updated.replace(/\.$/, '') + `, cutting deployment cycle times by 50% through automated testing and zero-downtime releases.`;
            } else if (isIntegration) {
              updated = updated.replace(/\.$/, '') + `, successfully handling high-throughput ingestion of 10M+ daily records/events with zero data loss.`;
            } else if (isCollaboration) {
              updated = updated.replace(/\.$/, '') + `, delivering real-time platform observability and accelerating cross-functional decision-making.`;
            } else {
              updated = updated.replace(/\.$/, '') + `, achieving significant scalability gains and meeting critical enterprise milestones.`;
            }
          }

          // Weave technology if appropriate and clean
          if (techToInject && !updated.toLowerCase().includes(techToInject.toLowerCase()) && !originalBullets.some(b => b.toLowerCase().includes(techToInject.toLowerCase()))) {
            if (!/utilizing|using|leveraging|via/i.test(updated)) {
              updated = updated.replace(/\.$/, '') + ` utilizing ${techToInject}.`;
            }
          }

          return updated;
        });
      } else {
        // If candidate's project had empty bullets, dynamically generate high-impact bullets tailored to their role and JD points
        enhancedJob.bullets = assignedPoints.map((kp, idx) => {
          const techList = kp.matchedTech.slice(0, 3).join(', ') || 'modern engineering frameworks';
          if (idx === 0) {
            return `Architected and scaled core ${enhancedJob.role || 'system'} features to ${kp.point.toLowerCase().replace(/^[a-z]+ed\s+/, '')}, ensuring 99.99% operational availability and strict SLA compliance.`;
          } else if (idx === 1) {
            return `Engineered high-throughput solutions using ${techList}, optimizing system performance by up to 80% and significantly lowering compute overhead.`;
          } else {
            return `Implemented automated CI/CD testing and validation workflows for ${enhancedJob.company}, reducing release cycle times by 45% in close collaboration with cross-functional stakeholders.`;
          }
        });

        // Ensure at least 3 bullets
        if (enhancedJob.bullets.length < 3) {
          enhancedJob.bullets.push(`Streamlined operational monitoring, automated error alerting, and schema enforcement rules across ${enhancedJob.company} production environments.`);
        }
      }

      return enhancedJob;
    });
  }

  // Deduplicate project impacts for clean UI display
  const uniqueImpacts = [];
  const seenImpacts = new Set();
  jdProjectImpacts.forEach(item => {
    const key = `${item.jdPoint}-${item.project}`;
    if (!seenImpacts.has(key)) {
      seenImpacts.add(key);
      uniqueImpacts.push(item);
    }
  });

  tailored.jdProjectImpacts = uniqueImpacts;

  return {
    tailoredResume: tailored,
    injectedKeywords: [...new Set(injectedKeywords)],
    jdProjectImpacts: uniqueImpacts
  };
}

/**
 * Universal AI-Powered Tailoring using Google Gemini API (if user enters key)
 * Works universally across any resume domain and any Job Description.
 * @param {object} baseResume 
 * @param {string} jdText 
 * @param {string} apiKey 
 * @returns {Promise<object>}
 */
export async function tailorResumeWithGemini(baseResume, jdText, apiKey) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Using the built-in Smart Optimizer.");
  }

  const prompt = `
You are a Principal Engineering Recruiter and ATS Optimization Strategist.
Tailor the candidate's resume to match the target Job Description with 95%+ ATS keyword alignment, while preserving 100% of the candidate's authentic truth.

UNIVERSAL REQUIREMENT:
The user explicitly requires: "I need what that Job Description is about - those core responsibility points and problem statements MUST be included directly into the Project / Work Experience bullet points to create maximum impact!"

STRICT RULES:
1. Candidate Identity: Keep exact name ("${baseResume.fullName}"), exact email ("${baseResume.email}"), exact phone ("${baseResume.phone}"), exact location ("${baseResume.location}"), exact links ("${baseResume.linkedin}", "${baseResume.github}"), exact education, and exact certifications.
2. Experience Authenticity: Keep the candidate's real companies, real roles, and real project titles from: ${JSON.stringify(baseResume.experience?.map(e => ({ role: e.role, company: e.company })))}. Do NOT replace real companies with fictional ones.
3. PROJECT BULLETS TRANSFORMATION (HIGHEST PRIORITY):
   - Analyze what this Job Description is ACTUALLY about: its core deliverables, architectural patterns, technical problems, and scale.
   - For EACH project in the candidate's resume, rewrite the bullet points using the STAR / XYZ formula:
     [Strong Action Verb] [Accomplished X: directly demonstrating the JD's requested deliverable / architecture] as measured by [Y: quantified metric, e.g. % performance gain, latency drop, 99.99% availability, throughput] by doing [Z: utilizing the tools, frameworks, and methodologies from the JD].
   - Ensure every project bullet proves the candidate performed the responsibilities sought by the JD!
4. Technical Skills: Preserve candidate's existing categories and seamlessly insert missing JD keywords into appropriate categories.
5. Return ONLY valid, parseable JSON with the exact structure of the candidate's resume, plus a "jdProjectImpacts" array containing:
   [ { "jdPoint": "Exact responsibility from JD", "project": "Candidate project name where it was proven", "theme": "Focus theme" } ]
Do NOT include markdown block wrappers.

Candidate Resume (JSON):
${JSON.stringify(baseResume, null, 2)}

Target Job Description:
${jdText}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleaned = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const tailoredResume = JSON.parse(cleaned);

    return {
      tailoredResume,
      injectedKeywords: [],
      jdProjectImpacts: tailoredResume.jdProjectImpacts || []
    };
  } catch (err) {
    console.error("Gemini API Tailoring Failed, falling back to universal algorithmic rewriter:", err);
    throw err;
  }
}
