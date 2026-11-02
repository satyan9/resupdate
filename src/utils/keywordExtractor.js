// Keyword & Entity Extractor for Job Descriptions

// Curated dictionary of high-frequency tech & industry keywords for fast NLP extraction
export const TECH_DICTIONARY = [
  // Languages & Core
  "TypeScript", "JavaScript", "Python", "Go", "Golang", "Java", "C++", "C#", "Rust", "SQL", "HTML5", "CSS3",
  // Frontend
  "React", "React.js", "Next.js", "Vue.js", "Angular", "Redux", "Tailwind CSS", "GraphQL", "REST APIs", "Webpack", "Vite",
  // Backend & Cloud
  "Node.js", "Express", "NestJS", "FastAPI", "Django", "Spring Boot", "Microservices", "Distributed Systems",
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "EC2", "S3", "Lambda", "ECS", "EKS", "RDS",
  // DevOps & Containers
  "Docker", "Kubernetes", "K8s", "Terraform", "CI/CD", "GitHub Actions", "Jenkins", "Helm", "Infrastructure as Code",
  // Databases, Lakehouse & Messaging
  "BigQuery", "Databricks", "Cloud Storage", "Cloud Composer", "Airflow", "Data Fusion", "Dataplex", "Data Lakehouse",
  "PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "Kafka", "Apache Kafka", "RabbitMQ", "Elasticsearch", "PySpark", "Apache Spark",
  // Observability & Testing
  "Prometheus", "Grafana", "OpenTelemetry", "Datadog", "Jest", "Cypress", "PyTest", "TDD", "Test-Driven Development",
  // Architectures, Data Governance & Methods
  "ETL", "ELT", "Data Pipelines", "Data Modeling", "Data Governance", "Data Transformation", "Data Quality",
  "Event-Driven Architecture", "System Design", "Agile", "Scrum", "API Design", "High Availability", "Scalability", "Partitioning", "Clustering",
  // AI & Search
  "Vertex AI", "Discovery Engine", "Enterprise Search", "Catalog Indexing", "Vector Databases",
  // Leadership & Soft Skills
  "Cross-functional Collaboration", "Mentorship", "Stakeholder Management", "Code Reviews", "Technical Leadership", "Problem Solving"
];

/**
 * Extracts target role title from the first few lines of the JD
 * @param {string} jdText 
 * @returns {string}
 */
export function extractTargetRole(jdText) {
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  for (let line of lines.slice(0, 5)) {
    const roleMatch = line.match(/(?:Role|Title|Position|Job Title):\s*(.+)/i);
    if (roleMatch) return roleMatch[1].trim();
    if (/engineer|architect|developer|lead|manager|specialist|analyst/i.test(line) && line.length < 60) {
      return line.replace(/^#+\s*/, '').trim();
    }
  }
  return "Data Engineer";
}

/**
 * Extracts key responsibilities and core project requirements from the JD
 * Tells us what the Job Description is ACTUALLY about so we can weave those exact points into projects!
 * @param {string} jdText 
 * @returns {Array<object>} keyPoints
 */
export function extractJDKeyPoints(jdText) {
  if (!jdText || jdText.trim().length === 0) return [];

  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  const keyPoints = [];
  let inResponsibilitiesSection = false;

  const actionVerbRegex = /^(architect|design|build|develop|implement|optimize|scale|automate|establish|integrate|lead|create|maintain|spearhead|champion|drive|engineer|migrate|refactor|deploy|monitor|manage|collaborate|partner)/i;

  const sectionHeaderRegex = /^(key\s+responsibilities|responsibilities|what\s+you(?:'ll|\s+will)\s+do|duties|core\s+deliverables|role\s+overview|job\s+summary|qualifications|requirements|about\s+the\s+role):?/i;

  for (let line of lines) {
    if (sectionHeaderRegex.test(line)) {
      inResponsibilitiesSection = true;
      continue;
    }

    const isBullet = /^[•\-\*·\d+\.]\s*/.test(line);
    const cleanLine = line.replace(/^[•\-\*·\d+\.]\s*/, '').trim();

    const startsWithVerb = actionVerbRegex.test(cleanLine);

    if (cleanLine.length > 25 && (isBullet || startsWithVerb || inResponsibilitiesSection)) {
      if (!/^(about\s+the\s+company|who\s+we\s+are|equal\s+opportunity|benefits|salary|location|about\s+us):/i.test(cleanLine)) {
        // Extract matched tech terms in this point
        const matchedTech = TECH_DICTIONARY.filter(t => {
          const reg = new RegExp(`(^|[^a-zA-Z0-9_])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9_]|$)`, 'i');
          return reg.test(cleanLine);
        });

        // Determine theme
        let theme = "System Architecture & Engineering";
        if (/etl|elt|pipeline|lakehouse|warehouse|dataplex|ingest/i.test(cleanLine)) {
          theme = "Data Pipelines & ETL Architecture";
        } else if (/optimize|performance|query|storage|tuning|latency|cost/i.test(cleanLine)) {
          theme = "Performance & Storage Optimization";
        } else if (/ci\/cd|docker|kubernetes|k8s|devops|automation|linux|git|deploy/i.test(cleanLine)) {
          theme = "Automated CI/CD & Cloud Infrastructure";
        } else if (/search|discovery|ai|catalog|analytics|nlp|ml/i.test(cleanLine)) {
          theme = "AI Search & Enterprise Intelligence";
        } else if (/governance|quality|security|iam|compliance|validation/i.test(cleanLine)) {
          theme = "Data Governance & Quality Assurance";
        } else if (/collaborat|stakeholder|mentor|lead|team|agile|scrum/i.test(cleanLine)) {
          theme = "Stakeholder Collaboration & Agile Leadership";
        }

        keyPoints.push({
          id: `jd-point-${keyPoints.length + 1}`,
          point: cleanLine,
          theme: theme,
          matchedTech: matchedTech
        });
      }
    }
  }

  // Fallback: sentence splitting if no bullets found
  if (keyPoints.length === 0) {
    const sentences = jdText.split(/[.!?]\s+/).map(s => s.trim()).filter(s => s.length > 30);
    sentences.forEach((sentence, idx) => {
      if (actionVerbRegex.test(sentence) || TECH_DICTIONARY.some(t => sentence.includes(t))) {
        keyPoints.push({
          id: `jd-point-${idx + 1}`,
          point: sentence,
          theme: "Core Deliverable & Requirement",
          matchedTech: TECH_DICTIONARY.filter(t => sentence.includes(t))
        });
      }
    });
  }

  return keyPoints.slice(0, 8);
}

/**
 * Extracts all relevant keywords from Job Description with frequency, weights, categories, and key points
 * @param {string} jdText 
 * @returns {object} { keywords, targetRole, categories, keyPoints }
 */
export function extractJDKeywords(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return { keywords: [], targetRole: "Target Position", categories: {}, keyPoints: [] };
  }

  const normalizedJD = jdText.toLowerCase();
  const extracted = [];
  const categories = {
    "Must-Have Technical Skills": [],
    "Cloud & Infrastructure": [],
    "Architecture & Methodologies": [],
    "Leadership & Collaboration": []
  };

  TECH_DICTIONARY.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
    
    if (regex.test(jdText)) {
      const occurrences = (normalizedJD.match(new RegExp(escaped.toLowerCase(), 'g')) || []).length;
      
      let weight = occurrences >= 2 ? 3 : 2;
      let category = "Must-Have Technical Skills";

      if (/aws|azure|gcp|google cloud|docker|kubernetes|k8s|terraform|ci\/cd|helm|linux/i.test(term)) {
        category = "Cloud & Infrastructure";
      } else if (/bigquery|etl|elt|pipeline|lakehouse|distributed|system design|event-driven|microservices|tdd|agile|scrum|governance/i.test(term)) {
        category = "Architecture & Methodologies";
      } else if (/collaboration|mentorship|stakeholder|leadership/i.test(term)) {
        category = "Leadership & Collaboration";
      }

      const item = {
        name: term,
        frequency: occurrences,
        weight: weight,
        category: category
      };

      extracted.push(item);
      categories[category].push(term);
    }
  });

  extracted.sort((a, b) => b.weight - a.weight || b.frequency - a.frequency);
  const keyPoints = extractJDKeyPoints(jdText);

  return {
    targetRole: extractTargetRole(jdText),
    keywords: extracted,
    keyPoints: keyPoints,
    categories: categories,
    totalCount: extracted.length
  };
}
