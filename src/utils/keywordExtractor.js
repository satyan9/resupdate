// Keyword & Entity Extractor for Job Descriptions

// Curated dictionary of high-frequency tech & industry keywords for fast NLP extraction
const TECH_DICTIONARY = [
  // Languages & Core
  "TypeScript", "JavaScript", "Python", "Go", "Golang", "Java", "C++", "C#", "Rust", "SQL", "HTML5", "CSS3",
  // Frontend
  "React", "React.js", "Next.js", "Vue.js", "Angular", "Redux", "Tailwind CSS", "GraphQL", "REST APIs", "Webpack", "Vite",
  // Backend & Cloud
  "Node.js", "Express", "NestJS", "FastAPI", "Django", "Spring Boot", "Microservices", "Distributed Systems",
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "EC2", "S3", "Lambda", "ECS", "EKS", "RDS",
  // DevOps & Containers
  "Docker", "Kubernetes", "K8s", "Terraform", "CI/CD", "GitHub Actions", "Jenkins", "Helm", "Infrastructure as Code",
  // Databases & Messaging
  "PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "Kafka", "Apache Kafka", "RabbitMQ", "Elasticsearch",
  // Observability & Testing
  "Prometheus", "Grafana", "OpenTelemetry", "Datadog", "Jest", "Cypress", "PyTest", "TDD", "Test-Driven Development",
  // Architectures & Methods
  "Event-Driven Architecture", "System Design", "Agile", "Scrum", "API Design", "High Availability", "Scalability",
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
  return "Senior Software Engineer";
}

/**
 * Extracts all relevant keywords from Job Description with frequency, weights, and categories
 * @param {string} jdText 
 * @returns {object} { keywords, targetRole, categories }
 */
export function extractJDKeywords(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return { keywords: [], targetRole: "Target Position", categories: {} };
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
    // Regex word boundary matching to avoid substring false positives (e.g. "go" in "good")
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
    
    if (regex.test(jdText)) {
      // Count frequency
      const occurrences = (normalizedJD.match(new RegExp(escaped.toLowerCase(), 'g')) || []).length;
      
      let weight = occurrences >= 2 ? 3 : 2;
      let category = "Must-Have Technical Skills";

      if (/aws|azure|gcp|docker|kubernetes|k8s|terraform|ci\/cd|helm/i.test(term)) {
        category = "Cloud & Infrastructure";
      } else if (/distributed|system design|event-driven|microservices|tdd|agile|scrum/i.test(term)) {
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

  // Sort by weight descending
  extracted.sort((a, b) => b.weight - a.weight || b.frequency - a.frequency);

  return {
    targetRole: extractTargetRole(jdText),
    keywords: extracted,
    categories: categories,
    totalCount: extracted.length
  };
}
