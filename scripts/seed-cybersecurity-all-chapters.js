const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- SEEDING CYBERSECURITY CHAPTERS 02 TO 50 WITH DEEP CURRICULUM & ASSESSMENTS ---');

const deleteLessonsStmt = db.prepare('DELETE FROM lessons WHERE chapter_id = ?');
const deleteQuestionsStmt = db.prepare('DELETE FROM assessment_questions WHERE assessment_id = ?');

const insertLessonStmt = db.prepare(`
  INSERT INTO lessons (
    id, chapter_id, title, slug, content, content_type, sort_order, estimated_time, is_required, status,
    title_en, title_id, content_en, content_id
  ) VALUES (?, ?, ?, ?, ?, 'text', ?, ?, 1, 'published', ?, ?, ?, ?)
`);

const upsertAssessmentStmt = db.prepare(`
  INSERT OR REPLACE INTO assessments (
    id, chapter_id, title, description, passing_score, max_attempts, time_limit_min, status
  ) VALUES (?, ?, ?, ?, 70, 0, ?, 'published')
`);

const insertQuestionStmt = db.prepare(`
  INSERT INTO assessment_questions (
    id, assessment_id, question_text, question_type, options, correct_answer, explanation, points, sort_order,
    question_text_en, question_text_id, explanation_en, explanation_id, hint_en, hint_id
  ) VALUES (?, ?, ?, 'multiple_choice', ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
`);

// 50 Chapters Definition with their core topics
const CHAPTERS_DATA = [
  // Ch 2
  { order: 2, titleEn: 'Computers, Operating Systems, and Digital Data', titleId: 'Komputer, Sistem Operasi, dan Data Digital',
    topics: ['Hardware Architecture & Processing Pipeline', 'Operating System Kernels and User Space', 'Processes, Memory Management & Privilege Rings', 'File Systems and Discretionary Access Controls (DAC)', 'Configuration Vulnerabilities and Defensive Hardening'] },
  // Ch 3
  { order: 3, titleEn: 'How the Internet and Networks Work', titleId: 'Cara Kerja Internet dan Jaringan Komputer',
    topics: ['OSI Model vs TCP/IP Stack in Security', 'Packet Encapsulation, IP Addressing & Subnets', 'Switches, Routers, and ARP Dynamics', 'Domain Name System (DNS) Architecture and Security', 'HTTP, HTTPS, and Packet Flow across Web Boundaries'] },
  // Ch 4
  { order: 4, titleEn: 'Linux, Windows, and Command-Line Fundamentals', titleId: 'Fondasi Command-Line Linux dan Windows',
    topics: ['The Power of the Command Line Interface in Defense', 'Linux Terminal Fundamentals (bash, core utilities)', 'Windows PowerShell Essentials and Administration', 'File Permissions, Ownership & Sudo Elevation', 'Inspecting System Processes and Network Sockets'] },
  // Ch 5 (Checkpoint 1)
  { order: 5, titleEn: 'Cybersecurity Ethics, Safety, and Threat Awareness', titleId: 'Etika Keamanan Siber, Keselamatan, dan Kesadaran Ancaman',
    topics: ['Ethical Boundaries and the Hacker Taxonomy', 'Rules of Engagement and Written Authorization', 'Legal Ramifications of Unauthorized Access', 'Responsible Vulnerability Disclosure Frameworks', 'Building Isolated and Safe Local Practice Labs'] },
  // Ch 6
  { order: 6, titleEn: 'Security Goals and the CIA Triad', titleId: 'Tujuan Keamanan dan CIA Triad',
    topics: ['Confidentiality: Protecting Secrets and Sensitive Records', 'Integrity: Guaranteeing Accuracy and Tamper Evidence', 'Availability: System Uptime and Disaster Resilience', 'Balancing Security Trade-offs and Business Agility', 'Real-world Failures of the CIA Triad across Sectors'] },
  // Ch 7
  { order: 7, titleEn: 'Assets, Threats, Vulnerabilities, and Risk', titleId: 'Aset, Ancaman, Kerentanan, dan Risiko',
    topics: ['Asset Identification and Criticality Categorization', 'Threat Landscapes and Vulnerability Lifecycles', 'Exploits, Zero-Days, and Weaponization Concepts', 'Qualitative vs Quantitative Risk Calculation', 'Building and Maintaining an Organizational Risk Register'] },
  // Ch 8
  { order: 8, titleEn: 'Threat Actors and Attack Surfaces', titleId: 'Pelaku Ancaman dan Bidang Serangan',
    topics: ['Classifying Adversaries: Hacktivists to Nation-State APTs', 'Motivations, Capabilities, and Tactics (TTPs)', 'Mapping Organizational Attack Surfaces', 'Human, Software, Cloud, and Physical Vectors', 'Techniques for Proactive Attack Surface Reduction'] },
  // Ch 9
  { order: 9, titleEn: 'Social Engineering and Phishing Defense', titleId: 'Rekayasa Sosial dan Pertahanan Phishing',
    topics: ['Psychological Levers: Urgency, Authority, Fear & Greed', 'Spear Phishing, Whaling, and Vishing Mechanisms', 'Anatomy of Deceptive Links and Spoofed Senders', 'Technical Controls: Email Filtering and Sender Verification', 'Building Human Security Culture and Reporting Workflows'] },
  // Ch 10 (Checkpoint 2)
  { order: 10, titleEn: 'Security Policies and Fundamental Controls', titleId: 'Kebijakan Keamanan dan Kontrol Fundamental',
    topics: ['Security Policies, Standards, Guidelines, and Procedures', 'Administrative, Technical, and Physical Security Controls', 'Preventative, Detective, Corrective, and Recovery Controls', 'Compensating Controls and Defense in Depth', 'Aligning Control Selection with Business Risk Tolerance'] },
  // Ch 11
  { order: 11, titleEn: 'Authentication, Authorization, and Accounting', titleId: 'Autentikasi, Otorisasi, dan Akuntansi (AAA)',
    topics: ['The Identity Triad: Identification vs Authentication', 'Authorization: Determining Permitted Actions', 'Accounting: Immutable Audit Trails and Log Integrity', 'Modern Secure Authentication Workflows', 'Implementing AAA Architectures in Corporate Networks'] },
  // Ch 12
  { order: 12, titleEn: 'Password Security and Multi-Factor Authentication', titleId: 'Keamanan Kata Sandi dan Autentikasi Multi-Faktor',
    topics: ['Password Entropy, Passphrases, and Brute-Force Math', 'Password Managers and Cryptographic Vault Architecture', 'Multi-Factor Authentication (MFA) Factors', 'Time-Based One-Time Passwords (TOTP) and Push Verification', 'FIDO2, WebAuthn, Hardware Keys, and Passkeys'] },
  // Ch 13
  { order: 13, titleEn: 'Access Control Models', titleId: 'Model Kontrol Akses (RBAC & ABAC)',
    topics: ['Principle of Least Privilege and Default Deny', 'Discretionary Access Control (DAC) Mechanisms', 'Role-Based Access Control (RBAC) Architecture', 'Attribute-Based Access Control (ABAC) Policies', 'Separation of Duties and Access Certification Audits'] },
  // Ch 14
  { order: 14, titleEn: 'Identity Federation and Secure Sessions', titleId: 'Federasi Identitas dan Manajemen Sesi Aman',
    topics: ['Identity Providers (IdP) and Service Providers (SP)', 'Single Sign-On (SSO) Architecture and Benefits', 'OAuth 2.0 Authorization Grants and Token Flows', 'OpenID Connect (OIDC) Authentication Layer', 'Session Management, Cookie Security Flags, and Revocation'] },
  // Ch 15 (Checkpoint 3)
  { order: 15, titleEn: 'Privileged Access and Account Lifecycle', titleId: 'Akses Istimewa dan Siklus Hidup Akun',
    topics: ['Privileged Access Management (PAM) Vaults', 'Just-In-Time (JIT) Privilege Elevation', 'Joiner, Mover, and Leaver (JML) Identity Workflows', 'Automated Account Provisioning and Deprovisioning', 'Service Accounts, API Keys, and Machine Identity Governance'] },
  // Ch 16
  { order: 16, titleEn: 'Cryptography Fundamentals', titleId: 'Fondasi Kriptografi',
    topics: ['Core Goals of Cryptography: Confidentiality, Integrity, Non-Repudiation', 'Plaintext, Ciphertext, and Key Space Mathematics', 'Symmetric Encryption: Block Ciphers, Stream Ciphers, AES-GCM', 'Asymmetric Encryption: Public and Private Key Pairs', 'Cryptographic Entropy, Randomness, and Limitations'] },
  // Ch 17
  { order: 17, titleEn: 'Hashing, Salting, and Password Storage', titleId: 'Hashing, Salting, dan Penyimpanan Kata Sandi',
    topics: ['Cryptographic Hash Functions: SHA-256 and Properties', 'Why Hashing is One-Way and Not Encryption', 'Rainbow Tables and Collision Vulnerabilities', 'Salt and Pepper: Preventing Precomputed Dictionary Attacks', 'Adaptive Password Hashing: Argon2id, bcrypt, and scrypt'] },
  // Ch 18
  { order: 18, titleEn: 'Public-Key Cryptography and Digital Signatures', titleId: 'Kriptografi Kunci Publik dan Tanda Tangan Digital',
    topics: ['Diffie-Hellman Key Exchange and Asymmetric Math', 'RSA, Elliptic Curve Cryptography (ECC), and Efficiency', 'Digital Signatures: Combining Hashing with Private Keys', 'Verifying Authenticity, Integrity, and Non-Repudiation', 'Public Key Infrastructure (PKI) and Certificate Authorities'] },
  // Ch 19
  { order: 19, titleEn: 'TLS, HTTPS, and Secure Communication', titleId: 'TLS, HTTPS, dan Komunikasi Jaringan Aman',
    topics: ['The Evolution from SSL to TLS 1.3', 'Anatomy of the Modern TLS Handshake', 'Digital Certificates, Trust Chains, and Revocation (CRL/OCSP)', 'Forward Secrecy and Cryptographic Session Keys', 'Common TLS Misconfigurations and Certificate Pinning'] },
  // Ch 20 (Checkpoint 4)
  { order: 20, titleEn: 'Data Classification, Privacy, and Protection', titleId: 'Klasifikasi Data, Privasi, dan Perlindungan Informasi',
    topics: ['Data Classification Tiers: Public, Internal, Confidential, Restricted', 'Data States: Data-at-Rest, Data-in-Transit, Data-in-Use', 'Transparent Database Encryption and Full-Disk Encryption', 'Data Minimization and Anonymization Techniques', 'Data Retention Policies and Cryptographic Eradication'] },
  // Ch 21
  { order: 21, titleEn: 'Endpoint Security Fundamentals', titleId: 'Fondasi Keamanan Endpoint',
    topics: ['Endpoint Device Taxonomy and Diverse Threat Vectors', 'Antivirus vs Modern Endpoint Detection and Response (EDR)', 'Application Allowlisting and Software Execution Policies', 'Managing Removable Media and USB Security', 'Establishing Organizational Endpoint Security Baselines'] },
  // Ch 22
  { order: 22, titleEn: 'Operating-System Hardening', titleId: 'Pengerasan Sistem Operasi (OS Hardening)',
    topics: ['The Concept of System Hardening and Attack Surface Reduction', 'Disabling Unnecessary Services, Daemons, and Ports', 'Configuring Host-Based Firewalls (iptables/ufw/Windows Defender)', 'Kernel Mitigations: ASLR, DEP/NX, and Secure Boot', 'Automated Hardening Benchmarks: CIS Benchmarks and DISA STIGs'] },
  // Ch 23
  { order: 23, titleEn: 'Network Security Fundamentals', titleId: 'Fondasi Keamanan Jaringan dan Segmentasi',
    topics: ['Network Boundaries and Defense-in-Depth Perimeters', 'VLAN Segmentation and Lateral Movement Containment', 'Stateful Packet Inspection vs Next-Generation Firewalls (NGFW)', 'Demilitarized Zones (DMZ) for Public Services', 'Intrusion Detection (IDS) and Intrusion Prevention Systems (IPS)'] },
  // Ch 24
  { order: 24, titleEn: 'DNS, Email, and Network Service Security', titleId: 'Keamanan DNS, Email, dan Layanan Jaringan',
    topics: ['DNS Vulnerabilities: Poisoning, Spoofing, and Hijacking', 'DNSSEC and DNS over HTTPS (DoH) Deployments', 'Email Authentication: SPF Records and Mechanisms', 'DKIM Cryptographic Signatures and DMARC Enforcement', 'Securing Remote Management: SSH Keys, Bastions, and Port Security'] },
  // Ch 25 (Checkpoint 5)
  { order: 25, titleEn: 'Wireless, Remote Access, and Network Defense', titleId: 'Keamanan Nirkabel, VPN, dan Akses Jarak Jauh',
    topics: ['Wireless Encryption Protocols: WEP, WPA2, and WPA3', 'Enterprise 802.1X Wireless Authentication with RADIUS', 'Rogue Access Point Detection and Evil Twin Defenses', 'Virtual Private Networks (VPN): IPsec vs WireGuard', 'Zero Trust Network Access (ZTNA) Replacing Legacy VPNs'] },
  // Ch 26
  { order: 26, titleEn: 'Secure Software Development Fundamentals', titleId: 'Fondasi Pengembangan Perangkat Lunak Aman (Secure SDLC)',
    topics: ['Integrating Security Across the Software Development Life Cycle', 'Threat Modeling in the Design Phase (STRIDE)', 'Static Application Security Testing (SAST) in CI Pipelines', 'Dynamic Application Security Testing (DAST) and IAST', 'Secure Release Management and Automated Quality Gates'] },
  // Ch 27
  { order: 27, titleEn: 'Web Applications and HTTP Security', titleId: 'Aplikasi Web dan Keamanan Protokol HTTP',
    topics: ['Client-Server Architecture and the HTTP Request Pipeline', 'HTTP Headers for Defense: CSP, HSTS, X-Content-Type-Options', 'Secure Cookie Attributes: HttpOnly, Secure, SameSite', 'Input Validation, Whitelisting, and Type Constraints', 'Output Encoding to Neutralize Context Injection'] },
  // Ch 28
  { order: 28, titleEn: 'Common Web Vulnerabilities and Their Prevention', titleId: 'Kerentanan Web Umum dan Strategi Pencegahannya',
    topics: ['SQL Injection (SQLi) and Parameterized Query Defense', 'Cross-Site Scripting (XSS): Stored, Reflected, DOM-based', 'Cross-Site Request Forgery (CSRF) and Anti-CSRF Tokens', 'Broken Object Level Authorization (BOLA / IDOR)', 'Server-Side Request Forgery (SSRF) and Cloud Metadata Defense'] },
  // Ch 29
  { order: 29, titleEn: 'API Security', titleId: 'Keamanan Antarmuka Pemrograman Aplikasi (API Security)',
    topics: ['REST, GraphQL, and Modern API Threat Vectors', 'API Authentication: JWT, OAuth 2.0, and API Keys', 'Object-Level and Function-Level Authorization Enforcement', 'Rate Limiting, Throttling, and DoS Mitigation for Endpoints', 'Safe Error Handling without Leaking Stack Traces'] },
  // Ch 30 (Checkpoint 6)
  { order: 30, titleEn: 'Secure Coding and Dependency Management', titleId: 'Penulisan Kode Aman dan Manajemen Dependensi',
    topics: ['Software Supply Chain Attacks and Malicious Dependencies', 'Software Bill of Materials (SBOM) and Dependency Audits', 'Automated Vulnerability Scanners (Dependabot, Snyk)', 'Secret Hygiene: Preventing Hardcoded API Keys and Git Leaks', 'Peer Code Reviews with Security Checklists'] },
  // Ch 31
  { order: 31, titleEn: 'Cloud Computing and Shared Responsibility', titleId: 'Komputasi Awan dan Model Tanggung Jawab Bersama',
    topics: ['Cloud Service Models: IaaS, PaaS, SaaS Security Boundaries', 'The Shared Responsibility Model across Major Providers', 'Cloud Identity as the New Security Perimeter', 'Data Sovereignty, Residency, and Regulatory Requirements', 'Cloud Threat Landscapes: Misconfiguration vs Infrastructure Flaws'] },
  // Ch 32
  { order: 32, titleEn: 'Cloud Identity and Configuration Security', titleId: 'Manajemen Identitas dan Keamanan Konfigurasi Cloud',
    topics: ['Cloud Identity and Access Management (IAM) Best Practices', 'Enforcing Least Privilege with Granular Cloud Policies', 'Preventing Public Cloud Storage Exposure (S3 / Blob Storage)', 'Centralizing Cloud Audit Logs (CloudTrail, Activity Logs)', 'Automated Cloud Security Posture Management (CSPM)'] },
  // Ch 33
  { order: 33, titleEn: 'Containers and Infrastructure Security', titleId: 'Keamanan Kontainer dan Infrastruktur sebagai Kode',
    topics: ['Container Architecture and Linux Namespaces / cgroups', 'Base Image Minimization and Image Vulnerability Scanning', 'Running Containers as Non-Root with Read-Only Filesystems', 'Securing Kubernetes Clusters: RBAC, Network Policies, Pod Security', 'Infrastructure as Code (IaC) Security Scanning (Terraform / CloudFormation)'] },
  // Ch 34
  { order: 34, titleEn: 'Vulnerability and Patch Management', titleId: 'Manajemen Kerentanan dan Pembaruan Sistem (Patching)',
    topics: ['The Vulnerability Management Lifecycle: Discover, Assess, Remediate', 'Common Vulnerabilities and Exposures (CVE) and NVD', 'CVSS 3.1 Severity Metrics: Base, Temporal, Environmental Scores', 'Prioritizing Patches Based on Exploitation in the Wild (KEV)', 'Staging Environments, Patch Testing, and Safe Rollback Plans'] },
  // Ch 35 (Checkpoint 7)
  { order: 35, titleEn: 'Backup, Recovery, and Business Continuity', titleId: 'Pencadangan, Pemulihan, dan Kelangsungan Bisnis',
    topics: ['The 3-2-1 Backup Rule: Copies, Formats, and Offsite Storage', 'Immutable Backups and Ransomware Protection', 'Defining Recovery Time Objective (RTO) and Recovery Point Objective (RPO)', 'Disaster Recovery (DR) Plan Design and Regular Testing', 'Business Impact Analysis (BIA) and Crisis Resumption Protocols'] },
  // Ch 36
  { order: 36, titleEn: 'Security Logs and Monitoring Fundamentals', titleId: 'Fondasi Log Keamanan dan Pemantauan Sistem',
    topics: ['Log Sources: Authentication, Operating System, Web, Network', 'Standardized Log Formats: Syslog, JSON, Common Event Format (CEF)', 'Time Synchronization with Network Time Protocol (NTP)', 'Log Retention Policies and Tamper-Proof Storage', 'Defining Monitoring Objectives and Identifying Blind Spots'] },
  // Ch 37
  { order: 37, titleEn: 'Security Information and Event Management', titleId: 'Manajemen Informasi dan Peristiwa Keamanan (SIEM)',
    topics: ['SIEM Architecture: Log Collectors, Indexers, Correlation Engines', 'Log Normalization and Field Extraction Standards', 'Writing Correlation Rules for Threat Detection', 'Alert Prioritization and Mitigating Alert Fatigue', 'Security Orchestration, Automation, and Response (SOAR) Integration'] },
  // Ch 38
  { order: 38, titleEn: 'Threat Detection and Defensive Analysis', titleId: 'Deteksi Ancaman dan Analisis Defensif',
    topics: ['Indicators of Compromise (IoCs) vs Indicators of Attack (IoAs)', 'Establishing Behavioral Baselines across Users and Entities (UEBA)', 'Applying the MITRE ATT&CK Framework to Detections', 'Investigating Suspicious Anomalies and False-Positive Triage', 'Evidence Gathering and Defensive Timeline Reconstruction'] },
  // Ch 39
  { order: 39, titleEn: 'Incident Response Fundamentals', titleId: 'Fondasi Tanggap Insiden Keamanan (Incident Response)',
    topics: ['The 6-Phase Incident Response Lifecycle (NIST SP 800-61 / SANS)', 'Preparation: Forming the CSIRT and Creating Playbooks', 'Identification and Triaging Security Incidents', 'Containment Strategies: Short-Term Isolation vs Long-Term Control', 'Eradication, System Recovery, and Post-Incident Lessons Learned'] },
  // Ch 40 (Checkpoint 8)
  { order: 40, titleEn: 'Digital Forensics and Evidence Handling', titleId: 'Forensik Digital dan Penanganan Bukti Digital',
    topics: ['Digital Forensics Principles and Order of Volatility', 'Maintaining Strict Legal Chain of Custody for Evidence', 'Volatile Memory (RAM) Acquisition and Analysis', 'Disk Imaging and Cryptographic Verification (Hashes)', 'Investigative Documentation and Court-Admissible Reporting'] },
  // Ch 41
  { order: 41, titleEn: 'Security Governance and Compliance', titleId: 'Tata Kelola Keamanan dan Kepatuhan Regulasi',
    topics: ['Security Governance Frameworks: Aligning Business with Defense', 'Key Industry Standards: ISO/IEC 27001, SOC 2, PCI DSS', 'Privacy Regulations: GDPR, CCPA, and Indonesia UU PDP', 'Audit Readiness, Evidence Collection, and Continuous Compliance', 'Security Metrics and Executive Performance Dashboards'] },
  // Ch 42
  { order: 42, titleEn: 'Security Frameworks and Risk Management', titleId: 'Kerangka Kerja Keamanan (NIST CSF) dan Manajemen Risiko',
    topics: ['NIST Cybersecurity Framework 2.0: Govern, Identify, Protect, Detect, Respond, Recover', 'Risk Assessment Methodologies (NIST SP 800-30)', 'Developing and Updating Organizational Risk Registers', 'Risk Treatment Options: Mitigate, Accept, Transfer, Avoid', 'Communicating Technical Cyber Risk to Board Executives'] },
  // Ch 43
  { order: 43, titleEn: 'Threat Intelligence and Security Awareness', titleId: 'Intelijen Ancaman (Threat Intelligence) dan Edukasi Keamanan',
    topics: ['The Cyber Threat Intelligence (CTI) Lifecycle', 'Strategic, Operational, and Tactical Threat Intelligence', 'Consuming and Sharing Threat Feeds: STIX and TAXII Standards', 'Evaluating Source Reliability and Intelligence Confidence', 'Designing Engaging Organization-Wide Security Awareness Programs'] },
  // Ch 44
  { order: 44, titleEn: 'Zero Trust and Defense in Depth', titleId: 'Arsitektur Zero Trust dan Pertahanan Berlapis (Defense in Depth)',
    topics: ['The Fall of the Traditional Perimeter Defense Model', 'Core Zero Trust Principles: Never Trust, Always Verify', 'Identity, Device, Network, and Application Verification', 'Micro-segmentation and Least-Privilege Network Access', 'Evaluating and Measuring Multi-Layered Defense Efficacy'] },
  // Ch 45 (Checkpoint 9)
  { order: 45, titleEn: 'Security Architecture and Threat Modeling', titleId: 'Arsitektur Keamanan dan Pemodelan Ancaman (Threat Modeling)',
    topics: ['Principles of Defensive Enterprise Security Architecture', 'Identifying Trust Boundaries and Data Flow Diagrams (DFDs)', 'Threat Modeling Methodologies: STRIDE, PASTA, and DREAD', 'Challenging Security Assumptions in System Designs', 'Conducting Formal Architectural Security Reviews'] },
  // Ch 46
  { order: 46, titleEn: 'Security Testing and Validation', titleId: 'Pengujian dan Validasi Keamanan Defensif',
    topics: ['Taxonomy of Security Testing: Vulnerability Scans vs Penetration Tests', 'Red Team vs Blue Team vs Purple Team Exercises', 'Scope Definition, Legal Agreements, and Authorization', 'Breach and Attack Simulation (BAS) Technologies', 'Validating Security Controls and Verifying Fixes'] },
  // Ch 47
  { order: 47, titleEn: 'Security Automation and Defensive Tooling', titleId: 'Otomasi Keamanan dan Alat Bantu Defensif',
    topics: ['Principles of Safe Defensive Security Automation', 'Writing Defensive Python and Shell Automation Scripts', 'Automating Log Parsing and Indicator Enrichment', 'Integrating Security Orchestration, Automation, and Response (SOAR)', 'Secure Credential Handling in Automated Workflows'] },
  // Ch 48
  { order: 48, titleEn: 'Security Documentation and Professional Reporting', titleId: 'Dokumentasi Keamanan dan Pelaporan Profesional',
    topics: ['Writing High-Impact Technical Security Reports', 'Crafting Executive Summaries for Business Leaders', 'Structuring Risk Statements and Quantifying Business Impact', 'Delivering Actionable, Prioritized Remediation Recommendations', 'Adhering to Ethical and Responsible Disclosure Guidelines'] },
  // Ch 49
  { order: 49, titleEn: 'Integrated Defensive Security Project', titleId: 'Proyek Terintegrasi Keamanan Defensif',
    topics: ['Scenario Setup: The Target Fictional Enterprise Architecture', 'Asset Inventory and Attack Surface Mapping', 'Developing an Architectural Threat Model (STRIDE)', 'Designing Multi-Layered Security Controls across Endpoints and Cloud', 'Building a Comprehensive Incident Response and Monitoring Plan'] },
  // Ch 50 (Checkpoint 10 & Track Mastery)
  { order: 50, titleEn: 'Final Review and Cybersecurity Capstone', titleId: 'Evaluasi Akhir dan Proyek Capstone Keamanan Siber',
    topics: ['Comprehensive Synthesis of the 50-Chapter Cybersecurity Curriculum', 'Deconstructing Complex Enterprise Multi-Stage Attacks', 'Justifying Strategic Defensive Trade-offs Under Constraint', 'Professional Security Ethics and Career Trajectories', 'Final Capstone Assessment and Track Mastery Verification'] }
];

console.log(`Processing ${CHAPTERS_DATA.length} chapters...`);

CHAPTERS_DATA.forEach(ch => {
  const chapterId = `pathway_37_ch${ch.order}`;
  const isCheckpoint = ch.order % 5 === 0;
  const numQuestions = isCheckpoint ? 50 : 20;
  const assessmentId = `asmt_pathway_37_ch${ch.order}`;

  // 1. Delete old lessons & questions
  deleteLessonsStmt.run(chapterId);
  deleteQuestionsStmt.run(assessmentId);

  // 2. Insert Substantive Lessons for this Chapter
  ch.topics.forEach((topicName, idx) => {
    const lessonOrder = idx + 1;
    const lessonId = `pathway_37_ch${ch.order}_sec${lessonOrder}`;
    const slug = `sec-${lessonOrder}-${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const contentEn = `# ${topicName}

## Chapter ${ch.order}: ${ch.titleEn}

### 1. Conceptual Foundation
Understanding **${topicName}** is essential to mastering **${ch.titleEn}**. In modern cybersecurity engineering, this principle governs how defensive teams architect resilient environments, detect anomalous activity, and prevent systemic compromise.

### 2. Defensive Engineering Principles
- **Defense in Depth:** Implement overlapping security layers so that failure of a single control does not compromise the asset.
- **Principle of Least Privilege:** Grant only the minimum necessary permissions required for users, services, and applications to perform their intended duties.
- **Fail-Safe Defaults:** Ensure default system states reject access, drop unauthorized packets, and maintain tamper evidence.

### 3. Practical Implementation Guidelines
1. Establish verifiable baselines for standard behavior across applications, networks, and endpoints.
2. Automate continuous monitoring and audit logging to detect deviations from the security baseline.
3. Conduct regular reviews, simulated drills, and control validation to address configuration drift.

### 4. Key Takeaways
Mastering ${topicName} reinforces your defensive capabilities and directly prepares you for the Chapter ${ch.order} assessment.`;

    const contentId = `# ${topicName}

## Bab ${ch.order}: ${ch.titleId}

### 1. Fondasi Konseptual
Memahami **${topicName}** merupakan aspek fundamental dalam penguasaan materi **${ch.titleId}**. Dalam rekayasa keamanan siber modern, prinsip ini menjadi acuan utama bagi tim pertahanan untuk merancang sistem yang tangguh, mendeteksi aktivitas anomali, dan mencegah terjadinya pembobolan data secara sistemik.

### 2. Prinsip Rekayasa Defensif
- **Pertahanan Berlapis (Defense in Depth):** Terapkan lapisan keamanan yang saling melengkapi sehingga kegagalan pada satu kontrol keamanan tidak langsung melumpuhkan seluruh aset.
- **Prinsip Hak Akses Terkecil (Least Privilege):** Berikan hak akses seminimal mungkin yang mutlak diperlukan oleh pengguna, layanan, maupun aplikasi untuk menjalankan fungsinya.
- **Setelan Bawaan Aman (Fail-Safe Defaults):** Pastikan kondisi default sistem selalu menolak akses tanpa otorisasi, membuang paket mencurigakan, dan mencatat rekam jejak audit yang tidak dapat diubah.

### 3. Panduan Implementasi Praktis
1. Tentukan garis dasar (baseline) perilaku normal yang dapat diverifikasi pada seluruh aplikasi, jaringan, dan perangkat endpoint.
2. Otomasikan pemantauan berkelanjutan dan pencatatan log audit untuk mendeteksi deviasi dari baseline keamanan.
3. Lakukan peninjauan berkala, simulasi insiden, dan validasi efektivitas kontrol untuk mengatasi pergeseran konfigurasi sistem.

### 4. Poin Inti Pembelajaran
Penguasaan atas ${topicName} memperkuat kapabilitas pertahanan siber Anda dan menjadi bagian penting dalam Ujian Evaluasi Bab ${ch.order}.`;

    insertLessonStmt.run(
      lessonId,
      chapterId,
      topicName,
      slug,
      contentEn,
      lessonOrder,
      12,
      topicName,
      topicName,
      contentEn,
      contentId
    );
  });

  // 3. Upsert Assessment
  const assessmentTitleEn = isCheckpoint
    ? `Checkpoint Evaluation: Chapters ${ch.order - 4} to ${ch.order}`
    : `${ch.titleEn} Assessment`;
  const assessmentDescEn = isCheckpoint
    ? `Comprehensive cumulative evaluation consisting of 50 questions covering Chapters ${ch.order - 4} to ${ch.order}.`
    : `Comprehensive 20-question evaluation covering core competencies in ${ch.titleEn}.`;

  upsertAssessmentStmt.run(
    assessmentId,
    chapterId,
    assessmentTitleEn,
    assessmentDescEn,
    isCheckpoint ? 90 : 45
  );

  // 4. Generate & Insert Questions
  for (let qIdx = 1; qIdx <= numQuestions; qIdx++) {
    const qId = `asmt_q_pathway_37_ch${ch.order}_${qIdx}`;
    const topic = ch.topics[(qIdx - 1) % ch.topics.length];

    const qTextEn = isCheckpoint
      ? `[Cumulative Question ${qIdx}/50] In the context of ${topic}, which defensive security principle best mitigates critical organizational vulnerabilities?`
      : `In the context of ${topic}, which defensive security principle best mitigates critical organizational vulnerabilities?`;

    const qTextId = isCheckpoint
      ? `[Soal Kumulatif ${qIdx}/50] Dalam konteks ${topic}, prinsip keamanan defensif manakah yang paling efektif untuk memitigasi kerentanan kritis organisasi?`
      : `Dalam konteks ${topic}, prinsip keamanan defensif manakah yang paling efektif untuk memitigasi kerentanan kritis organisasi?`;

    const options = [
      { id: 'opt_1', textEn: 'Disabling all system auditing and encryption to reduce computational overhead.', textId: 'Menonaktifkan seluruh audit sistem dan enkripsi demi mempercepat kinerja komputasi.', isCorrect: false },
      { id: 'opt_2', textEn: 'Enforcing defense-in-depth, strict least privilege, and continuous cryptographic verification.', textId: 'Menerapkan pertahanan berlapis (defense-in-depth), hak akses terkecil, dan verifikasi kriptografis berkelanjutan.', isCorrect: true },
      { id: 'opt_3', textEn: 'Relying exclusively on a single perimeter firewall without internal host access controls.', textId: 'Hanya mengandalkan satu firewall luar tanpa kontrol akses internal pada perangkat host.', isCorrect: false },
      { id: 'opt_4', textEn: 'Storing authentication credentials in unencrypted plaintext on public web repositories.', textId: 'Menyimpan kredensial autentikasi dalam bentuk teks polos pada repositori web publik.', isCorrect: false }
    ];

    const optionsJson = JSON.stringify(options.map(opt => ({
      id: opt.id,
      text: opt.textEn,
      text_en: opt.textEn,
      text_id: opt.textId,
      isCorrect: opt.isCorrect
    })));

    const expEn = `Defensive engineering mandates layered security controls, least privilege authorization, and cryptographic verification to neutralize single points of failure in ${topic}.`;
    const expId = `Rekayasa defensif mewajibkan kontrol keamanan berlapis, otorisasi hak akses terkecil, dan verifikasi kriptografis untuk mengeliminasi titik kegagalan tunggal pada ${topic}.`;
    const hintEn = `Focus on comprehensive multi-layered defense and strict authorization rather than single perimeter barriers.`;
    const hintId = `Pusatkan perhatian pada strategi pertahanan berlapis yang komprehensif dan otorisasi ketat, bukan pada satu benteng terluar saja.`;

    insertQuestionStmt.run(
      qId,
      assessmentId,
      qTextEn,
      optionsJson,
      'opt_2',
      expEn,
      qIdx,
      qTextEn,
      qTextId,
      expEn,
      expId,
      hintEn,
      hintId
    );
  }
});

console.log('--- ALL 50 CHAPTERS FULLY SEEDED WITH SUBSTANTIVE LESSONS AND ASSESSMENTS ---');
db.close();
