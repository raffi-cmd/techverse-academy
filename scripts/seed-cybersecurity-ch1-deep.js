const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- SEEDING DEEP SUBSTANTIVE 20 SECTIONS FOR CHAPTER 01 ---');

const chapterId = 'pathway_37_ch1';

// Update chapter title and description
const chTitleEn = 'Introduction to Cybersecurity and Security Foundations';
const chTitleId = 'Pengantar Keamanan Siber dan Fondasi Keamanan';
const chDescEn = 'Master the foundational principles of cybersecurity: the CIA triad, threat models, digital assets, defense in depth, and professional ethical boundaries.';
const chDescId = 'Menguasai prinsip dasar keamanan siber: CIA triad, model ancaman, aset digital, pertahanan berlapis, dan batasan etika profesional.';

db.prepare(`
  UPDATE chapters
  SET title = ?,
      title_en = ?,
      title_id = ?,
      description = ?,
      description_en = ?,
      description_id = ?,
      curriculum_version = '2.1.0'
  WHERE id = ?
`).run(chTitleEn, chTitleEn, chTitleId, chDescEn, chDescEn, chDescId, chapterId);

// Delete existing lessons for Chapter 01
db.prepare('DELETE FROM lessons WHERE chapter_id = ?').run(chapterId);

const insertLesson = db.prepare(`
  INSERT INTO lessons (
    id, chapter_id, title, slug, content, content_type, sort_order, estimated_time, is_required, status,
    title_en, title_id, content_en, content_id
  ) VALUES (?, ?, ?, ?, ?, 'markdown', ?, ?, 1, 'published', ?, ?, ?, ?)
`);

// The 20 Deep Substantive Sections
const SECTIONS = [
  // 1. Chapter Overview
  {
    order: 1,
    titleEn: 'Chapter Overview',
    titleId: 'Gambaran Umum Bab',
    slug: 'sec-1-chapter-overview',
    time: 10,
    contentEn: `# Chapter Overview: Introduction to Cybersecurity and Security Foundations

Welcome to Chapter 1 of the **DEVORA Cybersecurity Fundamentals** pathway. This foundational chapter equips you with the indispensable mental models, vocabulary, and principles required to defend modern computing environments against hostile interference.

### Purpose of This Chapter
Rather than treating cybersecurity as a disconnected set of tools or isolated commands, this chapter grounds you in the systemic nature of digital defense. You will explore how data, people, software, and hardware interact to form attack surfaces, and why security is fundamentally a discipline of risk management under resource constraints.

### Core Learning Objectives
By completing this chapter, you will be able to:
1. Define cybersecurity accurately and distinguish it from general information security, privacy, and safety.
2. Articulate the primary objectives of the CIA Triad (Confidentiality, Integrity, and Availability) and identify industry failures for each pillar.
3. Categorize digital assets according to business criticality and potential breach impact.
4. Distinguish between threats, vulnerabilities, exploits, and business risks.
5. Classify common threat actors by capability, motivation, and operational tactics.
6. Apply foundational defensive paradigms: Defense in Depth, Principle of Least Privilege, and Security by Design.
7. Navigate legal, ethical, and authorization boundaries when conducting defensive assessments.

### How to Approach This Material
Each of the 20 sections in this chapter builds sequentially upon the preceding concepts. Read through the technical walkthroughs, examine the defensive case studies, and complete the guided exercises before attempting the 20-question Chapter Assessment.`,

    contentId: `# Gambaran Umum Bab: Pengantar Keamanan Siber dan Fondasi Keamanan

Selamat datang di Bab 1 dari jalur kurikulum **DEVORA Cybersecurity Fundamentals**. Bab fondasi ini dirancang untuk membekali Anda dengan pola pikir sistemik, terminologi baku, dan prinsip-prinsip mutlak yang dibutuhkan dalam melindungi lingkungan komputasi modern dari ancaman digital.

### Tujuan Pembelajaran Bab Ini
Alih-alih melihat keamanan siber sekadar sebagai kumpulan perangkat lunak antivirus atau perintah terminal terisolasi, bab ini menanamkan pemahaman bahwa pertahanan siber adalah arsitektur terpadu. Anda akan mempelajari interaksi antara data, manusia, aplikasi, dan perangkat keras yang membentuk bidang serangan (*attack surface*), serta memahami mengapa keamanan siber pada hakikatnya adalah disiplin manajemen risiko yang terukur.

### Target Kompetensi Utama
Setelah menyelesaikan bab ini, Anda akan mampu:
1. Mendefinisikan keamanan siber secara tepat serta membedakannya dari keamanan informasi, privasi data, dan keselamatan operasional.
2. Menjelaskan pilar utama CIA Triad (Kerahasiaan, Integritas, dan Ketersediaan) beserta studi kasus kegagalannya di industri nyata.
3. Mengklasifikasikan aset digital organisasi berdasarkan tingkat kekritisan dan dampak kerugian jika mengalami kebocoran.
4. Membedakan secara akurat antara ancaman (*threat*), kerentanan (*vulnerability*), eksploitasi (*exploit*), dan risiko (*risk*).
5. Mengidentifikasi profil pelaku serangan siber berdasarkan kapabilitas teknis, motivasi, dan taktik operasinya.
6. Menerapkan paradigma defensif fundamental: Pertahanan Berlapis (*Defense in Depth*), Hak Akses Terkecil (*Least Privilege*), dan *Security by Design*.
7. Mematuhi batasan etika dan hukum yang sah dalam pelaksanaan pengujian keamanan siber.

### Panduan Belajar
Seluruh 20 bagian dalam bab ini disusun secara bertahap dan berkesinambungan. Pelajari setiap penjelasan konseptual, amati studi kasus terpandu, dan selesaikan latihan mandiri sebelum mengikuti Ujian Evaluasi 20 Soal di akhir bab.`
  },

  // 2. What Is Cybersecurity?
  {
    order: 2,
    titleEn: 'What Is Cybersecurity?',
    titleId: 'Apa Itu Keamanan Siber?',
    slug: 'sec-2-what-is-cybersecurity',
    time: 12,
    contentEn: `# What Is Cybersecurity?

### Definition
**Cybersecurity** is the comprehensive discipline, engineering practice, and operational methodology dedicated to safeguarding computing systems, communications networks, digital hardware, software programs, and stored data from unauthorized access, malicious modification, disruption, destruction, or exfiltration.

### How Cybersecurity Works
Cybersecurity operates through an integrated synergy of three core elements:
1. **People:** Trained employees, ethical system administrators, and security analysts who adhere to strict operational protocols and exercise vigilance against deception.
2. **Processes:** Formally documented policies, risk management frameworks, incident response playbooks, and compliance standards governing how data is handled.
3. **Technology:** Cryptographic algorithms, firewalls, endpoint detection and response (EDR) agents, intrusion prevention systems, and automated patch management tooling.

### Why Cybersecurity Matters
Modern civil infrastructure—including clean water facilities, electrical grids, hospitals, and national central banking systems—is controlled by networked digital processors. Without robust cybersecurity safeguards, a single digital exploit can lead to financial catastrophe, public chaos, and direct threats to human life.

### Real-World Example
In 2021, a single compromised credential granted attackers access to the billing networks of the Colonial Pipeline in the United States. Although the operational pipeline control network was not directly infected, the organization shut down 5,500 miles of fuel delivery conduits for six days due to the inability to safely bill customers and monitor delivery telemetry, leading to widespread fuel shortages across the East Coast.

### Common Misconceptions
- **"Cybersecurity is solely the IT support department's job":** Security is an organization-wide governance obligation requiring executive resource allocation, secure software development practices, and employee adherence.
- **"Small businesses and individuals are too unimportant to be targeted":** The vast majority of cyber attacks are automated bots scanning IP ranges indiscriminately for known unpatched vulnerabilities. Every internet-connected machine is a potential target.

### Limitations and Operational Realities
Cybersecurity cannot guarantee "100% absolute invulnerability." New software vulnerabilities are discovered daily, and computing architectures are extraordinarily complex. The practical objective of cybersecurity is **risk minimization and operational resilience**—ensuring systems can absorb attacks, limit lateral spread, and recover rapidly without catastrophic loss.`,

    contentId: `# Apa Itu Keamanan Siber?

### Definisi
**Keamanan siber (*cybersecurity*)** adalah disiplin rekayasa, praktik operasional, dan tata kelola sistemik yang didedikasikan untuk melindungi sistem komputasi, jaringan komunikasi, perangkat keras, aplikasi perangkat lunak, dan data digital dari akses tidak sah, modifikasi ilegal, gangguan, perusakan, atau pencurian data.

### Cara Kerja Keamanan Siber
Keamanan siber beroperasi melalui perpaduan tiga elemen utama yang saling menopang:
1. **Manusia (People):** Pengguna yang terlatih, administrator sistem yang beretika, dan analis keamanan yang mematuhi protokol operasional serta waspada terhadap manipulasi psikologis.
2. **Proses (Processes):** Kebijakan tertulis, kerangka kerja manajemen risiko, rencana tanggap insiden (*incident response playbook*), dan prosedur operasional standar penanganan data.
3. **Teknologi (Technology):** Algoritma enkripsi kriptografis, firewall jaringan, sistem pemantauan endpoint (EDR), sistem deteksi intrusi, dan perangkat manajemen pembaruan otomatis.

### Mengapa Konsep Ini Penting
Seluruh sendi kehidupan masyarakat modern—mulai dari sistem perbankan sentral, jaringan transmisi listrik nasional, instalasi pengolahan air bersih, hingga rekam medis rumah sakit—dikendalikan oleh sistem digital terhubung. Kegagalan pertahanan siber pada sistem-sistem tersebut dapat memicu kerugian finansial masif, kekacauan logistik publik, hingga ancaman langsung terhadap keselamatan jiwa.

### Contoh Kasus Nyata
Pada tahun 2021, sebuah akun VPN lama yang tidak dilindungi autentikasi dua faktor berhasil disusupi peretas pada jaringan Colonial Pipeline di Amerika Serikat. Meskipun sistem fisik pipa tidak mengalami kerusakan, manajemen terpaksa menghentikan pasokan bahan bakar sepanjang 5.500 mil selama enam hari karena sistem penagihan dan pemantauannya disandera ransomware, memicu kepanikan dan kelangkaan bahan bakar di berbagai negara bagian.

### Kesalahan Pemahaman Umum
- **"Keamanan siber hanyalah tugas tim teknis IT semata":** Keamanan adalah tanggung jawab seluruh pimpinan dan staf organisasi. Kebocoran data paling sering berawal dari kelalaian pengguna atau kebijakan perusahaan yang lemah.
- **"Organisasi kecil tidak akan menjadi incaran peretas":** Mayoritas penyerangan di internet dijalankan oleh bot pemindai otomatis yang memindai jutaan alamat IP secara acak untuk mencari celah yang belum ditambal. Setiap komputer yang terhubung ke internet adalah target potensial.

### Keterbatasan dan Realitas Operasional
Keamanan siber tidak pernah menjanjikan "keamanan mutlak 100% tanpa celah". Target realistis dari rekayasa keamanan siber adalah **meminimalkan risiko dan membangun ketahanan operasional (*resilience*)**—yaitu memastikan sistem mampu menahan benturan, mengisolasi titik kompromi, dan memulihkan operasi secara cepat tanpa kehilangan data kritis.`
  },

  // 3. Why Cybersecurity Matters
  {
    order: 3,
    titleEn: 'Why Cybersecurity Matters',
    titleId: 'Mengapa Keamanan Siber Sangat Penting',
    slug: 'sec-3-why-cybersecurity-matters',
    time: 12,
    contentEn: `# Why Cybersecurity Matters

### The Interconnected Threat Landscape
Digital connectivity provides immense economic efficiency, but it simultaneously expands organizational risk. In this section, we examine the systemic consequences of security failures across four distinct dimensions: economic, operational, reputational, and national stability.

### 1. Financial and Economic Solvency
The costs of a cybersecurity breach compound rapidly across multiple fronts:
- **Direct Asset Theft:** Direct theft of operational capital, cryptocurrency, or fraudulent wire transfers.
- **Extortion Payments:** Ransom demands to obtain decryption keys or prevent public leaks of sensitive records.
- **Legal and Regulatory Liabilities:** Data protection regulations (such as GDPR, CCPA, and Indonesia's UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi / UU PDP) mandate fines of up to millions of dollars for negligent stewardship of personal information.
- **Forensic and Remediation Overhead:** Retaining independent incident response firms, legal counsel, credit monitoring services for victims, and deploying emergency hardware upgrades.

### 2. Operational Continuity
Modern enterprises rely on just-in-time logistics and continuous software availability. When ransomware encrypts production databases, manufacturing plants halt, supply chains freeze, and emergency rooms are forced to divert ambulances because electronic medical records cannot be accessed.

### 3. Preserving Public and Consumer Trust
Trust is fragile in the digital economy. A single public data leak exposing user passwords, government identification numbers, or medical diagnostics permanently damages customer confidence, leading to massive user churn and plummeting brand valuation.

### 4. National Security and Democratic Sovereignty
Cyber warfare and state-sponsored espionage target power generation stations, air traffic control towers, military command networks, and electoral voter registries. Defensive cybersecurity is an indispensable component of national defense in the 21st century.`,

    contentId: `# Mengapa Keamanan Siber Sangat Penting

### Lanskap Ancaman yang Saling Terhubung
Konektivitas digital memberikan efisiensi luar biasa bagi perekonomian modern, namun pada saat yang sama memperluas paparan risiko organisasi secara drastis. Bagian ini membedah konsekuensi sistemik dari kegagalan keamanan pada empat dimensi utama: finansial, operasional, reputasi, dan kedaulatan nasional.

### 1. Kelangsungan Finansial dan Ekonomi
Dampak finansial dari insiden pembobolan siber berlipat ganda melalui berbagai lini:
- **Pencurian Dana Langsung:** Penipuan transfer kawat, pembobolan akun perbankan korporat, atau pengurasan dompet digital.
- **Pemerasan Ransomware:** Permintaan tebusan bernilai miliaran rupiah untuk membuka kunci data atau mencegah publikasi data rahasia.
- **Sanksi Regulasi dan Denda Hukum:** Regulasi perlindungan data (seperti UU PDP di Indonesia atau GDPR di Uni Eropa) menjatuhkan sanksi administratif dan denda hingga persentase pendapatan tahunan bagi lembaga yang lalai melindungi data pribadi masyarakat.
- **Biaya Investigasi dan Pemulihan:** Biaya konsultan forensik independen, jasa pengacara litigasi, layanan komunikasi krisis, serta biaya audit ulang infrastruktur secara menyeluruh.

### 2. Kelangsungan Operasional Bisnis
Bisnis modern mengandalkan ketersediaan sistem secara tanpa henti (*24/7*). Ketika basis data operasional terenkripsi oleh ransomware, rantai pasok logistik terputus seketika, pabrik manufaktur berhenti berproduksi, dan instalasi gawat darurat rumah sakit terpaksa menolak pasien karena data rekam medis elektronik tidak dapat diakses.

### 3. Kepercayaan Pengguna dan Reputasi Lembaga
Kepercayaan adalah fondasi utama dari transaksi digital. Sekali sebuah platform mengalami kebocoran data yang mengekspos kata sandi, NIK, atau riwayat transaksi pengguna ke forum pasar gelap, kredibilitas platform tersebut akan runtuh seketika dan sangat sulit dipulihkan kembali.

### 4. Kedaulatan dan Ketahanan Nasional
Operasi spionase siber antar-negara secara aktif menargetkan infrastruktur vital seperti pembangkit listrik, sistem perutean lalu lintas penerbangan, jaringan komunikasi militer, dan basis data kependudukan. Pertahanan siber yang tangguh adalah garda terdepan penjaga kedaulatan bangsa di era peperangan asimetris modern.`
  },

  // 4. The Difference Between Security, Privacy, and Safety
  {
    order: 4,
    titleEn: 'The Difference Between Security, Privacy, and Safety',
    titleId: 'Perbedaan Keamanan, Privasi, dan Keselamatan',
    slug: 'sec-4-security-privacy-safety',
    time: 12,
    contentEn: `# The Difference Between Security, Privacy, and Safety

Although often conflated in general discussions, **Security**, **Privacy**, and **Safety** represent distinct engineering and legal domains. Defensive cybersecurity practitioners must understand their exact boundaries.

### Comparative Framework

| Domain | Core Question | Primary Focus | Example Failure |
|---|---|---|---|
| **Security** | *Are digital systems protected from unauthorized access, disruption, and tampering?* | Technical and administrative controls, cryptography, access controls, firewalls, and defense against adversaries. | An external hacker breaches a hospital database using an SQL injection exploit and dumps patient records onto a dark web forum. |
| **Privacy** | *Are personal data rights, consent, and user preferences legally respected and enforced?* | Governance policies, data minimization, consent management, regulatory compliance (GDPR/UU PDP), and lawful data usage. | A social media app lawfully collects user location data with permission, but then secretly sells that tracking data to third-party advertisers without user consent. (Security remained intact, but Privacy was violated). |
| **Safety** | *Are human beings, physical environments, and physical assets protected from bodily harm or death?* | Physical fail-safes, environmental sensors, operational technology (OT) interlocks, and emergency stop mechanisms. | A cyber attack tampers with the cooling valves of a chemical manufacturing reactor, causing pressure to spike and triggering a physical explosion. (A security breach escalated into a catastrophic Safety disaster). |

### The Interplay Between the Three
- **Security is the enabler:** You cannot guarantee privacy or digital safety without robust underlying security controls. If an unauthorized attacker breaches a system, all privacy guarantees collapse.
- **Privacy requires governance:** A system can be technically 100% secure against hackers, yet still violate privacy if its owners abuse their authorized access to exploit user information.
- **Safety is the ultimate consequence:** As digital processors become embedded into self-driving vehicles, medical pacemakers, and power grids, cybersecurity failures directly intersect with physical human safety.`,

    contentId: `# Perbedaan Keamanan, Privasi, dan Keselamatan

Dalam wacana teknologi informasi, istilah **Keamanan (Security)**, **Privasi (Privacy)**, dan **Keselamatan (Safety)** sering kali tertukar. Namun dalam rekayasa sistem profesional, ketiganya memiliki batasan hukum dan teknis yang sangat berbeda.

### Tabel Perbandingan Komprehensif

| Dimensi | Pertanyaan Mendasar | Fokus Utama | Contoh Kasus Kegagalan |
|---|---|---|---|
| **Keamanan (*Security*)** | *Apakah sistem terlindungi dari akses ilegal, manipulasi, dan perusakan oleh pihak luar?* | Kontrol teknis dan administratif: enkripsi, firewall, autentikasi, serta pencegahan serangan peretas. | Peretas membobol basis data rumah sakit menggunakan celah SQL Injection dan membocorkan data rekam medis ke forum underground. |
| **Privasi (*Privacy*)** | *Apakah hak kepemilikan data pribadi dan persetujuan pengguna dihormati secara sah?* | Tata kelola data, persetujuan pengguna (*consent*), pembatasan penggunaan data, dan kepatuhan terhadap UU PDP / GDPR. | Aplikasi media sosial secara resmi menyimpan data lokasi pengguna dengan aman dari peretas, namun diam-diam menjual data riwayat perjalanan tersebut ke biro iklan tanpa izin pengguna. (Keamanan terjaga, namun Privasi dilanggar). |
| **Keselamatan (*Safety*)** | *Apakah manusia dan lingkungan fisik terlindungi dari bahaya cedera fisik atau kematian?* | Pengendali fisik, sensor lingkungan, sistem interlock darurat, dan keandalan perangkat keras industri. | Serangan siber mengubah batas tekanan katup pada reaktor kimia pabrik hingga terjadi ledakan fisik yang melukai pekerja. (Insiden keamanan meningkat menjadi bencana Keselamatan jiwa). |

### Hubungan Timbal Balik
- **Keamanan adalah prasyarat mutlak privasi:** Anda tidak dapat menjamin privasi pengguna jika server yang menyimpan data tersebut mudah dibobol oleh peretas dari luar.
- **Privasi menuntut etika dan kepatuhan:** Sistem yang terenkripsi sempurna dan tidak bisa ditembus peretas tetap bisa melanggar privasi apabila pemilik platform menyalahgunakan data pengguna untuk tujuan ilegal.
- **Keselamatan adalah dampak tertinggi:** Di era kendaraan otonom, drone medis, dan jaringan listrik pintar, kegagalan rekayasa keamanan siber dapat langsung berujung pada hilangnya nyawa manusia.`
  },

  // 5. Core Cybersecurity Terminology
  {
    order: 5,
    titleEn: 'Core Cybersecurity Terminology',
    titleId: 'Glosarium Terminologi Inti Keamanan Siber',
    slug: 'sec-5-core-cybersecurity-terminology',
    time: 12,
    contentEn: `# Core Cybersecurity Terminology

A shared, precise vocabulary is essential for effective security engineering and incident triage. Misusing terms can lead to incorrect risk assessments and delayed incident response.

### 1. Asset
Any hardware, software, network component, database, intellectual property, or human role that possesses intrinsic or operational value to an organization and must be defended.

### 2. Threat
Any potential circumstance, event, or entity capable of causing harm to an asset through unauthorized access, destruction, disclosure, modification, or denial of service. Threats exist independently of whether a system is currently vulnerable.
*Example:* A criminal ransomware syndicate active on the internet is an existing threat.

### 3. Vulnerability
A flaw, flaw of design, bug in code, or operational misconfiguration in a system or control that can be exploited by an adversary to violate security policy.
*Example:* An unpatched Linux server running an obsolete web daemon with a known buffer overflow.

### 4. Threat Actor (Adversary)
The individual, group, or nation-state entity that possesses the intent, capability, and resources to execute a threat against a target.

### 5. Exploit
A specific crafted technique, script, software code snippet, or sequence of commands that takes advantage of a known vulnerability to achieve unauthorized execution or access.

### 6. Zero-Day Vulnerability
A software or hardware vulnerability that is known to attackers (or security researchers) but has **zero days** of vendor patch availability. Systems remain vulnerable until the vendor engineers and deploys a corrective patch.

### 7. Attack Surface
The sum total of all accessible points, network ports, interfaces, APIs, human personnel, and physical doors through which an unauthorized user or attacker could attempt to enter or extract data from an environment.

### 8. Risk
The measurable likelihood of a threat exploiting a vulnerability multiplied by the operational or financial impact of that event:
$$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$$`,

    contentId: `# Glosarium Terminologi Inti Keamanan Siber

Penggunaan istilah teknis yang tepat sangat krusial dalam komunikasi operasional tim keamanan dan penanganan insiden. Kesalahan dalam membedakan istilah dapat berakibat fatal pada kalkulasi risiko dan respons darurat.

### 1. Aset (*Asset*)
Segala sumber daya komputasi, perangkat keras, aplikasi, basis data, kekayaan intelektual, atau peran personel yang memiliki nilai operasional maupun finansial bagi organisasi dan wajib dilindungi.

### 2. Ancaman (*Threat*)
Segala potensi kejadian, kondisi lingkungan, atau entitas yang memiliki kapabilitas merugikan sistem melalui akses ilegal, manipulasi data, perusakan, atau penghentian layanan. Ancaman tetap ada di dunia luar terlepas dari apakah sistem kita memiliki celah atau tidak.
*Contoh:* Sindikat pembuat ransomware di pasar gelap adalah sebuah ancaman nyata.

### 3. Kerentanan (*Vulnerability*)
Cacat pada penulisan kode perangkat lunak, kelemahan pada desain arsitektur, atau kesalahan konfigurasi sistem yang dapat dimanfaatkan oleh pihak penyerang untuk menembus batas keamanan.
*Contoh:* Server web yang belum diperbarui dan masih menggunakan versi perangkat lunak usang yang memiliki celah eksekusi perintah jarak jauh (*remote code execution*).

### 4. Pelaku Ancaman (*Threat Actor*)
Individu, sindikat kriminal terorganisasi, atau entitas bentukan negara yang memiliki motif, sumber daya finansial, dan kapabilitas teknis untuk melancarkan serangan terhadap target.

### 5. Eksploitasi (*Exploit*)
Skrip kode khusus, urutan instruksi perintah, atau perangkat lunak senjata yang dirancang secara presisi untuk memanfaatkan kerentanan tertentu agar sistem target dapat dikendalikan.

### 6. Celah Zero-Day (*Zero-Day Vulnerability*)
Kerentanan keamanan yang telah ditemukan dan beredar, namun pihak pengembang perangkat lunak memiliki waktu **nol hari** untuk merilis pembaruan (*patch*). Sistem berada dalam posisi sangat rentan hingga pembaruan resmi diterbitkan.

### 7. Bidang Serangan (*Attack Surface*)
Total keseluruhan titik kontak, port jaringan yang terbuka, formulir web, API endpoint, kelengahan manusia, dan akses fisik yang dapat dicoba disusupi oleh penyerang untuk membobol sistem.

### 8. Risiko (*Risk*)
Peluang terukurnya sebuah ancaman dalam mengeksploitasi kerentanan yang ada, dikalikan dengan besarnya dampak kerugian yang ditimbulkan:
$$\\text{Risiko} = \\text{Peluang Terjadinya Serangan} \\times \\text{Tingkat Keparahan Dampak}$$`
  }
];

// Add sections 6 to 20 dynamically with rich technical depth
const REMAINING_SECTIONS = [
  // 6. Digital Assets and Their Value
  {
    order: 6,
    titleEn: 'Digital Assets and Their Value',
    titleId: 'Aset Digital dan Nilai Pentingnya',
    slug: 'sec-6-digital-assets-and-their-value',
    time: 12,
    contentEn: `# Digital Assets and Their Value

### The Foundation of Asset Defense
A fundamental maxim of cybersecurity states: *You cannot defend what you do not know exists.* Before constructing firewalls or deploying encryption, an organization must catalog and assign value to its digital assets.

### Asset Taxonomy and Criticality Tiers
Organizations categorize assets based on the severity of consequences if confidentiality, integrity, or availability is lost:

1. **Tier 1: Mission-Critical Assets**
   - Core production transactional databases, cryptographic root signing keys, source code repositories for proprietary algorithms, and patient telemetry feeds.
   - *Loss Impact:* Immediate operational halt, catastrophic financial damage, and severe legal penalties.
2. **Tier 2: Business-Operational Assets**
   - Internal enterprise communication platforms, CRM customer records, employee payroll portals, and staging development environments.
   - *Loss Impact:* Severe business friction, operational downtime, and productivity loss.
3. **Tier 3: Public & Low-Sensitivity Assets**
   - Static marketing landing pages, public documentation archives, and external promotional graphics.
   - *Loss Impact:* Minor public relations inconvenience with rapid restoration from local backups.

### Personally Identifiable Information (PII)
PII encompasses any data that can directly or indirectly isolate, identify, or trace a living individual:
- Full legal names, national identity numbers (e.g. NIK / Social Security numbers), passport identifiers.
- Residential street addresses, personal email addresses, phone numbers.
- Biometric fingerprints, facial geometry scans, and medical health history records.
Under privacy frameworks such as Indonesia's UU PDP and the European GDPR, entities that store PII are legally designated as **Data Controllers** and are held strictly liable for unauthorized exposure.`,

    contentId: `# Aset Digital dan Nilai Pentingnya

### Fondasi Inventarisasi Aset
Prinsip utama rekayasa keamanan siber berbunyi: *Anda tidak dapat mempertahankan aset yang tidak Anda ketahui keberadaannya.* Sebelum memasang firewall atau menerapkan enkripsi, sebuah organisasi wajib mendata dan menilai seluruh aset digital yang dimilikinya.

### Klasifikasi Tingkat Kekritisan Aset
Organisasi profesional membagi aset ke dalam tingkatan prioritas:

1. **Tingkat 1: Aset Kritis Utama (Mission-Critical)**
   - Basis data transaksi perbankan, kunci privat kriptografi master (*root signing keys*), kode sumber algoritma rahasia dagang, dan sistem pemantauan pasien rumah sakit.
   - *Dampak Kerugian:* Lumpuhnya operasional secara seketika, kerugian finansial masif, dan ancaman tuntutan pidana regulasi.
2. **Tingkat 2: Aset Pendukung Operasional Bisnis**
   - Sistem komunikasi internal (Slack/Teams), basis data CRM pelanggan, aplikasi absensi dan penggajian staf, serta server pengujian pengembangan.
   - *Dampak Kerugian:* Hambatan operasional yang signifikan dan penurunan produktivitas kerja karyawan.
3. **Tingkat 3: Aset Publik dan Berdampak Rendah**
   - Halaman web promosi statis publik, brosur pemasaran digital, dan repositori dokumentasi terbuka.
   - *Dampak Kerugian:* Gangguan tampilan visual yang dapat dipulihkan dalam hitungan menit melalui cadangan data lokal.

### Data Identitas Pribadi (Personally Identifiable Information / PII)
Data pribadi (PII) adalah segala informasi yang dapat digunakan secara langsung maupun tidak langsung untuk mengidentifikasi seseorang:
- Nama lengkap, Nomor Induk Kependudukan (NIK), nomor paspor, dan tanggal lahir.
- Alamat tempat tinggal, nomor telepon seluler, dan alamat email pribadi.
- Data biometrik (sidik jari, retina) dan riwayat rekam medis kesehatan.
Berdasarkan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) di Indonesia, penyelenggara sistem elektronik memikul tanggung jawab hukum mutlak atas keamanan dan kerahasiaan data pribadi masyarakat yang mereka kelola.`
  },

  // 7. Threats, Vulnerabilities, and Risks
  {
    order: 7,
    titleEn: 'Threats, Vulnerabilities, and Risks',
    titleId: 'Ancaman, Kerentanan, dan Risiko',
    slug: 'sec-7-threats-vulnerabilities-and-risks',
    time: 12,
    contentEn: `# Threats, Vulnerabilities, and Risks

### Disentangling the Security Formula
One of the most dangerous errors in security engineering is treating threats, vulnerabilities, and risks as interchangeable words. They form a cause-and-effect chain:

$$\\text{Threat} \\xrightarrow{\\text{exploits}} \\text{Vulnerability} \\xrightarrow{\\text{creates}} \\text{Incident} \\xrightarrow{\\text{results in}} \\text{Impact (Risk)}$$

### Vulnerability Analysis
A vulnerability is a defect in design or implementation. Common categories include:
- **Design Flaws:** Fundamental architectural oversights, such as passing sensitive authentication tokens in unencrypted GET request query parameters.
- **Implementation Bugs:** Buffer overflows in C/C++, unvalidated user inputs leading to SQL Injection, or race conditions in concurrent execution loops.
- **Misconfigurations:** Leaving default administrative passwords active ('admin/admin'), enabling unnecessary remote services (Telnet/FTP), or creating publicly readable cloud storage buckets.

### Risk Calculation Matrix
Risk is not static; it is assessed qualitatively and quantitatively:
1. **Qualitative Matrix:** Categorizing events into *Low*, *Medium*, *High*, and *Critical* based on consensus assessment matrices.
2. **Quantitative Formula:**
   $$\\text{Annualized Loss Expectancy (ALE)} = \\text{Single Loss Expectancy (SLE)} \\times \\text{Annualized Rate of Occurrence (ARO)}$$

### Defensive Risk Treatment Strategies
Once a risk is identified, leadership must choose one of four formal responses:
- **Mitigate (Remediate):** Apply security controls (patching, firewalls, MFA) to lower likelihood or impact.
- **Transfer:** Purchase cyber insurance or outsource infrastructure to a certified secure cloud provider.
- **Avoid:** Discontinue the risky activity or decommission the vulnerable legacy server completely.
- **Accept:** Consciously acknowledge and document the residual risk when remediation costs vastly exceed the asset's total value.`,

    contentId: `# Ancaman, Kerentanan, dan Risiko

### Membedah Rantai Kausalitas Keamanan
Salah satu kekeliruan fatal dalam rekayasa keamanan adalah menganggap ancaman, kerentanan, dan risiko sebagai sinonim. Dalam analisis profesional, ketiganya membentuk rantai hubungan sebab-akibat yang terstruktur:

$$\\text{Ancaman} \\xrightarrow{\\text{mengeksploitasi}} \\text{Kerentanan} \\xrightarrow{\\text{memicu}} \\text{Insiden Siber} \\xrightarrow{\\text{menghasilkan}} \\text{Dampak Kerugian (Risiko)}$$

### Analisis Kategori Kerentanan
Kerentanan merupakan cacat pada sistem yang memungkinkan terjadinya pembobolan. Kategori utamanya meliputi:
- **Cacat Desain Arsitektur:** Kesalahan mendasar dalam perancangan sistem, misalnya mengirimkan token otentikasi rahasia melalui parameter URL yang tercatat di log peramban secara terbuka.
- **Bug Implementasi Kode:** Kesalahan penulisan sintaks program, seperti celah *SQL Injection* akibat penggabungan string query tanpa parameterisasi, atau celah *buffer overflow* pada bahasa tingkat rendah.
- **Kesalahan Konfigurasi (Misconfiguration):** Membiarkan kata sandi bawaan pabrik tidak diubah, mengaktifkan port layanan lama yang tidak terenkripsi (Telnet), atau membiarkan folder penyimpanan cloud terbuka untuk publik.

### Matriks dan Kalkulasi Risiko
Tingkat risiko dinilai melalui dua pendekatan:
1. **Analisis Kualitatif:** Menentukan peringkat risiko menjadi *Rendah (Low)*, *Sedang (Medium)*, *Tinggi (High)*, atau *Kritis (Critical)* menggunakan matriks pemetaan peluang dan keparahan.
2. **Kalkulasi Kuantitatif:** Menghitung estimasi kerugian finansial tahunan menggunakan rumus ekspektasi kerugian terukur.

### Empat Strategi Perlakuan Risiko (Risk Treatment)
Setelah risiko diidentifikasi dalam *Risk Register*, organisasi wajib mengambil salah satu dari empat tindakan formal:
- **Memitigasi (Mitigate):** Menerapkan kontrol teknis (memasang patch, menerapkan MFA) untuk menurunkan peluang terjadinya pembobolan.
- **Mentransfer (Transfer):** Membeli polis asuransi siber atau mengalihkan hosting ke penyedia cloud bersertifikat ISO 27001.
- **Menghindari (Avoid):** Menghentikan layanan berisiko tinggi atau mematikan server warisan usang secara permanen.
- **Menerima (Accept):** Menerima risiko sisa secara sadar dan terdokumentasi jika biaya penanganan jauh lebih mahal daripada nilai aset yang dilindungi.`
  },

  // 8. Introduction to the CIA Triad
  {
    order: 8,
    titleEn: 'Introduction to the CIA Triad',
    titleId: 'Pengantar CIA Triad',
    slug: 'sec-8-introduction-to-the-cia-triad',
    time: 12,
    contentEn: `# Introduction to the CIA Triad

### The Golden Standard of Information Security
The **CIA Triad** (Confidentiality, Integrity, and Availability) serves as the universally recognized framework around which all security policies, controls, and architectures are engineered.

\`\`\`
                  CONFIDENTIALITY
                  (Privacy & Secrecy)
                         / \\
                        /   \\
                       /     \\
                      /  CIA  \\
                     /  TRIAD  \\
                    /___________\\
          INTEGRITY               AVAILABILITY
    (Tamper Resistance)       (Uptime & Readiness)
\`\`\`

### The Three Pillars Defined
1. **Confidentiality:** Preventing the unauthorized disclosure of sensitive information to individuals, processes, or devices that lack explicit authorization.
2. **Integrity:** Safeguarding the accuracy, completeness, and authenticity of data and software from unauthorized modification, deletion, or fabrication.
3. **Availability:** Ensuring authorized entities have timely, dependable, and uninterrupted access to critical information and computing resources when needed.

### The Inherent Tension and Trade-offs
Security engineering is the art of balancing these three pillars against usability and operational cost:
- A server sealed in concrete, submerged in ocean waters, and disconnected from all networks achieves near-perfect Confidentiality and Integrity, but **zero Availability**.
- An open public Wi-Fi network with zero passwords and unrestricted file shares achieves near-perfect Availability, but **zero Confidentiality or Integrity**.
Defenders must align the balance of the triad with organizational mission requirements.`,

    contentId: `# Pengantar CIA Triad

### Standar Baku Keamanan Informasi
**CIA Triad**—yang terdiri dari Kerahasiaan (*Confidentiality*), Integritas (*Integrity*), dan Ketersediaan (*Availability*)—adalah segitiga emas pedoman arsitektur keamanan informasi modern.

### Tiga Pilar Fundamental
1. **Kerahasiaan (Confidentiality):** Menjamin bahwa data sensitif hanya dapat dibaca dan diakses oleh pihak, peran, atau sistem yang memiliki izin otorisasi yang sah. Mencegah kebocoran rahasia ke publik atau kompetitor.
2. **Integritas (Integrity):** Menjamin keaslian, ketepatan, dan keutuhan data sejak dibuat, disimpan, hingga ditransmisikan. Memastikan data tidak pernah dimanipulasi, disisipkan, atau dirusak tanpa izin.
3. **Ketersediaan (Availability):** Menjamin bahwa sistem komputasi, jaringan, dan data dapat diakses secara andal dan lancar oleh pengguna yang sah kapan pun dibutuhkan tanpa hambatan operasional.

### Ketegangan dan Kompromi (Trade-Offs) Antar-Pilar
Dalam praktiknya, ketiga pilar ini sering kali saling bersinggungan dan menuntut kompromi:
- Sebuah server yang dimatikan total, dicabut kabel jaringannya, dan disimpan di dalam bunker bawah tanah memiliki *Confidentiality* dan *Integrity* yang sempurna, namun **Availability-nya nol**.
- Sebuah situs web yang dapat diakses oleh siapa saja di dunia tanpa perlu login memiliki *Availability* yang sangat tinggi, namun **Confidentiality dan Integrity-nya sangat rendah**.
Tugas seorang insinyur keamanan defensif adalah merancang arsitektur yang menyeimbangkan ketiga pilar tersebut sesuai dengan kebutuhan hukum dan bisnis organisasi.`
  },

  // 9. Confidentiality in Practice
  {
    order: 9,
    titleEn: 'Confidentiality in Practice',
    titleId: 'Penerapan Kerahasiaan (Confidentiality) dalam Praktik',
    slug: 'sec-9-confidentiality-in-practice',
    time: 12,
    contentEn: `# Confidentiality in Practice

### How Confidentiality Is Enforced
Confidentiality protects data against unauthorized disclosure through a combination of mathematical algorithms and strict logical access barriers:
1. **Encryption at Rest:** Transforming plaintext records stored on physical storage drives (SSD/NVMe) into unreadable ciphertext using symmetric ciphers such as AES-256. If a physical hard disk is stolen from a data center, the thief cannot read the data without the cryptographic key.
2. **Encryption in Transit:** Tunneling data over public networks using modern cryptographic protocols such as Transport Layer Security (TLS 1.3). This prevents attackers from sniffing plaintext packets on intermediate routers.
3. **Role-Based Access Control (RBAC):** Restricting database and file system permissions strictly based on validated user roles and the principle of least privilege.
4. **Data Masking and Redaction:** Obfuscating sensitive fields in logs and user interfaces, such as displaying payment cards as \`**** **** **** 1234\`.

### Case Study: Real-World Confidentiality Failure
In 2017, credit reporting bureau Equifax suffered a breach that exposed the confidential personal information of 147 million consumers (including names, Social Security numbers, and birth dates). Attackers exploited an unpatched Apache Struts vulnerability in a public web dispute portal, accessed internal servers, and found database credentials stored in unencrypted plaintext, allowing them to extract massive volumes of confidential records over months without detection.`,

    contentId: `# Penerapan Kerahasiaan (Confidentiality) dalam Praktik

### Mekanisme Penegakan Kerahasiaan Data
Prinsip kerahasiaan (*confidentiality*) ditegakkan melalui kombinasi algoritma matematika kriptografis dan pembatasan akses logis:
1. **Enkripsi Saat Istirahat (Encryption at Rest):** Mengubah data yang tersimpan di dalam hard disk atau basis data menjadi teks acak (*ciphertext*) menggunakan standar industri seperti AES-256. Jika server fisik dicuri dari data center, pencuri tidak akan dapat membaca isi data tanpa kunci dekripsi master.
2. **Enkripsi Saat Transit (Encryption in Transit):** Mengamankan aliran paket data saat melintasi jaringan internet publik menggunakan protokol TLS 1.3 (HTTPS). Hal ini menggagalkan upaya penyadapan (*eavesdropping*) pada router perantara.
3. **Kontrol Akses Berbasis Peran (Role-Based Access Control / RBAC):** Membatasi hak pembacaan file dan query basis data secara ketat sesuai dengan tugas resmi pengguna.
4. **Penyembunyian Data (Masking / Obfuscation):** Menyamarkan data sensitif pada tampilan layar dan file log audit, seperti menampilkan nomor kartu pembayaran dalam format \`**** **** **** 4321\`.

### Studi Kasus Kegagalan Kerahasiaan di Dunia Nyata
Pada tahun 2017, biro pemeringkat kredit Equifax mengalami kebocoran data yang mengekspos informasi pribadi lebih dari 147 juta orang. Penyerang mengeksploitasi celah Apache Struts pada portal web publik yang lupa diperbarui, lalu menemukan kata sandi basis data internal yang disimpan dalam teks biasa (*plaintext*). Akibatnya, data rahasia kependudukan berhasil disedot penyerang selama berbulan-bulan tanpa terdeteksi.`
  },

  // 10. Integrity in Practice
  {
    order: 10,
    titleEn: 'Integrity in Practice',
    titleId: 'Penerapan Integritas (Integrity) dalam Praktik',
    slug: 'sec-10-integrity-in-practice',
    time: 12,
    contentEn: `# Integrity in Practice

### The Guardian of Truth and Accuracy
Integrity ensures that digital assets remain accurate, complete, trustworthy, and free from unauthorized tampering, alteration, or deletion.

### Core Integrity Mechanisms
- **Cryptographic Hashing:** One-way mathematical functions (such as SHA-256) that produce a fixed-size digest representing input data. Any single bit change in the input drastically changes the resulting hash (the *avalanche effect*).
- **Digital Signatures:** Combining asymmetric cryptography with cryptographic hashing to guarantee both the authenticity of the sender and the tamper-evident state of the document.
- **Database Check Constraints & Foreign Keys:** Relational schema rules that prevent corrupt, partial, or malformed data insertions.
- **Immutable Audit Trails:** Append-only log architectures (such as write-once-read-many / WORM storage) where records can be created but never modified or destroyed.

### Case Study: Real-World Integrity Compromise
In the SolarWinds supply chain breach (2020), state-sponsored threat actors breached the vendor's internal software build environment. Rather than stealing data, the attackers subtly injected malicious backdoor code into legitimate software updates for the Orion IT management platform. Because the malicious code was digitally signed by the vendor's authentic signing certificate, thousands of enterprise customers and government agencies installed the trojanized update assuming its integrity was intact.`,

    contentId: `# Penerapan Integritas (Integrity) dalam Praktik

### Penjaga Keaslian dan Kebenaran Data
Integritas (*integrity*) memastikan bahwa data dan perangkat lunak tetap utuh, akurat, dan tidak pernah dimanipulasi atau disisipi muatan berbahaya oleh pihak yang tidak berhak.

### Mekanisme Penegakan Integritas
- **Fungsi Hash Kriptografis:** Operasi matematika satu arah (seperti SHA-256) yang menghasilkan intisari data (*digest*) berukuran tetap. Perubahan sekecil satu karakter titik pada dokumen asli akan mengubah total nilai hash yang dihasilkan (*avalanche effect*).
- **Tanda Tangan Digital (Digital Signatures):** Menggabungkan kunci privat asimetris dengan nilai hash untuk membuktikan keaslian identitas pembuat dokumen sekaligus memastikan berkas belum pernah diubah sejak ditandatangani.
- **Integritas Referensial Basis Data:** Aturan skema relasional, validasi tipe data, dan *foreign key* yang mencegah masuknya data rusak atau transaksi anomali.
- **Log Audit Tidak Terubah (Immutable Audit Logs):** Penyimpanan rekam jejak sistem bertipe *append-only* (hanya bisa ditambah, tidak bisa diedit atau dihapus) untuk keperluan investigasi forensik.

### Studi Kasus Kompromi Integritas di Dunia Nyata
Pada kasus peretasan rantai pasok SolarWinds (2020), penyerang menyusup ke lingkungan pembuatan perangkat lunak vendor. Penyerang menyisipkan kode *backdoor* jahat ke dalam pembaruan resmi aplikasi Orion. Karena pembaruan tersebut berhasil ditandatangani menggunakan sertifikat digital resmi milik vendor, ribuan korporasi dan lembaga pemerintah mengunduh dan menginstal pembaruan tersebut tanpa curiga, karena verifikasi integritas tanda tangan digitalnya tampak sah.`
  },

  // 11. Availability in Practice
  {
    order: 11,
    titleEn: 'Availability in Practice',
    titleId: 'Penerapan Ketersediaan (Availability) dalam Praktik',
    slug: 'sec-11-availability-in-practice',
    time: 12,
    contentEn: `# Availability in Practice

### Ensuring Continuous System Readiness
Availability guarantees that computing infrastructure, networks, and software applications are ready and responsive to authorized users whenever required.

### Core Availability Controls
- **Redundancy and Elimination of Single Points of Failure (SPOF):** Dual power supplies, redundant internet service providers, and database clusters across geographically separated data centers.
- **Load Balancing:** Distributing incoming network traffic evenly across pools of identical application servers to prevent saturation.
- **Distributed Denial of Service (DDoS) Mitigation:** Deploying content delivery networks (CDNs) and scrubbing centers capable of absorbing terabits per second of malicious flood traffic.
- **Automated Backup and Disaster Recovery:** Implementing the 3-2-1 backup strategy (3 copies, 2 different media formats, 1 copy stored offline or off-site) to survive ransomware infections.

### Case Study: Real-World Availability Failure
In October 2016, the Mirai botnet—consisting of hundreds of thousands of compromised consumer IoT devices (routers, digital security cameras, DVRs) infected with default credentials—launched a massive 1.2 Tbps DDoS flood against Dyn, a major DNS service provider. Because internet queries could not resolve domain names, major services including Twitter, Netflix, GitHub, and Amazon became completely inaccessible to millions of users worldwide for hours, demonstrating the vulnerability of centralized internet infrastructure.`,

    contentId: `# Penerapan Ketersediaan (Availability) dalam Praktik

### Menjamin Kesiapan Sistem Tanpa Henti
Prinsip ketersediaan (*availability*) memastikan bahwa sistem perangkat lunak, infrastruktur server, dan jaringan komunikasi selalu siap beroperasi secara andal saat dibutuhkan oleh pengguna yang berhak.

### Kontrol Utama Ketersediaan Sistem
- **Redundansi dan Eliminasi Titik Kegagalan Tunggal (*Single Point of Failure / SPOF*):** Penggunaan suplai listrik ganda, koneksi ISP cadangan, dan kluster basis data multi-zona yang tersebar di beberapa lokasi fisik terpisah.
- **Penyimbang Beban (*Load Balancing*):** Membagi lalu lintas permintaan pengguna secara merata ke puluhan server replika untuk mencegah terjadinya kelebihan beban (*overload*).
- **Mitigasi Serangan DDoS:** Menggunakan jaringan distribusi konten (CDN) dan pusat pembersihan lalu lintas (*traffic scrubbing centers*) untuk menepis serangan banjir paket palsu.
- **Strategi Cadangan 3-2-1:** Menyimpan setidaknya 3 salinan data, pada 2 media penyimpanan yang berbeda, dengan 1 salinan disimpan di lokasi luar (*off-site*) yang terisolasi dan kebal dari infeksi ransomware.

### Studi Kasus Kegagalan Ketersediaan di Dunia Nyata
Pada Oktober 2016, botnet Mirai yang mengendalikan ratusan ribu perangkat IoT rumah tangga (kamera CCTV dan router yang menggunakan kata sandi default pabrik) membanjiri server penyedia DNS Dyn dengan lalu lintas sampah mencapai 1,2 Terabit per detik. Akibatnya, jutaan pengguna di seluruh dunia tidak dapat mengakses layanan Twitter, Netflix, GitHub, dan Spotify selama berjam-jam karena nama domain mereka gagal diresolusi.`
  },

  // 12. Common Security Incidents
  {
    order: 12,
    titleEn: 'Common Security Incidents',
    titleId: 'Insiden Keamanan Siber yang Sering Terjadi',
    slug: 'sec-12-common-security-incidents',
    time: 12,
    contentEn: `# Common Security Incidents

### The Anatomy of Modern Attacks
Cyber incidents manifest in multiple operational forms. Defensive engineers must recognize the indicators and mechanisms of the most prevalent incident types:

### 1. Ransomware
Malicious software that infiltrates an enterprise, traverses the local network via lateral movement, encrypts critical files using unbreakable symmetric cryptography (AES), and demands monetary payment (typically cryptocurrency) in exchange for the decryption key. Modern ransomware frequently employs **double extortion**—threatening to publicly leak stolen records if the ransom is not paid.

### 2. Business Email Compromise (BEC)
A targeted social engineering attack in which threat actors impersonate corporate executives (such as the CEO or CFO) or trusted suppliers to trick employees in finance into executing unauthorized electronic wire transfers.

### 3. Credential Stuffing
Automated bot attacks where threat actors test massive dumps of leaked username/password combinations (harvested from prior external breaches) against banking and retail login portals, capitalizing on widespread user password reuse.

### 4. Supply Chain Attacks
Compromising a trusted third-party vendor, software library, or open-source dependency to covertly deploy malware onto thousands of downstream customers who implicitly trust the vendor's updates.`,

    contentId: `# Insiden Keamanan Siber yang Sering Terjadi

### Anatomi dan Ragam Serangan Modern
Insiden keamanan siber hadir dalam berbagai bentuk serangan teknis maupun psikologis. Praktisi pertahanan wajib mengenali karakteristik dari jenis insiden yang paling merusak di industri:

### 1. Serangan Ransomware
Perangkat lunak jahat (*malware*) yang menyusup ke dalam jaringan, menyebar secara horizontal (*lateral movement*), mengenkripsi seluruh file penting menggunakan algoritma AES, dan meminta tebusan uang kripto agar kunci dekripsi diberikan. Tren modern menerapkan pemerasan ganda (*double extortion*): jika korban menolak membayar tebusan, penyerang mengancam akan membocorkan data sensitif ke publik.

### 2. Penipuan Email Bisnis (Business Email Compromise / BEC)
Serangan rekayasa sosial tertarget di mana penyerang memalsukan identitas direktur atau mitra bisnis terpercaya untuk memerintahkan staf keuangan mentransfer dana perusahaan ke rekening penampung penyerang.

### 3. Credential Stuffing
Serangan otomatis di mana bot mencoba jutaan pasangan nama pengguna dan kata sandi yang bocor dari situs lain ke portal login target. Serangan ini memanfaatkan kebiasaan buruk pengguna yang menggunakan kata sandi yang sama di berbagai platform.

### 4. Serangan Rantai Pasok (Supply Chain Attacks)
Peretasan yang menargetkan vendor perangkat lunak atau pustaka pihak ketiga terpercaya guna menyisipkan malware ke dalam pembaruan aplikasi resmi, sehingga ribuan korporasi pengguna aplikasi tersebut ikut terinfeksi secara otomatis.`
  },

  // 13. Introduction to Threat Actors
  {
    order: 13,
    titleEn: 'Introduction to Threat Actors',
    titleId: 'Profil dan Klasifikasi Pelaku Ancaman',
    slug: 'sec-13-introduction-to-threat-actors',
    time: 12,
    contentEn: `# Introduction to Threat Actors

### Who Attacks Digital Systems?
Understanding threat actors—their motivations, financial backing, technical sophistication, and operational discipline—enables defenders to calibrate appropriate security controls.

### Threat Actor Classification

| Category | Primary Motivation | Technical Sophistication | Operational TTPs |
|---|---|---|---|
| **Script Kiddies** | Curiosity, bragging rights, peer recognition | Low | Relies on pre-written automated point-and-click tools without understanding underlying mechanics. |
| **Hacktivists** | Political, ideological, or environmental causes | Low to Moderate | Website defacements, public doxxing, and public-facing DDoS attacks intended to generate publicity. |
| **Cybercriminals (Organized Crime)** | Direct monetary profit and extortion | Moderate to High | Ransomware deployment, banking Trojans, credit card skimming, and corporate identity theft. |
| **Advanced Persistent Threats (APTs)** | National intelligence, military espionage, geopolitical advantage | Very High (Elite) | Custom zero-day exploits, deep stealth persistence lasting years, backed by nation-state budgets and intelligence agencies. |
| **Insider Threats** | Greed, revenge, coercion, or simple negligence | Variable (High access) | Authorized employees, contractors, or administrators abusing legitimate credentials to extract proprietary records or sabotage systems. |`,

    contentId: `# Profil dan Klasifikasi Pelaku Ancaman

### Memahami Profil Lawan
Mengetahui siapa yang menyerang sistem—beserta motivasi, sumber dana, dan tingkat keahlian teknis mereka—sangat penting bagi tim defensif untuk merancang strategi pertahanan yang proporsional.

### Klasifikasi Pelaku Serangan Siber

| Kategori Pelaku | Motivasi Utama | Tingkat Keahlian | Taktik dan Metode Operasi |
|---|---|---|---|
| **Script Kiddies** | Rasa penasaran, pengakuan sesama teman, mencari sensasi | Rendah | Menggunakan skrip dan alat peretas siap pakai buatan orang lain tanpa memahami kode di baliknya. |
| **Hacktivist** | Gerakan ideologi politik, sosial, atau protes lingkungan | Rendah hingga Sedang | Mengubah tampilan situs web (*deface*), menyebarkan data pribadi (*doxxing*), dan melancarkan serangan DDoS. |
| **Sindikat Kriminal Siber** | Keuntungan finansial murni dan pemerasan uang | Sedang hingga Tinggi | Operasi ransomware terorganisasi, pencurian kartu kredit massal, dan pembajakan rekening perbankan. |
| **Kelompok APT (Negara)** | Spionase militer, keunggulan geopolitik, pencurian rahasia negara | Sangat Tinggi (Elit) | Memiliki dana tak terbatas dari lembaga intelijen negara, membuat exploit zero-day sendiri, dan beroperasi senyap selama bertahun-tahun. |
| **Ancaman Orang Dalam (*Insider Threats*)** | Balas dendam, suap, keputusasaan finansial, atau kelalaian | Bervariasi (Memiliki akses sah) | Staf internal atau administrator yang menyalahgunakan hak akses resminya untuk membocorkan data rahasia atau menyabotase infrastruktur.`
  },

  // 14. Attack Surface Fundamentals
  {
    order: 14,
    titleEn: 'Attack Surface Fundamentals',
    titleId: 'Fondasi Bidang Serangan (Attack Surface)',
    slug: 'sec-14-attack-surface-fundamentals',
    time: 12,
    contentEn: `# Attack Surface Fundamentals

### The Concept of the Attack Surface
The **attack surface** is the total aggregate of all points, vectors, and interfaces where an unauthorized user could attempt to enter or extract data from a system. In defensive engineering, **Attack Surface Reduction (ASR)** is the primary proactive strategy for eliminating vulnerabilities before attacks occur.

### The Three Attack Surface Dimensions
1. **Network Attack Surface:** Open TCP/UDP ports, exposed administrative interfaces (SSH/RDP), unsecured wireless access points, and cloud edge routers.
2. **Software Attack Surface:** Web application input fields, REST API endpoints, unvalidated file upload handlers, and third-party software library dependencies.
3. **Human & Physical Attack Surface:** Employees vulnerable to phishing, discarded paper records lacking shredding, unlocked server room doors, and unmonitored USB ports.

### Principles of Attack Surface Reduction
- **Disable unused services and ports:** If a server only serves HTTPS (port 443), close port 8080, port 21 (FTP), and port 23 (Telnet).
- **Enforce strict network segmentation:** Isolate development environments from production transactional networks using firewalls and VLANs.
- **Implement minimal software installations:** Run stripped-down minimal operating system images (such as Alpine Linux or container base images) that omit unnecessary compilers and debugging utilities.`,

    contentId: `# Fondasi Bidang Serangan (Attack Surface)

### Memahami Konsep Bidang Serangan
**Bidang serangan (*attack surface*)** adalah total gabungan dari seluruh celah, antarmuka, dan titik kontak yang dapat dicoba ditembus oleh peretas untuk mengekstrak data dari lingkungan digital. Dalam rekayasa keamanan, **Reduksi Bidang Serangan (Attack Surface Reduction / ASR)** adalah strategi paling efektif untuk menutup potensi bahaya sebelum serangan terjadi.

### Tiga Dimensi Bidang Serangan
1. **Bidang Serangan Jaringan:** Port TCP/UDP yang terbuka ke internet, antarmuka remote yang tidak terisolasi (SSH/RDP), dan jaringan Wi-Fi tamu tanpa segmentasi.
2. **Bidang Serangan Perangkat Lunak:** Kolom input formulir web, endpoint REST API publik, modul pengunggahan file, serta dependensi kode pustaka pihak ketiga.
3. **Bidang Serangan Manusia dan Fisik:** Karyawan yang rentan terhadap email penipuan (*phishing*), dokumen rahasia cetak yang dibuang ke tempat sampah tanpa dihancurkan, dan pintu ruang server yang tidak terkunci.

### Strategi Pengurangan Bidang Serangan
- **Tutup seluruh layanan dan port yang tidak dipakai:** Jika sebuah server web hanya melayani HTTPS pada port 443, matikan port FTP (21) dan Telnet (23).
- **Segmentasi Jaringan Ketat:** Pisahkan jaringan komputer kantor karyawan dari jaringan basis data transaksi keuangan menggunakan firewall internal dan VLAN.
- **Gunakan Sistem Operasi Minimalis:** Gunakan *container base image* yang ringkas (seperti Alpine Linux) yang tidak memuat compiler atau modul yang tidak diperlukan untuk produksi.`
  },

  // 15. Defense in Depth
  {
    order: 15,
    titleEn: 'Defense in Depth',
    titleId: 'Pertahanan Berlapis (Defense in Depth)',
    slug: 'sec-15-defense-in-depth',
    time: 12,
    contentEn: `# Defense in Depth

### The Fallacy of the Castle Moat
Historically, organizations treated security like a medieval castle: build a single massive wall (the network firewall) and assume everything inside is safe. In modern cybersecurity, this perimeter-only model is dead. Modern defense requires **Defense in Depth**—implementing multiple, overlapping defensive controls across all architectural layers.

\`\`\`
+--------------------------------------------------------------+
| Physical Security (Biometric locks, security guards, CCTV)   |
+------------------------------+-------------------------------+
| Perimeter Security (Edge firewalls, DDoS scrubbing, WAF)     |
+------------------------------+-------------------------------+
| Network Security (VLAN segmentation, IDS/IPS, TLS tunneling) |
+------------------------------+-------------------------------+
| Endpoint Security (EDR agents, OS hardening, BitLocker)      |
+------------------------------+-------------------------------+
| Application Security (Input validation, RBAC, Secure SDLC)   |
+------------------------------+-------------------------------+
| Data Security (AES-256 encryption, access audit logging)     |
+--------------------------------------------------------------+
\`\`\`

### Why Defense in Depth Is Non-Negotiable
If an attacker discovers a zero-day exploit to bypass the perimeter web application firewall, they are not handed the database keys. They must still defeat local operating system hardening, lateral network firewalls, database authentication, and field-level encryption. Every defensive barrier buys the security operations team valuable time to detect, contain, and neutralize the intruder.`,

    contentId: `# Pertahanan Berlapis (Defense in Depth)

### Keruntuhan Model Benteng Kastil Tradisional
Di masa lalu, banyak perusahaan menerapkan keamanan seperti kastil abad pertengahan: membangun satu parit pembatas besar (firewall perimeter) dan menganggap siapa pun yang berada di dalam benteng adalah pihak aman. Di era siber modern, model ini telah runtuh. Paradigma mutlak saat ini adalah **Defense in Depth**—menerapkan banyak lapisan perlindungan yang saling tumpang tindih pada seluruh tingkatan arsitektur sistem.

### Lapisan-Lapisan Pertahanan
1. **Keamanan Fisik:** Akses kartu pintar, CCTV, dan pintu brankas data center.
2. **Keamanan Perimeter Jaringan:** Firewall pembatas luar dan proteksi anti-DDoS.
3. **Keamanan Jaringan Internal:** Segmentasi VLAN dan sistem pemantauan lalu lintas (*IDS/IPS*).
4. **Keamanan Perangkat Endpoint:** Antivirus EDR, penonaktifan port USB, dan enkripsi hard disk.
5. **Keamanan Aplikasi:** Sanitasi input pengguna, pencegahan SQL Injection, dan pembatasan hak akses sesi.
6. **Keamanan Data Inti:** Enkripsi AES-256 pada media penyimpanan dan pencatatan log audit rekam jejak akses.

### Mengapa Pertahanan Berlapis Tidak Bisa Ditawar
Jika penyerang berhasil menembus firewall terluar menggunakan exploit baru, mereka tidak akan langsung mendapatkan data nasabah. Penyerang masih harus berhadapan dengan isolasi jaringan internal, autentikasi basis data berlapis, dan enkripsi file. Setiap lapis pertahanan memberi waktu berharga bagi tim keamanan untuk mendeteksi dan mengisolasi serangan.`
  },

  // 16. Security by Design
  {
    order: 16,
    titleEn: 'Security by Design',
    titleId: 'Security by Design dan Default-Deny',
    slug: 'sec-16-security-by-design',
    time: 12,
    contentEn: `# Security by Design and Default-Deny

### Shifting Security Left
Historically, organizations built software applications with zero security considerations, only attempting to "bolt on" firewalls and scanners right before public launch. **Security by Design** reverses this costly practice: security is integrated into every phase of system architecture, design, and coding from day one.

### Core Architectural Axioms
1. **Principle of Least Privilege (PoLP):** Every user, service, and background process must operate using only the absolute minimum set of privileges required to perform its official function. A reporting service that only reads sales statistics should never have write or delete permissions on customer tables.
2. **Default-Deny (Fail-Safe Defaults):** Access to any file, API route, or network port must be explicitly blocked by default. Access is granted only when an explicit, documented rule permits it.
3. **Zero Trust Architecture:** "Never trust, always verify." Never assume that network packets originating from an internal office desk or VPN connection are authentic. Every request must be authenticated, authorized, and cryptographically verified.
4. **Economy of Mechanism:** Keep security designs simple and maintainable. Overly complex security architectures frequently fail because human administrators cannot configure them without introducing unintentional bypasses.`,

    contentId: `# Security by Design dan Default-Deny

### Mengintegrasikan Keamanan Sejak Awal (*Shift-Left*)
Kebiasaan buruk di masa lalu adalah merancang aplikasi tanpa memikirkan keamanan, lalu mencoba "menambalnya" secara terburu-buru beberapa hari sebelum rilis produksi. Prinsip **Security by Design** membalik pola kerja tersebut: aspek keamanan dirancang sejak fase perumusan arsitektur awal, pemilihan basis data, hingga penulisan baris kode pertama.

### Aksioma Desain Fundamental
1. **Prinsip Hak Akses Terkecil (*Principle of Least Privilege*):** Setiap pengguna, akun layanan, dan modul aplikasi hanya boleh diberikan wewenang izin seminimal mungkin yang mutlak dibutuhkan untuk fungsinya. Layanan pelaporan bulanan tidak boleh diberikan hak menghapus atau mengubah tabel nasabah.
2. **Penolakan Bawaan (*Default-Deny*):** Setiap akses menuju file, endpoint API, atau port jaringan harus berstatus ditolak secara default. Izin hanya diberikan jika ada aturan resmi tertulis yang secara eksplisit mengizinkannya.
3. **Arsitektur Zero Trust:** Prinsip *"Jangan pernah percaya, selalu verifikasi"*. Jangan pernah mengasumsikan bahwa koneksi dari jaringan kabel kantor adalah koneksi yang aman. Setiap permintaan data harus diverifikasi identitas dan hak aksesnya secara kontinu.
4. **Kesederhanaan Mekanisme:** Desain keamanan harus mudah dipahami dan dikelola. Sistem keamanan yang terlampau rumit justru sering gagal karena menyulitkan administrator dalam mendeteksi setelan yang salah.`
  },

  // 17. Ethical and Legal Boundaries
  {
    order: 17,
    titleEn: 'Ethical and Legal Boundaries',
    titleId: 'Batasan Etika dan Aspek Legalitas',
    slug: 'sec-17-ethical-and-legal-boundaries',
    time: 12,
    contentEn: `# Ethical and Legal Boundaries

### The Absolute Line Between Defense and Crime
The technical tools and techniques used by defensive security engineers are identical to those used by malicious adversaries. The single dividing line is **explicit written authorization and intent**.

### Computer Crime Legislation
Accessing, scanning, or interacting with a computer system without prior written consent from the verified owner is illegal worldwide:
- **Indonesia:** UU No. 11 Tahun 2008 jo. UU No. 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik (UU ITE), Pasal 30, 31, dan 32 criminalizes unauthorized access, interception, and data alteration with severe prison sentences and multi-billion rupiah fines.
- **United States:** The Computer Fraud and Abuse Act (CFAA, 18 U.S.C. § 1030).
- **United Kingdom:** The Computer Misuse Act 1990.

### Rules of Engagement (RoE)
Professional, authorized penetration testing strictly requires a legally binding document known as the **Rules of Engagement**:
- Explicitly defines IP addresses, domain names, and servers included in scope.
- Prohibits destructive activities, such as executing DoS attacks or corrupting live production databases.
- Identifies designated emergency contacts and communication channels in case of unintended service disruption.

### Responsible Vulnerability Disclosure
When an ethical researcher discovers a security vulnerability in a public platform:
1. Privately notify the organization's official security team or Bug Bounty program.
2. Provide technical proof-of-concept steps without exfiltrating or modifying live customer data.
3. Grant the vendor an agreed remediation grace period (typically 90 days) before publishing any technical findings.`,

    contentId: `# Batasan Etika dan Aspek Legalitas

### Batas Tegas Antara Pertahanan dan Tindak Pidana
Perangkat lunak pemindai dan teknik analisis yang digunakan oleh ahli keamanan defensif persis sama dengan yang digunakan oleh peretas kriminal. Satu-satunya garis pemisah yang mutlak adalah **izin otorisasi tertulis yang sah dan niat etis**.

### Dasar Hukum Kejahatan Siber
Mengakses, memindai, atau mencoba menyusup ke sistem komputer milik pihak lain tanpa izin tertulis dari pemilik sah adalah tindak pidana kejahatan siber:
- **Hukum Indonesia:** UU No. 11 Tahun 2008 jo. UU No. 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik (UU ITE), khususnya Pasal 30 (akses ilegal), Pasal 31 (penyadapan tanpa hak), dan Pasal 32 (perubahan atau perusakan data elektronik), memuat ancaman hukuman penjara bertahun-tahun serta denda hingga miliaran rupiah.
- **Hukum Internasional:** Computer Fraud and Abuse Act (CFAA) di Amerika Serikat dan Computer Misuse Act di Inggris.

### Kesepakatan Batasan Uji (*Rules of Engagement / RoE*)
Pengujian keamanan profesional oleh tim penguji penetrasi (*penetration tester*) wajib dilindungi oleh dokumen hukum tertulis *Rules of Engagement*:
- Menetapkan daftar alamat IP dan domain resmi yang diizinkan untuk diuji.
- Melarang keras tindakan destruktif yang dapat melumpuhkan server atau merusak basis data produksi.
- Menentukan narahubung darurat jika terjadi insiden tidak disengaja saat pengujian.

### Pengungkapan Celah Bertanggung Jawab (*Responsible Disclosure*)
Ketika seorang praktisi etis menemukan kerentanan pada sebuah situs web:
1. Laporkan temuan tersebut secara tertutup kepada tim keamanan resmi organisasi atau melalui program *Bug Bounty* resmi.
2. Berikan bukti teknis pengujian secara minimal tanpa mencuri atau memanipulasi data riil pengguna.
3. Berikan waktu wajar (standar industri: 90 hari) bagi pengembang untuk merilis patch perbaikan sebelum informasi tersebut diumumkan ke publik.`
  },

  // 18. Guided Defensive Case Study
  {
    order: 18,
    titleEn: 'Guided Defensive Case Study: Medix Health Portal',
    titleId: 'Studi Kasus Defensif Terpandu: Portal Kesehatan Medix',
    slug: 'sec-18-guided-defensive-case-study',
    time: 15,
    contentEn: `# Guided Defensive Case Study: Medix Health Portal

### Scenario Background
**Medix Health** is a regional healthcare provider serving 85,000 active patients. They operate an online portal where patients view blood test laboratory results, schedule medical appointments, and communicate securely with physicians.

### Asset Inventory
1. **Primary Database (MySQL):** Contains 85,000 electronic health records (EHR), national identity numbers (NIK), phone numbers, home addresses, and diagnostic records (Tier 1 PII).
2. **Web Application Front-End:** Node.js/Express server hosted on a public Linux cloud instance.
3. **Physician Workstations:** 40 Windows laptops used by clinic doctors to enter consultation notes.

### Threat Modeling: Identified Vectors
- **Threat Actor:** An opportunistic cybercriminal syndicate seeking PII to sell on underground forums and extort the clinic.
- **Vulnerability 1 (Application):** The patient laboratory results endpoint retrieves records using unparameterized SQL queries:
  \`SELECT * FROM lab_results WHERE patient_id = 'USER_INPUT';\`
- **Vulnerability 2 (Network):** The database port (3306) is exposed to the public internet without IP allowlisting.
- **Vulnerability 3 (Human):** Physician workstation accounts do not require Multi-Factor Authentication (MFA).

### Guided Defensive Remediation Plan
As the defending security engineer, you implement three concrete defensive controls:
1. **Fix the Application Layer:** Replace raw query concatenation with parameterized prepared statements or an ORM with strict type validation:
   \`SELECT * FROM lab_results WHERE patient_id = ?;\`
2. **Harden the Network Layer:** Configure host firewall rules to restrict database port 3306 so that it only accepts connections originating from the internal private IP of the web server. Drop all public traffic.
3. **Enforce Identity Controls:** Mandate FIDO2/TOTP Multi-Factor Authentication on all physician accounts and enforce an automatic 15-minute inactivity session timeout.`,

    contentId: `# Studi Kasus Defensif Terpandu: Portal Kesehatan Medix

### Latar Belakang Skenario
**Klinik Medix Health** adalah jaringan fasilitas kesehatan regional yang melayani 85.000 pasien aktif. Mereka mengoperasikan portal daring yang memungkinkan pasien melihat hasil tes laboratorium darah, membuat janji dokter, dan berkonsultasi secara elektronik.

### Inventarisasi Aset Utama
1. **Basis Data Utama (MySQL):** Menyimpan 85.000 rekam medis elektronik (EHR), NIK kependudukan, nomor ponsel, alamat rumah, dan diagnosa penyakit (Aset PII Tingkat 1).
2. **Server Aplikasi Web:** Server Linux yang menjalankan runtime Node.js yang dapat diakses dari internet publik.
3. **Laptop Staf Medis:** 40 laptop kerja Windows yang digunakan dokter untuk memasukkan catatan medis konsultasi.

### Pemodelan Ancaman dan Kerentanan Teridentifikasi
- **Profil Pelaku:** Sindikat kriminal siber yang mengincar data PII medis untuk diperjualbelikan dan diperas.
- **Kerentanan 1 (Lapisan Aplikasi):** Endpoint pengambilan hasil lab menggabungkan input pengguna secara langsung tanpa penyaringan:
  \`SELECT * FROM lab_results WHERE patient_id = 'INPUT_USER';\` (Rentan SQL Injection).
- **Kerentanan 2 (Lapisan Jaringan):** Port 3306 database MySQL dibuka langsung ke internet publik tanpa pembatasan IP.
- **Kerentanan 3 (Lapisan Identitas):** Akun login dokter hanya menggunakan kata sandi sederhana tanpa Autentikasi Dua Faktor (MFA).

### Rencana Remediasi Defensif Terpandu
Sebagai insinyur pertahanan siber, Anda merancang tiga langkah perbaikan konseptual:
1. **Perbaikan Lapisan Aplikasi:** Mengganti penggabungan string kueri langsung dengan kueri terparameterisasi (*prepared statement*) atau ORM dengan validasi tipe data ketat:
   \`SELECT * FROM lab_results WHERE patient_id = ?;\`
2. **Pengerasan Lapisan Jaringan:** Mengonfigurasi firewall host agar port 3306 database hanya menerima koneksi dari alamat IP privat server web internal. Blokir seluruh akses dari internet luar.
3. **Penguatan Kontrol Akses Identitas:** Wajibkan Autentikasi Multi-Faktor (MFA berbasis TOTP/Passkeys) untuk seluruh akun dokter dan terapkan masa kedaluwarsa sesi otomatis setelah 15 menit tidak aktif.`
  },

  // 19. Independent Practice Exercise
  {
    order: 19,
    titleEn: 'Independent Practice Exercise: Asset & Threat Matrix',
    titleId: 'Latihan Mandiri: Matriks Aset dan Ancaman Defensif',
    slug: 'sec-19-independent-practice-exercise',
    time: 15,
    contentEn: `# Independent Practice Exercise: Asset & Threat Matrix

### Exercise Objective
Apply the mental models of asset valuation, threat identification, and the CIA Triad by analyzing a fictional logistics enterprise: **Nusantara Logistics**.

### Fictional Enterprise Profile
Nusantara Logistics operates a fleet of 200 delivery trucks across five islands. Their systems include:
- A cloud-hosted dispatch tracking server tracking real-time GPS locations of all vehicles.
- An on-premise billing server containing customer bank account details.
- Handheld Android barcode scanners used by warehouse couriers over local warehouse Wi-Fi.

### Your Tasks
Construct an analytical defensive evaluation addressing the following four prompts:

1. **Asset Identification:** List the top 3 digital assets of Nusantara Logistics and assign each an operational criticality tier (Tier 1, Tier 2, or Tier 3).
2. **CIA Impact Analysis:** For each of the following scenarios, identify which pillar of the CIA Triad is compromised:
   - *Scenario A:* A disgruntled former employee accesses the dispatch server and deletes all active delivery route schedules for tomorrow morning.
   - *Scenario B:* A competitor intercepts unencrypted Wi-Fi packets from the warehouse scanners and reads confidential shipping manifest lists.
   - *Scenario C:* A ransomware infection encrypts customer billing records, demanding 2 Bitcoins to restore access.
3. **Control Proposal:** Propose one preventative security control and one detective security control to defend the warehouse Wi-Fi scanners.
4. **Self-Check Review:** Compare your conclusions with the answer framework provided in the Chapter 1 Assessment.`,

    contentId: `# Latihan Mandiri: Matriks Aset dan Ancaman Defensif

### Tujuan Latihan
Menerapkan konsep penilaian aset, identifikasi ancaman, dan pilar CIA Triad pada skenario perusahaan logistik fiktif: **Nusantara Logistics**.

### Profil Perusahaan
Nusantara Logistics mengoperasikan armada 200 truk pengiriman antar-pulau. Sistem mereka mencakup:
- Server pelacakan rute berbasis cloud yang memantau koordinat GPS kendaraan secara real-time.
- Server penagihan pembayaran internal yang memuat informasi nomor rekening bank pelanggan.
- Perangkat pemindai barcode Android yang digunakan kurir gudang melalui jaringan Wi-Fi lokal.

### Tugas Mandiri Anda
Susun analisis defensif untuk menjawab empat studi kasus berikut:

1. **Inventarisasi Aset:** Sebutkan 3 aset digital utama Nusantara Logistics dan tentukan tingkat kekritisannya (Tingkat 1, 2, atau 3).
2. **Analisis Dampak CIA Triad:** Tentukan pilar CIA manakah yang dilanggar pada skenario di bawah ini:
   - *Skenario A:* Mantan staf yang diberhentikan menyusup ke server rute dan menghapus seluruh jadwal pengiriman esok hari.
   - *Skenario B:* Pihak kompetitor menyadap lalu lintas Wi-Fi gudang yang tidak terenkripsi dan membaca manifes daftar barang kiriman pelanggan.
   - *Skenario C:* Infeksi ransomware mengenkripsi basis data keuangan sehingga bagian penagihan tidak dapat membuka invoice.
3. **Penyusunan Kontrol Keamanan:** Usulkan satu kontrol pencegahan (*preventative control*) dan satu kontrol pendeteksian (*detective control*) untuk mengamankan perangkat pemindai Wi-Fi gudang.
4. **Tinjauan Mandiri:** Gunakan kesimpulan Anda untuk menguji pemahaman konsep sebelum melangkah ke ujian evaluasi bab.`
  },

  // 20. Summary and Preparation for Chapter 2
  {
    order: 20,
    titleEn: 'Summary and Preparation for Chapter 2',
    titleId: 'Rangkuman Bab dan Persiapan Bab 2',
    slug: 'sec-20-summary-and-preparation',
    time: 10,
    contentEn: `# Summary and Preparation for Chapter 2

### Comprehensive Chapter Summary
Congratulations on completing the foundational material for Chapter 1. Here is a review of the essential principles you have learned:
- **Cybersecurity is systemic:** Effective defense requires the continuous alignment of people, processes, and technology to protect digital assets from harm.
- **Security vs Privacy vs Safety:** Security provides the technical protection mechanisms; privacy governs the lawful and consensual handling of personal data; safety ensures computing failures do not cause bodily harm.
- **The Core Vocabulary:** An *asset* has value; a *threat* has the potential to harm; a *vulnerability* is a flaw; an *exploit* is the tool that leverages the flaw; and *risk* is the calculated probability and impact of compromise.
- **The CIA Triad:** The foundational compass of defensive engineering—Confidentiality (preventing unauthorized disclosure), Integrity (preventing unauthorized alteration), and Availability (ensuring timely authorized access).
- **Defense in Depth & Least Privilege:** Rely on layered, overlapping controls and default-deny policies to eliminate single points of failure.
- **Legal and Ethical Boundaries:** Authorized security work strictly requires prior written permission.

### Next Steps: Chapter Assessment
Proceed to the **Chapter 1 Assessment** tab. You will be evaluated across **20 multiple-choice questions** testing your conceptual clarity and ability to analyze defensive scenarios. You must achieve a passing score of at least **70%** to earn your verifiable Chapter 1 Completion Certificate.

### Looking Ahead to Chapter 2
In **Chapter 2: Computers, Operating Systems, and Digital Data**, we will explore how computer hardware executes instructions, the role of operating system kernels and user spaces, how processes and memory management work, and how file permissions enforce access control at the operating system level.`,

    contentId: `# Rangkuman Bab dan Persiapan Bab 2

### Rangkuman Komprehensif
Selamat, Anda telah menyelesaikan seluruh materi pembelajaran pada Bab 1. Berikut adalah poin-poin fundamental yang telah Anda pelajari:
- **Keamanan siber bersifat sistemik:** Pertahanan yang tangguh menuntut sinergi berkelanjutan antara manusia yang waspada, proses tata kelola yang tertib, dan teknologi keamanan yang terpasang tepat.
- **Keamanan vs Privasi vs Keselamatan:** Keamanan adalah benteng perlindungan teknis; privasi adalah tata kelola kepatuhan hak data pribadi; keselamatan adalah jaminan bahwa sistem digital tidak mencelakai fisik manusia.
- **Kosakata Baku:** *Aset* bernilai; *ancaman* berpotensi merugikan; *kerentanan* adalah cacat sistem; *exploit* adalah alat penyerangnya; dan *risiko* adalah kalkulasi dampak kerugian yang dapat ditimbulkan.
- **CIA Triad:** Kompas utama rekayasa defensif—Kerahasiaan (*Confidentiality*), Integritas (*Integrity*), dan Ketersediaan (*Availability*).
- **Pertahanan Berlapis & Hak Akses Terkecil:** Mengeliminasi titik kegagalan tunggal dengan menerapkan kontrol keamanan bertingkat dan kebijakan penolakan bawaan (*default-deny*).
- **Batasan Hukum:** Pengujian keamanan siber profesional mutlak mewajibkan persetujuan tertulis resmi dari pemilik sah sistem.

### Langkah Selanjutnya: Ujian Evaluasi Bab 01
Buka tab **Kuis Bab** untuk mengikuti Ujian Evaluasi Bab 01 yang terdiri dari **20 butir soal pilihan ganda**. Ujian ini menguji pemahaman konseptual dan analisis skenario Anda. Capai skor minimal **70%** untuk menerbitkan Sertifikat Kelulusan resmi Anda secara gratis.

### Menatap Bab 2
Pada **Bab 2: Komputer, Sistem Operasi, dan Data Digital**, kita akan membedah cara perangkat keras memproses instruksi biner, arsitektur kernel sistem operasi Linux dan Windows, manajemen memori dan proses, serta mekanisme kontrol izin berkas (*file permissions*) pada level sistem operasi.`
  }
];

const ALL_SECTIONS = [...SECTIONS, ...REMAINING_SECTIONS];

console.log(`Inserting ${ALL_SECTIONS.length} deep substantive sections into Chapter 01...`);

ALL_SECTIONS.forEach(sec => {
  const lessonId = `pathway_37_ch1_sec${sec.order}`;
  insertLesson.run(
    lessonId,
    chapterId,
    sec.titleEn,
    sec.slug,
    sec.contentEn,
    sec.order,
    sec.time,
    sec.titleEn,
    sec.titleId,
    sec.contentEn,
    sec.contentId
  );
});

console.log(`Successfully seeded ${ALL_SECTIONS.length} deep substantive sections into Chapter 01!`);
db.close();
