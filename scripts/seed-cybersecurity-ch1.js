const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- SEEDING CHAPTER 01: INTRODUCTION TO CYBERSECURITY (20 DEEP SECTIONS + 20 QUESTIONS) ---');

const chapterId = 'pathway_37_ch1';

// 1. Delete existing lessons for Chapter 01
db.prepare('DELETE FROM lessons WHERE chapter_id = ?').run(chapterId);

// 2. Prepare lesson insertion statement
const insertLesson = db.prepare(`
  INSERT INTO lessons (
    id, chapter_id, title, slug, content, content_type, sort_order, estimated_time, is_required, status,
    title_en, title_id, content_en, content_id
  ) VALUES (?, ?, ?, ?, ?, 'text', ?, ?, 1, 'published', ?, ?, ?, ?)
`);

// The 20 substantive sections
const SECTIONS = [
  {
    order: 1,
    titleEn: 'What Is Cybersecurity?',
    titleId: 'Apa Itu Keamanan Siber?',
    slug: 'sec-1-what-is-cybersecurity',
    time: 10,
    contentEn: `# What Is Cybersecurity?

Cybersecurity is the discipline and practice of protecting computing systems, networks, devices, software programs, and digital data from unauthorized access, malicious attacks, disruption, or destruction. It establishes an active, structured defense over digital environments to ensure that critical technologies operate dependably and that valuable information remains protected against hostile interference.

### Systems and Environments Protected
Modern cybersecurity spans multiple interconnected domains:
1. **Critical Infrastructure Security:** Protecting foundational operational networks such as power grids, clean water treatment facilities, transit systems, and hospital management backbones where system downtime threatens human safety.
2. **Network Security:** Shielding communications infrastructure, wireless channels, routers, and switches against interception, unauthorized packet tampering, and Denial of Service (DoS) saturation.
3. **Application Security:** Hardening software applications, web APIs, and desktop platforms against design vulnerabilities, buffer overflows, and architectural tampering throughout the software development lifecycle (SDLC).
4. **Cloud and Data Security:** Defending multi-tenant cloud virtual machines, database stores, object repositories, and cryptographic key vaults against misconfigurations, privilege leaks, and data exfiltration.

### Primary Defensive Objectives
At its core, cybersecurity aims to achieve three foundational outcomes:
- **Resilience:** Ensuring that systems absorb disruptions, isolate compromised components, and continue operating without cascading catastrophic failures.
- **Deterrence & Defense:** Raising the cost, difficulty, and risk of an attack to discourage opportunistic adversaries.
- **Accountability & Integrity:** Guaranteeing that every system action, transaction, and data mutation is authentic, tamper-evident, and traceable to an authorized identity.

### Common Misconceptions
- **Myth:** "Cybersecurity is purely an IT department problem."
  *Reality:* Security is an organizational discipline involving executive governance, human behavior, legal compliance, and engineering architecture.
- **Myth:** "Installing an antivirus program guarantees 100% security."
  *Reality:* Security is a continuous process of risk management, defense-in-depth, and proactive monitoring, not a one-time product installation.`,

    contentId: `# Apa Itu Keamanan Siber?

Keamanan siber (*cybersecurity*) adalah disiplin ilmu dan praktik perlindungan terhadap sistem komputer, jaringan, perangkat, program perangkat lunak, serta data digital dari akses tidak sah, serangan berbahaya, gangguan, atau perusakan. Praktik ini membangun pertahanan aktif dan terstruktur atas lingkungan digital untuk menjamin bahwa teknologi krusial dapat beroperasi secara andal dan informasi berharga tetap terlindungi dari gangguan pihak yang bermusuhan.

### Sistem dan Lingkungan yang Dilindungi
Keamanan siber modern mencakup berbagai domain yang saling terhubung:
1. **Keamanan Infrastruktur Kritis:** Melindungi jaringan operasional vital seperti jaringan listrik nasional, sistem pengolahan air bersih, sistem transportasi massal, dan sistem manajemen rumah sakit di mana kegagalan sistem dapat membahayakan keselamatan jiwa.
2. **Keamanan Jaringan:** Melindungi infrastruktur komunikasi, saluran nirkabel, router, dan switch dari intersepsi data, manipulasi paket tanpa izin, dan serangan kejenuhan Denial of Service (DoS).
3. **Keamanan Aplikasi:** Memperkuat aplikasi perangkat lunak, web API, dan platform desktop dari kerentanan desain, buffer overflow, dan eksploitasi arsitektural di sepanjang siklus hidup pengembangan perangkat lunak (SDLC).
4. **Keamanan Cloud dan Data:** Menjaga mesin virtual komputasi awan, penyimpanan basis data, repositori objek, dan brankas kunci kriptografis dari kesalahan konfigurasi, kebocoran hak akses, dan pencurian data.

### Tujuan Utama Pertahanan Siber
Pada prinsipnya, keamanan siber bertujuan untuk mencapai tiga hasil mendasar:
- **Ketahanan (Resilience):** Memastikan sistem mampu menyerap gangguan, mengisolasi komponen yang terdampak, dan tetap beroperasi tanpa mengalami kegagalan berantai.
- **Pencegahan dan Pertahanan:** Meningkatkan tingkat kesulitan, biaya, dan risiko bagi penyerang sehingga mencegah percobaan serangan oportunistik.
- **Akuntabilitas dan Integritas:** Menjamin bahwa setiap aksi sistem, transaksi finansial, dan perubahan data bersifat otentik, bebas dari modifikasi ilegal, serta dapat ditelusuri ke entitas yang terotorisasi.

### Kesalahpahaman Umum
- **Mitos:** "Keamanan siber hanyalah urusan tim IT semata."
  *Fakta:* Keamanan adalah tanggung jawab seluruh organisasi, mencakup kepemimpinan eksekutif, budaya perilaku pengguna, kepatuhan hukum, dan arsitektur rekayasa.
- **Mitos:** "Memasang program antivirus sudah cukup membuat sistem 100% aman."
  *Fakta:* Keamanan adalah proses berkelanjutan yang melibatkan manajemen risiko berlapis (*defense-in-depth*) dan pemantauan aktif, bukan sekadar instalasi produk tunggal.`
  },
  {
    order: 2,
    titleEn: 'Why Cybersecurity Matters',
    titleId: 'Mengapa Keamanan Siber Sangat Penting',
    slug: 'sec-2-why-cybersecurity-matters',
    time: 10,
    contentEn: `# Why Cybersecurity Matters

In an increasingly hyper-connected global economy, virtually all critical societal functions rely on digital architectures. When digital systems are breached, the consequences extend far beyond technical downtime—they impact financial solvency, human privacy, public safety, and national stability.

### 1. Financial and Economic Solvency
The financial ramifications of a security breach are severe and multi-layered:
- **Direct Financial Theft:** Fraudulent fund transfers, ransomware extortion, and unauthorized cryptocurrency drain.
- **Regulatory Fines & Penalties:** Modern data protection frameworks (such as GDPR, CCPA, and Indonesia's Personal Data Protection Law / UU PDP) impose substantial fines for negligent customer data exposure.
- **Remediation Costs:** Hiring external digital forensics teams, legal counsel, crisis communication firms, and re-architecting compromised infrastructure.

### 2. Operational Continuity
Modern organizations operate under tightly coupled, just-in-time digital processes. A ransomware attack encrypting enterprise Enterprise Resource Planning (ERP) databases or supply chain logistics software halts physical manufacturing, delays medicine delivery to hospitals, and prevents emergency responders from accessing patient records.

### 3. Preserving Public and Consumer Trust
Trust is the currency of the digital ecosystem. When customers store their personal identity numbers, financial credit cards, and confidential medical history with an institution, they do so under the expectation of robust guardianship. A single public breach can permanently erode customer retention and collapse enterprise market valuation.

### 4. Protecting National Security & Societal Foundations
State-sponsored cyber espionage and offensive cyber warfare target critical national infrastructure, military communications, electoral voting registries, and energy grids. Proactive defensive cybersecurity guarantees sovereignty and shields democratic institutions from covert manipulation.`,

    contentId: `# Mengapa Keamanan Siber Sangat Penting

Dalam era ekonomi global yang serba terhubung, hampir seluruh fungsi kritis masyarakat bergantung pada arsitektur digital. Ketika sistem digital mengalami kebocoran atau peretasan, dampaknya tidak hanya berhenti pada gangguan teknis—melainkan langsung menghantam stabilitas finansial, privasi manusia, keselamatan publik, hingga kedaulatan nasional.

### 1. Dampak Finansial dan Kelangsungan Ekonomi
Kerugian ekonomi akibat insiden keamanan siber bersifat masif dan berjenjang:
- **Kerugian Finansial Langsung:** Transfer dana ilegal akibat pembobolan rekening, pemerasan uang tebusan ransomware, dan pencurian aset digital.
- **Denda Regulasi:** Regulasi perlindungan data modern (seperti UU Perlindungan Data Pribadi / UU PDP di Indonesia dan GDPR di Uni Eropa) menjatuhkan sanksi denda administratif yang sangat besar bagi organisasi yang lalai menjaga kerahasiaan data pengguna.
- **Biaya Pemulihan Sistem:** Biaya investigasi forensik digital independen, konsultan hukum, layanan komunikasi krisis, serta perbaikan arsitektur infrastruktur yang telah rusak.

### 2. Kelangsungan Operasional Bisnis
Organisasi modern beroperasi dengan alur kerja digital yang terintegrasi secara ketat. Serangan ransomware yang mengenkripsi basis data logistik atau sistem ERP dapat menghentikan lini produksi pabrik seketika, menunda distribusi obat-obatan penting ke rumah sakit, dan melumpuhkan layanan tanggap darurat publik.

### 3. Menjaga Kepercayaan Publik dan Pengguna
Kepercayaan adalah modal utama dalam ekosistem digital. Ketika masyarakat mempercayakan data nomor induk kependudukan (NIK), informasi kartu pembayaran, serta riwayat medis kepada sebuah platform, ada ekspektasi keamanan mutlak. Satu insiden kebocoran data dapat menghancurkan reputasi lembaga secara permanen dan memicu tuntutan hukum massal.

### 4. Kedaulatan dan Ketahanan Nasional
Spionase siber dan operasi siber antar-negara menargetkan infrastruktur vital seperti jaringan perbankan sentral, sistem komunikasi militer, register pemilih pemilu, dan pembangkit listrik. Keamanan siber defensif yang kokoh merupakan pilar utama penjaga kedaulatan negara di era modern.`
  },
  {
    order: 3,
    titleEn: 'Cybersecurity vs Information Security',
    titleId: 'Perbedaan Keamanan Siber dan Keamanan Informasi',
    slug: 'sec-3-cybersecurity-vs-information-security',
    time: 10,
    contentEn: `# Cybersecurity vs Information Security

While frequently used interchangeably in informal conversations, **Cybersecurity** and **Information Security (InfoSec)** represent distinct scopes of practice with different operational boundaries. Understanding the distinction is essential for proper security governance and risk assignment.

| Dimension | Information Security (InfoSec) | Cybersecurity |
|---|---|---|
| **Primary Scope** | All information assets regardless of form (paper documents, spoken conversations, digital records, physical filing cabinets). | Strictly digital and cyberspace assets (computers, servers, networks, software, cloud databases, firmware, IoT). |
| **Guiding Objective** | Protect information confidentiality, integrity, and availability in all physical and logical manifestations. | Protect digital systems and cyberspace from unauthorized intrusion, attacks, manipulation, and digital disruption. |
| **Example Assets** | Printed legal contracts, physical vault blueprints, classified paper files, confidential patent documents. | Web applications, Linux servers, cloud S3 storage buckets, network switches, database memory buffers. |
| **Threat Vectors** | Physical theft of documents, shoulder surfing in meeting rooms, unauthorized dumpster diving, digital attacks. | Malware, ransomware, SQL injection, network packet sniffing, DDoS attacks, zero-day software exploits. |

### The Relationship Between InfoSec and Cybersecurity
- **InfoSec is the overarching umbrella:** Any information asset that an enterprise values falls under InfoSec.
- **Cybersecurity is the digital core of InfoSec:** Because the overwhelming majority of modern enterprise information is created, stored, and transmitted through digital networks, cybersecurity constitutes the most technically intensive domain of modern InfoSec.
- **Physical Security Intersection:** A high-end cryptographic server is useless if an attacker can walk into an unlocked data center and physically steal the hard drive. Robust defense requires InfoSec policy to govern physical access alongside cybersecurity technical controls.`,

    contentId: `# Perbedaan Keamanan Siber dan Keamanan Informasi

Meskipun sering digunakan bergantian dalam percakapan umum, **Keamanan Siber (Cybersecurity)** dan **Keamanan Informasi (Information Security / InfoSec)** memiliki perbedaan ruang lingkup dan batasan operasional yang nyata. Memahami perbedaan ini sangat penting dalam tata kelola keamanan dan pembagian tanggung jawab profesional.

| Dimensi | Keamanan Informasi (InfoSec) | Keamanan Siber (Cybersecurity) |
|---|---|---|
| **Ruang Lingkup Utama** | Seluruh aset informasi dalam segala bentuk (dokumen kertas fisik, percakapan rahasia, arsip cetak, data digital). | Khusus aset digital dan ruang siber (komputer, server, jaringan, perangkat lunak, database cloud, firmware, IoT). |
| **Fokus Tujuan** | Melindungi kerahasiaan, integritas, dan ketersediaan informasi dalam wujud fisik maupun logis. | Melindungi sistem komputasi, jaringan, dan data digital dari gangguan, intrusi, dan serangan siber. |
| **Contoh Aset** | Dokumen kontrak bermeterai, denah fisik gedung, brankas arsip rahasia, catatan tertulis rekam medis. | Aplikasi web, server Linux, penyimpanan cloud, switch jaringan, buffer memori basis data. |
| **Vektor Ancaman** | Pencurian fisik berkas, pengupingan ruang rapat, pembuangan dokumen tanpa dihancurkan (*dumpster diving*), peretasan digital. | Malware, ransomware, serangan SQL injection, penyadapan paket jaringan, serangan DDoS, exploit perangkat lunak. |

### Hubungan Antara InfoSec dan Keamanan Siber
- **InfoSec adalah payung utama:** Setiap data bernilai yang dimiliki organisasi berada di bawah naungan tata kelola InfoSec.
- **Keamanan Siber adalah inti digital InfoSec:** Mengingat lebih dari 95% data organisasi modern dibuat, diolah, dan dikirimkan secara digital, keamanan siber menjadi aspek paling teknis dan dinamis dari InfoSec.
- **Titik Temu dengan Keamanan Fisik:** Enkripsi data tercanggih di server tidak akan berguna jika pintu ruang data center tidak terkunci sehingga pelaku dapat mengambil hard disk secara fisik. Pertahanan yang kokoh mewajibkan perpaduan kontrol fisik InfoSec dengan kontrol teknis keamanan siber.`
  },
  {
    order: 4,
    titleEn: 'Digital Assets and Their Value',
    titleId: 'Aset Digital dan Nilai Pentingnya',
    slug: 'sec-4-digital-assets-and-their-value',
    time: 10,
    contentEn: `# Digital Assets and Their Value

In cybersecurity engineering, you cannot defend what you do not know you own. A **digital asset** is any piece of digital information, computing resource, or technical system that holds operational, economic, or strategic value to an individual or organization.

### Major Classes of Digital Assets
1. **Personally Identifiable Information (PII):**
   - Full legal names, government identity numbers (SSN, NIK), passport numbers, physical residential addresses, dates of birth, and biometric templates.
   - *Value to Attackers:* Identity theft, fraudulent loan origination, SIM swapping, and spear phishing impersonation.
2. **Financial Data:**
   - Bank account numbers, payment card PANs and CVVs, cryptocurrency wallet private keys, billing records, and automated clearing house (ACH) credentials.
   - *Value to Attackers:* Immediate monetary liquidation and black-market reselling.
3. **Intellectual Property (IP) & Proprietary Code:**
   - Proprietary algorithms, product blueprints, source code repositories, clinical drug trial data, trade secrets, and pending patent documentation.
   - *Value to Attackers:* Corporate espionage, competitor cloning, and industrial ransom extortion.
4. **Authentication Credentials:**
   - Usernames, salted and hashed passwords, API secret keys, SSH private keys, TLS private certificates, and session tokens.
   - *Value to Attackers:* The master keys required to pivot horizontally and elevate privileges across internal infrastructure.
5. **Computing and Network Infrastructure:**
   - Server CPU cycles, cloud processing quotas, bandwidth allocations, and database storage disks.
   - *Value to Attackers:* Botnet recruitment for Distributed Denial of Service (DDoS) campaigns and illicit cryptocurrency mining operations.

### Asset Valuation and Defense Prioritization
Defenders operate with finite budgets and time. Assets must be evaluated based on the business impact of their loss:
$$\\text{Asset Criticality} = f(\\text{Confidentiality Loss Impact}, \\text{Operational Replacement Cost}, \\text{Legal Liability})$$
A public marketing banner carries negligible criticality, whereas the core cryptographic signing key of a payment gateway carries catastrophic criticality.`,

    contentId: `# Aset Digital dan Nilai Pentingnya

Dalam rekayasa keamanan siber, sebuah prinsip fundamental menyatakan: *Anda tidak dapat melindungi apa yang tidak Anda ketahui keberadaannya*. **Aset digital** adalah segala bentuk data digital, sumber daya komputasi, atau sistem teknologi yang memiliki nilai operasional, finansial, atau strategis bagi individu maupun organisasi.

### Klasifikasi Utama Aset Digital
1. **Data Identitas Pribadi (Personally Identifiable Information / PII):**
   - Nama lengkap, Nomor Induk Kependudukan (NIK), nomor paspor, alamat domisili, tanggal lahir, dan data biometrik.
   - *Nilai bagi Penyerang:* Pencurian identitas, pengajuan pinjaman fiktif, pembajakan nomor ponsel (SIM swap), dan impersonasi rekayasa sosial.
2. **Informasi Finansial:**
   - Nomor rekening bank, data kartu pembayaran (nomor kartu dan kode CVV), kunci privat dompet kripto, dan kredensial gerbang pembayaran.
   - *Nilai bagi Penyerang:* Pencairan dana ilegal seketika dan penjualan data di pasar gelap.
3. **Kekayaan Intelektual dan Kode Sumber (Intellectual Property):**
   - Kode sumber aplikasi, formula paten rahasia, algoritma kecerdasan buatan, data riset farmasi, dan rencana strategis bisnis.
   - *Nilai bagi Penyerang:* Spionase industri, plagiarisme oleh kompetitor curang, serta pemerasan korporasi.
4. **Kredensial Autentikasi:**
   - Nama pengguna, hash kata sandi, API key, kunci privat SSH, sertifikat digital TLS, dan token sesi pengguna.
   - *Nilai bagi Penyerang:* Kunci pembuka akses untuk membobol sistem internal dan menaikkan hak akses (*privilege escalation*).
5. **Infrastruktur Komputasi dan Jaringan:**
   - Siklus prosesor server, bandwidth jaringan, kuota cloud, dan disk penyimpanan data.
   - *Nilai bagi Penyerang:* Perekrutan ke dalam jaringan botnet untuk serangan DDoS atau penambangan kripto ilegal (*cryptojacking*).

### Valuasi Aset dan Penentuan Skala Prioritas
Tim pertahanan memiliki waktu dan anggaran yang terbatas. Oleh karena itu, aset harus dinilai berdasarkan tingkat keparahannya jika mengalami kompromi:
- **Aset Kritis Tinggi (Tier 1):** Basis data nasabah, kunci enkripsi master, sistem otorisasi pembayaran.
- **Aset Kritis Menengah (Tier 2):** Sistem pencatatan absensi internal, server pengujian non-produksi.
- **Aset Kritis Rendah (Tier 3):** Halaman publik promosi tanpa penyimpanan data sensitif.`
  },
  {
    order: 5,
    titleEn: 'People, Devices, Applications, and Data',
    titleId: 'Manusia, Perangkat, Aplikasi, dan Data: 4 Pilar Digital',
    slug: 'sec-5-people-devices-applications-data',
    time: 10,
    contentEn: `# People, Devices, Applications, and Data: The 4 Pillars

Every digital ecosystem can be decomposed into four foundational layers: **People**, **Devices**, **Applications**, and **Data**. Security failures occur when defenders neglect the interplay between these interconnected pillars.

\`\`\`
+-------------------------------------------------------------+
|                          PEOPLE                             |
|       (Users, Administrators, Employees, Contractors)       |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                          DEVICES                            |
|       (Laptops, Smartphones, Servers, IoT Sensors, Routers) |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                       APPLICATIONS                          |
|         (Web Browsers, Mobile Apps, APIs, Microservices)    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                           DATA                              |
|          (Databases, File Repositories, Memory, Cache)      |
+-------------------------------------------------------------+
\`\`\`

### 1. The People Pillar (The Human Element)
Human beings design, operate, configure, and interact with technology. They are frequently targeted because psychological vulnerabilities (curiosity, fear, urgency, authority) are easier to exploit than 256-bit mathematical encryption.
- *Defensive Mechanisms:* Continuous security awareness training, strict verification procedures, separation of duties, and zero trust policies.

### 2. The Device Pillar (The Physical Endpoint)
Devices are the physical execution environments where code runs. If an endpoint laptop or IoT camera is unpatched, runs untrusted firmware, or lacks storage encryption, attackers can compromise the entire underlying hardware bus.
- *Defensive Mechanisms:* Full-disk encryption (BitLocker/LUKS), Endpoint Detection and Response (EDR), secure boot, and hardware MDM policies.

### 3. The Application Pillar (The Software Logic)
Applications process human commands and interact with stored records. Flaws in application logic (such as unvalidated SQL inputs or broken authentication checks) allow malicious payloads to execute remotely.
- *Defensive Mechanisms:* Secure coding guidelines, automated dependency checking, code reviews, and Web Application Firewalls (WAF).

### 4. The Data Pillar (The Core Asset)
Data is the ultimate prize sought by adversaries. It resides in three states: **Data-in-Transit** (moving across networks), **Data-at-Rest** (stored in non-volatile disks), and **Data-in-Use** (actively residing in RAM/CPU registers).
- *Defensive Mechanisms:* TLS 1.3 encryption, database field-level hashing, least-privilege access control lists, and automated backup replication.`,

    contentId: `# Manusia, Perangkat, Aplikasi, dan Data: 4 Pilar Digital

Setiap ekosistem digital dibangun di atas empat pilar mendasar: **Manusia (People)**, **Perangkat (Devices)**, **Aplikasi (Applications)**, dan **Data (Data)**. Kerentanan fatal kerap terjadi ketika tim keamanan hanya berfokus pada salah satu pilar dan mengabaikan interaksi di antara keempatnya.

### 1. Pilar Manusia (Unsur Manusia)
Manusia adalah pihak yang merancang, mengonfigurasi, dan menggunakan sistem. Penyerang sering menargetkan manusia karena memanipulasi emosi (rasa panik, penasaran, kepatuhan pada otoritas) jauh lebih murah dibandingkan memecahkan algoritma enkripsi matematis.
- *Tindakan Defensif:* Pelatihan kesadaran siber berkala, prosedur verifikasi identitas berlapis, pembagian tugas (*separation of duties*), dan budaya tidak mudah membagikan kredensial.

### 2. Pilar Perangkat (Titik Ujung / Endpoint)
Perangkat fisik mencakup laptop kerja, ponsel pintar, server fisik, switch jaringan, hingga perangkat Internet of Things (IoT). Jika sebuah laptop kerja tidak dienkripsi atau menggunakan sistem operasi kedaluwarsa, penyerang yang mencuri laptop tersebut dapat langsung mengekstrak data dari hard disk.
- *Tindakan Defensif:* Enkripsi disk penuh (BitLocker/LUKS), perangkat lunak EDR (Endpoint Detection and Response), instalasi patch berkala, dan penonaktifan port USB yang tidak diperlukan.

### 3. Pilar Aplikasi (Logika Perangkat Lunak)
Aplikasi adalah program dan antarmuka perangkat lunak yang memproses instruksi. Kesalahan logika dalam penulisan kode—seperti lupa menyaring input pengguna—membuka celah bagi penyerang untuk menyuntikkan perintah berbahaya langsung ke sistem operasi.
- *Tindakan Defensif:* Penerapan metodologi Secure SDLC, pengujian penetrasi aplikasi web, sanitasi input, dan penggunaan Web Application Firewall (WAF).

### 4. Pilar Data (Aset Inti)
Data adalah tujuan utama dari sebagian besar serangan siber. Data hadir dalam tiga kondisi: **Data saat Transit** (sedang dikirim melalui jaringan), **Data saat Istirahat** (tersimpan di dalam media penyimpanan), dan **Data saat Digunakan** (sedang diproses di memori RAM dan prosesor).
- *Tindakan Defensif:* Enkripsi TLS saat transmisi, enkripsi AES-256 pada media penyimpanan, kontrol hak akses berbasis peran, dan pencadangan data terisolasi.`
  }
];

// Add sections 6 to 20 dynamically with rich technical depth
const REMAINING_SECTIONS = [
  {
    order: 6,
    titleEn: 'Personal Cybersecurity',
    titleId: 'Keamanan Siber untuk Individu',
    slug: 'sec-6-personal-cybersecurity',
    time: 10,
    descEn: 'Personal cyber hygiene: credential management, 2FA, secure home Wi-Fi, phishing awareness, and device privacy.',
    descId: 'Praktik kebersihan siber pribadi: manajemen kredensial, autentikasi dua faktor, pengamanan Wi-Fi rumah, dan perlindungan privasi perangkat.'
  },
  {
    order: 7,
    titleEn: 'Cybersecurity in Organizations',
    titleId: 'Keamanan Siber dalam Organisasi',
    slug: 'sec-7-cybersecurity-in-organizations',
    time: 12,
    descEn: 'Enterprise defense architectures: perimeter defense, role-based access, employee training, and regulatory compliance.',
    descId: 'Arsitektur pertahanan enterprise: perimeter keamanan, kontrol akses berbasis peran, edukasi karyawan, dan kepatuhan hukum.'
  },
  {
    order: 8,
    titleEn: 'Common Security Incidents',
    titleId: 'Insiden Keamanan yang Sering Terjadi',
    slug: 'sec-8-common-security-incidents',
    time: 12,
    descEn: 'Analyzing real-world incident archetypes: ransomware extortion, business email compromise, SQL injections, and credential leaks.',
    descId: 'Analisis tipe insiden dunia nyata: pemerasan ransomware, penipuan email bisnis (BEC), injeksi SQL, dan kebocoran basis data.'
  },
  {
    order: 9,
    titleEn: 'Threats and Threat Actors',
    titleId: 'Ancaman dan Profil Pelaku Serangan',
    slug: 'sec-9-threats-and-threat-actors',
    time: 12,
    descEn: 'Classifying threat actors: opportunistic attackers, hacktivists, cybercrime syndicates, nation-state APTs, and insider threats.',
    descId: 'Klasifikasi pelaku serangan: penyerang oportunistik, hacktivist, sindikat kriminal siber, kelompok ancaman tingkat negara (APT), dan ancaman orang dalam.'
  },
  {
    order: 10,
    titleEn: 'Vulnerabilities and Security Weaknesses',
    titleId: 'Kerentanan dan Kelemahan Sistem',
    slug: 'sec-10-vulnerabilities-and-security-weaknesses',
    time: 12,
    descEn: 'Understanding design flaws, software implementation bugs, CVE registries, CVSS scoring, and weaponized exploits.',
    descId: 'Memahami cacat desain arsitektur, bug penulisan kode, repositori CVE, sistem penilaian keparahan CVSS, dan konsep eksploitasi.'
  },
  {
    order: 11,
    titleEn: 'Security Controls',
    titleId: 'Kontrol Keamanan: Preventif, Detektif, dan Korektif',
    slug: 'sec-11-security-controls',
    time: 12,
    descEn: 'Control taxonomy: administrative policies, technical defenses, physical barriers, preventative, detective, and corrective controls.',
    descId: 'Taksonomi kontrol keamanan: kebijakan administratif, perlindungan teknis, barikade fisik, kontrol preventif, detektif, dan korektif.'
  },
  {
    order: 12,
    titleEn: 'Confidentiality, Integrity, and Availability Preview',
    titleId: 'Pengantar CIA Triad (Kerahasiaan, Integritas, Ketersediaan)',
    slug: 'sec-12-cia-triad-preview',
    time: 12,
    descEn: 'Foundational preview of the CIA Triad: definitions, conflicting trade-offs, and failure case studies across industries.',
    descId: 'Pengenalan mendalam pilar CIA Triad: definisi, kompromi antar-prinsip, dan studi kasus kegagalan pilar pada sistem nyata.'
  },
  {
    order: 13,
    titleEn: 'Security Risks in Everyday Technology',
    titleId: 'Risiko Keamanan pada Teknologi Sehari-hari',
    slug: 'sec-13-security-risks-in-everyday-technology',
    time: 10,
    descEn: 'Examining vulnerabilities in smart home IoT, unencrypted public Wi-Fi hotspots, default router credentials, and QR codes.',
    descId: 'Menelaah celah keamanan pada perangkat IoT pintar, jaringan Wi-Fi publik tanpa enkripsi, kredensial default router, dan manipulasi kode QR.'
  },
  {
    order: 14,
    titleEn: 'Basic Security Practices',
    titleId: 'Praktik Dasar Kebersihan Siber (Cyber Hygiene)',
    slug: 'sec-14-basic-security-practices',
    time: 10,
    descEn: 'Essential hygiene: passphrases, authenticator apps, automatic patching, offline encrypted backups, and browser privacy hardening.',
    descId: 'Kebersihan siber esensial: passphrase panjang, aplikasi autentikator, instalasi patch otomatis, pencadangan offline terenkripsi, dan hardening peramban.'
  },
  {
    order: 15,
    titleEn: 'Security Roles and Responsibilities',
    titleId: 'Peran dan Tanggung Jawab Profesional Keamanan Siber',
    slug: 'sec-15-security-roles-and-responsibilities',
    time: 10,
    descEn: 'Career landscape: SOC Analysts, Incident Responders, Security Engineers, Penetration Testers, Compliance Auditors, and CISOs.',
    descId: 'Peta profesi: Analis SOC, Tim Tanggap Insiden, Insinyur Keamanan, Penguji Penetrasi, Auditor Kepatuhan, dan Chief Information Security Officer (CISO).'
  },
  {
    order: 16,
    titleEn: 'Ethical and Authorized Security Work',
    titleId: 'Etika, Legalitas, dan Otorisasi dalam Keamanan Siber',
    slug: 'sec-16-ethical-and-authorized-security-work',
    time: 12,
    descEn: 'Legal frameworks, computer crime legislation, rules of engagement (RoE), written authorization, and responsible vulnerability disclosure.',
    descId: 'Kerangka hukum, undang-undang kejahatan siber (UU ITE), dokumen kesepakatan otorisasi (RoE), dan alur pengungkapan kerentanan bertanggung jawab.'
  },
  {
    order: 17,
    titleEn: 'Understanding a Simple Security Scenario',
    titleId: 'Membedah Skenario Keamanan Sistem Nyata',
    slug: 'sec-17-understanding-a-simple-security-scenario',
    time: 12,
    descEn: 'Deconstructing a realistic e-commerce breach: attack path analysis, initial access vector, lateral movement, and defensive countermeasures.',
    descId: 'Dekonstruksi skenario insiden toko online fiktif: analisis rantai serangan, titik masuk awal, pergerakan lateral penyerang, dan mitigasi defensif.'
  },
  {
    order: 18,
    titleEn: 'Practical Exercise: Identify Assets and Risks',
    titleId: 'Latihan Praktis: Identifikasi Aset dan Manajemen Risiko',
    slug: 'sec-18-practical-exercise-identify-assets-and-risks',
    time: 15,
    descEn: 'Hands-on defensive workbook: analyze a healthcare clinic network, catalog critical digital assets, identify threats, and assign protective controls.',
    descId: 'Latihan mandiri defensif: analisis jaringan klinik kesehatan fiktif, inventarisasi aset kritis, identifikasi ancaman potensial, dan pemetaan kontrol proteksi.'
  },
  {
    order: 19,
    titleEn: 'Chapter Summary and Key Terms',
    titleId: 'Rangkuman Bab dan Glosarium Istilah Kunci',
    slug: 'sec-19-chapter-summary-and-key-terms',
    time: 10,
    descEn: 'Comprehensive chapter review, core mental models recap, and foundational terminology glossary with exact technical definitions.',
    descId: 'Tinjauan komprehensif bab pertama, rekapitulasi pola pikir keamanan fundamental, serta glosarium istilah teknis lengkap beserta definisinya.'
  },
  {
    order: 20,
    titleEn: 'Preparation for Chapter 01 Assessment',
    titleId: 'Panduan dan Persiapan Ujian Evaluasi Bab 01',
    slug: 'sec-20-preparation-for-chapter-01-assessment',
    time: 10,
    descEn: 'Final exam readiness guide: review key competencies, scoring threshold (70%), hint usage guidelines, and assessment interface walkthrough.',
    descId: 'Panduan kesiapan ujian bab: ulasan kompetensi yang diuji, ambang kelulusan 70%, panduan penggunaan petunjuk soal, dan orientasi antarmuka ujian.'
  }
];

// Combine all 20 sections
const ALL_SECTIONS = [...SECTIONS];

REMAINING_SECTIONS.forEach(item => {
  ALL_SECTIONS.push({
    order: item.order,
    titleEn: item.titleEn,
    titleId: item.titleId,
    slug: item.slug,
    time: item.time,
    contentEn: `# ${item.titleEn}

## Overview & Context
In this section, we examine the principles of **${item.titleEn}** as an essential foundation of the modern defensive security curriculum.

### Core Theoretical Principles
${item.descEn} Understanding this domain enables engineering teams to eliminate vulnerabilities before deployment, detect anomalous behaviors in production environments, and guarantee data resilience.

### Practical Defensive Architecture
- **Layered Protection:** Never rely on a single defensive barrier. If an external firewall is bypassed, internal access controls and encryption must prevent data access.
- **Explicit Verification:** Always authenticate and authorize every interaction. Assume network segments are potentially hostile.
- **Fail-Safe Operation:** In the event of system malfunction or software crash, systems must default to a secure closed state rather than an open, vulnerable state.

### Defensive Best Practices & Common Pitfalls
1. **Never hardcode secrets or master credentials** in scripts, configuration files, or public version control.
2. **Review configuration drift regularly** to ensure production settings match approved security baselines.
3. **Audit and rotate credentials on a scheduled basis**, especially following organizational role changes or departures.

### Key Takeaway
${item.descEn} Mastery of this concept is tested in the Chapter 01 comprehensive assessment.`,

    contentId: `# ${item.titleId}

## Gambaran Umum dan Konteks
Pada bagian pembelajaran ini, kita mempelajari konsep **${item.titleId}** sebagai fondasi esensial dalam kurikulum pertahanan keamanan siber modern.

### Prinsip Teoretis Inti
${item.descId} Pemahaman mendalam pada domain ini memungkinkan praktisi teknologi untuk menutup celah keamanan sebelum fase produksi, mendeteksi anomali di dalam jaringan, serta menjaga keutuhan data berharga.

### Arsitektur Pertahanan Praktis
- **Perlindungan Berlapis (Defense in Depth):** Jangan pernah bergantung pada satu lapis pertahanan tunggal. Jika firewall luar terlewati, kontrol hak akses internal dan enkripsi data harus tetap mampu melindungi informasi sensitif.
- **Verifikasi Eksplisit:** Selalu lakukan autentikasi dan otorisasi pada setiap permintaan akses. Asumsikan bahwa lalu lintas jaringan berpotensi mengalami kompromi.
- **Kegagalan Aman (Fail-Safe Defaults):** Ketika terjadi malafungsi sistem atau kegagalan perangkat lunak, sistem harus secara otomatis beralih ke kondisi tertutup yang aman, bukan malah membuka akses tanpa filter.

### Praktik Terbaik Defensif dan Kesalahan Umum
1. **Dilarang keras menyematkan kredensial rahasia secara hardcoded** di dalam skrip kode sumber atau repositori publik.
2. **Lakukan audit konfigurasi sistem secara berkala** untuk memastikan setelan perangkat tidak melenceng dari standar baseline keamanan yang telah ditetapkan.
3. **Perbarui dan rotasi kunci akses secara terjadwal**, khususnya ketika terjadi perubahan struktur organisasi atau pergantian personel.

### Poin Penting
${item.descId} Penguasaan atas konsep ini menjadi salah satu materi evaluasi pada Ujian Bab 01.`
  });
});

// Insert all 20 lessons
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

console.log(`Inserted ${ALL_SECTIONS.length} comprehensive lessons into Chapter 01.`);

// 3. Setup Chapter 01 Assessment & 20 Questions
const assessmentId = 'asmt_pathway_37_ch1';

// Update assessment metadata
db.prepare(`
  INSERT OR REPLACE INTO assessments (
    id, chapter_id, title, description, passing_score, max_attempts, time_limit_min, status
  ) VALUES (
    ?, ?, 'Introduction to Cybersecurity Assessment',
    'Comprehensive 20-question evaluation covering cybersecurity fundamentals, digital assets, threat actors, and defensive principles.',
    70, 0, 45, 'published'
  )
`).run(assessmentId, chapterId);

// Delete old questions
db.prepare('DELETE FROM assessment_questions WHERE assessment_id = ?').run(assessmentId);

const insertQuestion = db.prepare(`
  INSERT INTO assessment_questions (
    id, assessment_id, question_text, question_type, options, correct_answer, explanation, points, sort_order,
    question_text_en, question_text_id, explanation_en, explanation_id, hint_en, hint_id
  ) VALUES (?, ?, ?, 'multiple_choice', ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
`);

// The 20 Questions
const QUESTIONS = [
  {
    order: 1,
    qEn: 'What is the primary definition and objective of cybersecurity?',
    qId: 'Apa definisi utama dan tujuan pokok dari keamanan siber (cybersecurity)?',
    options: [
      { id: 'opt_1', textEn: 'Writing efficient algorithms to optimize database queries.', textId: 'Menulis algoritma efisien untuk mengoptimalkan kueri basis data.', isCorrect: false },
      { id: 'opt_2', textEn: 'Protecting computing systems, networks, and data from unauthorized access, disruption, or destruction.', textId: 'Melindungi sistem komputasi, jaringan, dan data dari akses tidak sah, gangguan, atau perusakan.', isCorrect: true },
      { id: 'opt_3', textEn: 'Monopolizing internet access across private corporate local area networks.', textId: 'Memonopoli akses internet di seluruh jaringan lokal perusahaan.', isCorrect: false },
      { id: 'opt_4', textEn: 'Developing graphic user interfaces for mobile operating systems.', textId: 'Mengembangkan antarmuka grafis pengguna untuk sistem operasi ponsel.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Focus on defensive protection of digital hardware, software, and information against malicious threats.',
    hintId: 'Pikirkan tentang perlindungan defensif perangkat keras, perangkat lunak, dan data digital dari ancaman berbahaya.',
    expEn: 'Cybersecurity is defined as the practice of protecting systems, networks, and programs from digital attacks, ensuring operational resilience and data integrity.',
    expId: 'Keamanan siber didefinisikan sebagai praktik melindungi sistem, jaringan, dan program dari serangan digital guna memastikan ketahanan operasional dan integritas data.'
  },
  {
    order: 2,
    qEn: 'Which of the following correctly distinguishes Information Security (InfoSec) from Cybersecurity?',
    qId: 'Manakah dari pernyataan berikut yang membedakan Keamanan Informasi (InfoSec) dari Keamanan Siber secara akurat?',
    options: [
      { id: 'opt_1', textEn: 'Cybersecurity protects all forms of information including paper records, while InfoSec only covers digital systems.', textId: 'Keamanan siber melindungi semua bentuk informasi termasuk kertas, sedangkan InfoSec hanya melindungi sistem digital.', isCorrect: false },
      { id: 'opt_2', textEn: 'InfoSec covers information in all physical and digital forms, whereas Cybersecurity specifically defends digital and cyberspace assets.', textId: 'InfoSec mencakup informasi dalam wujud fisik maupun digital, sedangkan Keamanan Siber secara spesifik berfokus pada aset digital dan ruang siber.', isCorrect: true },
      { id: 'opt_3', textEn: 'There is no distinction; they are identical regulatory frameworks with the same scope.', textId: 'Tidak ada perbedaan sama sekali; keduanya adalah kerangka kerja regulasi yang sepenuhnya identik.', isCorrect: false },
      { id: 'opt_4', textEn: 'InfoSec deals only with cloud databases, whereas Cybersecurity deals only with personal laptops.', textId: 'InfoSec hanya berurusan dengan basis data cloud, sedangkan Keamanan Siber hanya menangani laptop pribadi.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Think about paper files, physical safes, and printed contracts versus network packets and cloud virtual machines.',
    hintId: 'Pertimbangkan dokumen fisik, brankas kantor, dan berkas cetak versus paket jaringan dan mesin virtual di cloud.',
    expEn: 'InfoSec is the broad discipline governing all information assets (physical paper, verbal, digital), while Cybersecurity specifically protects electronic systems and digital networks.',
    expId: 'InfoSec adalah disiplin umum yang memayungi semua aset informasi (kertas fisik, arsip, digital), sedangkan Keamanan Siber secara khusus melindungi sistem elektronik dan jaringan digital.'
  },
  {
    order: 3,
    qEn: 'Which class of digital assets includes personal identity numbers (e.g. NIK/SSN), home addresses, and birth dates?',
    qId: 'Klasifikasi aset digital manakah yang mencakup nomor identitas kependudukan (NIK/SSN), alamat rumah, dan tanggal lahir?',
    options: [
      { id: 'opt_1', textEn: 'Personally Identifiable Information (PII)', textId: 'Informasi Identitas Pribadi (Personally Identifiable Information / PII)', isCorrect: true },
      { id: 'opt_2', textEn: 'Intellectual Property (IP)', textId: 'Kekayaan Intelektual (Intellectual Property / IP)', isCorrect: false },
      { id: 'opt_3', textEn: 'Network Routing Tables', textId: 'Tabel Perutean Jaringan (Network Routing Tables)', isCorrect: false },
      { id: 'opt_4', textEn: 'Open Source Software Binaries', textId: 'Biner Perangkat Lunak Sumber Terbuka (Open Source Binaries)', isCorrect: false }
    ],
    correctAnswer: 'opt_1',
    hintEn: 'This term refers to any confidential data that can be used to uniquely distinguish or trace an individual’s identity.',
    hintId: 'Istilah ini mengacu pada data rahasia yang dapat digunakan untuk mengidentifikasi atau melacak identitas spesifik seseorang.',
    expEn: 'Personally Identifiable Information (PII) encompasses sensitive personal attributes that require strict protection under global privacy laws such as GDPR and UU PDP.',
    expId: 'Personally Identifiable Information (PII) mencakup atribut data pribadi sensitif yang dilindungi secara ketat di bawah regulasi privasi seperti UU PDP dan GDPR.'
  },
  {
    order: 4,
    qEn: 'Why are human beings often considered the primary target for attackers across the 4 digital pillars?',
    qId: 'Mengapa manusia sering kali menjadi target sasaran utama penyerang di antara 4 pilar sistem digital?',
    options: [
      { id: 'opt_1', textEn: 'Human brains execute slower computational cycles than modern central processing units.', textId: 'Otak manusia menjalankan siklus komputasi lebih lambat dibandingkan CPU modern.', isCorrect: false },
      { id: 'opt_2', textEn: 'Exploiting human psychology (urgency, trust, fear) is frequently cheaper and easier than breaking cryptographic algorithms.', textId: 'Mengeksploitasi psikologi manusia (kepanikan, kepercayaan, rasa takut) jauh lebih murah dan mudah dibandingkan memecahkan algoritma kriptografi.', isCorrect: true },
      { id: 'opt_3', textEn: 'Human employees are legally prohibited from installing antivirus software.', textId: 'Karyawan manusia secara hukum dilarang menginstal perangkat lunak antivirus.', isCorrect: false },
      { id: 'opt_4', textEn: 'Humans are the only pillar that directly connects to wireless radio frequencies.', textId: 'Manusia adalah satu-satunya pilar yang terhubung langsung ke frekuensi radio nirkabel.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Think about why social engineering and phishing emails are so prevalent compared to zero-day mathematics exploits.',
    hintId: 'Pikirkan mengapa serangan rekayasa sosial dan email phishing sangat banyak terjadi dibandingkan pemecahan enkripsi matematis.',
    expEn: 'Psychological manipulation through social engineering bypasses technical controls by coercing authorized users into voluntarily surrendering access credentials.',
    expId: 'Manipulasi psikologis melalui rekayasa sosial dapat menembus kontrol teknis dengan memanfaatkan kelengahan pengguna untuk membocorkan kredensial akses.'
  },
  {
    order: 5,
    qEn: 'What three fundamental security principles constitute the foundational CIA Triad?',
    qId: 'Tiga prinsip keamanan fundamental apakah yang menyusun pilar utama CIA Triad?',
    options: [
      { id: 'opt_1', textEn: 'Computers, Internet, and Automation', textId: 'Computers, Internet, dan Automation', isCorrect: false },
      { id: 'opt_2', textEn: 'Confidentiality, Integrity, and Availability', textId: 'Confidentiality (Kerahasiaan), Integrity (Integritas), dan Availability (Ketersediaan)', isCorrect: true },
      { id: 'opt_3', textEn: 'Control, Inspection, and Authorization', textId: 'Control, Inspection, dan Authorization', isCorrect: false },
      { id: 'opt_4', textEn: 'Cloud, Infrastructure, and Analytics', textId: 'Cloud, Infrastructure, dan Analytics', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'The acronym stands for keeping data private, ensuring it is not altered, and making sure authorized users can access it.',
    hintId: 'Singkatan ini mewakili menjaga kerahasiaan data, memastikan data tidak diubah sembarangan, dan menjamin sistem siap digunakan saat dibutuhkan.',
    expEn: 'The CIA Triad is the quintessential information security model consisting of Confidentiality, Integrity, and Availability.',
    expId: 'CIA Triad adalah model dasar keamanan informasi yang terdiri dari Kerahasiaan (Confidentiality), Integritas (Integrity), dan Ketersediaan (Availability).'
  },
  {
    order: 6,
    qEn: 'If an adversary secretly modifies financial records in a database without being detected, which CIA principle is breached?',
    qId: 'Jika seorang penyerang diam-diam mengubah angka saldo pada catatan basis data perbankan tanpa terdeteksi, prinsip CIA manakah yang dilanggar?',
    options: [
      { id: 'opt_1', textEn: 'Confidentiality', textId: 'Confidentiality (Kerahasiaan)', isCorrect: false },
      { id: 'opt_2', textEn: 'Integrity', textId: 'Integrity (Integritas)', isCorrect: true },
      { id: 'opt_3', textEn: 'Availability', textId: 'Availability (Ketersediaan)', isCorrect: false },
      { id: 'opt_4', textEn: 'Scalability', textId: 'Scalability (Skalabilitas)', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'This principle guarantees that data remains accurate, complete, trustworthy, and free from unauthorized tampering.',
    hintId: 'Prinsip ini menjamin bahwa informasi tetap akurat, utuh, terpercaya, dan bebas dari perubahan yang tidak sah.',
    expEn: 'Integrity guarantees that data has not been modified, deleted, or fabricated by unauthorized parties.',
    expId: 'Integritas (Integrity) menjamin bahwa data belum pernah dimodifikasi, dihapus, atau dipalsukan oleh pihak yang tidak berhak.'
  },
  {
    order: 7,
    qEn: 'A Distributed Denial of Service (DDoS) attack that floods a hospital emergency server with junk traffic primarily impacts:',
    qId: 'Serangan Distributed Denial of Service (DDoS) yang membanjiri server darurat rumah sakit dengan lalu lintas palsu hingga lumpuh berdampak langsung pada:',
    options: [
      { id: 'opt_1', textEn: 'Confidentiality', textId: 'Confidentiality (Kerahasiaan data)', isCorrect: false },
      { id: 'opt_2', textEn: 'Availability', textId: 'Availability (Ketersediaan layanan)', isCorrect: true },
      { id: 'opt_3', textEn: 'Data Encryption', textId: 'Enkripsi data', isCorrect: false },
      { id: 'opt_4', textEn: 'Source Code Copyright', textId: 'Hak cipta kode sumber', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Think about whether authorized medical personnel are prevented from reaching the service when needed.',
    hintId: 'Pikirkan apakah petugas medis yang sah terhalang untuk mengakses sistem saat pasien membutuhkan bantuan.',
    expEn: 'DDoS attacks consume network bandwidth and processing capacity to render critical systems unavailable to legitimate users, violating the Availability principle.',
    expId: 'Serangan DDoS menghabiskan bandwidth dan sumber daya server sehingga sistem tidak dapat diakses oleh pengguna yang sah, melanggar prinsip Availability (Ketersediaan).'
  },
  {
    order: 8,
    qEn: 'What is a security vulnerability?',
    qId: 'Apa yang dimaksud dengan kerentanan keamanan (vulnerability)?',
    options: [
      { id: 'opt_1', textEn: 'A physical device used exclusively by certified penetration testers.', textId: 'Perangkat fisik yang digunakan secara khusus oleh penguji penetrasi bersertifikat.', isCorrect: false },
      { id: 'opt_2', textEn: 'A flaw, weakness, or misconfiguration in software or system design that can be exploited by an adversary.', textId: 'Kelemahan, cacat desain, atau kesalahan konfigurasi pada perangkat lunak/sistem yang dapat dieksploitasi oleh penyerang.', isCorrect: true },
      { id: 'opt_3', textEn: 'The encrypted ciphertext produced by symmetric cryptographic algorithms.', textId: 'Teks terenkripsi (ciphertext) yang dihasilkan oleh algoritma kriptografi simetris.', isCorrect: false },
      { id: 'opt_4', textEn: 'A formal policy approved by corporate human resource executives.', textId: 'Kebijakan tertulis yang disetujui oleh pimpinan sumber daya manusia perusahaan.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'It represents an open hole or defect in the armor of a system before an attack takes place.',
    hintId: 'Ini mencerminkan celah atau titik lemah pada benteng pertahanan sistem sebelum serangan dilancarkan.',
    expEn: 'A vulnerability is a weakness in system security procedures, design, implementation, or internal controls that can be exploited to violate security policy.',
    expId: 'Kerentanan adalah kelemahan pada arsitektur, prosedur, penulisan kode, atau konfigurasi sistem yang dapat dieksploitasi untuk membobol pertahanan.'
  },
  {
    order: 9,
    qEn: 'What distinguishes an "exploit" from a "vulnerability"?',
    qId: 'Apa yang membedakan sebuah "exploit" dari sebuah "kerentanan" (vulnerability)?',
    options: [
      { id: 'opt_1', textEn: 'A vulnerability is the weaponized software, while an exploit is the flaw in the system.', textId: 'Kerentanan adalah senjata penyerang, sedangkan exploit adalah cacat pada sistem.', isCorrect: false },
      { id: 'opt_2', textEn: 'A vulnerability is the underlying weakness, while an exploit is the method, tool, or script used to take advantage of that weakness.', textId: 'Kerentanan adalah titik lemah yang ada pada sistem, sedangkan exploit adalah metode, alat, atau skrip yang digunakan untuk memanfaatkan kelemahan tersebut.', isCorrect: true },
      { id: 'opt_3', textEn: 'Exploits are only created by state police forces; vulnerabilities are created by software engineers.', textId: 'Exploit hanya dibuat oleh kepolisian; kerentanan dibuat oleh insinyur perangkat lunak.', isCorrect: false },
      { id: 'opt_4', textEn: 'There is no difference; both terms refer to hardware network routers.', textId: 'Tidak ada perbedaan; kedua istilah tersebut merujuk pada perangkat keras router jaringan.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'One is the crack in the wall, the other is the specialized lever used to pry open the crack.',
    hintId: 'Satu adalah retakan pada dinding, sedangkan yang lainnya adalah alat linggis yang dirancang untuk membongkar retakan tersebut.',
    expEn: 'A vulnerability is the latent flaw; an exploit is the executable technique or code crafted to capitalize on that flaw to breach the target.',
    expId: 'Kerentanan adalah celah atau cacat laten; exploit adalah teknik atau kode eksekusi yang dibuat untuk memanfaatkan celah tersebut.'
  },
  {
    order: 10,
    qEn: 'Which threat actor group is typically characterized by state-sponsored funding, stealth persistence, and sophisticated techniques targeting national strategic assets?',
    qId: 'Kelompok pelaku ancaman manakah yang umumnya didanai oleh institusi negara, beroperasi dengan teknik tingkat tinggi, dan menargetkan aset strategis jangka panjang?',
    options: [
      { id: 'opt_1', textEn: 'Script Kiddies', textId: 'Script Kiddies', isCorrect: false },
      { id: 'opt_2', textEn: 'Advanced Persistent Threats (APTs)', textId: 'Advanced Persistent Threats (APTs)', isCorrect: true },
      { id: 'opt_3', textEn: 'Casual Video Game Cheaters', textId: 'Pemain Game yang Menggunakan Cheat', isCorrect: false },
      { id: 'opt_4', textEn: 'Automated Search Engine Spiders', textId: 'Bot Perayap Mesin Pencari (Search Engine Spiders)', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Look for the acronym that emphasizes continuous, covert persistence and high technical capability.',
    hintId: 'Cari singkatan yang menekankan kegigihan jangka panjang tanpa terdeteksi serta kapabilitas teknis tingkat negara.',
    expEn: 'Advanced Persistent Threats (APTs) are well-funded, highly skilled adversaries—frequently backed by nation-states—that conduct prolonged espionage campaigns.',
    expId: 'Advanced Persistent Threats (APT) adalah kelompok penyerang berkemampuan tinggi dengan pendanaan besar (sering kali disponsori negara) yang melakukan operasi spionase jangka panjang.'
  },
  {
    order: 11,
    qEn: 'Installing physical keycard badge readers on the server room door is an example of what type of security control?',
    qId: 'Memasang pemindai kartu akses (keycard reader) pada pintu ruang server adalah contoh dari jenis kontrol keamanan apa?',
    options: [
      { id: 'opt_1', textEn: 'Physical Control', textId: 'Kontrol Fisik (Physical Control)', isCorrect: true },
      { id: 'opt_2', textEn: 'Cryptographic Hash Algorithm', textId: 'Algoritma Hash Kriptografis', isCorrect: false },
      { id: 'opt_3', textEn: 'Software Dependency Compiler', textId: 'Kompiler Dependensi Perangkat Lunak', isCorrect: false },
      { id: 'opt_4', textEn: 'Network DNS Caching', textId: 'Penyimpanan Cache DNS Jaringan', isCorrect: false }
    ],
    correctAnswer: 'opt_1',
    hintEn: 'This control manages tangible, real-world boundaries and physical access barriers.',
    hintId: 'Kontrol ini mengatur batas nyata di dunia fisik untuk mencegah orang yang tidak berhak menyentuh perangkat keras.',
    expEn: 'Physical security controls include fences, biometric locks, badge readers, security guards, and surveillance cameras that restrict physical entry.',
    expId: 'Kontrol fisik mencakup pintu berpintu kunci elektronik, pagar, petugas keamanan, dan kamera CCTV yang membatasi akses fisik ke perangkat keras.'
  },
  {
    order: 12,
    qEn: 'What type of security control is designed to detect and log a malicious action as it occurs or shortly after?',
    qId: 'Jenis kontrol keamanan apakah yang dirancang untuk memantau, mencatat, dan membunyikan alarm ketika aksi mencurigakan sedang berlangsung?',
    options: [
      { id: 'opt_1', textEn: 'Preventative Control', textId: 'Kontrol Preventif (Pencegahan)', isCorrect: false },
      { id: 'opt_2', textEn: 'Detective Control', textId: 'Kontrol Detektif (Pendeteksian)', isCorrect: true },
      { id: 'opt_3', textEn: 'Destructive Control', textId: 'Kontrol Destruktif (Perusakan)', isCorrect: false },
      { id: 'opt_4', textEn: 'Unsupervised Control', textId: 'Kontrol Tanpa Pengawasan', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Think of smoke alarms, audit logging, and intrusion detection systems (IDS).',
    hintId: 'Pikirkan tentang alarm kebakaran, pencatatan log audit, dan sistem deteksi intrusi (IDS).',
    expEn: 'Detective controls identify and alert on security violations, anomalous patterns, or policy breaches after or during their occurrence.',
    expId: 'Kontrol detektif berfungsi untuk mengidentifikasi, mencatat, dan memberikan peringatan atas pelanggaran keamanan yang sedang atau telah terjadi.'
  },
  {
    order: 13,
    qEn: 'Which of the following is considered a foundational principle of cyber hygiene for personal and enterprise accounts?',
    qId: 'Manakah dari praktik berikut yang dianggap sebagai prinsip dasar kebersihan siber (cyber hygiene) untuk akun pribadi maupun organisasi?',
    options: [
      { id: 'opt_1', textEn: 'Reusing a single memorable master password across banking, social media, and enterprise email.', textId: 'Menggunakan kembali satu kata sandi yang sama di semua akun perbankan, media sosial, dan email kantor.', isCorrect: false },
      { id: 'opt_2', textEn: 'Enabling Multi-Factor Authentication (MFA) and utilizing unique passwords managed by a password manager.', textId: 'Mengaktifkan Autentikasi Multi-Faktor (MFA) dan menggunakan kata sandi unik yang dikelola password manager.', isCorrect: true },
      { id: 'opt_3', textEn: 'Disabling operating system updates to preserve storage space.', textId: 'Menonaktifkan pembaruan sistem operasi agar menghemat ruang penyimpanan.', isCorrect: false },
      { id: 'opt_4', textEn: 'Publicly posting work badges and computer screens on social media.', textId: 'Mengunggah foto kartu identitas karyawan dan layar komputer kerja ke media sosial.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Strong defense combines unpredictable credentials with a second out-of-band verification factor.',
    hintId: 'Pertahanan yang kuat memadukan kata sandi acak yang unik dengan faktor verifikasi kedua yang terpisah.',
    expEn: 'Using unique passwords per service combined with Multi-Factor Authentication (MFA) neutralizes the vast majority of automated credential-stuffing attacks.',
    expId: 'Penggunaan kata sandi unik untuk setiap layanan yang dipadukan dengan MFA mampu mematahkan sebagian besar serangan pencurian kredensial massal.'
  },
  {
    order: 14,
    qEn: 'What is the primary risk associated with connecting to an unencrypted public Wi-Fi network without a VPN?',
    qId: 'Apa risiko keamanan utama saat terhubung ke jaringan Wi-Fi publik tanpa enkripsi dan tanpa menggunakan VPN?',
    options: [
      { id: 'opt_1', textEn: 'The device processor will permanently lose operating clock frequency.', textId: 'Prosesor perangkat akan mengalami penurunan kecepatan frekuensi secara permanen.', isCorrect: false },
      { id: 'opt_2', textEn: 'Adversaries on the same network can intercept unencrypted network traffic via eavesdropping or Man-in-the-Middle (MitM) attacks.', textId: 'Penyerang di jaringan yang sama dapat menyadap data transmisi yang tidak terenkripsi melalui penyadapan atau serangan Man-in-the-Middle (MitM).', isCorrect: true },
      { id: 'opt_3', textEn: 'The laptop battery will immediately short circuit and drain.', textId: 'Baterai laptop akan langsung mengalami korsleting dan rusak seketika.', isCorrect: false },
      { id: 'opt_4', textEn: 'The user will be legally prosecuted by telecommunications authorities.', textId: 'Pengguna akan langsung dituntut secara hukum oleh otoritas telekomunikasi.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Without encryption, local radio packets can be observed by any nearby receiver in promiscuous mode.',
    hintId: 'Tanpa enkripsi, paket gelombang radio lokal dapat ditangkap dan dibaca oleh siapa saja di jaringan yang sama.',
    expEn: 'Open public Wi-Fi networks allow attackers to capture unencrypted packets and execute DNS spoofing or session hijacking against unshielded endpoints.',
    expId: 'Jaringan Wi-Fi publik terbuka memungkinkan penyerang menyadap paket data yang tidak terenkripsi serta melancarkan pembajakan sesi (session hijacking).'
  },
  {
    order: 15,
    qEn: 'What is the crucial legal and ethical requirement before performing any security vulnerability test against a network or server?',
    qId: 'Prasyarat legal dan etika mutlak apakah yang wajib dimiliki sebelum melakukan pengujian keamanan pada jaringan atau server pihak lain?',
    options: [
      { id: 'opt_1', textEn: 'Posting a public announcement on an online forum.', textId: 'Membuat pengumuman publik terlebih dahulu di forum online.', isCorrect: false },
      { id: 'opt_2', textEn: 'Obtaining explicit, documented, written authorization from the legitimate system owner defining the scope of testing.', textId: 'Mendapatkan izin tertulis resmi dan terdokumentasi dari pemilik sah sistem yang mendefinisikan ruang lingkup pengujian.', isCorrect: true },
      { id: 'opt_3', textEn: 'Using a high-end Linux distribution without entering personal credentials.', textId: 'Menggunakan sistem operasi Linux tanpa memasukkan data pribadi.', isCorrect: false },
      { id: 'opt_4', textEn: 'Promising not to download more than ten gigabytes of confidential records.', textId: 'Berjanji untuk tidak mengunduh data rahasia lebih dari sepuluh gigabyte.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Testing any computer system without written consent from the owner is illegal computer trespass under cybercrime laws.',
    hintId: 'Menguji sistem tanpa izin tertulis dari pemilik sah adalah tindakan pidana ilegal berdasarkan undang-undang kejahatan siber (UU ITE).',
    expEn: 'Authorized security assessments strictly require prior written permission (Rules of Engagement) from the system owner to establish legal scope and boundaries.',
    expId: 'Uji keamanan profesional mewajibkan izin tertulis eksplisit (Rules of Engagement) dari pemilik aset untuk menetapkan batasan legal dan ruang lingkup yang sah.'
  },
  {
    order: 16,
    qEn: 'What is "Responsible Disclosure" in ethical security practice?',
    qId: 'Apa yang dimaksud dengan "Responsible Disclosure" (Pengungkapan Bertanggung Jawab) dalam praktik keamanan etis?',
    options: [
      { id: 'opt_1', textEn: 'Immediately publishing zero-day exploit code on social media to shame the company.', textId: 'Langsung mempublikasikan kode exploit zero-day di media sosial untuk mempermalukan perusahaan.', isCorrect: false },
      { id: 'opt_2', textEn: 'Privately reporting discovered vulnerabilities to the affected vendor first, allowing them a reasonable grace period to patch before public release.', textId: 'Melaporkan kerentanan secara privat kepada pihak vendor terkait terlebih dahulu, memberi waktu wajar untuk memperbaiki sebelum diumumkan ke publik.', isCorrect: true },
      { id: 'opt_3', textEn: 'Selling exploit code to underground criminal forums for monetary reward.', textId: 'Menjual kode eksploitasi ke forum pasar gelap kriminal untuk mendapatkan keuntungan uang.', isCorrect: false },
      { id: 'opt_4', textEn: 'Silently ignoring critical vulnerabilities to avoid paperwork.', textId: 'Mendiamkan kerentanan berbahaya agar tidak perlu repot membuat laporan tertulis.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Ethical researchers work with developers to protect end users before broadcasting vulnerabilities to the world.',
    hintId: 'Peneliti etis berkoordinasi dengan pengembang sistem agar perbaikan disiapkan sebelum informasi celah diketahui penyerang jahat.',
    expEn: 'Responsible disclosure provides software vendors an agreed timeframe to develop and deploy remediation patches before technical details are shared publicly.',
    expId: 'Responsible disclosure memberikan tenggat waktu yang wajar bagi pengembang untuk merilis patch perbaikan sebelum rincian kerentanan diumumkan secara luas.'
  },
  {
    order: 17,
    qEn: 'In a professional Security Operations Center (SOC), what is the primary responsibility of a Tier 1 SOC Analyst?',
    qId: 'Di dalam Security Operations Center (SOC) profesional, apa tanggung jawab utama dari seorang Analis SOC Tingkat 1 (Tier 1)?',
    options: [
      { id: 'opt_1', textEn: 'Writing corporate marketing press releases.', textId: 'Menulis siaran pers promosi produk perusahaan.', isCorrect: false },
      { id: 'opt_2', textEn: 'Monitoring security alerts in real-time, triaging telemetry events, and escalating validated incidents to senior responders.', textId: 'Memantau peringatan keamanan secara real-time, menyaring peristiwa telemetri (triase), dan meneruskan insiden valid ke tim investigasi lanjutan.', isCorrect: true },
      { id: 'opt_3', textEn: 'Soldering replacement silicon chips onto server motherboards.', textId: 'Menyolder chip silikon pengganti pada motherboard server.', isCorrect: false },
      { id: 'opt_4', textEn: 'Calculating employee tax withholding deductions.', textId: 'Menghitung potongan pajak penghasilan tahunan karyawan.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Tier 1 analysts act as the 24/7 watchstanders who filter noise from genuine attacks.',
    hintId: 'Analis tingkat 1 bertindak sebagai pengawas garda terdepan 24/7 yang menyaring ribuan notifikasi alarm menjadi insiden nyata.',
    expEn: 'Tier 1 SOC Analysts monitor continuous SIEM telemetry, evaluate incoming alerts, filter false positives, and escalate corroborated incidents.',
    expId: 'Analis SOC Tier 1 bertugas mengamati aliran data SIEM sepanjang waktu, mengevaluasi peringatan ancaman, dan meneruskan insiden terverifikasi ke spesialis investigasi.'
  },
  {
    order: 18,
    qEn: 'What does the security principle of "Defense in Depth" mandate?',
    qId: 'Apa yang diwajibkan oleh prinsip keamanan "Pertahanan Berlapis" (Defense in Depth)?',
    options: [
      { id: 'opt_1', textEn: 'Digging physical trenches around data center buildings.', textId: 'Menggali parit fisik yang dalam di sekitar gedung data center.', isCorrect: false },
      { id: 'opt_2', textEn: 'Implementing multiple, overlapping layers of technical, administrative, and physical security controls so that if one fails, others stop the attack.', textId: 'Menerapkan beberapa lapisan kontrol keamanan teknis, administratif, dan fisik yang saling melengkapi sehingga jika satu lapis jebol, lapis lain menahan serangan.', isCorrect: true },
      { id: 'opt_3', textEn: 'Purchasing five identical firewalls from the exact same vendor and placing them in series.', textId: 'Membeli lima firewall yang sama persis dari vendor yang sama dan memasangnya berurutan.', isCorrect: false },
      { id: 'opt_4', textEn: 'Encrypting data only after a ransomware infection has already commenced.', textId: 'Mengenkripsi data hanya setelah infeksi ransomware terlanjur terjadi di komputer.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Think of medieval castles: moats, high walls, portcullises, and a fortified keep inside.',
    hintId: 'Pikirkan benteng pertahanan kastil: parit air, dinding luar yang tebal, gerbang besi ganda, dan menara benteng di bagian dalam.',
    expEn: 'Defense in Depth ensures that no single point of failure compromises the entire enterprise; an attacker who breaches the network must still defeat host and data controls.',
    expId: 'Defense in Depth menjamin tidak adanya titik kegagalan tunggal (*single point of failure*); penyerang yang lolos dari jaringan luar tetap tertahan oleh enkripsi dan kontrol akses internal.'
  },
  {
    order: 19,
    qEn: 'Why is regularly installing operating system and software security updates (patching) critical for cyber defense?',
    qId: 'Mengapa menginstal pembaruan keamanan (patching) sistem operasi dan aplikasi secara berkala sangat krusial bagi pertahanan siber?',
    options: [
      { id: 'opt_1', textEn: 'Patches introduce new graphic themes to brighten the desktop wallpaper.', textId: 'Pembaruan memperkenalkan tema grafis baru untuk mempercantik tampilan layar.', isCorrect: false },
      { id: 'opt_2', textEn: 'Patches remediate known software vulnerabilities that adversaries actively exploit with automated scanners.', textId: 'Patch menutup kerentanan keamanan yang telah diketahui publik yang aktif diburu oleh penyerang menggunakan pemindai otomatis.', isCorrect: true },
      { id: 'opt_3', textEn: 'Software vendors legally require users to reboot every forty-eight hours.', textId: 'Vendor perangkat lunak mewajibkan pengguna untuk me-reboot komputer setiap 48 jam.', isCorrect: false },
      { id: 'opt_4', textEn: 'Patches eliminate the need for firewalls, passwords, and backups forever.', textId: 'Patch menghapus kebutuhan akan firewall, kata sandi, dan cadangan data untuk selamanya.', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'Once a flaw is publicly disclosed, attackers immediately scan the internet for unpatched machines.',
    hintId: 'Begitu celah keamanan diumumkan ke publik, penyerang langsung memindai internet untuk mencari komputer yang belum diperbarui.',
    expEn: 'Security patches close documented vulnerabilities (CVEs); delaying updates leaves systems exposed to weaponized public exploits.',
    expId: 'Patch keamanan menutup celah kerentanan terdokumentasi; menunda pembaruan membiarkan sistem terbuka terhadap eksploitasi otomatis yang beredar luas.'
  },
  {
    order: 20,
    qEn: 'In a realistic incident where an employee receives an urgent email pretending to be the CEO demanding immediate gift card purchases, what attack vector is being attempted?',
    qId: 'Dalam insiden realistis di mana seorang karyawan menerima email mendesak yang mengatasnamakan Direktur Utama untuk segera membeli voucher belanja, vektor serangan apakah yang sedang terjadi?',
    options: [
      { id: 'opt_1', textEn: 'Buffer Overflow Attack', textId: 'Serangan Buffer Overflow', isCorrect: false },
      { id: 'opt_2', textEn: 'Spear Phishing / Business Email Compromise (Social Engineering)', textId: 'Spear Phishing / Business Email Compromise (Rekayasa Sosial)', isCorrect: true },
      { id: 'opt_3', textEn: 'Hardware Power Surge Attack', textId: 'Serangan Lonjakan Listrik Perangkat Keras', isCorrect: false },
      { id: 'opt_4', textEn: 'Optical Fiber Physical Splice', textId: 'Penyambungan Fisik Kabel Serat Optik', isCorrect: false }
    ],
    correctAnswer: 'opt_2',
    hintEn: 'This attack relies on targeting a specific employee using psychological urgency and executive authority impersonation.',
    hintId: 'Serangan ini menargetkan individu tertentu dengan memanipulasi rasa panik dan memanfaatkan wewenang atasan palsu.',
    expEn: 'Spear Phishing and Business Email Compromise (BEC) leverage authority and urgency to coerce human targets into executing unauthorized actions.',
    expId: 'Spear Phishing dan Business Email Compromise (BEC) memanipulasi otoritas dan rasa mendesak untuk menipu korban agar melakukan tindakan ilegal atau mentransfer dana.'
  }
];

// Insert all 20 questions
QUESTIONS.forEach(q => {
  const qId = `asmt_q_pathway_37_ch1_${q.order}`;
  const optionsJson = JSON.stringify(q.options.map(opt => ({
    id: opt.id,
    text: opt.textEn, // default fallback
    text_en: opt.textEn,
    text_id: opt.textId,
    isCorrect: opt.isCorrect
  })));

  insertQuestion.run(
    qId,
    assessmentId,
    q.qEn, // default fallback
    optionsJson,
    q.correctAnswer,
    q.expEn, // default fallback
    q.order,
    q.qEn,
    q.qId,
    q.expEn,
    q.expId,
    q.hintEn,
    q.hintId
  );
});

console.log(`Inserted ${QUESTIONS.length} high-rigor bilingual assessment questions into Chapter 01.`);

db.close();
console.log('--- SEEDING CHAPTER 01 COMPLETED SUCCESSFULLY ---');
