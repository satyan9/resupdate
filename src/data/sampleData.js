// High quality pre-configured sample data strictly matching Satyanarayana's real resume structure

export const SAMPLE_RESUME = {
  fullName: "SATYANARAYANA REDDY KOLAGATLA",
  headline: "Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow",
  targetRole: "Data Engineer",
  email: "satyanarayanareddykolagatla@gmail.com",
  phone: "+91 8639822170",
  location: "Hyderabad, India",
  linkedin: "https://www.linkedin.com/in/satyanarayana-reddy-kolagatla",
  github: "https://github.com/satyanarayanareddy",
  portfolio: "",
  summary: "Google Cloud Certified Data Engineer with 2+ years of experience designing cloud-native ETL/ELT pipelines on GCP using BigQuery, Cloud Composer, Cloud Data Fusion, Python, PySpark, and SQL. Experienced in managing 600+ daily ETL pipelines, optimizing BigQuery performance, implementing CI/CD automation, and delivering reliable enterprise data solutions.",
  skills: {
    "Cloud (GCP)": ["BigQuery", "Cloud Storage", "Cloud Composer (Airflow)", "Data Fusion (ETL)", "Cloud KMS (Secret Management)", "Dataproc", "Dataflow", "Pub/Sub", "Apache Beam", "Dataplex", "Cloud Build", "Cloud Run", "Cloud Scheduler", "Cloud Monitoring", "Cloud Logging", "Artifact Registry", "Cloud IAM", "Discovery Engine (Vertex AI Search)"],
    "Languages / DBs": ["Python", "PySpark", "SQL", "Apache Spark"],
    "AI Search & Analytics": ["Google Cloud Discovery Engine", "Enterprise Search", "Search Analytics", "Catalog Indexing", "BigQuery Audit Logs"],
    "Infrastructure": ["Bitbucket", "Version Control", "Git", "Docker", "CI/CD", "Linux"],
    "Data Engineering": ["Databricks", "ETL/ELT Pipelines", "Data Modeling", "Data Validation", "Data Transformation", "Incremental Loading", "Metadata-Driven Pipelines", "Configuration-Driven ETL", "Partitioning", "Clustering", "Data Governance"],
    "BI & Analytics": ["Looker Studio", "Tableau", "Power BI"]
  },
  experience: [
    {
      company: "FISClouds Pvt. Ltd.",
      role: "Data Engineer",
      period: "Nov 2024 – July 2026",
      location: "Hyderabad, India",
      bullets: []
    },
    {
      company: "Banking Client – Financial Sector",
      role: "Enterprise ODS & Secure ETL Optimization",
      period: "May 2025 – July 2026",
      location: "Remote / Hybrid",
      bullets: [
        "Designed and implemented enterprise ODS ETL/ELT pipelines to integrate banking data into BigQuery using Cloud Data Fusion and Cloud Composer.",
        "Built Landing, Raw, Staging, and Curated data layers with Dataplex-based governance and automated data quality validation.",
        "Optimized BigQuery storage and query performance using partitioning, clustering, and SQL tuning, improving query execution by 85% and reducing bytes processed by up to 99.9%.",
        "Developed Tableau dashboards for ETL monitoring, Airflow DAG execution, and operational reporting, providing real-time platform visibility.",
        "Utilized Cloud Data Fusion to connect on-premises servers with diverse databases (Oracle, MySQL, SQL Server, PostgreSQL) to ingest data into BigQuery."
      ]
    },
    {
      company: "Telecom Client",
      role: "AI-Powered Enterprise Search & Catalog Data Platform",
      period: "Nov 2024 – April 2025",
      location: "Remote / Hybrid",
      bullets: [
        "Designed and developed a configuration-driven ETL framework using Python and PySpark on GCP to ingest, transform, and standardize complex nested JSON telecom catalog data into BigQuery Data Lakehouse environments, processing 5M+ records daily.",
        "Engineered scalable BigQuery Data Warehousing and Data Modeling architectures with ingestion pipelines integrated with Cloud Storage, applying Partitioning and Clustering to accelerate query performance by 65% and cut compute overhead.",
        "Built metadata-driven Python and PySpark Data Transformation pipelines to normalize nested structures, validate business rules, and ensure schema consistency across prepaid, postpaid, and broadband catalogs, achieving 99.9% data reliability.",
        "Integrated BigQuery with Google Cloud Discovery Engine and Vertex AI Search to enable enterprise AI search through automated catalog indexing, metadata synchronization, and document ingestion utilities, boosting search retrieval speeds by 40%.",
        "Established automated CI/CD deployment pipelines using Git, Docker containers, and Linux environments for Apache Airflow DAGs and ETL utilities, enforcing Cloud IAM security policies and Dataplex Data Governance, cutting release cycles by 50%."
      ]
    }
  ],
  certifications: [
    "Google Cloud Certified: Professional Data Engineer",
    "Microsoft Certified: Azure AI Fundamentals",
    "Solved 250+ algorithmic problems on LeetCode | 6-Star Python badge on Hacker Rank",
    "Received On-the-Spot Award at FISClouds for delivering critical project milestones"
  ],
  education: [
    {
      degree: "B.Tech – Electronics and Communication Engineering",
      institution: "KKR & KSR Institute of Technology and Sciences, Guntur | GPA: 8.5/10",
      year: "Jun 2020 – May 2024"
    }
  ]
};

export const SAMPLE_JD = `Role: Senior Data Engineer (GCP & BigQuery Platform)
Company: Global Data Systems Inc.
Location: Hyderabad, India / Remote

About The Role:
We are seeking an experienced Data Engineer to design, scale, and optimize enterprise cloud data warehousing and real-time/batch ETL/ELT pipelines on Google Cloud Platform (GCP).

Key Responsibilities:
• Architect and maintain high-throughput ETL/ELT pipelines using BigQuery, Cloud Composer (Apache Airflow), and Cloud Data Fusion.
• Implement robust Data Lakehouse architectures spanning Landing, Raw, Staging, and Curated layers with Dataplex Data Governance and automated data quality checks.
• Accelerate BigQuery SQL performance, query execution, and storage optimization using Partitioning, Clustering, and cost tuning.
• Build reusable, metadata-driven Python & PySpark transformation frameworks to ingest JSON, relational (PostgreSQL, Oracle, SQL Server), and streaming data.
• Establish automated CI/CD deployment pipelines using Git, Docker, and Linux for Airflow DAGs and cloud data infrastructure.
• Integrate BigQuery with Google Cloud Discovery Engine, Vertex AI Search, and BI visualization platforms (Tableau, Looker Studio, Power BI).
• Collaborate with cross-functional stakeholders, data analysts, and engineering teams to ensure schema consistency and operational reliability.

Qualifications & Core Skills:
• 3+ years hands-on experience in Data Engineering on Google Cloud Platform (GCP).
• Deep expertise in BigQuery, Cloud Storage, Cloud Composer (Airflow), and Data Fusion.
• Advanced proficiency in Python, SQL, and PySpark for data transformation and pipeline orchestration.
• Proven track record with Dataplex, Data Modeling, Partitioning, Clustering, and Query Optimization.
• Familiarity with Docker, CI/CD, Git, Linux, and Cloud IAM security policies.
• Google Cloud Certified Professional Data Engineer is strongly preferred.`;
