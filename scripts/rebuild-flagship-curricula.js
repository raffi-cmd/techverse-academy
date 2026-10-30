const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- REBUILDING FLAGSHIP CURRICULA (AI, BACKEND, SOFTWARE ENG, FRONTEND, CLOUD) ---');

// Define curricula for the 5 flagship pathways
const FLAGSHIP_CURRICULA = {
  // 1. AI Engineering (pathway_21)
  pathway_21: {
    modules: [
      { order: 1, en: 'Module 1: Python for AI & Mathematical Foundations', id: 'Modul 1: Python untuk AI dan Fondasi Matematika' },
      { order: 2, en: 'Module 2: Data Preparation & Exploratory Analysis', id: 'Modul 2: Penyiapan Data dan Analisis Eksploratif' },
      { order: 3, en: 'Module 3: Classical Machine Learning & Feature Engineering', id: 'Modul 3: Machine Learning Klasik dan Rekayasa Fitur' },
      { order: 4, en: 'Module 4: Neural Networks & Deep Learning Foundations', id: 'Modul 4: Jaringan Saraf Tiruan dan Deep Learning' },
      { order: 5, en: 'Module 5: Computer Vision & Natural Language Architectures', id: 'Modul 5: Computer Vision dan Pemrosesan Bahasa Alami' },
      { order: 6, en: 'Module 6: Embeddings, Vector Stores, and Similarity Search', id: 'Modul 6: Embeddings, Vector Store, dan Pencarian Kesamaan' },
      { order: 7, en: 'Module 7: Large Language Models & Prompt Engineering', id: 'Modul 7: Large Language Models dan Rekayasa Prompt' },
      { order: 8, en: 'Module 8: Retrieval-Augmented Generation (RAG) Systems', id: 'Modul 8: Sistem Retrieval-Augmented Generation (RAG)' },
      { order: 9, en: 'Module 9: AI Evaluation, Safety, Privacy, and Guardrails', id: 'Modul 9: Evaluasi AI, Keselamatan, Privasi, dan Guardrails' },
      { order: 10, en: 'Module 10: Production AI Deployment, MLOps & Capstone', id: 'Modul 10: Penerapan AI Produksi, MLOps, dan Proyek Capstone' }
    ],
    chapters: [
      // M1
      'Python Environment & NumPy Vectorization', 'Linear Algebra & Matrix Operations for ML', 'Calculus, Gradients & Loss Optimization', 'Probability, Distributions & Statistical Inference', 'Object-Oriented Python for AI Pipelines',
      // M2
      'Data Ingestion with Pandas & Polars', 'Handling Missing Values & Outliers', 'Data Normalization, Scaling & Encoding', 'Exploratory Data Analysis & Visualization', 'Building Reproducible Data Cleaning Pipelines',
      // M3
      'Supervised Learning: Regression & Classification', 'Decision Trees, Random Forests & Gradient Boosting', 'Unsupervised Learning: Clustering & Dimensionality Reduction', 'Cross-Validation & Model Evaluation Metrics', 'Feature Selection & Automated Feature Engineering',
      // M4
      'Perceptrons & Multilayer Artificial Neural Networks', 'Backpropagation & Gradient Descent Optimizers', 'Activation Functions: ReLU, Sigmoid & GELU', 'Preventing Overfitting: Dropout & Regularization', 'Building Neural Networks with PyTorch',
      // M5
      'Convolutional Neural Networks (CNN) for Image Processing', 'Transfer Learning with Pretrained Vision Models', 'Recurrent Neural Networks & LSTMs for Sequences', 'The Attention Mechanism & Scaled Dot-Product Math', 'Transformer Architecture: Encoders, Decoders & Self-Attention',
      // M6
      'Vector Embeddings: Concept, Math & Intuition', 'Sentence Transformers & Semantic Search', 'Vector Database Fundamentals: Indexing (HNSW/IVF)', 'Integrating Pinecone, ChromaDB & Qdrant', 'Hybrid Search: Combining BM25 with Vector Search',
      // M7
      'Modern LLM Architectures: GPT, Llama & Mistral', 'System Prompts, In-Context Learning & Few-Shot Prompting', 'Advanced Prompting: Chain-of-Thought & ReAct', 'Structured Output Generation with JSON Schemas', 'LLM API Integration: Rate Limits, Streaming & Error Recovery',
      // M8
      'RAG Architecture: Document Chunking & Ingestion', 'Retrieval Strategies: Re-ranking & Contextual Compression', 'Building End-to-End RAG with LangChain & LlamaIndex', 'Multi-Modal RAG: Text, Tables, and Charts', 'Advanced Query Transformations & HyDE',
      // M9
      'Benchmarking LLMs: BLEU, ROUGE & Semantic Similarity', 'Evaluating RAG Systems: Ragas Framework & TruLens', 'AI Safety: Jailbreak Prevention & Prompt Injection Defense', 'Data Privacy, PII Redaction & Enterprise Governance', 'Implementing Defensive LLM Guardrails (NeMo)',
      // M10
      'Model Serving: FastAPI, vLLM & TensorRT-LLM', 'Containerizing AI Workflows with Docker', 'Continuous Monitoring, Drift Detection & Observability', 'Latency Optimization, Quantization (AWQ/GGUF) & Cost Control', 'AI Engineering Capstone: Production Enterprise Knowledge Agent'
    ]
  },

  // 2. Backend Development (pathway_07)
  pathway_07: {
    modules: [
      { order: 1, en: 'Module 1: Backend Fundamentals & Web Architecture', id: 'Modul 1: Fondasi Backend dan Arsitektur Web' },
      { order: 2, en: 'Module 2: Server Runtimes, Routing & Middleware', id: 'Modul 2: Runtime Server, Routing, dan Middleware' },
      { order: 3, en: 'Module 3: Relational Databases & SQL Engineering', id: 'Modul 3: Basis Data Relasional dan Rekayasa SQL' },
      { order: 4, en: 'Module 4: Data Modeling, Migrations & ORMs', id: 'Modul 4: Pemodelan Data, Migrasi, dan ORM' },
      { order: 5, en: 'Module 5: Authentication, Authorization & Sessions', id: 'Modul 5: Autentikasi, Otorisasi, dan Manajemen Sesi' },
      { order: 6, en: 'Module 6: RESTful API Design & Validation', id: 'Modul 6: Desain RESTful API dan Validasi Input' },
      { order: 7, en: 'Module 7: Caching Strategies & Redis Engineering', id: 'Modul 7: Strategi Caching dan Rekayasa Redis' },
      { order: 8, en: 'Module 8: Asynchronous Processing & Message Queues', id: 'Modul 8: Pemrosesan Asinkron dan Message Queue' },
      { order: 9, en: 'Module 9: Backend Security, Testing & Hardening', id: 'Modul 9: Keamanan Backend, Pengujian, dan Hardening' },
      { order: 10, en: 'Module 10: Microservices, System Design & Capstone', id: 'Modul 10: Microservices, Desain Sistem, dan Proyek Capstone' }
    ],
    chapters: [
      // M1
      'The Client-Server Model & Internet Protocols', 'HTTP/1.1, HTTP/2, and HTTP/3 Deep Dive', 'TCP/IP Sockets, Handshakes, and Connection Lifecycles', 'DNS Resolution and Reverse Proxies (Nginx)', 'Setting Up a Professional Backend Development Environment',
      // M2
      'Node.js Event Loop & Concurrency Models', 'Building HTTP Servers without Frameworks', 'Routing Engines and Controller Architecture', 'Middleware Chains, Interceptors & Request Pipelines', 'Centralized Error Handling & Structured Logging',
      // M3
      'Relational Database Concepts & ACID Guarantees', 'SQL Fundamentals: Queries, Joins & Aggregations', 'Advanced SQL: Window Functions, CTEs & Subqueries', 'Database Indexing: B-Trees, Hash Indexes & Query Plans', 'Database Transactions, Concurrency & Isolation Levels',
      // M4
      'Entity-Relationship Modeling & Schema Normalization', 'Database Migration Strategies & Zero-Downtime Releases', 'Working with Modern ORMs: Prisma, Drizzle & TypeORM', 'Solving the N+1 Query Problem & Batch Loading', 'Managing Connection Pools, Timeouts & Deadlocks',
      // M5
      'Password Security: Salting, Peppering & Argon2id/bcrypt', 'Session-Based Authentication with Secure Cookies', 'Token-Based Authentication: JWT Structure & Vulnerabilities', 'Role-Based Access Control (RBAC) Implementation', 'OAuth 2.0 & OpenID Connect Social Login Flows',
      // M6
      'REST Architectural Constraints & Best Practices', 'HTTP Verbs, Idempotency & Standard Status Codes', 'Input Validation, Type Constraints & Sanitization (Zod)', 'API Versioning Strategies (URI, Header, Parameter)', 'Interactive Documentation with OpenAPI and Swagger',
      // M7
      'Caching Topologies: In-Memory, Distributed & CDN', 'Redis Fundamentals: Strings, Hashes, Lists & Sets', 'Cache Eviction Policies: LRU, LFU & TTL Design', 'Cache Invalidation Strategies (Cache-Aside, Write-Through)', 'Mitigating Cache Stampedes, Penetration & Breakdowns',
      // M8
      'Synchronous vs Asynchronous Communication Patterns', 'Message Brokers: RabbitMQ & Redis Pub/Sub', 'Kafka Fundamentals: Topics, Partitions & Consumer Groups', 'Background Job Processing with BullMQ / Celery', 'Handling Failed Jobs, Dead-Letter Queues & Retries',
      // M9
      'OWASP Top 10 for Backend Engineers (SQLi, IDOR, SSRF)', 'Rate Limiting, Throttling & DDoS Mitigation', 'CORS, CSP & Secure HTTP Response Headers', 'Automated Unit & Integration Testing (Jest/Supertest)', 'Continuous Security Scanning (SAST & Dependency Audits)',
      // M10
      'Monolithic vs Microservice Architecture Trade-offs', 'API Gateways, Service Discovery & Circuit Breakers', 'Database Sharding, Partitioning & Read Replicas', 'Containerizing Backends with Docker & Multi-Stage Builds', 'Backend Capstone: Scalable Distributed Financial Ledger API'
    ]
  },

  // 3. Software Engineering (pathway_09)
  pathway_09: {
    modules: [
      { order: 1, en: 'Module 1: Professional Engineering & Algorithmic Foundations', id: 'Modul 1: Rekayasa Perangkat Lunak dan Algoritma' },
      { order: 2, en: 'Module 2: Advanced Data Structures & Time Complexity', id: 'Modul 2: Struktur Data Lanjutan dan Kompleksitas Waktu' },
      { order: 3, en: 'Module 3: Object-Oriented Design & Clean Code Principles', id: 'Modul 3: Desain Berorientasi Objek dan Clean Code' },
      { order: 4, en: 'Module 4: Gang of Four (GoF) Design Patterns', id: 'Modul 4: Design Patterns (Gang of Four)' },
      { order: 5, en: 'Module 5: Architectural Patterns & Decoupled Systems', id: 'Modul 5: Pola Arsitektur dan Sistem Terkopel Rendah' },
      { order: 6, en: 'Module 6: Code Quality, Refactoring & Technical Debt', id: 'Modul 6: Kualitas Kode, Refaktor, dan Technical Debt' },
      { order: 7, en: 'Module 7: Automated Testing, TDD & Verification', id: 'Modul 7: Pengujian Otomatis, TDD, dan Verifikasi' },
      { order: 8, en: 'Module 8: Git Workflows, Code Review & Collaboration', id: 'Modul 8: Workflow Git, Code Review, dan Kolaborasi Tim' },
      { order: 9, en: 'Module 9: CI/CD Pipelines, DevOps & Release Engineering', id: 'Modul 9: Pipeline CI/CD, DevOps, dan Rekayasa Rilis' },
      { order: 10, en: 'Module 10: System Scalability, Trade-offs & Capstone', id: 'Modul 10: Skalabilitas Sistem, Trade-off, dan Capstone' }
    ],
    chapters: [
      // M1
      'The Software Engineering Mindset: Rigor, Trade-offs & Ethics', 'Asymptotic Notation: Big-O, Big-Omega & Space-Time Trade-offs', 'Divide-and-Conquer Algorithms: Merge Sort & Quick Sort', 'Binary Search & Two-Pointer Algorithmic Patterns', 'Recursion, Call Stacks & Dynamic Programming Foundations',
      // M2
      'Arrays, Dynamic Vectors & Memory Contiguity', 'Linked Lists, Doubly Linked Lists & Sentinel Nodes', 'Stacks, Queues & Circular Deques in Memory', 'Hash Tables, Collision Resolution & Amortized Complexity', 'Binary Search Trees, Heaps & Priority Queues',
      // M3
      'The 4 Pillars of OOP: Abstraction, Encapsulation, Inheritance, Polymorphism', 'SOLID: Single Responsibility & Open/Closed Principles', 'SOLID: Liskov Substitution Principle Deep Dive', 'SOLID: Interface Segregation & Dependency Inversion', 'Clean Code: Naming, Function Cohesion & Guard Clauses',
      // M4
      'Creational Patterns: Singleton, Factory Method & Builder', 'Structural Patterns: Adapter, Decorator & Facade', 'Structural Patterns: Composite & Proxy Architectures', 'Behavioral Patterns: Strategy, Observer & State', 'Behavioral Patterns: Command, Iterator & Template Method',
      // M5
      'Layered & N-Tier Architectural Patterns', 'Hexagonal, Clean & Onion Architecture (Ports and Adapters)', 'Event-Driven Architecture: Event Bus & Event Sourcing', 'CQRS (Command Query Responsibility Segregation)', 'Domain-Driven Design (DDD): Entities, Value Objects & Aggregates',
      // M6
      'Recognizing Code Smells: Long Methods, Feature Envy & God Classes', 'Disciplined Refactoring Techniques (Martin Fowler Patterns)', 'Managing and Quantifying Technical Debt', 'Static Code Analysis, Linters & SonarQube Quality Gates', 'Preserving Backward Compatibility in Public Interfaces',
      // M7
      'The Test Pyramid: Unit, Integration & End-to-End Tests', 'Test-Driven Development (TDD): Red-Green-Refactor Cycle', 'Test Doubles: Mocks, Stubs, Fakes, Spies & Dummies', 'Property-Based Testing & Mutation Testing', 'Writing Maintainable Test Suites & Flaky Test Remediation',
      // M8
      'Advanced Git: Interactive Rebasing, Cherry-Picking & Bisect', 'Branching Strategies: Trunk-Based Development vs GitFlow', 'Crafting Meaningful Commits & Conventional Commit Standards', 'The Art of Constructive Code Review & PR Etiquette', 'Resolving Complex Merge Conflicts & Git Recovery',
      // M9
      'CI/CD Fundamentals: Fast Feedback Loops & Shift-Left', 'Building Production CI Workflows with GitHub Actions', 'Automated Semantic Versioning & Changelog Generation', 'Artifact Repositories, Container Registries & Build Optimization', 'Blue-Green & Canary Zero-Downtime Deployment Strategies',
      // M10
      'High-Availability Architecture: Redundancy & Failover', 'CAP Theorem, PACELC & Distributed Consensus', 'Graceful Degradation, Circuit Breakers & Backpressure', 'Engineering Documentation: ADRs, RFCs & C4 Architecture Models', 'Software Engineering Capstone: Production Resilient Core Engine'
    ]
  },

  // 4. Frontend Development (pathway_06)
  pathway_06: {
    modules: [
      { order: 1, en: 'Module 1: Semantic HTML5, Web Standards & Modern DOM', id: 'Modul 1: Semantic HTML5, Standar Web, dan Modern DOM' },
      { order: 2, en: 'Module 2: Modern CSS, Layout Systems & Responsive UI', id: 'Modul 2: Modern CSS, Sistem Layout, dan Desain Responsif' },
      { order: 3, en: 'Module 3: JavaScript Deep Dive: Engines, ES6+ & Async', id: 'Modul 3: JavaScript Mendalam: Engine, ES6+, dan Async' },
      { order: 4, en: 'Module 4: TypeScript for Production Frontend Engineering', id: 'Modul 4: TypeScript untuk Rekayasa Frontend Produksi' },
      { order: 5, en: 'Module 5: Component Architecture & Declarative UI', id: 'Modul 5: Arsitektur Komponen dan UI Deklaratif' },
      { order: 6, en: 'Module 6: Advanced State Management & Data Fetching', id: 'Modul 6: Manajemen State Lanjutan dan Data Fetching' },
      { order: 7, en: 'Module 7: Web Accessibility (a11y) & WCAG 2.2 Standards', id: 'Modul 7: Aksesibilitas Web (a11y) dan Standar WCAG 2.2' },
      { order: 8, en: 'Module 8: Web Performance, Core Web Vitals & Optimization', id: 'Modul 8: Performa Web, Core Web Vitals, dan Optimasi' },
      { order: 9, en: 'Module 9: Frontend Security, Testing & Tooling', id: 'Modul 9: Keamanan Frontend, Pengujian, dan Build Tooling' },
      { order: 10, en: 'Module 10: Modern Frameworks, Edge Rendering & Capstone', id: 'Modul 10: Framework Modern, Edge Rendering, dan Capstone' }
    ],
    chapters: [
      // M1
      'The Critical Rendering Path: DOM, CSSOM & Render Tree', 'Semantic HTML5 Elements & Meaningful Document Outlines', 'Forms, Native Inputs, Validations & Accessibility', 'The Document Object Model (DOM) API & Mutation Observers', 'Web Standards, W3C, WHATWG & Browser Compatibility',
      // M2
      'CSS Specificity, The Cascade, and Inheritance Rules', 'Modern CSS Layouts: Flexbox Deep Dive & Edge Cases', 'CSS Grid: Multi-Dimensional Layouts & Subgrid', 'Responsive Design: Fluid Typography, Breakpoints & Container Queries', 'Modern Styling Paradigms: CSS Modules, PostCSS & Tailwind CSS',
      // M3
      'JavaScript Execution Context, Call Stack & Memory Heap', 'Closures, Lexical Scope, and Hoisting Mechanics', 'Asynchronous JS: Event Loop, Microtasks & Promises', 'Modern ES6+ Features: Destructuring, Modules & Iterators', 'Browser APIs: Web Storage, IndexedDB, Fetch & Service Workers',
      // M4
      'TypeScript Fundamentals: Primitive Types, Unions & Intersections', 'Interfaces, Type Aliases & Generics for UI Components', 'Narrowing, Type Guards, and Discriminated Unions', 'Utility Types: Partial, Pick, Omit, Record & ReturnType', 'Configuring Strict tsconfig for Scalable Frontend Codebases',
      // M5
      'Declarative UI Foundations & Virtual DOM Reconciliation', 'Component Lifecycle, Pure Functions & Side Effect Isolation', 'Props Drilling, Compound Components & Render Props', 'Composition over Inheritance in UI Architecture', 'Building an Accessible Reusable Design System Component Library',
      // M6
      'Local vs Global vs Server State Classification', 'Context API Architecture and Avoiding Unnecessary Re-renders', 'Client-Side State Stores (Redux Toolkit, Zustand, Jotai)', 'Server State Management: Caching, Deduping & SWR / TanStack Query', 'Real-Time UI Updates: WebSockets, SSE & Optimistic UI',
      // M7
      'The Business & Human Case for Web Accessibility (a11y)', 'WCAG 2.2 Level AA Principles: POUR (Perceivable, Operable, Understandable, Robust)', 'Accessible Rich Internet Applications (ARIA): Roles, States & Attributes', 'Keyboard Navigation: Focus Management, Tab Trapping & Skip Links', 'Automated & Manual Accessibility Auditing (Axe, Screen Readers)',
      // M8
      'Core Web Vitals: LCP, INP, and CLS Explained and Measured', 'Asset Optimization: Modern Image Formats (WebP/AVIF) & Font Loading', 'Code Splitting, Lazy Loading & Dynamic Imports', 'Minimizing JavaScript Execution Time & Long Task Breakdown', 'Profiling Frontend Performance with Chrome DevTools Performance Panel',
      // M9
      'Frontend Security: Mitigating Cross-Site Scripting (XSS)', 'Content Security Policy (CSP) & Secure Resource Loading', 'Automated Component Testing with React Testing Library', 'End-to-End Browser Testing with Playwright & Cypress', 'Modern Build Tooling: Vite, Rollup & ESBuild Architecture',
      // M10
      'Server-Side Rendering (SSR), Static Site Generation (SSG) & ISR', 'React Server Components (RSC) and Streaming Architecture', 'Progressive Web Apps (PWA): Service Workers & Offline Caching', 'Edge Deployment, CDN Caching & Global Asset Distribution', 'Frontend Capstone: Production High-Performance Interactive Dashboard'
    ]
  },

  // 5. Cloud Computing (pathway_32)
  pathway_32: {
    modules: [
      { order: 1, en: 'Module 1: Cloud Foundations & Service Models', id: 'Modul 1: Fondasi Cloud dan Model Layanan' },
      { order: 2, en: 'Module 2: Cloud Compute & Virtualization Systems', id: 'Modul 2: Komputasi Cloud dan Sistem Virtualisasi' },
      { order: 3, en: 'Module 3: Cloud Storage Topologies & Lifecycle', id: 'Modul 3: Topologi Penyimpanan Cloud dan Siklus Hidup Data' },
      { order: 4, en: 'Module 4: Virtual Private Clouds (VPC) & Networking', id: 'Modul 4: Virtual Private Cloud (VPC) dan Jaringan' },
      { order: 5, en: 'Module 5: Identity and Access Management (IAM) in Cloud', id: 'Modul 5: Manajemen Identitas dan Akses (IAM) di Cloud' },
      { order: 6, en: 'Module 6: Containers, Registries & Kubernetes', id: 'Modul 6: Kontainer, Registri, dan Kubernetes' },
      { order: 7, en: 'Module 7: Infrastructure as Code (IaC) with Terraform', id: 'Modul 7: Infrastructure as Code (IaC) dengan Terraform' },
      { order: 8, en: 'Module 8: Cloud Databases & Managed Services', id: 'Modul 8: Basis Data Cloud dan Layanan Terkelola' },
      { order: 9, en: 'Module 9: Cloud Security, Compliance & Cost FinOps', id: 'Modul 9: Keamanan Cloud, Kepatuhan, dan Manajemen Biaya FinOps' },
      { order: 10, en: 'Module 10: Multi-Region High Availability & Capstone', id: 'Modul 10: Ketersediaan Tinggi Multi-Region dan Capstone' }
    ],
    chapters: [
      // M1
      'The Evolution of Cloud: On-Premise vs Cloud Paradigms', 'NIST Cloud Characteristics: Elasticity, On-Demand & Measured Service', 'Service Models: IaaS, PaaS, and SaaS Demarcation', 'Deployment Models: Public, Private, Hybrid & Multi-Cloud', 'Major Cloud Ecosystems: AWS, Azure, GCP & Architecture Mapping',
      // M2
      'Hardware Virtualization, Hypervisors & VM Lifecycles', 'Configuring Elastic Compute Instances (CPU, RAM & Disk Types)', 'Autoscaling Groups & Dynamic Load Balancing (ALB/NLB)', 'Serverless Compute Architecture (AWS Lambda, Cloud Functions)', 'Bare Metal Instances vs Specialized GPU Compute Nodes',
      // M3
      'Object Storage Architecture: S3/GCS Buckets, Objects & Keys', 'Block Storage: High-IOPS Disks (EBS/Persistent Disk)', 'File Storage: Managed NFS (EFS / Azure Files)', 'Storage Tiering: Hot, Cool, Cold & Deep Archive Lifecycles', 'Data Encryption at Rest: SSE-S3, SSE-KMS & Customer-Managed Keys',
      // M4
      'Virtual Private Cloud (VPC) Architecture & CIDR Block Design', 'Subnetting: Public vs Private Subnets & Routing Tables', 'Internet Gateways, NAT Gateways & Egress Traffic Control', 'Network Access Control Lists (NACLs) vs Stateful Security Groups', 'VPC Peering, Transit Gateways & Direct Connect / ExpressRoute',
      // M5
      'Cloud Identity Perimeters: Users, Groups, Roles & Policies', 'The Principle of Least Privilege in JSON IAM Policy Documents', 'IAM Roles for Compute Services (Instance Profiles)', 'Federated Identities, SAML 2.0 & Single Sign-On in Cloud', 'Securing Root Accounts, MFA Enforcement & Credential Auditing',
      // M6
      'Containerizing Workloads with Docker for Cloud Deployments', 'Container Registries (ECR/GCR) & Automated Vulnerability Scanning', 'Managed Container Runtimes (AWS ECS / Azure Container Apps)', 'Kubernetes Architecture: Control Plane, Nodes, Pods & Services', 'Deploying Resilient Workloads on Managed Kubernetes (EKS/GKE)',
      // M7
      'The Declarative Infrastructure Paradigm & IaC Benefits', 'Terraform Fundamentals: Providers, Resources & State Management', 'Terraform State: Remote Backends, Locking & Sensitive Variables', 'Modular Infrastructure Design: Reusable Terraform Modules', 'GitOps & Automated Infrastructure Pipelines with CI/CD',
      // M8
      'Managed Relational Databases (Amazon RDS / Cloud SQL)', 'High Availability & Read Replicas for Cloud Databases', 'Managed NoSQL Databases (DynamoDB / Firestore / Cosmos DB)', 'In-Memory Cloud Caching (ElastiCache / MemoryStore)', 'Database Migration Service (DMS) & Zero-Downtime Data Cutover',
      // M9
      'The Cloud Shared Responsibility Security Model', 'Cloud Security Posture Management (CSPM) & GuardDuty', 'Cloud Observability: Centralized Logging (CloudWatch) & Metrics', 'FinOps: Cloud Cost Allocation, Tagging & Reserved Instances', 'Rightsizing Resources, Spot Instances & Cost Anomaly Alerts',
      // M10
      'Disaster Recovery Strategies: Backup-and-Restore vs Warm Standby', 'Multi-Region Active-Active Architectures & GeoDNS Routing', 'Chaos Engineering & Automated Disaster Recovery Drills', 'Cloud Well-Architected Framework: The 6 Pillars', 'Cloud Computing Capstone: Automated Multi-Tier Enterprise VPC Deployment'
    ]
  }
};

const updateModuleStmt = db.prepare('UPDATE pathway_modules SET name = ? WHERE id = ?');
const updateChapterStmt = db.prepare(`
  UPDATE chapters
  SET title = ?,
      title_en = ?,
      title_id = ?,
      description = ?,
      description_en = ?,
      description_id = ?,
      module_id = ?,
      difficulty_level = ?,
      curriculum_version = '2.0.0'
  WHERE pathway_id = ? AND sort_order = ?
`);

const updateLessonStmt = db.prepare(`
  UPDATE lessons
  SET title = ?,
      title_en = ?,
      title_id = ?,
      content = ?,
      content_en = ?,
      content_id = ?
  WHERE chapter_id = ? AND sort_order = 1
`);

const updateLesson2Stmt = db.prepare(`
  UPDATE lessons
  SET title = ?,
      title_en = ?,
      title_id = ?,
      content = ?,
      content_en = ?,
      content_id = ?
  WHERE chapter_id = ? AND sort_order = 2
`);

const updateAssessmentStmt = db.prepare(`
  UPDATE assessments
  SET title = ?,
      description = ?,
      passing_score = 70
  WHERE chapter_id = ?
`);

// Execute updates for each flagship pathway
for (const [pId, curriculum] of Object.entries(FLAGSHIP_CURRICULA)) {
  const pathway = db.prepare('SELECT name FROM learning_pathways WHERE id = ?').get(pId);
  console.log(`Updating ${pathway.name} (${pId})...`);

  // 1. Update 10 modules
  curriculum.modules.forEach(m => {
    const modId = `${pId}_m${m.order}`;
    updateModuleStmt.run(m.en, modId);
  });

  // 2. Update 50 chapters
  curriculum.chapters.forEach((chapTitleEn, idx) => {
    const chapOrder = idx + 1;
    const chapId = `${pId}_ch${chapOrder}`;
    const mIdx = Math.floor(idx / 5);
    const modId = `${pId}_m${mIdx + 1}`;
    const diff = chapOrder <= 15 ? 'beginner' : chapOrder <= 35 ? 'intermediate' : 'advanced';

    const descEn = `In-depth study of ${chapTitleEn} within the ${pathway.name} specialization track. Master architectural mental models, code patterns, and production standards.`;
    const descId = `Pembahasan mendalam tentang ${chapTitleEn} dalam jalur spesialisasi ${pathway.name}. Menguasai model mental arsitektural, pola kode, dan standar produksi.`;

    updateChapterStmt.run(
      chapTitleEn,
      chapTitleEn,
      chapTitleEn,
      descEn,
      descEn,
      descId,
      modId,
      diff,
      pId,
      chapOrder
    );

    // Update lesson 1 content
    const l1ContentEn = `# ${chapTitleEn}

## Chapter ${chapOrder}: ${pathway.name}

### 1. Architectural Foundations
In modern ${pathway.name}, mastering **${chapTitleEn}** is critical to building scalable, resilient, and maintainable software systems.

### Key Principles
- **Separation of Concerns:** Keep modular boundaries clearly defined.
- **Fail-Safe Defaults:** Ensure default system states reject invalid operations gracefully.
- **Deterministic Outcomes:** Ensure logic produces predictable behavior under all valid and invalid inputs.

### Practical Engineering Takeaways
1. Always validate data contracts at the trust boundary.
2. Automate unit and integration test assertions for every critical path.
3. Observe performance metrics and error rates under real-world traffic.`;

    const l1ContentId = `# ${chapTitleEn}

## Bab ${chapOrder}: ${pathway.name}

### 1. Fondasi Arsitektural
Dalam ${pathway.name} modern, menguasai **${chapTitleEn}** sangat penting untuk membangun sistem perangkat lunak yang andal, berskala besar, dan mudah dipelihara.

### Prinsip Utama
- **Pemisahan Tanggung Jawab (Separation of Concerns):** Jaga batasan modular agar tetap terisolasi dengan jelas.
- **Setelan Bawaan Aman (Fail-Safe Defaults):** Pastikan kondisi sistem default menangani kesalahan secara aman.
- **Hasil Deterministik (Deterministic Outcomes):** Pastikan logika kode menghasilkan perilaku yang dapat diprediksi pada setiap kondisi input.

### Poin Penting Rekayasa Praktis
1. Selalu validasi kontrak data pada batas kepercayaan sistem.
2. Otomasikan pengujian unit dan integrasi untuk setiap alur logika kritis.
3. Amati metrik kinerja dan tingkat kesalahan pada beban sistem nyata.`;

    updateLessonStmt.run(
      'Theory & Architecture',
      'Theory & Architecture',
      'Teori & Arsitektur',
      l1ContentEn,
      l1ContentEn,
      l1ContentId,
      chapId
    );

    // Update lesson 2 content
    const l2ContentEn = `# Hands-On Implementation Guide: ${chapTitleEn}

## Step-by-Step Implementation Workflow
To apply the concepts of **${chapTitleEn}** effectively:
1. Initialize your local project workspace and configure dependencies.
2. Structure the core domain logic cleanly following modular best practices.
3. Implement automated verification tests and inspect execution logs.

### Defensive Best Practices & Common Pitfalls
- **Avoid Unchecked Assumptions:** Verify inputs before mutating internal state.
- **Sanitize Secrets:** Never commit raw API keys or credentials to version control.
- **Measure Before Optimizing:** Prioritize clean readability and correctness before micro-optimizations.`;

    const l2ContentId = `# Panduan Implementasi Praktis: ${chapTitleEn}

## Alur Kerja Implementasi Langkah demi Langkah
Untuk menerapkan konsep **${chapTitleEn}** secara efektif:
1. Siapkan ruang kerja proyek lokal Anda dan konfigurasikan dependensi yang diperlukan.
2. Susun logika domain utama dengan mematuhi praktik terbaik modularitas kode.
3. Terapkan pengujian verifikasi otomatis dan periksa log eksekusi sistem.

### Praktik Terbaik dan Kesalahan Umum
- **Hindari Asumsi Tanpa Validasi:** Selalu periksa keabsahan input sebelum memproses perubahan data.
- **Jaga Kerahasiaan Kredensial:** Jangan pernah menyimpan API key atau rahasia produksi di repositori publik.
- **Ukur Sebelum Mengoptimasi:** Prioritaskan keterbacaan kode dan ketepatan logika sebelum melakukan optimasi kinerja.`;

    updateLesson2Stmt.run(
      'Implementation & Real-World Application',
      'Implementation & Real-World Application',
      'Implementasi & Aplikasi Nyata',
      l2ContentEn,
      l2ContentEn,
      l2ContentId,
      chapId
    );

    // Update assessment
    updateAssessmentStmt.run(
      `${chapTitleEn} Assessment`,
      `Evaluate your mastery of ${chapTitleEn} in ${pathway.name}. Passing score: 70%.`,
      chapId
    );
  });
}

console.log('--- FLAGSHIP CURRICULA REBUILD COMPLETED SUCCESSFULLY ---');
db.close();
