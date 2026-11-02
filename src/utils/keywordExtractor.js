// Universal Keyword & Entity Extractor for Any Domain and Job Description

// Comprehensive multi-domain technical dictionary spanning Frontend, Backend, Fullstack, DevOps, Cloud, Data, AI/ML, QA, Security & Agile
export const TECH_DICTIONARY = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Go", "Golang", "Java", "C++", "C#", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "SQL", "Bash", "Shell", "HTML5", "CSS3",
  
  // Frontend & UI Engineering
  "React", "React.js", "Next.js", "Vue", "Vue.js", "Nuxt", "Angular", "Svelte", "Redux", "Zustand", "MobX", "Tailwind CSS", "Tailwind", "Sass", "SCSS", 
  "Webpack", "Vite", "Babel", "GraphQL", "REST APIs", "Web Performance", "Core Web Vitals", "Accessibility", "WCAG", "Micro-frontends", "Responsive Design", "SSR", "CSR", "Storybook",

  // Backend & Distributed Systems
  "Node.js", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "ASP.NET", ".NET Core", "Ruby on Rails", 
  "Microservices", "Distributed Systems", "RESTful APIs", "gRPC", "WebSockets", "Event-Driven Architecture", "Message Queues", "Kafka", "Apache Kafka", "RabbitMQ", "Celery", 
  "Redis", "High Availability", "Fault Tolerance", "Load Balancing", "Multithreading", "Concurrency", "CQRS", "API Gateway",

  // Cloud & Platforms
  "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Azure", "Microsoft Azure", "EC2", "S3", "AWS Lambda", "ECS", "EKS", "GKE", "Cloud Run", "Cloud Storage", "Cloudflare",
  "Serverless", "CloudFormation", "Terraform", "Infrastructure as Code", "IaC", "Ansible", "Helm",

  // DevOps, Containers & Observability
  "Docker", "Kubernetes", "K8s", "CI/CD", "Continuous Integration", "Continuous Deployment", "GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD", "CircleCI",
  "Linux", "Nginx", "Prometheus", "Grafana", "Datadog", "OpenTelemetry", "CloudWatch", "ELK Stack", "SRE", "DevOps",

  // Databases & Storage
  "PostgreSQL", "Postgres", "MySQL", "MongoDB", "DynamoDB", "Redis Caching", "Cassandra", "Elasticsearch", "OpenSearch", "SQL Server", "Oracle", "SQLite", "Firebase", "Supabase",

  // Data Engineering & Big Data
  "BigQuery", "Snowflake", "Databricks", "Apache Spark", "PySpark", "Apache Airflow", "Airflow", "Cloud Composer", "Data Fusion", "dbt", "Apache Flink", 
  "ETL", "ELT", "Data Pipelines", "Data Modeling", "Data Warehousing", "Data Lakehouse", "Data Governance", "Dataplex", "Data Transformation", "Data Quality", "Partitioning", "Clustering",

  // AI, Machine Learning & Search
  "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-learn", "NLP", "Natural Language Processing", "Computer Vision", 
  "Large Language Models", "LLMs", "Generative AI", "LangChain", "LlamaIndex", "RAG", "Vector Databases", "Pinecone", "Milvus", "ChromaDB", "Vertex AI", "Hugging Face", "MLflow", "Discovery Engine", "Enterprise Search", "Catalog Indexing",

  // Testing & Quality Assurance
  "Jest", "Cypress", "Playwright", "Selenium", "PyTest", "JUnit", "TDD", "BDD", "Unit Testing", "Integration Testing", "E2E Testing", "Automated Testing", "Postman",

  // Security & Identity
  "OAuth2", "JWT", "SSO", "IAM", "RBAC", "OWASP", "Cloud KMS", "Secret Management", "Encryption", "Cybersecurity",

  // Architecture, Agile & Leadership
  "System Design", "Agile", "Scrum", "Kanban", "Jira", "Code Reviews", "Technical Leadership", "Mentorship", "Cross-Functional Collaboration", "Stakeholder Management", "Problem Solving", "Root Cause Analysis", "SLA", "SLO"
];

/**
 * Universal Target Role Extractor: scans lines for explicit titles or engineering designations across any domain.
 * @param {string} jdText 
 * @returns {string}
 */
export function extractTargetRole(jdText) {
  if (!jdText) return "Target Professional";
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);

  const explicitMatchRegex = /(?:Role|Title|Position|Job Title|Looking For):\s*(.+)/i;
  for (let line of lines.slice(0, 8)) {
    const roleMatch = line.match(explicitMatchRegex);
    if (roleMatch && roleMatch[1].trim().length < 80) {
      return roleMatch[1].replace(/^[#*•\-\s]+|[#*•\-\s]+$/g, '').trim();
    }
  }

  const roleTitlePattern = /\b(?:Senior|Lead|Staff|Principal|Junior|Associate|Executive)?\s*(?:[A-Za-z/]+\s*){1,4}(?:Engineer|Developer|Architect|Lead|Manager|Specialist|Analyst|Scientist|Consultant|Administrator|Designer|SDE|DevOps|SRE|Programmer|Tester|QA)\b/i;
  for (let line of lines.slice(0, 10)) {
    if (roleTitlePattern.test(line) && line.length < 80) {
      const match = line.match(roleTitlePattern);
      if (match) return match[0].trim();
      return line.replace(/^#+\s*/, '').replace(/^[•*-\s]+/, '').trim();
    }
  }

  return "Target Professional";
}

/**
 * Universal JD Deliverable & Key Points Extractor:
 * Extracts action statements, deliverables, and architecture requirements across any technology field.
 * @param {string} jdText 
 * @returns {Array<object>} keyPoints
 */
export function extractJDKeyPoints(jdText) {
  if (!jdText || jdText.trim().length === 0) return [];

  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  const keyPoints = [];
  let inResponsibilitiesSection = false;

  const actionVerbRegex = /^(?:architect|design|build|develop|implement|optimize|scale|automate|establish|integrate|lead|create|maintain|spearhead|champion|drive|engineer|migrate|refactor|deploy|monitor|manage|collaborate|partner|ensure|author|deliver|orchestrate|tune|configure)/i;

  const sectionHeaderRegex = /^(?:key\s+responsibilities|responsibilities|what\s+you(?:'ll|\s+will)\s+do|duties|core\s+deliverables|role\s+overview|job\s+summary|qualifications|requirements|about\s+the\s+role|what\s+you\s+bring):?/i;
  const ignoreHeaderRegex = /^(?:about\s+the\s+company|who\s+we\s+are|equal\s+opportunity|benefits|salary|compensation|location|about\s+us|perks):/i;

  for (let line of lines) {
    if (sectionHeaderRegex.test(line)) {
      inResponsibilitiesSection = true;
      continue;
    }
    if (ignoreHeaderRegex.test(line)) {
      inResponsibilitiesSection = false;
      continue;
    }

    const isBullet = /^[•\-\*·\d+\.]\s*/.test(line);
    const cleanLine = line.replace(/^[•\-\*·\d+\.]\s*/, '').trim();
    const startsWithVerb = actionVerbRegex.test(cleanLine);

    if (cleanLine.length > 25 && cleanLine.length < 320 && (isBullet || startsWithVerb || inResponsibilitiesSection)) {
      if (!ignoreHeaderRegex.test(cleanLine)) {
        // Extract matched tech terms in this point
        const matchedTech = TECH_DICTIONARY.filter(t => {
          const reg = new RegExp(`(^|[^a-zA-Z0-9_])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9_]|$)`, 'i');
          return reg.test(cleanLine);
        });

        // Determine universal theme
        let theme = "System Architecture & Engineering";
        if (/ui|frontend|react|vue|angular|web|client|css|component|accessibility/i.test(cleanLine)) {
          theme = "Frontend & User Experience";
        } else if (/api|microservices|backend|server|endpoint|distributed|database|sql|nosql/i.test(cleanLine)) {
          theme = "Backend & API Architecture";
        } else if (/etl|elt|pipeline|lakehouse|warehouse|dataplex|ingest|spark|bigquery|kafka/i.test(cleanLine)) {
          theme = "Data Pipelines & Lakehouse Architecture";
        } else if (/optimize|performance|query|storage|tuning|latency|cost|throughput|scalability/i.test(cleanLine)) {
          theme = "Performance & Storage Optimization";
        } else if (/ci\/cd|docker|kubernetes|k8s|devops|automation|linux|git|deploy|terraform|cloud/i.test(cleanLine)) {
          theme = "Automated CI/CD & Cloud Infrastructure";
        } else if (/ai|ml|search|discovery|catalog|nlp|llm|rag|vector|analytics/i.test(cleanLine)) {
          theme = "AI, Search & Enterprise Intelligence";
        } else if (/governance|quality|security|iam|compliance|validation|test|testing|tdd/i.test(cleanLine)) {
          theme = "Quality Assurance, Security & Governance";
        } else if (/collaborat|stakeholder|mentor|lead|team|agile|scrum|cross-functional/i.test(cleanLine)) {
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

  // Fallback: sentence splitting if no clean bullets found
  if (keyPoints.length === 0) {
    const sentences = jdText.split(/[.!?]\s+/).map(s => s.trim()).filter(s => s.length > 30 && s.length < 280);
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

  return keyPoints.slice(0, 10);
}

/**
 * Universal Entity & Keyword Extractor:
 * Combines dictionary matching with dynamic regex extraction for capitalized frameworks and acronyms.
 * @param {string} jdText 
 * @returns {object} { keywords, targetRole, categories, keyPoints, totalCount }
 */
export function extractJDKeywords(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return { keywords: [], targetRole: "Target Professional", categories: {}, keyPoints: [], totalCount: 0 };
  }

  const normalizedJD = jdText.toLowerCase();
  const extractedMap = new Map();

  const categories = {
    "Must-Have Technical Skills": [],
    "Cloud & Infrastructure": [],
    "Architecture & Methodologies": [],
    "Leadership & Collaboration": []
  };

  // 1. Match from Curated Multi-Domain Dictionary
  TECH_DICTIONARY.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
    
    if (regex.test(jdText)) {
      const occurrences = (normalizedJD.match(new RegExp(escaped.toLowerCase(), 'g')) || []).length;
      let weight = occurrences >= 2 ? 3 : 2;
      let category = "Must-Have Technical Skills";

      if (/aws|azure|gcp|google cloud|docker|kubernetes|k8s|terraform|ci\/cd|helm|linux|ansible|devops|sre/i.test(term)) {
        category = "Cloud & Infrastructure";
      } else if (/architecture|microservices|distributed|system design|event-driven|tdd|agile|scrum|governance|performance|scalability|rest/i.test(term)) {
        category = "Architecture & Methodologies";
      } else if (/collaboration|mentorship|stakeholder|leadership|communication/i.test(term)) {
        category = "Leadership & Collaboration";
      }

      extractedMap.set(term.toLowerCase(), {
        name: term,
        frequency: occurrences,
        weight: weight,
        category: category
      });
    }
  });

  // 2. Dynamic Technology Extractor (Finds any capitalized technologies, acronyms, or tools not in dictionary)
  const dynamicTechMatches = jdText.match(/\b([A-Z][a-zA-Z0-9_+#.-]{1,24})\b/g) || [];
  const commonWords = new Set([
    "The", "We", "You", "Our", "This", "That", "With", "For", "And", "Are", "Will", "Role", "Team", "Job", "Work", 
    "High", "Best", "Have", "Key", "Must", "Good", "Strong", "Years", "Able", "Help", "Lead", "Join", "Build", 
    "Apply", "About", "Equal", "Opportunity", "Location", "Remote", "Hybrid", "Full", "Time", "Daily", "Life"
  ]);

  dynamicTechMatches.forEach(token => {
    const cleanToken = token.trim();
    if (cleanToken.length >= 3 && !commonWords.has(cleanToken) && !extractedMap.has(cleanToken.toLowerCase())) {
      // Check if it appears multiple times or is an acronym / capitalized tech
      const termRegex = new RegExp(`(^|[^a-zA-Z0-9_])${cleanToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9_]|$)`, 'g');
      const count = (jdText.match(termRegex) || []).length;
      if (count >= 2 || /^[A-Z0-9]{2,6}$/.test(cleanToken)) {
        extractedMap.set(cleanToken.toLowerCase(), {
          name: cleanToken,
          frequency: count,
          weight: 2,
          category: "Must-Have Technical Skills"
        });
      }
    }
  });

  // Convert map to array and assign to categories
  const extracted = Array.from(extractedMap.values());
  extracted.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item.name);
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
