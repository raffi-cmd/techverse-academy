const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- UPDATING CYBERSECURITY FUNDAMENTALS CURRICULUM ---');

const MODULES = [
  { order: 1, id: 'pathway_37_m1', en: 'Module 1: Orientation and Computer Foundations', id_name: 'Modul 1: Orientasi dan Fondasi Komputer' },
  { order: 2, id: 'pathway_37_m2', en: 'Module 2: Core Security Principles', id_name: 'Modul 2: Prinsip Inti Keamanan Siber' },
  { order: 3, id: 'pathway_37_m3', en: 'Module 3: Identity and Access Management', id_name: 'Modul 3: Manajemen Identitas dan Akses' },
  { order: 4, id: 'pathway_37_m4', en: 'Module 4: Cryptography and Data Protection', id_name: 'Modul 4: Kriptografi dan Perlindungan Data' },
  { order: 5, id: 'pathway_37_m5', en: 'Module 5: Endpoint and Network Security', id_name: 'Modul 5: Keamanan Endpoint dan Jaringan' },
  { order: 6, id: 'pathway_37_m6', en: 'Module 6: Application and Web Security', id_name: 'Modul 6: Keamanan Aplikasi dan Web' },
  { order: 7, id: 'pathway_37_m7', en: 'Module 7: Cloud and Infrastructure Security', id_name: 'Modul 7: Keamanan Cloud dan Infrastruktur' },
  { order: 8, id: 'pathway_37_m8', en: 'Module 8: Security Monitoring and Incident Response', id_name: 'Modul 8: Pemantauan Keamanan dan Respon Insiden' },
  { order: 9, id: 'pathway_37_m9', en: 'Module 9: Security Management and Advanced Defense', id_name: 'Modul 9: Manajemen Keamanan dan Pertahanan Lanjutan' },
  { order: 10, id: 'pathway_37_m10', en: 'Module 10: Professional Practice and Capstone', id_name: 'Modul 10: Praktik Profesional dan Proyek Capstone' }
];

const updateModuleStmt = db.prepare('UPDATE pathway_modules SET name = ? WHERE id = ?');
MODULES.forEach(m => {
  updateModuleStmt.run(m.en, m.id);
});
console.log('Updated 10 pathway modules.');

const CHAPTER_METADATA = [
  // Module 1
  { order: 1, moduleId: 'pathway_37_m1', en: 'Introduction to Cybersecurity', id: 'Pengantar Keamanan Siber',
    descEn: 'Understand the fundamental goals of cybersecurity, digital assets, common threats, and the vital role of security professionals in modern organizations.',
    descId: 'Memahami tujuan fundamental keamanan siber, aset digital, ancaman umum, dan peran vital profesional keamanan dalam organisasi modern.' },
  { order: 2, moduleId: 'pathway_37_m1', en: 'Computers, Operating Systems, and Digital Data', id: 'Komputer, Sistem Operasi, dan Data Digital',
    descEn: 'Explore computer architecture, operating system internals, processes, file system permissions, and how misconfigurations lead to vulnerabilities.',
    descId: 'Mempelajari arsitektur komputer, mekanisme sistem operasi, proses, izin sistem berkas, dan bagaimana kesalahan konfigurasi memicu kerentanan.' },
  { order: 3, moduleId: 'pathway_37_m1', en: 'How the Internet and Networks Work', id: 'Cara Kerja Internet dan Jaringan Komputer',
    descEn: 'Master networking fundamentals: IP addressing, switches, routers, DNS resolution, HTTP/HTTPS, and packet journeys across the web.',
    descId: 'Menguasai fondasi jaringan: pengalamatan IP, switch, router, resolusi DNS, HTTP/HTTPS, dan alur transmisi paket data di web.' },
  { order: 4, moduleId: 'pathway_37_m1', en: 'Linux, Windows, and Command-Line Fundamentals', id: 'Fondasi Command-Line Linux dan Windows',
    descEn: 'Navigate bash and PowerShell terminals, inspect running processes, configure safe file permissions, and understand privilege separation.',
    descId: 'Navigasi terminal bash dan PowerShell, inspeksi proses berjalan, pengaturan izin file yang aman, dan pemisahan hak istimewa pengguna.' },
  { order: 5, moduleId: 'pathway_37_m1', en: 'Cybersecurity Ethics, Safety, and Threat Awareness', id: 'Etika Keamanan Siber, Keselamatan, dan Kesadaran Ancaman',
    descEn: 'Learn ethical boundaries, authorized testing frameworks, legal ramifications, responsible disclosure workflows, and safe local labs.',
    descId: 'Mempelajari batasan etika, otorisasi pengujian keamanan, aspek legal, alur pelaporan bertanggung jawab, dan pembuatan lab lokal aman.' },

  // Module 2
  { order: 6, moduleId: 'pathway_37_m2', en: 'Security Goals and the CIA Triad', id: 'Tujuan Keamanan dan CIA Triad',
    descEn: 'Examine Confidentiality, Integrity, and Availability trade-offs, defensive guarantees, and real-world implementation balances.',
    descId: 'Menganalisis prinsip Kerahasiaan (Confidentiality), Integritas (Integrity), dan Ketersediaan (Availability) serta trade-off defensifnya.' },
  { order: 7, moduleId: 'pathway_37_m2', en: 'Assets, Threats, Vulnerabilities, and Risk', id: 'Aset, Ancaman, Kerentanan, dan Risiko',
    descEn: 'Map digital assets to potential threats, understand software flaws versus active exploits, and calculate qualitative and quantitative risk.',
    descId: 'Pemetaan aset digital terhadap ancaman potensial, memahami kerentanan versus eksploitasi aktif, serta kalkulasi risiko kualitatif dan kuantitatif.' },
  { order: 8, moduleId: 'pathway_37_m2', en: 'Threat Actors and Attack Surfaces', id: 'Pelaku Ancaman dan Bidang Serangan',
    descEn: 'Classify adversaries from opportunistic script kiddies to advanced persistent threats, map organizational attack surfaces, and minimize exposure.',
    descId: 'Klasifikasi pelaku ancaman, pemetaan luas bidang serangan (attack surface) perangkat lunak dan jaringan, serta strategi reduksi paparan.' },
  { order: 9, moduleId: 'pathway_37_m2', en: 'Social Engineering and Phishing Defense', id: 'Rekayasa Sosial dan Pertahanan Phishing',
    descEn: 'Analyze psychological manipulation vectors, spear phishing markers, credential harvesting sites, and organizational verification procedures.',
    descId: 'Analisis manipulasi psikologis manusia, indikator spear phishing, situs pencurian kredensial, dan prosedur verifikasi organisasi.' },
  { order: 10, moduleId: 'pathway_37_m2', en: 'Security Policies and Fundamental Controls', id: 'Kebijakan Keamanan dan Kontrol Fundamental',
    descEn: 'Design comprehensive security policies, standards, and procedures using administrative, physical, technical, and compensating control models.',
    descId: 'Perancangan kebijakan, standar, dan prosedur keamanan dengan kontrol administratif, teknis, fisik, preventif, detektif, dan korektif.' },

  // Module 3
  { order: 11, moduleId: 'pathway_37_m3', en: 'Authentication, Authorization, and Accounting', id: 'Autentikasi, Otorisasi, dan Akuntansi (AAA)',
    descEn: 'Distinguish identification, authentication, authorization, and accounting with concrete modern login flows and immutable audit logs.',
    descId: 'Membedakan identifikasi, autentikasi, otorisasi, dan akuntansi dengan alur login modern yang terisolasi dan pencatatan log audit.' },
  { order: 12, moduleId: 'pathway_37_m3', en: 'Password Security and Multi-Factor Authentication', id: 'Keamanan Kata Sandi dan Autentikasi Multi-Faktor',
    descEn: 'Implement entropy-dense passwords, password managers, TOTP, FIDO2/WebAuthn hardware tokens, passkeys, and secure account recovery.',
    descId: 'Penerapan kata sandi berkekuatan tinggi, password manager, TOTP, kunci perangkat keras FIDO2/WebAuthn, passkeys, dan pemulihan akun aman.' },
  { order: 13, moduleId: 'pathway_37_m3', en: 'Access Control Models', id: 'Model Kontrol Akses (RBAC & ABAC)',
    descEn: 'Implement principle of least privilege, Role-Based Access Control, Attribute-Based Access Control, separation of duties, and default-deny.',
    descId: 'Penerapan prinsip hak istimewa terkecil (least privilege), Role-Based Access Control, Attribute-Based Access Control, dan default-deny.' },
  { order: 14, moduleId: 'pathway_37_m3', en: 'Identity Federation and Secure Sessions', id: 'Federasi Identitas dan Manajemen Sesi Aman',
    descEn: 'Architect single sign-on (SSO), OAuth 2.0 authorization grants, OpenID Connect identity tokens, cookie security attributes, and session revocation.',
    descId: 'Arsitektur SSO, protokol otorisasi OAuth 2.0, token identitas OpenID Connect, atribut keamanan cookie, dan pembatalan sesi aktif.' },
  { order: 15, moduleId: 'pathway_37_m3', en: 'Privileged Access and Account Lifecycle', id: 'Akses Istimewa dan Siklus Hidup Akun',
    descEn: 'Manage privileged access workstations, Just-In-Time (JIT) elevation, Joiner-Mover-Leaver automation, and service account governance.',
    descId: 'Pengelolaan akun istimewa administrator, elevasi hak Just-In-Time (JIT), siklus Joiner-Mover-Leaver, dan tata kelola service account.' },

  // Module 4
  { order: 16, moduleId: 'pathway_37_m4', en: 'Cryptography Fundamentals', id: 'Fondasi Kriptografi',
    descEn: 'Discover symmetric and asymmetric algorithms, key spaces, entropy, mathematical foundations, and legitimate use cases versus limitations.',
    descId: 'Dasar algoritma simetris dan asimetris, ruang kunci, entropi data, fondasi matematis, serta kasus penggunaan dan batasan kriptografi.' },
  { order: 17, moduleId: 'pathway_37_m4', en: 'Hashing, Salting, and Password Storage', id: 'Hashing, Salting, dan Penyimpanan Kata Sandi',
    descEn: 'Understand cryptographic hash functions (SHA-256), cryptographic salt/pepper, and adaptive key derivation functions (Argon2id, bcrypt).',
    descId: 'Fungsi hash kriptografis (SHA-256), salt dan pepper, serta fungsi derivasi kunci adaptif (Argon2id, bcrypt) untuk penyimpanan kata sandi.' },
  { order: 18, moduleId: 'pathway_37_m4', en: 'Public-Key Cryptography and Digital Signatures', id: 'Kriptografi Kunci Publik dan Tanda Tangan Digital',
    descEn: 'Implement asymmetric key pairs (RSA/ECC), digital signature generation, verification, non-repudiation, and Public Key Infrastructure (PKI).',
    descId: 'Penerapan pasangan kunci asimetris (RSA/ECC), pembuatan tanda tangan digital, verifikasi integritas, non-repudiation, dan infrastruktur PKI.' },
  { order: 19, moduleId: 'pathway_37_m4', en: 'TLS, HTTPS, and Secure Communication', id: 'TLS, HTTPS, dan Komunikasi Jaringan Aman',
    descEn: 'Examine TLS 1.3 cryptographic handshakes, certificate authority chains of trust, forward secrecy, and certificate pinning concepts.',
    descId: 'Mekanisme TLS 1.3 handshake, rantai kepercayaan otoritas sertifikat (CA), forward secrecy, dan perlindungan komunikasi saat transit.' },
  { order: 20, moduleId: 'pathway_37_m4', en: 'Data Classification, Privacy, and Protection', id: 'Klasifikasi Data, Privasi, dan Perlindungan Informasi',
    descEn: 'Establish data classification tiers, data lifecycle policies, encryption-at-rest (AES-256), secure erasure, and privacy regulation compliance.',
    descId: 'Skema klasifikasi data, siklus hidup informasi, enkripsi data at-rest (AES-256), penghapusan aman, dan kepatuhan regulasi privasi.' },

  // Module 5
  { order: 21, moduleId: 'pathway_37_m5', en: 'Endpoint Security Fundamentals', id: 'Fondasi Keamanan Endpoint',
    descEn: 'Protect laptops, mobile devices, and servers through Endpoint Detection and Response (EDR), application whitelisting, and secure baselines.',
    descId: 'Perlindungan perangkat pengguna dan server melalui Endpoint Detection and Response (EDR), application allowlisting, dan baseline keamanan.' },
  { order: 22, moduleId: 'pathway_37_m5', en: 'Operating-System Hardening', id: 'Pengerasan Sistem Operasi (OS Hardening)',
    descEn: 'Harden Linux and Windows systems: disable unnecessary services, enforce kernel mitigations, configure host firewalls, and audit policies.',
    descId: 'Pengerasan sistem Linux dan Windows: penonaktifan layanan tidak perlu, mitigasi kernel, firewall host, dan audit konfigurasi berkala.' },
  { order: 23, moduleId: 'pathway_37_m5', en: 'Network Security Fundamentals', id: 'Fondasi Keamanan Jaringan dan Segmentasi',
    descEn: 'Design defense-in-depth networks with VLAN segmentation, stateful firewalls, demilitarized zones (DMZ), and deep packet inspection.',
    descId: 'Desain jaringan berlapis dengan segmentasi VLAN, stateful firewall, zona demiliterisasi (DMZ), dan inspeksi paket mendalam.' },
  { order: 24, moduleId: 'pathway_37_m5', en: 'DNS, Email, and Network Service Security', id: 'Keamanan DNS, Email, dan Layanan Jaringan',
    descEn: 'Implement DNSSEC, DoH/DoT, SPF, DKIM, and DMARC email authentication records, and secure remote management interfaces (SSH/Bastions).',
    descId: 'Implementasi DNSSEC, DoH, autentikasi email (SPF, DKIM, DMARC), dan pengamanan antarmuka manajemen jaringan jarak jauh (SSH/Bastion).' },
  { order: 25, moduleId: 'pathway_37_m5', en: 'Wireless, Remote Access, and Network Defense', id: 'Keamanan Nirkabel, VPN, dan Akses Jarak Jauh',
    descEn: 'Secure enterprise Wi-Fi (WPA3-Enterprise, 802.1X), guest networks, IPsec and WireGuard VPN tunnels, and zero trust remote gateways.',
    descId: 'Pengamanan Wi-Fi perusahaan (WPA3-Enterprise, 802.1X), jaringan tamu, tunnel VPN IPsec/WireGuard, dan gateway akses jarak jauh.' },

  // Module 6
  { order: 26, moduleId: 'pathway_37_m6', en: 'Secure Software Development Fundamentals', id: 'Fondasi Pengembangan Perangkat Lunak Aman (Secure SDLC)',
    descEn: 'Integrate security into every phase of the SDLC: threat modeling in design, SAST/DAST in CI/CD pipelines, and secure release gates.',
    descId: 'Integrasi keamanan dalam setiap fase SDLC: threat modeling pada perancangan, SAST/DAST pada pipeline CI/CD, dan validasi rilis aman.' },
  { order: 27, moduleId: 'pathway_37_m6', en: 'Web Applications and HTTP Security', id: 'Aplikasi Web dan Keamanan Protokol HTTP',
    descEn: 'Inspect HTTP request/response flows, configure security headers (CSP, HSTS, X-Frame-Options), and enforce secure cookie flags.',
    descId: 'Inspeksi alur HTTP request/response, konfigurasi security headers (CSP, HSTS, X-Frame-Options), dan flag cookie aman.' },
  { order: 28, moduleId: 'pathway_37_m6', en: 'Common Web Vulnerabilities and Their Prevention', id: 'Kerentanan Web Umum dan Strategi Pencegahannya',
    descEn: 'Understand OWASP Top 10 vulnerabilities: SQLi, XSS, CSRF, IDOR, SSRF, and their architectural parameterization and validation defenses.',
    descId: 'Memahami OWASP Top 10: SQLi, XSS, CSRF, IDOR, SSRF, serta strategi defensif menggunakan kueri terparameterisasi dan validasi input.' },
  { order: 29, moduleId: 'pathway_37_m6', en: 'API Security', id: 'Keamanan Antarmuka Pemrograman Aplikasi (API Security)',
    descEn: 'Defend REST and GraphQL endpoints against Broken Object Level Authorization (BOLA), rate-limiting bypass, token leakage, and mass assignment.',
    descId: 'Pertahanan endpoint REST dan GraphQL terhadap Broken Object Level Authorization (BOLA), pembatasan laju (rate limiting), dan kebocoran token.' },
  { order: 30, moduleId: 'pathway_37_m6', en: 'Secure Coding and Dependency Management', id: 'Penulisan Kode Aman dan Manajemen Dependensi',
    descEn: 'Prevent software supply chain attacks through Software Bill of Materials (SBOM), dependency vulnerability scanning, lockfiles, and secret hygiene.',
    descId: 'Mencegah serangan rantai pasok perangkat lunak melalui Software Bill of Materials (SBOM), pemindaian dependensi, lockfiles, dan manajemen rahasia.' },

  // Module 7
  { order: 31, moduleId: 'pathway_37_m7', en: 'Cloud Computing and Shared Responsibility', id: 'Komputasi Awan dan Model Tanggung Jawab Bersama',
    descEn: 'Delineate provider versus tenant security obligations across IaaS, PaaS, and SaaS, cloud identity perimeters, and regulatory residency.',
    descId: 'Pemisahan tanggung jawab penyedia vs pengguna pada model IaaS, PaaS, dan SaaS, perimeter identitas cloud, dan kepatuhan residensi data.' },
  { order: 32, moduleId: 'pathway_37_m7', en: 'Cloud Identity and Configuration Security', id: 'Manajemen Identitas dan Keamanan Konfigurasi Cloud',
    descEn: 'Configure Cloud IAM least privilege, detect public storage bucket exposure, enforce MFA on root accounts, and audit CloudTrail/Activity logs.',
    descId: 'Konfigurasi Cloud IAM least privilege, pencegahan paparan publik storage bucket, penegakan MFA akun root, dan audit log cloud terpusat.' },
  { order: 33, moduleId: 'pathway_37_m7', en: 'Containers and Infrastructure Security', id: 'Keamanan Kontainer dan Infrastruktur sebagai Kode',
    descEn: 'Harden Docker and Kubernetes clusters: non-root users, minimal base images, container image vulnerability scanning, and secure Terraform policies.',
    descId: 'Pengerasan kontainer Docker dan kluster Kubernetes: pengguna non-root, base image minimal, pemindaian kerentanan image, dan scan kode IaC.' },
  { order: 34, moduleId: 'pathway_37_m7', en: 'Vulnerability and Patch Management', id: 'Manajemen Kerentanan dan Pembaruan Sistem (Patching)',
    descEn: 'Establish vulnerability management lifecycles: CVSS severity scoring, vulnerability scanning, patch prioritization, and rollback contingency.',
    descId: 'Siklus hidup manajemen kerentanan: skoring keparahan CVSS, pemindaian kerentanan aset, prioritas patching, dan rencana mitigasi rollback.' },
  { order: 35, moduleId: 'pathway_37_m7', en: 'Backup, Recovery, and Business Continuity', id: 'Pencadangan, Pemulihan, dan Kelangsungan Bisnis',
    descEn: 'Formulate 3-2-1 backup strategies, immutable off-site backups, RTO/RPO metrics, disaster recovery orchestration, and ransomware resilience.',
    descId: 'Perumusan strategi cadangan 3-2-1, backup immutable terisolasi, perhitungan target RTO/RPO, orkestrasi pemulihan bencana, dan ketahanan ransomware.' },

  // Module 8
  { order: 36, moduleId: 'pathway_37_m8', en: 'Security Logs and Monitoring Fundamentals', id: 'Fondasi Log Keamanan dan Pemantauan Sistem',
    descEn: 'Collect, format (JSON/CEF), centralize, and synchronize (NTP) authentication, operating system, network, and application security logs.',
    descId: 'Pengumpulan, standarisasi format, sentralisasi, dan sinkronisasi waktu (NTP) log autentikasi, sistem operasi, jaringan, dan aplikasi.' },
  { order: 37, moduleId: 'pathway_37_m8', en: 'Security Information and Event Management', id: 'Manajemen Informasi dan Peristiwa Keamanan (SIEM)',
    descEn: 'Architect SIEM log pipelines, event normalization, correlation rules, false-positive reduction, and alert prioritization in a defensive SOC.',
    descId: 'Arsitektur pipeline SIEM, normalisasi log peristiwa, aturan korelasi, pengurangan false positive, dan prioritas peringatan dalam SOC.' },
  { order: 38, moduleId: 'pathway_37_m8', en: 'Threat Detection and Defensive Analysis', id: 'Deteksi Ancaman dan Analisis Defensif',
    descEn: 'Apply MITRE ATT&CK techniques, establish network/user behavioral baselines, analyze anomalous lateral movement, and triage alerts.',
    descId: 'Penerapan matriks MITRE ATT&CK, penentuan baseline perilaku normal sistem dan jaringan, deteksi pergerakan lateral, dan triase peringatan.' },
  { order: 39, moduleId: 'pathway_37_m8', en: 'Incident Response Fundamentals', id: 'Fondasi Tanggap Insiden Keamanan (Incident Response)',
    descEn: 'Execute the NIST/SANS 6-phase incident response cycle: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.',
    descId: 'Eksekusi siklus 6 fase tanggap insiden (NIST/SANS): Persiapan, Identifikasi, Pengisolasian (Containment), Eradikasi, Pemulihan, dan Evaluasi.' },
  { order: 40, moduleId: 'pathway_37_m8', en: 'Digital Forensics and Evidence Handling', id: 'Forensik Digital dan Penanganan Bukti Digital',
    descEn: 'Preserve digital evidence integrity, maintain strict legal chain of custody, perform volatile RAM acquisition, and construct forensic timelines.',
    descId: 'Penjagaan integritas bukti digital, pemeliharaan rantai pengawasan (chain of custody), akuisisi memori RAM volatil, dan rekonstruksi timeline forensik.' },

  // Module 9
  { order: 41, moduleId: 'pathway_37_m9', en: 'Security Governance and Compliance', id: 'Tata Kelola Keamanan dan Kepatuhan Regulasi',
    descEn: 'Align technical controls with governance standards (ISO/IEC 27001, SOC 2, HIPAA, GDPR), audit readiness, and measurable security KPIs.',
    descId: 'Penyelarasan kontrol teknis dengan standar tata kelola (ISO/IEC 27001, SOC 2, UU PDP/GDPR), kesiapan audit, dan metrik KPI keamanan.' },
  { order: 42, moduleId: 'pathway_37_m9', en: 'Security Frameworks and Risk Management', id: 'Kerangka Kerja Keamanan (NIST CSF) dan Manajemen Risiko',
    descEn: 'Operate the NIST Cybersecurity Framework 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), risk registers, and residual risk treatment.',
    descId: 'Penerapan kerangka NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), penyusunan risk register, dan mitigasi risiko sisa.' },
  { order: 43, moduleId: 'pathway_37_m9', en: 'Threat Intelligence and Security Awareness', id: 'Intelijen Ancaman (Threat Intelligence) dan Edukasi Keamanan',
    descEn: 'Consume strategic, operational, and tactical threat intelligence, ingest Indicators of Compromise (IoCs), and foster organizational security culture.',
    descId: 'Pemanfaatan intelijen ancaman strategis dan taktis, konsumsi indikator kompromi (IoC/STIX/TAXII), dan pembangunan budaya sadar keamanan.' },
  { order: 44, moduleId: 'pathway_37_m9', en: 'Zero Trust and Defense in Depth', id: 'Arsitektur Zero Trust dan Pertahanan Berlapis (Defense in Depth)',
    descEn: 'Architect Zero Trust architectures ("Never trust, always verify"), micro-segmentation, continuous authentication, and overlapping security layers.',
    descId: 'Perancangan arsitektur Zero Trust ("Jangan percaya, selalu verifikasi"), mikrosegmentasi, autentikasi kontinu, dan lapisan pertahanan bertingkat.' },
  { order: 45, moduleId: 'pathway_37_m9', en: 'Security Architecture and Threat Modeling', id: 'Arsitektur Keamanan dan Pemodelan Ancaman (Threat Modeling)',
    descEn: 'Conduct threat modeling using STRIDE and PASTA, map trust boundaries and data flow diagrams (DFDs), and validate architectural assumptions.',
    descId: 'Pemodelan ancaman menggunakan metodologi STRIDE dan PASTA, pemetaan batas kepercayaan (trust boundaries), dan validasi arsitektur sistem.' },

  // Module 10
  { order: 46, moduleId: 'pathway_37_m10', en: 'Security Testing and Validation', id: 'Pengujian dan Validasi Keamanan Defensif',
    descEn: 'Perform authorized vulnerability assessments, configuration auditing, breach and attack simulations, and defensive control efficacy verification.',
    descId: 'Pelaksanaan asesmen kerentanan terotorisasi, audit konfigurasi sistem, simulasi pertahanan serangan, dan verifikasi efikasi kontrol defensif.' },
  { order: 47, moduleId: 'pathway_37_m10', en: 'Security Automation and Defensive Tooling', id: 'Otomasi Keamanan dan Alat Bantu Defensif',
    descEn: 'Build defensive automation scripts, automate log ingestion and IP blocklisting, and integrate security orchestration (SOAR) workflows safely.',
    descId: 'Pembuatan skrip otomasi defensif, otomasi pemblokiran IP mencurigakan, dan integrasi alur kerja orkestrasi keamanan (SOAR) secara aman.' },
  { order: 48, moduleId: 'pathway_37_m10', en: 'Security Documentation and Professional Reporting', id: 'Dokumentasi Keamanan dan Pelaporan Profesional',
    descEn: 'Write technical finding reports, executive risk summaries, actionable remediation roadmaps, and adhere to responsible vulnerability disclosure.',
    descId: 'Penulisan laporan teknis temuan keamanan, ringkasan eksekutif risiko, peta jalan perbaikan sistem, dan etika pelaporan kerentanan profesional.' },
  { order: 49, moduleId: 'pathway_37_m10', en: 'Integrated Defensive Security Project', id: 'Proyek Terintegrasi Keamanan Defensif',
    descEn: 'Design an end-to-end defensive architecture for a fictional enterprise: asset inventory, threat model, control baseline, SIEM, and IR playbook.',
    descId: 'Rancang arsitektur keamanan lengkap untuk organisasi fiktif: inventarisasi aset, threat model, kontrol baseline, sistem SIEM, dan playbook IR.' },
  { order: 50, moduleId: 'pathway_37_m10', en: 'Final Review and Cybersecurity Capstone', id: 'Evaluasi Akhir dan Proyek Capstone Keamanan Siber',
    descEn: 'Synthesize across all 9 prior modules, resolve a complex enterprise security breach scenario, justify defensive trade-offs, and complete the track.',
    descId: 'Sintesis komprehensif seluruh modul kurikulum, evaluasi skenario insiden keamanan skala enterprise, pertanggungjawaban solusi defensif, dan penutupan jalur.' }
];

const updateChapterStmt = db.prepare(`
  UPDATE chapters
  SET title = ?,
      title_id = ?,
      title_en = ?,
      description = ?,
      description_id = ?,
      description_en = ?,
      module_id = ?,
      difficulty_level = ?,
      curriculum_version = '2.0.0'
  WHERE pathway_id = 'pathway_37' AND sort_order = ?
`);

CHAPTER_METADATA.forEach(c => {
  const diff = c.order <= 15 ? 'beginner' : c.order <= 35 ? 'intermediate' : 'advanced';
  updateChapterStmt.run(
    c.en,
    c.id,
    c.en,
    c.descEn,
    c.descId,
    c.descEn,
    c.moduleId,
    diff,
    c.order
  );
});

console.log('Successfully updated all 50 Cybersecurity Fundamentals chapters metadata in SQLite.');
