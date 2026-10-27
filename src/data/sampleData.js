// High quality pre-configured sample data for instant 1-click test drives

export const SAMPLE_RESUME = {
  fullName: "Alex Rivera",
  targetRole: "Senior Software Engineer",
  email: "alex.rivera@example.com",
  phone: "(555) 234-5678",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alex-rivera-dev",
  github: "github.com/alexrivera",
  summary: "Results-driven Software Engineer with 6+ years of experience designing and building scalable web applications. Proficient in JavaScript, React, Node.js, and SQL databases. Strong collaborator with a passion for clean code, automated testing, and agile practices.",
  skills: {
    "Programming Languages": ["JavaScript (ES6+)", "TypeScript", "Python", "SQL"],
    "Frontend Frameworks": ["React.js", "Redux", "HTML5", "CSS3/SASS"],
    "Backend & APIs": ["Node.js", "Express", "RESTful APIs", "PostgreSQL"],
    "DevOps & Tools": ["Git", "Docker", "Jest", "Webpack"]
  },
  experience: [
    {
      company: "Apex Cloud Solutions",
      role: "Senior Software Engineer",
      period: "2022 – Present",
      location: "San Francisco, CA",
      bullets: [
        "Architected and deployed high-traffic customer onboarding portal serving 150k+ monthly active users.",
        "Refactored legacy REST endpoints into optimized Node.js microservices, cutting API response times by 35%.",
        "Collaborated with UX designers and product managers to release 12 core product features on schedule.",
        "Mentored 4 junior engineers on unit testing standards, code reviews, and TypeScript design patterns."
      ]
    },
    {
      company: "Vanguard Tech Labs",
      role: "Software Engineer",
      period: "2019 – 2022",
      location: "Austin, TX",
      bullets: [
        "Built responsive client-facing dashboards using React, Redux, and Chart.js for real-time analytics.",
        "Implemented secure JWT authentication and role-based access control across internal management tools.",
        "Automated CI/CD deployment pipelines using GitHub Actions, decreasing release cycle duration by 40%.",
        "Wrote end-to-end integration tests using Cypress and Jest, maintaining 85%+ test coverage."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Texas at Austin",
      year: "2019",
      honors: "Dean's Honor List"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate",
    "Certified Scrum Master (CSM)"
  ]
};

export const SAMPLE_JD = `Role: Staff / Lead Full Stack Cloud Architect & Engineer
Company: CloudScale Enterprise Systems
Location: San Francisco, CA / Remote

About The Role:
We are seeking an exceptional Staff/Lead Engineer to spearhead our next-generation distributed SaaS platform. You will lead cross-functional architecture initiatives, optimize high-throughput microservices, and champion Kubernetes cloud-native infrastructure.

Key Responsibilities:
• Architect, scale, and maintain fault-tolerant distributed systems processing over 50M daily events with 99.99% uptime.
• Lead end-to-end cloud-native microservices development utilizing TypeScript, Node.js, Go/Python, and GraphQL.
• Design and maintain robust CI/CD pipelines with automated security testing using Docker, Kubernetes (K8s), and Terraform on AWS.
• Champion observability and performance optimization using Prometheus, Grafana, and OpenTelemetry.
• Implement scalable event-driven architectures with Apache Kafka, RabbitMQ, and Redis caching layers.
• Drive engineering excellence through System Design reviews, Test-Driven Development (TDD), and Agile/Scrum leadership.
• Collaborate with Executive Product Stakeholders, Security Teams, and mentor senior developers.

Required Technical Skills & Qualifications:
• 5+ years of extensive hands-on experience in Full Stack development with TypeScript, React.js, and Node.js.
• Proven expertise with AWS cloud infrastructure (ECS, Lambda, EKS, S3, RDS PostgreSQL, DynamoDB).
• Deep practical experience with Kubernetes orchestration, Docker containerization, and Infrastructure as Code (Terraform).
• Strong mastery of Distributed Caching (Redis), Message Brokers (Kafka / RabbitMQ), and GraphQL API design.
• Demonstrated track record in Performance Tuning, Load Balancing, and Database Indexing for large-scale relational & NoSQL databases.
• Strong communication, cross-functional stakeholder management, and team mentorship abilities.`;
