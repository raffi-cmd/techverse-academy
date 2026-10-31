const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- SEEDING 20 DEEP SUBSTANTIVE SECTIONS & 20 QUESTIONS FOR BACKEND CH01 ---');

const chapterId = 'pathway_07_ch1';
const assessmentId = 'asmt_pathway_07_ch1';

// 1. Update Chapter Details (Bilingual)
const chTitleEn = 'The Client-Server Model & Internet Protocols';
const chTitleId = 'Model Klien-Server dan Protokol Internet';
const chDescEn = 'Master the foundational architecture of backend software engineering: client-server communication, the OSI and TCP/IP models, HTTP/1.1 to HTTP/3 packet lifecycles, DNS resolution, and reverse proxies.';
const chDescId = 'Kuasai arsitektur fundamental rekayasa perangkat lunak backend: komunikasi klien-server, model OSI dan TCP/IP, siklus hidup paket HTTP/1.1 hingga HTTP/3, resolusi DNS, dan peran reverse proxy.';

db.prepare(`
  UPDATE chapters 
  SET title = ?, title_en = ?, title_id = ?,
      description = ?, description_en = ?, description_id = ?
  WHERE id = ?
`).run(chTitleEn, chTitleEn, chTitleId, chDescEn, chDescEn, chDescId, chapterId);

// 2. Clear old lessons
db.prepare('DELETE FROM lessons WHERE chapter_id = ?').run(chapterId);

const insertLesson = db.prepare(`
  INSERT INTO lessons (
    id, chapter_id, title, slug, content, content_type, sort_order, estimated_time, is_required, status,
    title_en, title_id, content_en, content_id
  ) VALUES (?, ?, ?, ?, ?, 'text', ?, ?, 1, 'published', ?, ?, ?, ?)
`);

// 20 Structured Sections
const ALL_SECTIONS = [
  // 1. Chapter Overview
  {
    order: 1,
    titleEn: 'Chapter Overview',
    titleId: 'Gambaran Umum Bab',
    slug: 'sec-1-chapter-overview',
    time: 10,
    contentEn: `# Chapter Overview: The Client-Server Model & Internet Protocols

Welcome to Chapter 1 of the **DEVORA Backend Development** pathway. This foundational chapter equips you with the indispensable mental models, protocol mechanics, and architectural principles required to engineer scalable, fault-tolerant backend web systems.

### Purpose of This Chapter
Backend engineering is not merely writing database queries or framework routes; it is the discipline of architecting resilient systems that process distributed network requests under strict latency and consistency constraints. In this chapter, you will transition from viewing the web as a visual browser interface to understanding the underlying packet streams, protocol state machines, and transport layers that power digital platforms.

### Core Learning Objectives
By completing this chapter, you will be able to:
1. Articulate the client-server paradigm and contrast it with peer-to-peer and event-driven distributed topologies.
2. Trace the end-to-end lifecycle of an HTTP request across DNS, TCP handshakes, TLS negotiation, and socket processing.
3. Differentiate between transport protocols (TCP vs UDP) and justify their selection based on throughput, ordering, and reliability guarantees.
4. Analyze HTTP message syntax, status codes, headers, and idempotency across modern protocol versions (HTTP/1.1, HTTP/2, and HTTP/3).
5. Explain the operational mechanics of reverse proxies, load balancers, and edge gateways in production architectures.
6. Design robust, stateless RESTful interface contracts adhering to web standards.

### How to Approach This Material
Each of the 20 sections in this chapter builds systematically upon preceding concepts. Study the architectural walkthroughs, inspect packet diagrams, and complete the guided exercises before taking the 20-question Chapter Assessment.`,

    contentId: `# Gambaran Umum Bab: Model Klien-Server dan Protokol Internet

Selamat datang di Bab 1 dari jalur kurikulum **DEVORA Backend Development**. Bab fondasi ini dirancang untuk membekali Anda dengan pola pikir sistemik, mekanisme protokol jaringan, dan prinsip arsitektur yang mutlak diperlukan untuk merekayasa sistem backend web yang skalabel dan andal.

### Tujuan Pembelajaran Bab Ini
Rekayasa backend bukan sekadar menulis query basis data atau membuat routing pada framework; backend adalah disiplin perancangan sistem terdistribusi yang memproses miliaran paket jaringan di bawah batasan latensi ketat dan integritas data yang tinggi. Pada bab ini, Anda akan beralih dari sekadar melihat web sebagai antarmuka visual peramban menuju pemahaman mendalam tentang aliran soket jaringan, protokol komunikasi data, dan lapisan transport yang menopang ekosistem digital modern.

### Target Kompetensi Utama
Setelah menyelesaikan bab ini, Anda akan mampu:
1. Menjelaskan paradigma klien-server serta membandingkannya dengan arsitektur peer-to-peer dan sistem terdistribusi berbasis event.
2. Menelusuri siklus hidup lengkap permintaan HTTP dari resolusi DNS, proses jabat tangan TCP, negosiasi enkripsi TLS, hingga pemrosesan pada soket server.
3. Membedakan protokol transport (TCP vs UDP) dan menentukan pemilihan protokol berdasarkan kebutuhan keandalan, urutan paket, dan toleransi latensi.
4. Membedah anatomi pesan HTTP, header standar, kode status, serta prinsip idempoten pada HTTP/1.1, HTTP/2, dan HTTP/3.
5. Menguraikan fungsi penting reverse proxy, load balancer, dan gateway jaringan dalam arsitektur backend skala produksi.
6. Merancang kontrak antarmuka API yang bersih, stateless, dan mematuhi standar web internasional.

### Panduan Belajar
Seluruh 20 bagian dalam bab ini disusun berurutan. Pelajari setiap penjelasan arsitektur, amati diagram alur paket data, dan selesaikan latihan mandiri sebelum mengikuti Ujian Evaluasi 20 Soal di akhir bab.`
  },

  // 2. The Client-Server Architectural Paradigm
  {
    order: 2,
    titleEn: 'The Client-Server Architectural Paradigm',
    titleId: 'Paradigma Arsitektur Klien-Server',
    slug: 'sec-2-client-server-paradigm',
    time: 12,
    contentEn: `# The Client-Server Architectural Paradigm

### Definition and Core Separation
The **Client-Server model** is a distributed application structure that partitions tasks or workloads between service providers (**servers**) and service requesters (**clients**).

\`\`\`
+-----------------------+              HTTP / TCP Sockets              +-----------------------+
|        CLIENT         | -------------------------------------------> |        SERVER         |
| (Browser, Mobile App, | <------------------------------------------- | (Node.js, Go, Python, |
|  CLI, IoT Sensor)     |                   Response                   |  PostgreSQL Database) |
+-----------------------+                                              +-----------------------+
\`\`\`

### Fundamental Responsibilities
1. **The Client (Presentation & User Experience):**
   - Captures user interactions and inputs.
   - Formulates structured requests conforming to established API protocols.
   - Renders visual interfaces, handles local state transitions, and presents data.
   - **Crucial Security Axiom:** The client runtime (whether a web browser, iOS app, or external webhook) must always be treated as untrusted and potentially hostile.

2. **The Server (Business Logic, Persistence & Governance):**
   - Authoritatively validates and sanitizes all incoming payloads.
   - Executes domain-specific business rules and transactional computations.
   - Manages state persistence across relational or NoSQL database engines.
   - Enforces authentication, authorization, and cryptographic integrity.

### Architectural Advantages
- **Centralized Data Integrity:** Financial ledgers and inventory balances are maintained in a single source of truth rather than distributed haphazardly.
- **Independent Evolution:** Frontend interfaces can be redesigned or deployed to native platforms without modifying the core backend API contract.
- **Resource Efficiency:** Heavy analytical processing and database indexing remain on high-performance server clusters rather than exhausting client mobile batteries.`,

    contentId: `# Paradigma Arsitektur Klien-Server

### Definisi dan Pemisahan Tanggung Jawab
Model **Klien-Server (*Client-Server*)** adalah pola arsitektur terdistribusi yang membagi beban kerja antara penyedia layanan (**server**) dan pemohon layanan (**klien**).

\`\`\`
+-----------------------+              HTTP / Soket TCP                +-----------------------+
|         KLIEN         | -------------------------------------------> |        SERVER         |
| (Peramban Web, App,   | <------------------------------------------- | (Node.js, Go, Python, |
|  Perangkat IoT, CLI)  |                  Respon Data                 |  Basis Data Postgres) |
+-----------------------+                                              +-----------------------+
\`\`\`

### Batasan Tanggung Jawab Utama
1. **Peran Klien (Presentasi & Antarmuka Pengguna):**
   - Menangkap interaksi, klik, dan input formulir dari pengguna.
   - Membentuk permintaan (*request*) berformat standar sesuai kontrak API.
   - Merender tampilan visual dan mengelola status tampilan lokal.
   - **Aksioma Keamanan Krusial:** Lingkungan klien (baik peramban web maupun aplikasi ponsel) harus selalu dianggap tidak terpercaya (*untrusted*) dan rentan dimanipulasi oleh pengguna jahat.

2. **Peran Server (Logika Bisnis, Persistensi, & Validasi):**
   - Memvalidasi dan membersihkan seluruh data masukan yang masuk tanpa terkecuali.
   - Menjalankan komputasi logika bisnis inti dan aturan transaksional.
   - Mengelola penyimpanan data permanen pada mesin basis data (SQL atau NoSQL).
   - Menegakkan keamanan autentikasi, hak akses otorisasi, dan perlindungan enkripsi.

### Keunggulan Arsitektur Klien-Server
- **Integritas Data Terpusat:** Saldo keuangan dan catatan inventaris disimpan pada satu sumber kebenaran tunggal (*single source of truth*) yang terlindungi.
- **Evolusi Independen:** Desain antarmuka peramban atau aplikasi mobile dapat diperbarui secara bebas tanpa perlu merombak logika server backend.
- **Efisiensi Sumber Daya Komputasi:** Komputasi analitik berat dan pengindeksan data dilakukan pada kluster server berkemampuan tinggi, menghemat baterai dan memori perangkat pengguna.`
  },

  // 3. Why Backend Engineering Matters
  {
    order: 3,
    titleEn: 'Why Backend Engineering Matters',
    titleId: 'Mengapa Rekayasa Backend Sangat Krusial',
    slug: 'sec-3-why-backend-matters',
    time: 12,
    contentEn: `# Why Backend Engineering Matters

### The Hidden Engine of Modern Civilization
While end users interact directly with buttons, animations, and layouts on the frontend, the entirety of modern commerce, communication, and governance depends upon the invisible reliability of backend infrastructure.

### The Four Pillars of Backend Excellence
1. **Data Consistency and Concurrency:**
   When thousands of users attempt to purchase the last available concert ticket simultaneously, a poorly engineered backend produces overselling or database race conditions. Backend engineers employ database transactions (ACID properties), row-level locks, and optimistic concurrency controls to guarantee exact inventory balance.

2. **High Availability and Fault Tolerance:**
   Production systems must withstand catastrophic hardware failures, network fiber cuts, and traffic spikes without taking down critical services. High availability is achieved through stateless server replicas, automated health probes, database replication, and multi-zone deployment strategies.

3. **Performance, Throughput, and Latency:**
   Search queries, payment verifications, and feed generation must execute within milliseconds. Backend engineers profile CPU bottlenecks, optimize SQL execution plans, implement multi-tiered Redis caching, and stream responses asynchronously to minimize Time-to-First-Byte (TTFB).

4. **Security and Trust Defense:**
   Backend systems safeguard proprietary customer databases, banking secrets, and private credentials against remote code execution, SQL injections, and unauthorized exfiltration.`,

    contentId: `# Mengapa Rekayasa Backend Sangat Krusial

### Mesin Tak Terlihat Penopang Peradaban Digital
Pengguna awam mungkin hanya melihat tombol, animasi, dan tata letak visual pada sisi frontend. Namun pada hakikatnya, seluruh transaksi perbankan, komunikasi publik, dan sistem logistik modern bergantung penuh pada ketangguhan infrastruktur backend.

### Empat Pilar Keunggulan Rekayasa Backend
1. **Konsistensi Data dan Konkurensi Tinggi:**
   Ketika ribuan pengguna mencoba membeli tiket konser terakhir secara bersamaan dalam detik yang sama, backend yang dirancang buruk akan mengalami *race condition* yang mengakibatkan penjualan ganda (*overselling*). Insinyur backend menerapkan transaksi basis data (prinsip ACID), penguncian tingkat baris (*row-level locking*), dan isolasi serializable untuk menjamin keakuratan inventaris.

2. **Ketersediaan Tinggi (*High Availability*) dan Ketahanan Bencana:**
   Sistem produksi skala industri harus mampu bertahan menghadapi kerusakan server fisik, pemadaman listrik pusat data, maupun lonjakan lalu lintas ekstrem tanpa memutus layanan penting. Hal ini dicapai melalui perancangan server tanpa status (*stateless*), replikasi basis data multi-wilayah, dan mekanisme pengalihan beban otomatis (*failover*).

3. **Performa, Throughput, dan Minimasi Latensi:**
   Pencarian data, otentikasi login, dan transaksi pembayaran harus selesai dalam hitungan milidetik. Insinyur backend menganalisis *bottleneck* memori, mengoptimalkan indeks query SQL, menerapkan *caching* berlapis menggunakan Redis, dan menggunakan pemrosesan asinkron untuk mempercepat respon.

4. **Pertahanan Keamanan dan Integritas Data:**
   Sistem backend adalah benteng utama pelindung basis data pribadi nasabah, riwayat rekam medis, dan kunci enkripsi rahasia dari ancaman serangan injeksi SQL, manipulasi token sesi, dan kebocoran data terorganisir.`
  },

  // 4. The Complete HTTP Request-Response Lifecycle
  {
    order: 4,
    titleEn: 'The HTTP Request-Response Lifecycle',
    titleId: 'Siklus Hidup Permintaan & Respon HTTP',
    slug: 'sec-4-request-response-lifecycle',
    time: 14,
    contentEn: `# The HTTP Request-Response Lifecycle

### Chronological Trace of a Web Transaction
What happens beneath the surface when a client initiates a request to \`https://api.devora.id/v1/courses\`? Understanding this end-to-end journey is the foundational mental model of backend engineering.

\`\`\`
1. Client Enters URL -> 2. DNS Query -> 3. IP Resolved -> 4. TCP 3-Way Handshake
                                                                   |
+------------------------------------------------------------------+
|
v
5. TLS 1.3 Handshake (Keys Exchanged) -> 6. HTTP Request Sent -> 7. Reverse Proxy (Nginx)
                                                                             |
+----------------------------------------------------------------------------+
|
v
8. Backend App (Node/Go/Python) -> 9. DB Query Executed -> 10. HTTP Response Formatted
                                                                      |
+---------------------------------------------------------------------+
|
v
11. Bytes Streamed over Socket -> 12. Client Parses Response JSON -> 13. Socket Closed/Kept-Alive
\`\`\`

### Step-by-Step Mechanical Walkthrough
1. **DNS Lookup:** The client queries local DNS caches and recursive resolvers to translate \`api.devora.id\` into an IPv4 or IPv6 destination address.
2. **Transport Establishment:** The client initiates a TCP 3-way handshake (SYN, SYN-ACK, ACK) with the destination IP on port 443.
3. **Cryptographic Negotiation:** A TLS 1.3 cryptographic handshake establishes ephemeral session keys, validating the server's X.509 certificate and encrypting all subsequent transmission.
4. **HTTP Serialization:** The client formats an HTTP request line, headers, and body, transmitting the serialized ASCII or binary frames across the encrypted TCP socket.
5. **Gateway Ingestion:** The edge reverse proxy (such as Nginx, Envoy, or AWS ALB) terminates TLS, applies rate limiting, and forwards the raw request to internal application instances via private network routing.
6. **Application Dispatch:** The backend framework matches the HTTP method and path against defined route controllers, invokes authentication middleware, and executes business logic.
7. **Database Interaction:** The server queries local or distributed database clusters using parameterized connection pools.
8. **Response Packaging:** The controller constructs an HTTP status code (e.g., 200 OK), response headers (e.g., \`Content-Type: application/json\`), and the serialized JSON payload.
9. **Egress & Teardown:** The response frames travel back over the socket to the client, where the runtime parses the JSON payload.`,

    contentId: `# Siklus Hidup Permintaan & Respon HTTP

### Penelusuran Kronologis Transaksi Web
Apa yang sebenarnya terjadi di balik layar ketika klien mengirimkan permintaan ke \`https://api.devora.id/v1/courses\`? Memahami perjalanan lengkap paket ini adalah fondasi mutlak bagi setiap insinyur backend.

\`\`\`
1. Klien Input URL -> 2. Kueri DNS -> 3. IP Ditemukan -> 4. Jabat Tangan 3 Arah TCP
                                                                  |
+-----------------------------------------------------------------+
|
v
5. Negosiasi TLS 1.3 (Enkripsi) -> 6. Kirim Paket HTTP -> 7. Diterima Reverse Proxy
                                                                    |
+-------------------------------------------------------------------+
|
v
8. Aplikasi Backend (Node/Go) -> 9. Eksekusi Kueri DB -> 10. Pembentukan Respon HTTP
                                                                    |
+-------------------------------------------------------------------+
|
v
11. Pengiriman Byte via Soket -> 12. Klien Parsing JSON -> 13. Selesai / Keep-Alive
\`\`\`

### Rincian Tahapan Kronologis
1. **Resolusi DNS (*DNS Lookup*):** Klien memeriksa cache lokal dan mengirim kueri ke server DNS resolver untuk menerjemahkan nama domain \`api.devora.id\` menjadi alamat IP tujuan (misalnya \`104.21.45.10\`).
2. **Membangun Koneksi Transport:** Klien memulai jabat tangan tiga arah TCP (*Three-Way Handshake*: SYN, SYN-ACK, ACK) pada port 443 milik server.
3. **Negosiasi Kriptografis TLS:** Protokol TLS 1.3 memverifikasi sertifikat digital server dan menyepakati kunci enkripsi sesi simetris untuk mengamankan seluruh saluran komunikasi.
4. **Serialisasi Permintaan HTTP:** Klien menyusun baris permintaan (*request line*), header, dan body dalam format byte terenkripsi lalu mengirimkannya melalui soket jaringan.
5. **Penerimaan oleh Reverse Proxy:** Server terluar (seperti Nginx atau Envoy) melakukan terminasi TLS, memeriksa kuota akses (*rate limiting*), dan meneruskan permintaan ke proses aplikasi backend internal.
6. **Penanganan oleh Aplikasi Backend:** Framework backend mencocokkan metode HTTP dan path URL dengan handler fungsi yang tepat, menjalankan middleware autentikasi, dan memproses data.
7. **Komunikasi Basis Data:** Server membuka koneksi dari *connection pool* untuk mengambil atau memperbarui baris data pada PostgreSQL atau MySQL.
8. **Penyusunan Respon:** Server menyusun kode status (misalnya 200 OK), menyertakan header (\`Content-Type: application/json\`), dan meletakkan data JSON pada body respon.
9. **Transmisi Kembali ke Klien:** Byte respon dialirkan kembali melalui jaringan, didekripsi oleh klien, dan diolah oleh aplikasi untuk disajikan kepada pengguna.`
  },

  // 5. Anatomy of HTTP Messages: Requests and Responses
  {
    order: 5,
    titleEn: 'Anatomy of HTTP Messages',
    titleId: 'Anatomi Pesan HTTP: Request dan Response',
    slug: 'sec-5-anatomy-of-http-messages',
    time: 12,
    contentEn: `# Anatomy of HTTP Messages: Requests and Responses

### The Text-Based Structure of HTTP/1.1
Under HTTP/1.1, messages are human-readable streams of ASCII characters divided into three distinct segments: the Start Line, Headers, and an optional Body.

### The Anatomy of an HTTP Request
\`\`\`http
POST /api/v1/orders HTTP/1.1
Host: api.devora.id
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Content-Length: 58
Accept: application/json

{"productId": 1084, "quantity": 2, "coupon": "TECHVERSE"}
\`\`\`

1. **Request Line (First Line):**
   - **Method:** The intended action (\`POST\`, \`GET\`, \`DELETE\`, etc.).
   - **Request Target:** The uniform resource identifier path (\`/api/v1/orders\`).
   - **HTTP Version:** The protocol specification (\`HTTP/1.1\`).
2. **Request Headers (Key-Value Pairs):** Metadata providing context regarding authorization tokens, expected mime-types, language preferences, and body length.
3. **Blank Line (\`\\r\\n\`):** A mandatory blank line separating headers from the payload body.
4. **Request Body:** The raw byte payload containing user data (JSON, form data, or binary files).

### The Anatomy of an HTTP Response
\`\`\`http
HTTP/1.1 201 Created
Date: Sat, 31 Oct 2026 08:30:00 GMT
Server: nginx/1.24.0
Content-Type: application/json; charset=utf-8
Content-Length: 72
Location: /api/v1/orders/ORD-94812
Connection: keep-alive

{"orderId": "ORD-94812", "status": "CONFIRMED", "totalAmount": 450000.00}
\`\`\`

1. **Status Line:** Contains HTTP version, numeric Status Code (\`201\`), and Reason Phrase (\`Created\`).
2. **Response Headers:** Metadata declaring payload encoding, cache parameters, and server details.
3. **Response Body:** The structured data returned to the client.`,

    contentId: `# Anatomi Pesan HTTP: Request dan Response

### Struktur Dasar Pesan HTTP/1.1
Pada standar protokol HTTP/1.1, pesan jaringan disusun menggunakan aliran teks ASCII terstruktur yang dibagi menjadi tiga bagian utama: Baris Awal (*Start Line*), Kumpulan Header (*Headers*), dan Badan Pesan (*Body*).

### Anatomi Permintaan (*HTTP Request*)
\`\`\`http
POST /api/v1/orders HTTP/1.1
Host: api.devora.id
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Content-Length: 58
Accept: application/json

{"productId": 1084, "quantity": 2, "coupon": "TECHVERSE"}
\`\`\`

1. **Baris Permintaan (*Request Line*):**
   - **Metode (*Method*):** Jenis aksi yang diminta (misalnya \`POST\`, \`GET\`, \`PUT\`, \`DELETE\`).
   - **Target Jalur (*Path*):** Alamat tujuan spesifik pada server (\`/api/v1/orders\`).
   - **Versi Protokol:** Standar versi HTTP yang digunakan klien (\`HTTP/1.1\`).
2. **Header Permintaan (*Request Headers*):** Kumpulan kunci-nilai metadata yang memuat kredensial token otorisasi, tipe data konten, dan identitas perangkat klien.
3. **Baris Kosong Pemisah (\`\\r\\n\`):** Karakter baris kosong wajib yang memisahkan blok header dari payload isi pesan.
4. **Badan Permintaan (*Request Body*):** Data aktual yang dikirimkan klien dalam format serialisasi JSON, teks formulir, atau berkas biner.

### Anatomi Respon (*HTTP Response*)
\`\`\`http
HTTP/1.1 201 Created
Date: Sat, 31 Oct 2026 08:30:00 GMT
Server: nginx/1.24.0
Content-Type: application/json; charset=utf-8
Content-Length: 72
Location: /api/v1/orders/ORD-94812
Connection: keep-alive

{"orderId": "ORD-94812", "status": "CONFIRMED", "totalAmount": 450000.00}
\`\`\`

1. **Baris Status (*Status Line*):** Memuat versi HTTP, kode angka status (\`201\`), dan deskripsi singkat (\`Created\`).
2. **Header Respon:** Informasi teknis server, tipe encoding data, masa berlaku cache, dan panjang byte konten.
3. **Badan Respon (*Response Body*):** Objek data hasil pemrosesan yang dikirimkan kembali ke pemohon.`
  },

  // 6. Transport Protocols: TCP vs UDP
  {
    order: 6,
    titleEn: 'Transport Layer: TCP vs UDP',
    titleId: 'Protokol Transport: TCP vs UDP',
    slug: 'sec-6-transport-tcp-vs-udp',
    time: 12,
    contentEn: `# Transport Layer: TCP vs UDP

### The Fundamental Dilemma: Reliability vs Latency
Beneath the application layer (HTTP, WebSocket, SSH) resides the transport layer of the network stack. Operating systems rely on two foundational protocols to transmit datagrams across IP networks: **TCP** (Transmission Control Protocol) and **UDP** (User Datagram Protocol).

| Operational Dimension | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|---|---|---|
| **Connection State** | Connection-oriented (Handshake required) | Connectionless (Fire and forget) |
| **Delivery Guarantee** | 100% Guaranteed (Retransmits lost packets) | Unreliable (Lost packets are discarded) |
| **Packet Ordering** | In-order delivery guaranteed by sequence numbers | Packets may arrive out of order |
| **Flow & Congestion Control** | Built-in window scaling and congestion avoidance | None (Transmits at application rate) |
| **Header Overhead** | 20–60 bytes per packet | 8 bytes per packet |
| **Primary Use Cases** | Web APIs, Database Connections, File Transfer | Video Streaming, DNS, Online Gaming, WebRTC |

### Why Backend Systems Rely Heavily on TCP
Financial transactions, database persistence queries, and REST API calls cannot tolerate dropped bytes. If a byte representing an account balance or order confirmation packet is lost in transit, TCP automatically detects the missing sequence number, halts higher-level stream consumption, and issues a retransmission request (ARQ) until the packet arrives intact.`,

    contentId: `# Protokol Transport: TCP vs UDP

### Dilema Mendasar: Keandalan Data vs Kecepatan Transmisi
Tepat di bawah lapisan aplikasi (seperti HTTP, WebSocket, atau SSH) terdapat lapisan transport (*Transport Layer*). Sistem operasi mengandalkan dua protokol utama untuk memindahkan data melintasi jaringan IP: **TCP** (*Transmission Control Protocol*) dan **UDP** (*User Datagram Protocol*).

| Dimensi Operasional | TCP (*Transmission Control Protocol*) | UDP (*User Datagram Protocol*) |
|---|---|---|
| **Status Koneksi** | Berbasis koneksi (wajib jabat tangan awal) | Nir-koneksi (*connectionless*, kirim langsung) |
| **Jaminan Pengiriman** | 100% Terjamin (mengirim ulang paket hilang) | Tidak terjamin (paket hilang dibiarkan) |
| **Urutan Paket** | Urutan terjamin melalui nomor urut (*sequence*) | Paket bisa tiba acak tanpa urutan |
| **Kontrol Kemacetan** | Memiliki kontrol aliran dan kemacetan jaringan | Tidak ada (mengalir secepat kapasitas aplikasi) |
| **Ukuran Header** | 20 hingga 60 byte per paket | 8 byte per paket |
| **Kasus Penggunaan** | API Web, Koneksi Basis Data, Transfer Berkas | Siaran Video Langsung, DNS, Game Real-time |

### Alasan Backend Mengutamakan TCP
Transaksi perbankan, mutasi saldo, dan pertukaran payload JSON pada API backend sama sekali tidak boleh kehilangan satu byte pun. Jika satu paket data hilang di tengah jalan akibat gangguan jaringan kabel, TCP secara otomatis mendeteksi ketiadaan paket tersebut dan melakukan pengiriman ulang (*retransmission*) hingga seluruh data tersusun utuh dan sempurna.`
  },

  // 7. The TCP Three-Way Handshake
  {
    order: 7,
    titleEn: 'The TCP Three-Way Handshake',
    titleId: 'Proses Jabat Tangan Tiga Arah TCP',
    slug: 'sec-7-tcp-three-way-handshake',
    time: 12,
    contentEn: `# The TCP Three-Way Handshake

### Establishing a Reliable Connection
Before a single byte of HTTP data can be transmitted over a traditional TCP socket, the client and server must synchronize their sequence numbers and confirm bidirectional communications through a 3-step handshake: **SYN, SYN-ACK, ACK**.

\`\`\`
CLIENT                                                     SERVER
  |                                                           |
  |  1. SYN (seq=X)                                           |
  |---------------------------------------------------------->| (Server allocates socket buffer,
  |                                                           |  enters SYN_RECEIVED state)
  |                                                           |
  |  2. SYN-ACK (seq=Y, ack=X+1)                              |
  |<----------------------------------------------------------|
  | (Client verifies seq,                                     |
  |  enters ESTABLISHED state)                                |
  |                                                           |
  |  3. ACK (seq=X+1, ack=Y+1)                                |
  |---------------------------------------------------------->| (Server enters ESTABLISHED state)
  |                                                           |
  | =============== CONNECTION ESTABLISHED ================== |
  |  4. Client sends HTTP Request Payload                     |
  |---------------------------------------------------------->|
\`\`\`

### Latency Implications in Backend Engineering
The handshake requires 1 full network Round-Trip Time (RTT) before application data can be sent. Over a high-latency mobile network (e.g., 100ms RTT), establishing a fresh TCP connection introduces noticeable delay.
- **Connection Reuse:** Modern backends mandate HTTP \`Keep-Alive\` headers and persistent connection pooling so subsequent requests reuse existing TCP sockets rather than performing the handshake repeatedly.`,

    contentId: `# Proses Jabat Tangan Tiga Arah TCP

### Membangun Saluran Komunikasi yang Terverifikasi
Sebelum byte data HTTP dapat dikirimkan melalui soket TCP, kedua belah pihak wajib menyelaraskan nomor urut (*sequence number*) dan memverifikasi keterhubungan dua arah melalui mekanisme tiga langkah: **SYN, SYN-ACK, ACK**.

\`\`\`
KLIEN                                                       SERVER
  |                                                           |
  |  1. SYN (seq=X)                                           |
  |---------------------------------------------------------->| (Server alokasikan memori buffer,
  |                                                           |  masuk status SYN_RECEIVED)
  |                                                           |
  |  2. SYN-ACK (seq=Y, ack=X+1)                              |
  |<----------------------------------------------------------|
  | (Klien verifikasi nomor urut,                             |
  |  masuk status ESTABLISHED)                                |
  |                                                           |
  |  3. ACK (seq=X+1, ack=Y+1)                                |
  |---------------------------------------------------------->| (Server masuk status ESTABLISHED)
  |                                                           |
  | ================ KONEKSI DUA ARAH TERBENTUK ============= |
  |  4. Klien mulai mengirim data HTTP Request                |
  |---------------------------------------------------------->|
\`\`\`

### Implikasi Latensi pada Rekayasa Backend
Proses jabat tangan ini membutuhkan satu waktu tempuh bolak-balik penuh (*Round-Trip Time / RTT*). Pada jaringan nirkabel dengan latensi 80ms, membuka koneksi baru menyita 80ms murni hanya untuk pembentukan soket sebelum data aplikasi dikirimkan.
- **Penggunaan Kembali Koneksi (*Keep-Alive*):** Insinyur backend menerapkan fitur \`Connection: keep-alive\` dan mekanisme *connection pooling* agar koneksi TCP yang telah terbuka tetap aktif dan dapat digunakan kembali oleh kueri berikutnya tanpa perlu mengulang jabat tangan dari awal.`
  },

  // 8. Domain Name System (DNS) Mechanics
  {
    order: 8,
    titleEn: 'Domain Name System (DNS) Mechanics',
    titleId: 'Resolusi Nama Domain (DNS) & Alur Akses Jaringan',
    slug: 'sec-8-dns-mechanics',
    time: 12,
    contentEn: `# Domain Name System (DNS) Mechanics

### The Address Book of the Internet
Computers route network packets using numeric IP addresses (such as \`172.67.142.22\` or \`2606:4700::6811:8e16\`), whereas humans navigate the web using domain names like \`api.devora.id\`. The **Domain Name System (DNS)** is a distributed, hierarchical database responsible for translating human-readable hostnames into routable network addresses.

\`\`\`
Client Browser -> Recursive Resolver (ISP / 1.1.1.1) -> Root Nameserver (.)
                                                     -> TLD Nameserver (.id)
                                                     -> Authoritative Nameserver (Cloudflare/Route53)
                                                     -> Returns A / AAAA Record (IP Address)
\`\`\`

### Critical DNS Record Types for Backend Engineers
- **A Record:** Maps a hostname directly to an IPv4 address (e.g., \`api.devora.id -> 104.21.45.10\`).
- **AAAA Record:** Maps a hostname to an IPv6 address.
- **CNAME (Canonical Name):** Maps an alias hostname to another domain name (e.g., \`docs.devora.id -> devora-docs.netlify.app\`).
- **MX Record:** Directs incoming emails to mail server clusters.
- **TXT Record:** Stores arbitrary text, used primarily for domain ownership verification and email security protocols (SPF, DKIM, DMARC).

### Caching and Time-to-Live (TTL)
Every DNS record includes a **TTL (Time-to-Live)** integer specifying how many seconds downstream resolvers may cache the record. A high TTL (e.g., 86400s) minimizes DNS query latency but delays IP migration during zero-downtime infrastructure cutovers.`,

    contentId: `# Resolusi Nama Domain (DNS) & Alur Akses Jaringan

### Buku Alamat Terdistribusi Global
Perangkat router dan switch di internet hanya memahami perutean paket berdasarkan alamat numerik IP (seperti \`104.21.45.10\` atau alamat IPv6). Manusia, di sisi lain, mengingat nama domain seperti \`api.devora.id\`. **Domain Name System (DNS)** adalah sistem basis data hierarki terdistribusi yang bertanggung jawab memetakan nama domain menjadi alamat IP yang dapat dituju.

\`\`\`
Peramban Klien -> Resolver Rekursif (ISP / 1.1.1.1) -> Server Root (.)
                                                   -> Server TLD (.id)
                                                   -> Server Otoritatif (Cloudflare/Route53)
                                                   -> Mengembalikan Record A / AAAA (IP Server)
\`\`\`

### Jenis Record DNS yang Wajib Dikuasai Insinyur Backend
- **Record A:** Memetakan nama domain langsung ke alamat IPv4 server (\`api.devora.id -> 104.21.45.10\`).
- **Record AAAA:** Memetakan nama domain ke alamat generasi baru IPv6.
- **Record CNAME (*Canonical Name*):** Mengarahkan domain alias ke domain lain (misalnya \`web.devora.id -> devora.id\`).
- **Record MX (*Mail Exchange*):** Mengarahkan lalu lintas surat elektronik ke server penyedia email korporat.
- **Record TXT:** Menyimpan teks verifikasi kepemilikan domain serta konfigurasi keamanan email (SPF, DKIM, DMARC) untuk mencegah pemalsuan pengirim.

### Nilai Time-to-Live (TTL) dan Caching
Setiap record DNS memiliki atribut **TTL (*Time-to-Live*)** dalam satuan detik yang menentukan berapa lama server resolver boleh menyimpan cache hasil pencarian. Nilai TTL yang tinggi mempercepat resolusi pengguna tetapi memperlambat proses migrasi IP ketika server backend berpindah hosting.`
  },

  // 9. Reverse Proxies and Web Servers
  {
    order: 9,
    titleEn: 'Reverse Proxies and Web Servers',
    titleId: 'Peran Reverse Proxy & Web Server (Nginx & Caddy)',
    slug: 'sec-9-reverse-proxies-and-web-servers',
    time: 12,
    contentEn: `# Reverse Proxies and Web Servers

### The Role of Edge Infrastructure
In production environments, backend application runtimes (such as Node.js Express, Python FastAPI, or Go Gin) should rarely be exposed directly to the public internet. Instead, they operate behind a specialized gateway known as a **Reverse Proxy**.

\`\`\`
PUBLIC INTERNET                                    PRIVATE BACKEND CLUSTER
+-----------------+      HTTPS (443)      +-------------------+      HTTP (3000)      +--------------------+
|  Client Device  | --------------------> |   REVERSE PROXY   | --------------------> | App Instance 1     |
|  (Untrusted)    |                       |   (Nginx, Caddy,  | --------------------> | App Instance 2     |
+-----------------+                       |    Envoy, Traefik)|      HTTP (3001)      +--------------------+
                                          +-------------------+
\`\`\`

### Key Capabilities of a Reverse Proxy
1. **TLS Termination:** The reverse proxy handles cryptographic decryption and SSL certificate renewal, relieving backend application threads of heavy mathematical overhead.
2. **Load Balancing:** Incoming traffic is distributed across multiple internal server replicas using round-robin, least-connections, or IP-hash algorithms.
3. **Static Asset Caching:** High-performance caching of CSS, JavaScript bundles, and images directly from memory or disk without invoking application code.
4. **Security Isolation & Rate Limiting:** Filters malicious payloads, mitigates Slowloris and DDoS attacks, and shields internal port numbers from public discovery.`,

    contentId: `# Peran Reverse Proxy & Web Server (Nginx & Caddy)

### Gerbang Utama Infrastruktur Produksi
Dalam lingkungan produksi skala industri, server aplikasi backend (seperti aplikasi Node.js, Go, atau Python) hampir tidak pernah diekspos secara telanjang langsung ke internet publik. Sistem backend selalu dilindungi oleh perantara gerbang yang disebut **Reverse Proxy**.

\`\`\`
INTERNET PUBLIK                                    JARINGAN PRIVAT BACKEND
+-----------------+      HTTPS (Port 443) +-------------------+      HTTP (Port 3000) +--------------------+
|  Perangkat Luar | --------------------> |   REVERSE PROXY   | --------------------> | Server Aplikasi 1  |
|  (Klien Bebas)  |                       |   (Nginx, Caddy,  | --------------------> | Server Aplikasi 2  |
+-----------------+                       |    Envoy, HAProxy)|      HTTP (Port 3001) +--------------------+
                                          +-------------------+
\`\`\`

### Fungsi Krusial Reverse Proxy
1. **Terminasi TLS/SSL (*TLS Termination*):** Reverse proxy mengelola sertifikat HTTPS dan melakukan proses dekripsi enkripsi, membebaskan proses aplikasi internal dari beban komputasi matematika kriptografi.
2. **Pembagian Beban (*Load Balancing*):** Membagi jutaan permintaan secara merata ke puluhan instans server aplikasi internal menggunakan algoritma *round-robin* atau *least-connections*.
3. **Penyimpanan Cache Statis (*Static Asset Caching*):** Menyajikan berkas gambar, CSS, dan JavaScript langsung dari memori server tanpa perlu menyentuh proses aplikasi utama.
4. **Isolasi Keamanan & Pembatasan Akses (*Rate Limiting*):** Menolak serangan DDoS, memblokir alamat IP penyerang, dan menyembunyikan arsitektur jaringan internal dari pemindaian publik.`
  },

  // 10. The Stateless Nature of HTTP and Session Strategies
  {
    order: 10,
    titleEn: 'Statelessness and Session Management',
    titleId: 'Model Stateless HTTP & Kebutuhan Manajemen Sesi',
    slug: 'sec-10-statelessness-and-sessions',
    time: 12,
    contentEn: `# Statelessness and Session Management

### The Fundamental Property of HTTP
The HTTP protocol is fundamentally **stateless**. This means the server retains zero memory of previous interactions between individual requests. Request #2 arrives with zero intrinsic awareness of Request #1, even if sent by the same client over the same socket.

### Why Statelessness Enables Infinite Scaling
If a server had to store client session state in its local RAM, that client would be permanently tied to that single physical machine (**sticky sessions**). If that machine crashed, the user would be unceremoniously logged out.
- With **stateless backends**, any request can be routed to any server instance in the cluster, allowing horizontal auto-scaling from 2 to 200 servers effortlessly.

### How State Is Reconstructed
To build shopping carts, user logins, and workflows over a stateless protocol, backend engineers utilize three primary strategies:
1. **Server-Side Sessions with Centralized Stores:** The client receives a random Session ID cookie. The server stores user state in a shared, in-memory Redis cluster.
2. **Stateless Tokens (JSON Web Tokens / JWT):** The server issues a cryptographically signed token containing user claims. The client stores the token and transmits it in the \`Authorization\` header; any backend instance can verify the signature mathematically without querying a database.
3. **Client-Side State Storage:** Non-sensitive preferences stored in browser \`localStorage\` or secure cookies.`,

    contentId: `# Model Stateless HTTP & Kebutuhan Manajemen Sesi

### Sifat Dasar Nir-Status (Stateless)
Protokol HTTP dirancang secara mendasar sebagai protokol yang **nir-status (*stateless*)**. Artinya, server tidak memiliki memori bawaan tentang transaksi masa lalu antara permintaan yang satu dengan permintaan berikutnya. Permintaan kedua diperlakukan sebagai entitas baru yang sepenuhnya asing dari permintaan pertama, meskipun dikirim dari peramban yang sama.

### Alasan Sifat Stateless Mendukung Skalabilitas Masif
Jika server harus menyimpan status login atau keranjang belanja pengguna di dalam memori RAM lokal server tersebut, pengguna tersebut akan terikat selamanya pada satu komputer fisik itu saja (*sticky sessions*). Jika server tersebut mati, sesi pengguna akan hilang seketika.
- Dengan **arsitektur backend tanpa status (*stateless*)**, setiap permintaan pengguna dapat diarahkan secara acak ke instans server mana pun di dalam kluster. Hal ini memungkinkan sistem melakukan penambahan kapasitas (*auto-scaling*) dari 2 server menjadi 100 server secara dinamis.

### Strategi Membangun Sesi pada Protokol Stateless
Untuk menghadirkan fitur autentikasi login dan keranjang belanja, insinyur backend menggunakan pendekatan berikut:
1. **Sesi Sisi Server dengan Redis Terpusat:** Klien hanya memegang sebuah cookie acak berisi *Session ID*. Objek data sesi pengguna disimpan pada kluster memori terpusat Redis yang dapat diakses bersama oleh seluruh server aplikasi.
2. **Token Tanpa Status (*JSON Web Token / JWT*):** Server menerbitkan token yang ditandatangani secara kriptografis. Klien menyertakan token ini pada header \`Authorization\`. Setiap server backend dapat memverifikasi keabsahan token tersebut secara matematis tanpa perlu membebani basis data.
3. **Cookie Aman Terenkripsi (*Secure HttpOnly Cookies*):** Melindungi token otentikasi dari pencurian melalui serangan skrip berbahaya (*Cross-Site Scripting / XSS*).`
  },

  // 11. Anatomy of Uniform Resource Identifiers (URI / URL)
  {
    order: 11,
    titleEn: 'Anatomy of URIs, URLs, and Query Parameters',
    titleId: 'Struktur URL, URI, dan Parameter Query',
    slug: 'sec-11-uri-url-and-query-parameters',
    time: 12,
    contentEn: `# Anatomy of URIs, URLs, and Query Parameters

### Dissecting the Web Address
Every backend route is triggered by a **Uniform Resource Identifier (URI)**. Understanding how components are parsed, encoded, and handled by web frameworks prevents critical routing vulnerabilities and parameter injection bugs.

\`\`\`
https://api.devora.id:443/v1/courses/backend-dev/lessons?sort=asc&limit=10#resources
\___/   \___________/ \_/ \____________________________/ \_____________/ \_______/
  |           |        |                |                       |            |
Scheme    Authority   Port             Path                   Query       Fragment
\`\`\`

### Component Breakdown
1. **Scheme / Protocol (\`https\`):** Declares the communication specification and default transport security.
2. **Authority / Host (\`api.devora.id\`):** The registered domain name or IP address of the destination gateway.
3. **Port (\`:443\`):** The numeric TCP port. Standard defaults (80 for HTTP, 443 for HTTPS) are typically omitted from browser view.
4. **Path (\`/v1/courses/backend-dev/lessons\`):** The hierarchical resource location mapped by backend routing tables to specific controller methods.
5. **Query String (\`?sort=asc&limit=10\`):** Key-value pairs providing non-hierarchical parameters used for filtering, pagination, sorting, and search constraints.
6. **Fragment (\`#resources\`):** Client-side anchor identifier; **crucially, fragments are never transmitted over the wire to backend servers**.

### Security Considerations: URL Encoding
All non-alphanumeric characters in URL components must be percent-encoded (e.g., spaces become \`%20\` or \`+\`, slashes become \`%2F\`). Failure to validate and decode parameters correctly can lead to directory traversal attacks (\`../../etc/passwd\`).`,

    contentId: `# Struktur URL, URI, dan Parameter Query

### Membedah Komponen Alamat Web
Setiap endpoint API backend dipicu melalui **Uniform Resource Identifier (URI)**. Pemahaman atas struktur pembedahan URL sangat penting untuk mencegah kerentanan salah perutean dan serangan injeksi parameter.

\`\`\`
https://api.devora.id:443/v1/courses/backend-dev/lessons?sort=asc&limit=10#resources
\___/   \___________/ \_/ \____________________________/ \_____________/ \_______/
  |           |        |                |                       |            |
Protokol   Domain     Port            Jalur (Path)           Kueri        Fragmen
\`\`\`

### Rincian Komponen URL
1. **Skema / Protokol (\`https\`):** Menentukan protokol komunikasi yang digunakan serta standar keamanannya.
2. **Domain / Otoritas (\`api.devora.id\`):** Alamat tujuan server yang terdaftar pada sistem DNS.
3. **Port Jaringan (\`:443\`):** Pintu masuk soket jaringan spesifik (port 80 untuk HTTP biasa, port 443 untuk HTTPS terenkripsi).
4. **Jalur Sumber Daya (*Path*):** Alur hierarkis alamat (\`/v1/courses/backend-dev/lessons\`) yang dipetakan oleh router backend ke fungsi handler tertentu.
5. **Parameter Kueri (*Query String*):** Pasangan kunci-nilai diawali tanda tanya (\`?sort=asc&limit=10\`) yang digunakan untuk penyaringan data (*filter*), halaman (*pagination*), atau pencarian.
6. **Fragmen (*Fragment / Hash*):** Penanda posisi dokumen untuk klien peramban. **Penting diketahui: fragmen tidak pernah dikirimkan oleh peramban ke server backend**.

### Aspek Keamanan: URL Encoding
Karakter khusus pada URL harus diubah ke format persen (*percent-encoding*, misalnya spasi menjadi \`%20\`). Kelalaian dalam memvalidasi jalur URL dapat membuka celah keamanan manipulasi direktori (*Path Traversal*).`
  },

  // 12. HTTP Methods and Idempotency
  {
    order: 12,
    titleEn: 'HTTP Methods and Idempotency',
    titleId: 'Metode HTTP dan Konsep Idempoten',
    slug: 'sec-12-http-methods-and-idempotency',
    time: 12,
    contentEn: `# HTTP Methods and Idempotency

### Standardized Semantic Actions
RESTful backend engineering relies on standard HTTP methods to convey semantic intent. Each method possesses specific architectural properties regarding **safety** and **idempotency**.

| HTTP Method | CRUD Mapping | Safe? | Idempotent? | Typical Request Body |
|---|---|---|---|---|
| **GET** | Read | Yes | Yes | None |
| **POST** | Create | No | No | JSON Payload |
| **PUT** | Replace / Overwrite | No | Yes | Full Resource Representation |
| **PATCH** | Partial Update | No | No* | Partial Modifications |
| **DELETE** | Delete | No | Yes | None (or metadata) |
| **HEAD** | Metadata (Headers only) | Yes | Yes | None |
| **OPTIONS** | CORS Preflight & Discovery | Yes | Yes | None |

### What Is Idempotency?
An HTTP method is **idempotent** if making multiple identical requests has the exact same net effect on the server state as making a single request:
\`\`\`
f(f(x)) = f(x)
\`\`\`

- **Example of Idempotent:** \`DELETE /api/users/42\`. The first request deletes user 42. Subsequent requests find the user already deleted and change nothing further.
- **Example of Non-Idempotent:** \`POST /api/orders/pay\`. Executing this request three times will charge the customer's credit card three distinct times unless protected by **Idempotency Keys**.

### Defensive Backend Design: Idempotency Keys
In financial payment APIs (such as Stripe or Midtrans), clients include a unique UUID in the header: \`Idempotency-Key: e1a58c19-...\`. The backend caches the initial response in Redis. If network retry storms resubmit the exact same POST request, the backend immediately returns the cached confirmation without re-executing payment processing.`,

    contentId: `# Metode HTTP dan Konsep Idempoten

### Semantik Standar Aksi RESTful API
Rekayasa backend RESTful mengandalkan metode standar HTTP untuk menyatakan maksud aksi data secara eksplisit. Setiap metode memiliki karakteristik arsitektur penting: **keamanan (*safety*)** dan **idempotensi (*idempotency*)**.

| Metode HTTP | Pemetaan CRUD | Aman (*Safe*)? | Idempoten? | Isi Body Permintaan |
|---|---|---|---|---|
| **GET** | Membaca Data | Ya | Ya | Kosong |
| **POST** | Membuat Data Baru | Tidak | Tidak | Objek Data Baru |
| **PUT** | Mengganti Total | Tidak | Ya | Representasi Utuh Objek |
| **PATCH** | Pembaruan Sebagian | Tidak | Tidak* | Kolom yang Diubah Saja |
| **DELETE** | Menghapus Data | Tidak | Ya | Kosong |
| **HEAD** | Mengambil Header | Ya | Ya | Kosong |
| **OPTIONS** | Uji Pra-Koneksi CORS | Ya | Ya | Kosong |

### Apa Itu Idempotensi?
Metode HTTP disebut **idempoten** jika menjalankan permintaan identik sebanyak satu kali atau sepuluh kali menghasilkan dampak akhir yang sama persis pada status data di server:
\`\`\`
f(f(x)) = f(x)
\`\`\`

- **Contoh Operasi Idempoten:** \`DELETE /api/users/42\`. Eksekusi pertama menghapus data ID 42. Eksekusi kedua dan ketiga tidak mengubah apapun karena data sudah terhapus.
- **Contoh Non-Idempoten:** \`POST /api/orders/pay\`. Jika pengguna menekan tombol bayar 3 kali akibat koneksi lambat, saldo pengguna akan terpotong 3 kali jika backend tidak dilindungi.

### Perlindungan Defensif: Kunci Idempotensi (*Idempotency Key*)
Pada sistem pemrosesan transaksi keuangan, klien wajib menyertakan header khusus: \`Idempotency-Key: a8f91...\`. Server menyimpan hasil transaksi pertama di Redis. Jika ada permintaan ulang dengan kunci yang sama, server langsung mengembalikan struk transaksi sebelumnya tanpa mendebit saldo nasabah lagi.`
  },

  // 13. HTTP Status Codes Standards
  {
    order: 13,
    titleEn: 'HTTP Status Code Standards',
    titleId: 'Penanganan Kode Status HTTP Standar',
    slug: 'sec-13-http-status-codes',
    time: 12,
    contentEn: `# HTTP Status Code Standards

### The Universal Vocabulary of HTTP
HTTP status codes inform the client runtime whether a request succeeded, requires client modification, or encountered an unrecoverable server failure. Backend engineers must adhere strictly to IANA RFC specifications.

\`\`\`
1xx Informational | 2xx Success | 3xx Redirection | 4xx Client Error | 5xx Server Error
\`\`\`

### 1. 2xx: Success
- **200 OK:** Standard success response for GET, PUT, or PATCH.
- **201 Created:** New resource successfully persisted (typically returned by POST). Includes \`Location\` header.
- **204 No Content:** Request succeeded, but the response intentionally contains zero body bytes (standard for DELETE).

### 2. 4xx: Client Errors (Client Must Change Request)
- **400 Bad Request:** Malformed JSON syntax or schema validation failure.
- **401 Unauthorized:** Missing or invalid authentication credentials (user is unauthenticated).
- **403 Forbidden:** The authenticated user lacks permission to access the resource (authorization failure).
- **404 Not Found:** The requested URI does not exist on the server.
- **409 Conflict:** State collision, such as attempting to register an email address that already exists.
- **429 Too Many Requests:** The client exceeded established rate limits.

### 3. 5xx: Server Errors (Backend Failed or Crashed)
- **500 Internal Server Error:** Unhandled exception or unexpected runtime crash.
- **502 Bad Gateway:** The reverse proxy received an invalid response from the upstream application instance.
- **503 Service Unavailable:** The server is temporarily overloaded or undergoing maintenance.
- **504 Gateway Timeout:** The upstream backend process failed to return a response before the gateway proxy timed out.`,

    contentId: `# Penanganan Kode Status HTTP Standar

### Kosakata Universal Komunikasi Server
Kode status HTTP memberi tahu klien apakah permintaan berhasil diproses, membutuhkan perbaikan dari sisi pengguna, atau mengalami kegagalan pada mesin server. Insinyur backend wajib mematuhi standar RFC internasional.

\`\`\`
1xx Informasi | 2xx Keberhasilan | 3xx Pengalihan | 4xx Kesalahan Klien | 5xx Kesalahan Server
\`\`\`

### 1. Kategori 2xx: Keberhasilan (*Success*)
- **200 OK:** Permintaan berhasil diproses (standar untuk GET, PUT, atau PATCH).
- **201 Created:** Sumber daya baru berhasil disimpan permanen ke basis data (standar untuk POST).
- **204 No Content:** Permintaan berhasil, namun badan respon sengaja dikosongkan (standar untuk operasi DELETE).

### 2. Kategori 4xx: Kesalahan Sisi Klien (*Client Errors*)
- **400 Bad Request:** Sintaks JSON rusak atau data tidak lolos validasi skema input.
- **401 Unauthorized:** Klien belum login atau token autentikasi kedaluwarsa/tidak sah.
- **403 Forbidden:** Klien sudah terautentikasi, namun akun tidak memiliki hak akses (*role*) ke data tersebut.
- **404 Not Found:** Alamat endpoint atau ID data yang dicari tidak ditemukan di server.
- **409 Conflict:** Terjadi benturan data, misalnya mendaftarkan alamat email yang sudah ada.
- **429 Too Many Requests:** Klien melampaui batas kuota permintaan yang diizinkan (*rate limit*).

### 3. Kategori 5xx: Kegagalan Sisi Server (*Server Errors*)
- **500 Internal Server Error:** Terjadi bug kode yang tidak tertangkap (*unhandled exception*) pada logika aplikasi.
- **502 Bad Gateway:** Reverse proxy menerima respon rusak dari proses backend internal.
- **503 Service Unavailable:** Server kehabisan kapasitas memori atau sedang dalam pemeliharaan darurat.
- **504 Gateway Timeout:** Aplikasi backend memakan waktu terlalu lama memproses data sehingga proxy memutuskan koneksi.`
  },

  // 14. Transport Layer Security (TLS 1.3) and HTTPS
  {
    order: 14,
    titleEn: 'Transport Layer Security (TLS 1.3) and HTTPS',
    titleId: 'Enkripsi Transport: TLS Handshake & HTTPS',
    slug: 'sec-14-tls-and-https',
    time: 12,
    contentEn: `# Transport Layer Security (TLS 1.3) and HTTPS

### Securing Plaintext Protocols
Plain HTTP transmits every header, cookie, and payload in unencrypted plaintext across the public internet. Any intermediate actor (such as an insecure Wi-Fi router, malicious ISP, or rogue proxy) can inspect and tamper with user credentials (a **Man-in-the-Middle / MitM** attack).

### What Is HTTPS?
HTTPS is not a separate protocol; it is standard HTTP running over an encrypted **TLS (Transport Layer Security)** tunnel:
\`\`\`
HTTP Application Data -> TLS Cryptographic Tunnel -> TCP Socket -> IP Network
\`\`\`

### The Modern TLS 1.3 Handshake (1-RTT)
TLS 1.3 dramatically simplified and accelerated the cryptographic handshake compared to legacy TLS 1.2:
1. **Client Hello:** The client sends supported cryptographic cipher suites and an ephemeral Diffie-Hellman public key share.
2. **Server Hello & Certificate:** The server verifies the client proposal, returns its matching public key share, presents its X.509 digital certificate, and calculates the shared symmetric encryption key.
3. **Encrypted Traffic Begins:** After just 1 RTT, both parties establish a forward-secret, AES-256-GCM encrypted tunnel.

### Strict Transport Security (HSTS)
Backend servers enforce HTTPS usage by sending the security header:
\`\`\`http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
\`\`\`
This instructs client browsers to permanently refuse plaintext HTTP connections to the domain.`,

    contentId: `# Enkripsi Transport: TLS Handshake & HTTPS

### Mengamankan Komunikasi Teks Terbuka
Protokol HTTP biasa mentransmisikan seluruh data password, cookie sesi, dan nomor rekening dalam bentuk teks polos (*plaintext*) melintasi kabel internet publik. Siapa pun di jaringan perantara dapat membaca dan memalsukan data tersebut (*Man-in-the-Middle Attack*).

### Definisi HTTPS
HTTPS bukanlah protokol baru yang berdiri sendiri; HTTPS adalah protokol HTTP standar yang dijalankan di dalam terowongan enkripsi **TLS (*Transport Layer Security*)**:
\`\`\`
Data Aplikasi HTTP -> Terowongan Kriptografi TLS -> Soket TCP -> Jaringan IP
\`\`\`

### Mekanisme Jabat Tangan Modern TLS 1.3
Standar TLS 1.3 memangkas waktu negosiasi menjadi hanya satu putaran jaringan (*1-RTT*):
1. **Client Hello:** Klien mengirimkan daftar algoritma enkripsi yang didukung beserta kunci publik sementara (*Diffie-Hellman Key Share*).
2. **Server Hello & Sertifikat Digital:** Server memilih cipher yang aman, mengirimkan kunci publiknya, menyertakan sertifikat digital X.509 yang terverifikasi, dan menyepakati kunci sesi simetris bersama.
3. **Komunikasi Terenkripsi Aktif:** Dalam 1 RTT, saluran enkripsi berkekuatan AES-256-GCM terbentuk sempurna dan data HTTP dialirkan secara aman.

### Header Keamanan HSTS (*HTTP Strict Transport Security*)
Backend mewajibkan browser selalu menggunakan HTTPS melalui pengiriman header protektif:
\`\`\`http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
\`\`\`
Header ini memerintahkan peramban pengguna untuk menolak koneksi HTTP tanpa enkripsi secara permanen demi mencegah serangan pembajakan SSL (*SSL Stripping*).`
  },

  // 15. Data Serialization Formats: JSON, Form Data, Protobuf
  {
    order: 15,
    titleEn: 'Data Serialization Formats',
    titleId: 'Format Pertukaran Data: JSON, Form Data, & Protobuf',
    slug: 'sec-15-data-serialization',
    time: 12,
    contentEn: `# Data Serialization Formats: JSON, Form Data, Protobuf

### Bridging Memory and the Wire
In-memory runtime objects (such as a JavaScript Map, Go struct, or Python dictionary) cannot be directly transmitted across a network wire. They must be transformed into a standardized stream of bytes—a process known as **serialization** (or marshaling)—and reconstructed on the destination server via **deserialization**.

### 1. JSON (JavaScript Object Notation)
- **Format:** Text-based, key-value syntax.
- **MIME Type:** \`application/json\`
- **Strengths:** Universally supported, human-readable, flexible schema.
- **Weaknesses:** High payload size overhead, lacks native binary data support, slower CPU parsing speed.

### 2. Multipart Form Data (\`multipart/form-data\`)
- **Format:** Delimited text boundaries containing multiple payload parts.
- **Use Case:** Transmitting binary files (PDFs, images) alongside metadata form fields in a single HTTP request.

### 3. Protocol Buffers (Protobuf) & gRPC
- **Format:** Binary serialization developed by Google based on strict \`.proto\` schema definitions.
- **Strengths:** 5x–10x smaller payload size than JSON, extremely fast binary parsing, strictly enforced type safety.
- **Use Case:** High-throughput microservice-to-microservice internal communications where bandwidth and latency are critical.`,

    contentId: `# Format Pertukaran Data: JSON, Form Data, & Protobuf

### Menghubungkan Memori Program dengan Jaringan Fisik
Objek yang tersimpan di dalam memori server (seperti *struct* pada bahasa Go atau objek pada Node.js) tidak dapat langsung dipancarkan melalui kabel jaringan. Data harus diubah terlebih dahulu menjadi deretan byte berformat standar—proses ini disebut **serialisasi (*serialization*)**—dan diurai kembali di sisi penerima melalui **deserialisasi**.

### 1. Format JSON (*JavaScript Object Notation*)
- **Bentuk:** Teks terstruktur pasangan kunci-nilai.
- **Header:** \`Content-Type: application/json\`
- **Kelebihan:** Sangat mudah dibaca manusia, didukung secara universal oleh seluruh bahasa pemrograman di dunia.
- **Kelemahan:** Ukuran byte relatif besar karena mengulang nama kunci, dan membutuhkan daya komputasi CPU untuk parsing teks.

### 2. Format Formulir Multipart (*multipart/form-data*)
- **Bentuk:** Aliran byte yang dipisahkan oleh batas pembatas (*boundary*).
- **Kasus Penggunaan:** Mengunggah dokumen biner (foto, PDF) bersamaan dengan input teks dalam satu kali pengiriman HTTP.

### 3. Format Biner Protobuf (*Protocol Buffers*)
- **Bentuk:** Serialisasi biner murni terkompresi yang diatur oleh skema kontrak \`.proto\`.
- **Kelebihan:** Ukuran paket data hingga 80% lebih kecil dibanding JSON, parsing biner sangat cepat, dan memiliki jaminan tipe data yang ketat.
- **Kasus Penggunaan:** Komunikasi internal antar-microservice berkecepatan tinggi pada infrastruktur berskala besar.`
  },

  // 16. Backend Concurrency Models
  {
    order: 16,
    titleEn: 'Backend Concurrency Models',
    titleId: 'Model Konkurensi Backend: Thread, Event Loop, & Worker',
    slug: 'sec-16-backend-concurrency-models',
    time: 12,
    contentEn: `# Backend Concurrency Models

### Serving Thousands of Concurrent Clients
A production backend must handle tens of thousands of simultaneous client connections. How does a server process concurrent requests without exhaustively locking its physical CPU cores?

### 1. Multi-Threaded Process Model (Java Spring, Traditional Python)
- **Mechanics:** Each incoming TCP connection is allocated a dedicated operating system thread.
- **Trade-off:** Threads consume dedicated stack memory (e.g., 1MB–2MB each). Having 10,000 idle connections consumes 10GB–20GB of RAM just for thread stacks, accompanied by heavy CPU context-switching overhead.

### 2. Single-Threaded Event Loop (Node.js, Python Asyncio)
- **Mechanics:** A single main thread executes non-blocking asynchronous JavaScript code. When network I/O or database queries are requested, the task is handed off to OS kernel mechanisms (such as \`epoll\` on Linux or \`kqueue\` on macOS).
- **Rule of Thumb:** Excellent for I/O-bound web APIs; disastrous for CPU-heavy tasks (such as video rendering or cryptography) which block the entire event loop.

### 3. Lightweight Goroutines / Fibers (Go, Erlang/Elixir)
- **Mechanics:** The runtime manages lightweight green threads multiplexed across a small pool of OS threads. Goroutines initialize with just 2KB of memory.
- **Advantage:** A single commodity server can manage hundreds of thousands of concurrent connections with minimal memory footprint and near-zero context-switch latency.`,

    contentId: `# Model Konkurensi Backend: Thread, Event Loop, & Worker

### Melayani Ribuan Koneksi Klien Bersamaan
Server backend produksi dituntut mampu melayani puluhan ribu pengguna secara bersamaan. Bagaimana arsitektur server memproses banyak permintaan tanpa mengunci inti prosesor CPU?

### 1. Model Multi-Thread Klasik (Java, Thread Pool)
- **Cara Kerja:** Setiap koneksi TCP baru dialokasikan ke satu *thread* sistem operasi tersendiri.
- **Kekurangan:** Setiap *thread* mengonsumsi memori tumpukan (*stack memory*) 1MB–2MB. Melayani 10.000 koneksi yang sedang menganggur dapat menyita puluhan gigabyte RAM dan membebani prosesor dengan *context-switching*.

### 2. Model Event Loop Asinkron (Node.js, Asyncio)
- **Cara Kerja:** Berjalan pada satu *thread* utama tanpa henti. Saat terjadi kueri basis data atau pembacaan berkas (I/O), pekerjaan diserahkan ke pustaka kernel sistem operasi (\`epoll\` pada Linux). Ketika data selesai diambil, fungsi *callback* dipanggil kembali ke antrean.
- **Kelebihan & Batasan:** Sangat hemat memori untuk API berbasis jaringan; namun tugas komputasi matematika berat tidak boleh dijalankan di thread utama karena dapat membekukan server.

### 3. Model Goroutine / Green Thread Ringan (Bahasa Go, Elixir)
- **Cara Kerja:** Runtime mengelola thread virtual (*green threads*) yang sangat ringan (hanya 2KB memori awal) yang dimultipleks ke sejumlah kecil thread sistem operasi fisik.
- **Keunggulan Mutlak:** Satu server mampu membuka lebih dari 200.000 koneksi soket aktif secara bersamaan dengan penggunaan memori yang luar biasa efisien.`
  },

  // 17. Common Architectural Mistakes in Backend Engineering
  {
    order: 17,
    titleEn: 'Common Architectural Mistakes',
    titleId: 'Kesalahan Umum Arsitektur Klien-Server',
    slug: 'sec-17-common-architectural-mistakes',
    time: 12,
    contentEn: `# Common Architectural Mistakes in Backend Engineering

### High-Impact Pitfalls to Avoid
Novice backend developers frequently introduce subtle architectural flaws that compromise security, scalability, and data integrity under production loads.

### 1. Trusting Client Input (The Fundamental Vulnerability)
- **Mistake:** Assuming parameters, prices, or user IDs sent from client frontends are legitimate.
- **Consequence:** An attacker alters the price field in a JSON payload (\`{"price": 0.01}\`) before submitting an order.
- **Defense:** Never calculate final amounts or verify authorizations based on client-provided metadata. The backend must query the authoritative database record.

### 2. Storing State in Server Local Memory
- **Mistake:** Storing user session data or shopping cart arrays in application global variables (\`globalUsers[userId]\`).
- **Consequence:** When deploying a second server behind a load balancer, half the requests fail because the session exists only on Server A.
- **Defense:** Keep all application instances 100% stateless; store ephemeral state in Redis or relational databases.

### 3. Unbounded Queries and Missing Pagination
- **Mistake:** Writing queries like \`SELECT * FROM transactions\` without limits.
- **Consequence:** As data scales to millions of records, a single endpoint invocation exhausts server memory and crashes the process.
- **Defense:** Enforce mandatory limit-offset or cursor-based pagination on every collection endpoint.

### 4. Overexposing Internal Database Schemas
- **Mistake:** Returning raw database rows directly to the client JSON response.
- **Consequence:** Leaks internal hash columns, salt fields, foreign key structures, and proprietary system metadata.
- **Defense:** Utilize Data Transfer Objects (DTOs) and serialization serializers to expose only intentional fields.`,

    contentId: `# Kesalahan Umum Arsitektur Klien-Server

### Jebakan Kritis yang Wajib Dihindari
Pengembang backend pemula kerap melakukan kesalahan arsitektural mendasar yang dapat melumpuhkan sistem saat menghadapi lalu lintas produksi skala besar.

### 1. Mempercayai Masukan dari Sisi Klien (*Trusting Client Input*)
- **Kesalahan:** Menganggap data harga, ID akun, atau status diskon yang dikirim dari formulir frontend adalah data yang valid.
- **Dampak Fatal:** Peretas dapat mengubah nilai harga pada payload JSON (\`{"harga": 100}\`) sebelum menekan tombol bayar.
- **Pertahanan Defensif:** Server backend wajib menghitung ulang seluruh nilai transaksi secara independen dengan mengambil data harga resmi langsung dari basis data.

### 2. Menyimpan Status Sesi di Memori Lokal Server
- **Kesalahan:** Menyimpan status login atau keranjang belanja di dalam variabel memori global aplikasi (\`const sessions = {}\`).
- **Dampak Fatal:** Saat aplikasi di-deploy menjadi 3 instans server di balik load balancer, pengguna akan terus ter-logout karena data sesi hanya ada di Server 1.
- **Pertahanan Defensif:** Jadikan seluruh instans server backend 100% *stateless*; simpan sesi bersama pada kluster Redis terpusat.

### 3. Kueri Tanpa Batas (*Unbounded Queries*)
- **Kesalahan:** Menuliskan perintah \`SELECT * FROM transaksi\` tanpa menyertakan batasan kuota.
- **Dampak Fatal:** Saat tabel memiliki 2 juta baris, satu permintaan akan menyedot seluruh memori RAM server hingga aplikasi mati seketika (*Out of Memory*).
- **Pertahanan Defensif:** Wajibkan paginasi berbasis kursor (*cursor-based pagination*) atau batas limit-offset pada setiap endpoint daftar data.

### 4. Mengekspos Skema Basis Data Mentah ke Publik
- **Kesalahan:** Mengirimkan objek baris basis data apa adanya langsung ke respon JSON klien.
- **Dampak Fatal:** Bocornya hash kata sandi tersembunyi, tanggal internal, dan relasi kunci foreign key ke publik.
- **Pertahanan Defensif:** Gunakan pola *Data Transfer Object (DTO)* untuk menyaring hanya data yang memang aman disajikan ke pengguna.`
  },

  // 18. Guided Architecture Case Study: Payment Reservation API
  {
    order: 18,
    titleEn: 'Guided Case Study: Flash Sale Reservation API',
    titleId: 'Studi Kasus Terpandu: API Reservasi Flash Sale',
    slug: 'sec-18-guided-case-study',
    time: 15,
    contentEn: `# Guided Case Study: Flash Sale Reservation API

### Scenario Architecture
You are tasked with engineering the backend reservation endpoint for an e-commerce flash sale platform where 10,000 customers will attempt to claim 50 limited-edition graphic cards within a 10-second window.

\`\`\`
10,000 Concurrent Clients -> Cloudflare (DDoS & WAF) -> Nginx Reverse Proxy (Rate Limiting)
                                                        -> 4x Stateless Node.js API Workers
                                                        -> Redis (Atomic Decrement Inventory)
                                                        -> PostgreSQL (ACID Order Confirmation)
\`\`\`

### Defensive Architecture Blueprint
1. **Edge Protection:**
   - Terminate TLS at Cloudflare and enforce rate limiting (maximum 5 requests per second per IP).
   - Validate that client requests possess valid JWT headers before forwarding traffic to application instances.

2. **Atomic Inventory Reservation:**
   - Querying PostgreSQL directly under 10,000 concurrent write locks would saturate database connection pools.
   - Instead, the backend utilizes Redis **Atomic Decrement (\`DECR\`)**:
   \`\`\`lua
   -- Atomic Redis Script
   local stock = redis.call('get', KEYS[1])
   if tonumber(stock) > 0 then
       redis.call('decr', KEYS[1])
       return 1
   else
       return 0
   end
   \`\`\`

3. **Asynchronous Order Finalization:**
   - Only the 50 clients that receive an affirmative response from the atomic Redis check are permitted to enqueue an order creation job into a message queue (BullMQ / RabbitMQ).
   - A dedicated worker pool processes the queue, executing an ACID PostgreSQL transaction to persist the invoice and generate an authoritative reservation ID.

### Key Architectural Lessons
- Decouple fast, high-concurrency admission checks (in-memory Redis) from slow, permanent persistence writes (PostgreSQL).
- Never allow uncontrolled traffic spikes to directly hit disk-based database connection pools.`,

    contentId: `# Studi Kasus Terpandu: API Reservasi Flash Sale

### Skenario Kebutuhan Arsitektur
Anda ditugaskan merancang endpoint API backend untuk program *Flash Sale*, di mana 10.000 calon pembeli akan berebut membeli 50 unit laptop dengan diskon 80% dalam rentang waktu 10 detik.

\`\`\`
10.000 Klien Bersamaan -> Cloudflare (Proteksi DDoS) -> Nginx Reverse Proxy (Rate Limit)
                                                       -> 4x Server Aplikasi Stateless
                                                       -> Redis (Pengurangan Stok Atomik)
                                                       -> PostgreSQL (Penyimpanan Transaksi)
\`\`\`

### Rencana Arsitektur Defensif
1. **Perlindungan Lapisan Terluar (*Edge Defense*):**
   - Terminasi enkripsi HTTPS di tingkat Cloudflare dan terapkan pembatasan frekuensi (*rate limiting* maksimal 5 panggilan per detik per alamat IP).
   - Tolak secara instan setiap permintaan yang tidak memuat header autentikasi yang sah.

2. **Pemesanan Stok Atomik di Memori (*Atomic In-Memory Reservation*):**
   - Mengizinkan 10.000 permintaan melakukan kueri \`UPDATE stok\` langsung ke PostgreSQL secara bersamaan akan membuat antrean basis data terkunci total (*deadlock*).
   - Solusi: Pengurangan stok dilakukan secara atomik di dalam memori Redis menggunakan perintah \`DECR\`:
   \`\`\`lua
   -- Skrip Atomik Redis
   local sisaStok = redis.call('get', KEYS[1])
   if tonumber(sisaStok) > 0 then
       redis.call('decr', KEYS[1])
       return 1
   else
       return 0
   end
   \`\`\`

3. **Penyimpanan Transaksional Asinkron:**
   - Hanya 50 permintaan yang berhasil mengurangi stok di Redis yang diizinkan memasukkan pesan ke dalam antrean (*Message Queue: RabbitMQ / BullMQ*).
   - Proses pekerja (*worker*) di latar belakang kemudian menyimpan faktur transaksi ke dalam PostgreSQL secara bertahap menggunakan transaksi ACID yang aman.

### Pelajaran Penting Rekayasa Backend
- Pisahkan mekanisme penerimaan lalu lintas tinggi yang cepat (berbasis memori Redis) dari sistem pencatatan permanen yang lambat (berbasis penyimpanan cakram PostgreSQL).
- Jangan pernah membiarkan lonjakan lalu lintas yang tidak teratur menghantam langsung ke kolam koneksi basis data.`
  },

  // 19. Independent Practice Exercise
  {
    order: 19,
    titleEn: 'Independent Practice: API Contract Design',
    titleId: 'Latihan Mandiri: Merancang Kontrak API Klien-Server',
    slug: 'sec-19-independent-practice',
    time: 15,
    contentEn: `# Independent Practice: API Contract Design

### Practical Architecture Drill
Apply the principles of client-server separation, RESTful semantics, HTTP status codes, and input validation to design an enterprise-grade API contract for a digital library management system.

### Your Scenario
Design the interface specification for managing book lending records. Define specifications for the following operations:
1. **Borrowing a Book:** A user borrows a specific book volume.
2. **Retrieving Active Borrows:** A user inspects their current outstanding borrowed titles.
3. **Renewing a Loan:** Extending the due date by 7 days.
4. **Returning a Book:** Marking the book as returned.

### Requirements for Your Solution
For each of the four endpoints, document:
- **HTTP Method & Path:** Adhering strictly to RESTful resource hierarchy conventions.
- **Required Headers:** Including authentication and content-type specifications.
- **Request Body (if applicable):** Formatted as a validated JSON schema.
- **Expected Success Status Code:** Explaining why that code was selected.
- **Potential Error Status Codes:** Specifying at least two 4xx failure scenarios.

### Self-Review Evaluation Criteria
- Did you use nouns for resource endpoints (\`/v1/loans\`) rather than RPC verbs (\`/v1/borrowBook\`)?
- Is the renewal operation designed as an idempotent update (\`PATCH /v1/loans/{id}\`)?
- Are error codes mathematically distinct (e.g., 401 for unauthenticated vs 403 for unauthorized)?`,

    contentId: `# Latihan Mandiri: Merancang Kontrak API Klien-Server

### Latihan Praktik Rekayasa
Terapkan prinsip pemisahan klien-server, kaidah semantik RESTful, standar kode status HTTP, dan validasi data untuk merancang kontrak API tingkat perusahaan untuk sistem perpustakaan digital.

### Skenario Tugas
Rancang spesifikasi kontrak antarmuka API untuk mengelola peminjaman buku perpustakaan. Buat definisi untuk empat alur operasi:
1. **Meminjam Buku Baru:** Pengguna meminjam judul buku tertentu.
2. **Melihat Buku yang Dipinjam:** Pengguna memeriksa daftar peminjaman aktif miliknya.
3. **Memperpanjang Masa Pinjam:** Menambah durasi peminjaman selama 7 hari.
4. **Mengembalikan Buku:** Menandai buku telah selesai dikembalikan ke rak.

### Elemen Wajib pada Solusi Anda
Untuk setiap endpoint di atas, tentukan:
- **Metode HTTP dan Jalur URL:** Mematuhi kaidah penamaan hierarkis RESTful.
- **Header Wajib:** Menyertakan header autentikasi token dan format konten.
- **Badan Permintaan (Payload JSON):** Struktur atribut data yang dikirimkan klien.
- **Kode Status Sukses:** Alasan pemilihan kode status 200, 201, atau 204.
- **Kemungkinan Kode Kesalahan:** Sebutkan minimal dua skenario kesalahan 4xx (misalnya 404 jika buku tidak ada, 409 jika buku sedang dipinjam orang lain).

### Kriteria Evaluasi Mandiri
- Apakah Anda menggunakan kata benda jamak untuk jalur resource (\`/v1/loans\`) dan bukan kata kerja (\`/v1/pinjamBuku\`)?
- Apakah operasi perpanjangan masa pinjam dirancang sebagai operasi idempoten (\`PATCH /v1/loans/{id}\`)?
- Apakah Anda membedakan kode 401 (belum login) dengan kode 403 (login berhasil tapi tidak punya hak akses)?`
  },

  // 20. Summary and Transition to Chapter 2
  {
    order: 20,
    titleEn: 'Summary and Transition to Chapter 2',
    titleId: 'Rangkuman Bab dan Persiapan Menuju Bab 2',
    slug: 'sec-20-summary-and-transition',
    time: 10,
    contentEn: `# Summary and Transition to Chapter 2

### Key Architectural Concepts Mastered
Congratulations on completing the 20 structured sections of **Chapter 1: The Client-Server Model & Internet Protocols**. You have established the indispensable mental foundations that distinguish senior backend architects from novice coders:

1. **Client-Server Boundary:** Clear segregation of concerns between untrusted presentation layers and authoritative persistence engines.
2. **Protocol Mechanics:** The precise lifecycle of network data packets traversing DNS, TCP handshakes, TLS 1.3 tunnels, and reverse proxy routing.
3. **Semantic Standards:** Accurate utilization of HTTP methods, headers, status codes, and the critical mathematical property of idempotency.
4. **Scalability Paradigms:** The necessity of stateless application instances and centralized Redis session storage for horizontal auto-scaling.

### Preparation for Chapter 2
In **Chapter 2: HTTP/1.1, HTTP/2, and HTTP/3 Deep Dive**, we will look inside the transport pipeline to examine:
- Head-of-Line (HoL) blocking in HTTP/1.1 and how multiplexing in HTTP/2 revolutionized binary web streams.
- The transition from TCP to the UDP-based **QUIC protocol** in HTTP/3.
- Server Push mechanics, HPACK header compression algorithms, and zero-RTT connection resumption.

### Next Step: Take the Chapter 1 Assessment
Test your understanding by taking the **20-question Chapter Assessment**. A score of at least 70% is required to earn your verified Chapter Completion Certificate.`,

    contentId: `# Rangkuman Bab dan Persiapan Menuju Bab 2

### Rangkuman Kompetensi Inti yang Telah Dikuasai
Selamat, Anda telah menyelesaikan seluruh 20 bagian terstruktur dari **Bab 1: Model Klien-Server dan Protokol Internet**. Anda kini telah memiliki fondasi pola pikir sistemik yang membedakan insinyur backend profesional:

1. **Batas Pemisahan Klien-Server:** Pemisahan tanggung jawab yang tegas antara lapisan visual klien yang tidak terpercaya dan mesin backend yang otoritatif.
2. **Mekanisme Jaringan:** Alur lengkap perjalanan data dari resolusi DNS, jabat tangan TCP, enkripsi TLS 1.3, hingga perutean oleh reverse proxy.
3. **Standar Semantik:** Penggunaan metode HTTP, header standar, penanganan kode status yang presisi, serta penerapan prinsip idempoten pada transaksi kritis.
4. **Skalabilitas Sistem:** Pentingnya merancang server aplikasi tanpa status (*stateless*) dan penyimpanan sesi terpusat untuk mendukung penambahan kapasitas horizontal.

### Pengantar Menuju Bab 2
Pada **Bab 2: Pendalaman Komprehensif HTTP/1.1, HTTP/2, dan HTTP/3**, kita akan membedah evolusi internal pipa transmisi web:
- Masalah antrean data terhambat (*Head-of-Line Blocking*) pada HTTP/1.1 dan solusinya melalui *multiplexing* pada HTTP/2.
- Peralihan dari TCP menuju protokol berbasis UDP yaitu **QUIC** pada standar HTTP/3.
- Kompresi header biner (HPACK/QPACK) dan penghematan waktu jabat tangan koneksi *0-RTT*.

### Langkah Selanjutnya: Ikuti Ujian Evaluasi Bab 1
Uji pemahaman Anda dengan mengikuti **Ujian Evaluasi Bab 1 (20 Soal Pilihan Ganda)**. Skor minimal 70% diperlukan untuk menerbitkan Sertifikat Kelulusan Bab resmi Anda.`
  }
];

// Insert 20 Lessons into SQLite
console.log(`Inserting ${ALL_SECTIONS.length} deep substantive sections into Backend Chapter 01...`);
ALL_SECTIONS.forEach(sec => {
  const lessonId = `pathway_07_ch1_sec${sec.order}`;
  const content = sec.contentId; // default
  insertLesson.run(
    lessonId,
    chapterId,
    sec.titleId,
    sec.slug,
    content,
    sec.order,
    sec.time,
    sec.titleEn,
    sec.titleId,
    sec.contentEn,
    sec.contentId
  );
});

// 3. Upsert Assessment
db.prepare(`
  INSERT OR REPLACE INTO assessments (
    id, chapter_id, title, description, passing_score, max_attempts, time_limit_min, status
  ) VALUES (?, ?, ?, ?, 70, 0, 45, 'published')
`).run(
  assessmentId,
  chapterId,
  'Backend Development Chapter 1 Assessment',
  'Comprehensive 20-question technical evaluation covering Client-Server Architecture, HTTP protocols, TCP handshakes, and API semantics.'
);

// Clear old questions
db.prepare('DELETE FROM assessment_questions WHERE assessment_id = ?').run(assessmentId);

const insertQuestion = db.prepare(`
  INSERT INTO assessment_questions (
    id, assessment_id, question_text, question_type, options, correct_answer, explanation, points, sort_order,
    question_text_en, question_text_id, explanation_en, explanation_id, hint_en, hint_id
  ) VALUES (?, ?, ?, 'multiple_choice', ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
`);

// 20 High-Quality Unique Assessment Questions
const QUESTIONS_DATA = [
  {
    idx: 1,
    qEn: 'In a professional client-server architecture, why must client-side input validation never replace backend validation?',
    qId: 'Dalam arsitektur klien-server profesional, mengapa validasi input di sisi klien tidak boleh menggantikan validasi di sisi server backend?',
    options: [
      { id: 'opt_a', textEn: 'Client devices have faster processors than cloud servers.', textId: 'Perangkat klien memiliki prosesor yang lebih cepat daripada server awan.', isCorrect: false },
      { id: 'opt_b', textEn: 'Client runtimes can be easily bypassed or manipulated using proxies, dev tools, or custom HTTP scripts.', textId: 'Lingkungan klien dapat dengan mudah dimanipulasi atau dilewati menggunakan skrip kustom atau perangkat proxy.', isCorrect: true },
      { id: 'opt_c', textEn: 'Backend servers do not have access to database schema constraints.', textId: 'Server backend tidak memiliki akses ke batasan skema basis data.', isCorrect: false },
      { id: 'opt_d', textEn: 'Client-side validation increases network packet latency significantly.', textId: 'Validasi sisi klien memperlambat transmisi paket jaringan secara drastis.', isCorrect: false }
    ],
    expEn: 'The client environment is inherently untrusted. Attackers can bypass browser form constraints using cURL or Postman; therefore, the backend must authoritatively validate every inbound byte.',
    expId: 'Lingkungan klien secara mendasar tidak dapat dipercaya. Penyerang dapat melewati validasi form peramban dengan mudah menggunakan cURL atau Postman; oleh karena itu server backend wajib memvalidasi setiap data yang masuk.',
    hintEn: 'Think about who controls the code execution environment on the client device.',
    hintId: 'Pikirkan siapa yang memegang kendali atas eksekusi kode pada perangkat klien.'
  },
  {
    idx: 2,
    qEn: 'Which transport protocol guarantees in-order, lossless packet delivery through sequence numbers and automatic retransmissions?',
    qId: 'Protokol transport manakah yang menjamin pengiriman paket secara utuh dan berurutan melalui nomor urut dan pengiriman ulang otomatis?',
    options: [
      { id: 'opt_a', textEn: 'UDP (User Datagram Protocol)', textId: 'UDP (User Datagram Protocol)', isCorrect: false },
      { id: 'opt_b', textEn: 'ICMP (Internet Control Message Protocol)', textId: 'ICMP (Internet Control Message Protocol)', isCorrect: false },
      { id: 'opt_c', textEn: 'TCP (Transmission Control Protocol)', textId: 'TCP (Transmission Control Protocol)', isCorrect: true },
      { id: 'opt_d', textEn: 'ARP (Address Resolution Protocol)', textId: 'ARP (Address Resolution Protocol)', isCorrect: false }
    ],
    expEn: 'TCP is connection-oriented and provides reliable, ordered byte-stream delivery with built-in retransmissions and flow control.',
    expId: 'TCP adalah protokol berorientasi koneksi yang menjamin pengiriman data byte yang andal dan berurutan dengan fitur retransmisi otomatis.',
    hintEn: 'Web APIs and relational databases rely on this reliable transport protocol.',
    hintId: 'API web dan basis data relasional mengandalkan protokol transport andal ini.'
  },
  {
    idx: 3,
    qEn: 'What is the correct chronological sequence of packets exchanged during the TCP Three-Way Handshake?',
    qId: 'Manakah urutan kronologis pertukaran paket yang benar pada proses Jabat Tangan Tiga Arah TCP?',
    options: [
      { id: 'opt_a', textEn: 'SYN -> SYN-ACK -> ACK', textId: 'SYN -> SYN-ACK -> ACK', isCorrect: true },
      { id: 'opt_b', textEn: 'ACK -> SYN -> FIN', textId: 'ACK -> SYN -> FIN', isCorrect: false },
      { id: 'opt_c', textEn: 'PING -> PONG -> ACK', textId: 'PING -> PONG -> ACK', isCorrect: false },
      { id: 'opt_d', textEn: 'SYN -> ACK -> RST', textId: 'SYN -> ACK -> RST', isCorrect: false }
    ],
    expEn: 'The client sends SYN, the server responds with SYN-ACK, and the client acknowledges with ACK to establish bidirectional communication.',
    expId: 'Klien mengirim SYN, server membalas dengan SYN-ACK, dan klien mengonfirmasi dengan ACK untuk menyepakati koneksi dua arah.',
    hintEn: 'Synchronization comes before acknowledgment.',
    hintId: 'Sinkronisasi dilakukan sebelum konfirmasi penerimaan.'
  },
  {
    idx: 4,
    qEn: 'What does it mean for an HTTP method to be "idempotent"?',
    qId: 'Apa yang dimaksud dengan sifat "idempoten" pada suatu metode HTTP?',
    options: [
      { id: 'opt_a', textEn: 'The request is encrypted with AES-256.', textId: 'Permintaan tersebut dienkripsi dengan standar AES-256.', isCorrect: false },
      { id: 'opt_b', textEn: 'Executing multiple identical requests leaves the server in the exact same state as executing a single request.', textId: 'Menjalankan permintaan identik berkali-kali menghasilkan dampak status akhir yang sama persis seperti menjalankannya sekali.', isCorrect: true },
      { id: 'opt_c', textEn: 'The method never modifies database records under any circumstance.', textId: 'Metode tersebut sama sekali tidak pernah mengubah catatan data basis data.', isCorrect: false },
      { id: 'opt_d', textEn: 'The response contains no headers or cookies.', textId: 'Respon dari server tidak memuat header maupun cookie.', isCorrect: false }
    ],
    expEn: 'Idempotency means f(f(x)) = f(x). Repeated invocations produce no additional side-effects on server state.',
    expId: 'Idempotensi berarti f(f(x)) = f(x). Pemanggilan berulang tidak menimbulkan efek samping tambahan pada status server.',
    hintEn: 'Consider what happens if network retry storms trigger the exact same request three times.',
    hintId: 'Pertimbangkan apa yang terjadi jika gangguan jaringan memicu pengiriman ulang permintaan 3 kali.'
  },
  {
    idx: 5,
    qEn: 'Which of the following HTTP methods is NOT idempotent according to RFC specifications?',
    qId: 'Manakah dari metode HTTP berikut yang secara spesifikasi RFC TIDAK bersifat idempoten?',
    options: [
      { id: 'opt_a', textEn: 'GET', textId: 'GET', isCorrect: false },
      { id: 'opt_b', textEn: 'PUT', textId: 'PUT', isCorrect: false },
      { id: 'opt_c', textEn: 'DELETE', textId: 'DELETE', isCorrect: false },
      { id: 'opt_d', textEn: 'POST', textId: 'POST', isCorrect: true }
    ],
    expEn: 'POST typically creates new resources; submitting the same POST request multiple times creates multiple duplicate resources.',
    expId: 'POST biasanya membuat data baru; mengirimkan permintaan POST yang sama berulang kali akan menciptakan banyak data duplikat.',
    hintEn: 'Think about creating a new order or charging a credit card.',
    hintId: 'Pikirkan aksi pembuatan pesanan baru atau pemotongan saldo pembayaran.'
  },
  {
    idx: 6,
    qEn: 'Which HTTP status code should a backend REST API return when a new resource is successfully created and persisted?',
    qId: 'Kode status HTTP manakah yang harus dikembalikan oleh REST API saat sebuah data baru berhasil dibuat dan disimpan?',
    options: [
      { id: 'opt_a', textEn: '200 OK', textId: '200 OK', isCorrect: false },
      { id: 'opt_b', textEn: '201 Created', textId: '201 Created', isCorrect: true },
      { id: 'opt_c', textEn: '204 No Content', textId: '204 No Content', isCorrect: false },
      { id: 'opt_d', textEn: '202 Accepted', textId: '202 Accepted', isCorrect: false }
    ],
    expEn: 'Status 201 Created signifies that the request succeeded and resulted in the instantiation of a new resource.',
    expId: 'Kode 201 Created menandakan bahwa permintaan berhasil dan menghasilkan pencatatan data baru di server.',
    hintEn: 'Look for the 2xx code specifically designated for creation.',
    hintId: 'Cari kode 2xx yang khusus menandakan pembuatan data baru.'
  },
  {
    idx: 7,
    qEn: 'What is the primary technical difference between HTTP 401 Unauthorized and HTTP 403 Forbidden?',
    qId: 'Apa perbedaan teknis utama antara kode status HTTP 401 Unauthorized dan HTTP 403 Forbidden?',
    options: [
      { id: 'opt_a', textEn: '401 is for server errors, while 403 is for client errors.', textId: '401 adalah kesalahan server, sedangkan 403 adalah kesalahan klien.', isCorrect: false },
      { id: 'opt_b', textEn: '401 indicates missing or invalid authentication (who are you?), while 403 indicates insufficient authorization (you are identified, but lack permission).', textId: '401 menandakan ketiadaan atau kesalahan autentikasi (siapa Anda?), sedangkan 403 menandakan kekurangan hak akses otorisasi (identitas diketahui, tetapi izin ditolak).', isCorrect: true },
      { id: 'opt_c', textEn: '401 means the URL does not exist, while 403 means the database is down.', textId: '401 berarti URL tidak ada, sedangkan 403 berarti basis data mati.', isCorrect: false },
      { id: 'opt_d', textEn: 'There is no difference; they are interchangeable synonyms.', textId: 'Tidak ada perbedaan teknis; keduanya adalah sinonim yang sama.', isCorrect: false }
    ],
    expEn: '401 means authentication is required or failed. 403 means the identity is known, but forbidden from performing that operation.',
    expId: '401 berarti autentikasi tidak ada atau gagal diverifikasi. 403 berarti identitas pengguna valid, namun hak aksesnya ditolak untuk operasi tersebut.',
    hintEn: 'Authentication vs Authorization.',
    hintId: 'Autentikasi (bukti identitas) vs Otorisasi (hak izin).'
  },
  {
    idx: 8,
    qEn: 'Which DNS record type maps a domain name directly to an IPv4 address?',
    qId: 'Jenis record DNS manakah yang memetakan nama domain secara langsung ke alamat IPv4?',
    options: [
      { id: 'opt_a', textEn: 'CNAME Record', textId: 'Record CNAME', isCorrect: false },
      { id: 'opt_b', textEn: 'MX Record', textId: 'Record MX', isCorrect: false },
      { id: 'opt_c', textEn: 'A Record', textId: 'Record A', isCorrect: true },
      { id: 'opt_d', textEn: 'TXT Record', textId: 'Record TXT', isCorrect: false }
    ],
    expEn: 'An "A" (Address) record maps an FQDN to a 32-bit IPv4 address.',
    expId: 'Record A (Address) memetakan nama domain langsung ke alamat 32-bit IPv4.',
    hintEn: 'The most fundamental single-letter DNS record.',
    hintId: 'Record DNS satu huruf paling mendasar.'
  },
  {
    idx: 9,
    qEn: 'In production systems, what is the primary role of a Reverse Proxy like Nginx or Envoy placed in front of application instances?',
    qId: 'Dalam arsitektur produksi, apa peran utama Reverse Proxy seperti Nginx atau Envoy yang diletakkan di depan server aplikasi?',
    options: [
      { id: 'opt_a', textEn: 'To execute database SQL migrations automatically.', textId: 'Untuk menjalankan migrasi SQL basis data secara otomatis.', isCorrect: false },
      { id: 'opt_b', textEn: 'To terminate TLS, load balance requests, cache static assets, and shield internal backend services.', textId: 'Untuk melakukan terminasi TLS, membagi beban lalu lintas (*load balancing*), menyimpan cache berkas, dan mengisolasi layanan internal.', isCorrect: true },
      { id: 'opt_c', textEn: 'To compile frontend React components on the fly.', textId: 'Untuk mengompilasi komponen frontend React secara langsung.', isCorrect: false },
      { id: 'opt_d', textEn: 'To generate client UI animations.', textId: 'Untuk menghasilkan animasi visual antarmuka pengguna.', isCorrect: false }
    ],
    expEn: 'Reverse proxies handle edge ingress concerns (TLS termination, load balancing, rate limiting, and caching) before forwarding clean traffic to backend workers.',
    expId: 'Reverse proxy menangani tugas terluar (terminasi enkripsi TLS, pembagian beban, pembatasan kuota, dan caching) sebelum meneruskan paket ke server aplikasi.',
    hintEn: 'Think of an edge security shield and traffic distributor.',
    hintId: 'Pikirkan peran pelindung terluar dan pengatur distribusi lalu lintas.'
  },
  {
    idx: 10,
    qEn: 'Why are modern cloud backend application instances engineered to be "stateless"?',
    qId: 'Mengapa instans aplikasi backend di era cloud dirancang untuk tidak menyimpan status (*stateless*)?',
    options: [
      { id: 'opt_a', textEn: 'Because stateless servers do not require operating systems.', textId: 'Karena server stateless tidak memerlukan sistem operasi.', isCorrect: false },
      { id: 'opt_b', textEn: 'To enable effortless horizontal scaling, where any incoming request can be handled by any replica without session loss.', textId: 'Agar sistem dapat melakukan penambahan kapasitas horizontal secara dinamis, di mana permintaan mana pun dapat ditangani oleh instans mana pun tanpa kehilangan sesi.', isCorrect: true },
      { id: 'opt_c', textEn: 'Because database engines cannot connect to stateful applications.', textId: 'Karena basis data tidak dapat terhubung ke aplikasi yang memiliki status.', isCorrect: false },
      { id: 'opt_d', textEn: 'To avoid generating server logs.', textId: 'Untuk menghindari pembuatan berkas log server.', isCorrect: false }
    ],
    expEn: 'Statelessness decouples user sessions from individual physical machines, allowing traffic to be load-balanced across dynamically autoscaled server pools.',
    expId: 'Desain stateless memisahkan data sesi pengguna dari mesin fisik tertentu, sehingga lalu lintas dapat disebar ke puluhan server yang dapat ditambah atau dikurangi secara otomatis.',
    hintEn: 'Think about autoscaling clusters from 2 servers to 50 servers.',
    hintId: 'Pikirkan kemampuan menambah jumlah server dari 2 menjadi 50 secara instan.'
  },
  {
    idx: 11,
    qEn: 'Which HTTP header instructs browsers to permanently enforce HTTPS connections and reject unencrypted HTTP transmission?',
    qId: 'Header HTTP manakah yang memerintahkan peramban pengguna untuk selalu menggunakan koneksi HTTPS dan menolak transmisi HTTP tanpa enkripsi?',
    options: [
      { id: 'opt_a', textEn: 'Content-Security-Policy', textId: 'Content-Security-Policy', isCorrect: false },
      { id: 'opt_b', textEn: 'Strict-Transport-Security (HSTS)', textId: 'Strict-Transport-Security (HSTS)', isCorrect: true },
      { id: 'opt_c', textEn: 'X-Frame-Options', textId: 'X-Frame-Options', isCorrect: false },
      { id: 'opt_d', textEn: 'Access-Control-Allow-Origin', textId: 'Access-Control-Allow-Origin', isCorrect: false }
    ],
    expEn: 'HSTS (HTTP Strict Transport Security) informs user agents that all future communications must use HTTPS, mitigating SSL stripping and downgrade attacks.',
    expId: 'HSTS (HTTP Strict Transport Security) memberi tahu peramban bahwa seluruh komunikasi di masa depan wajib memakai HTTPS untuk mencegah manipulasi downgrade SSL.',
    hintEn: 'Look for Transport Security in the header name.',
    hintId: 'Cari header yang memuat istilah Transport Security.'
  },
  {
    idx: 12,
    qEn: 'What happens to the URL fragment identifier (e.g., #section-2) during an HTTP request transmission?',
    qId: 'Apa yang terjadi pada penanda fragmen URL (misalnya #section-2) saat permintaan HTTP dikirimkan melalui jaringan?',
    options: [
      { id: 'opt_a', textEn: 'It is stored in the database primary key.', textId: 'Fragmen tersebut disimpan sebagai primary key basis data.', isCorrect: false },
      { id: 'opt_b', textEn: 'It is processed exclusively by the client browser and is NEVER transmitted to the backend server.', textId: 'Fragmen tersebut hanya diolah oleh peramban klien dan SAMA SEKALI TIDAK PERNAH dikirimkan ke server backend.', isCorrect: true },
      { id: 'opt_c', textEn: 'It is converted into a SQL query parameter automatically.', textId: 'Fragmen tersebut otomatis diubah menjadi parameter query SQL.', isCorrect: false },
      { id: 'opt_d', textEn: 'The server returns a 500 error if a fragment is present.', textId: 'Server mengembalikan kode error 500 jika ada fragmen.', isCorrect: false }
    ],
    expEn: 'RFC specifications state that fragments are client-side navigation anchors; user agents strip the fragment before sending request lines across sockets.',
    expId: 'Sesuai spesifikasi RFC, fragmen adalah penanda navigasi lokal pada peramban; browser menghapus tanda pagar dan fragmen sebelum mengirimkan byte ke server.',
    hintEn: 'Does the backend ever see what follows the hash symbol (#)?',
    hintId: 'Apakah server backend pernah melihat teks setelah tanda pagar (#)?'
  },
  {
    idx: 13,
    qEn: 'In payment processing systems, how does an "Idempotency Key" prevent duplicate financial charges during network timeouts?',
    qId: 'Pada sistem pembayaran digital, bagaimana "Kunci Idempotensi" (*Idempotency Key*) mencegah terjadinya pemotongan saldo ganda saat terjadi gangguan jaringan?',
    options: [
      { id: 'opt_a', textEn: 'It encrypts the customer credit card number with a symmetric key.', textId: 'Kunci tersebut mengenkripsi nomor kartu kredit nasabah.', isCorrect: false },
      { id: 'opt_b', textEn: 'The server caches the initial transaction result mapped to the unique key; retried requests return the cached confirmation without re-executing payment.', textId: 'Server menyimpan hasil transaksi pertama yang dipetakan ke kunci unik tersebut; permintaan ulang langsung menerima respon cache tanpa memproses debet ulang.', isCorrect: true },
      { id: 'opt_c', textEn: 'It cancels the transaction if the network latency exceeds 50 milliseconds.', textId: 'Kunci tersebut membatalkan transaksi jika latensi melebihi 50 milidetik.', isCorrect: false },
      { id: 'opt_d', textEn: 'It forces the client to use UDP instead of TCP.', textId: 'Kunci tersebut memaksa klien menggunakan UDP bukan TCP.', isCorrect: false }
    ],
    expEn: 'Idempotency keys ensure that accidental retries return the original invoice without running payment gateway charges again.',
    expId: 'Kunci idempotensi memastikan pengiriman ulang yang tidak sengaja hanya mengembalikan tanda terima transaksi awal tanpa mendebit ulang saldo pengguna.',
    hintEn: 'Caching previous transaction results by unique UUID.',
    hintId: 'Menyimpan respon transaksi awal berdasarkan kunci UUID unik.'
  },
  {
    idx: 14,
    qEn: 'What is the primary advantage of Protocol Buffers (Protobuf) over JSON for internal microservice communication?',
    qId: 'Apa keunggulan utama Protocol Buffers (Protobuf) dibanding JSON untuk komunikasi internal antar-microservice?',
    options: [
      { id: 'opt_a', textEn: 'Protobuf files can be opened and styled with CSS directly in browsers.', textId: 'Berkas Protobuf dapat dibuka dan dihias menggunakan CSS di browser.', isCorrect: false },
      { id: 'opt_b', textEn: 'Protobuf serializes into compact binary representations with strict schemas, yielding significantly smaller payloads and faster CPU parsing.', textId: 'Protobuf melakukan serialisasi biner terkompresi dengan skema ketat, menghasilkan ukuran paket jauh lebih kecil dan proses komputasi CPU jauh lebih cepat.', isCorrect: true },
      { id: 'opt_c', textEn: 'Protobuf requires no predefined data types or schema contracts.', textId: 'Protobuf tidak memerlukan skema kontrak tipe data apa pun.', isCorrect: false },
      { id: 'opt_d', textEn: 'Protobuf eliminates the need for network cables.', textId: 'Protobuf meniadakan kebutuhan kabel jaringan fisik.', isCorrect: false }
    ],
    expEn: 'Protobuf serializes structured data into compact binary wire formats, eliminating redundant key names and string conversion overhead.',
    expId: 'Protobuf mengompresi data terstruktur menjadi format biner padat, mengeliminasi pengulangan nama kunci teks dan mempercepat proses penguraian data.',
    hintEn: 'Binary efficiency and strict schemas.',
    hintId: 'Efisiensi format biner dan skema tipe data ketat.'
  },
  {
    idx: 15,
    qEn: 'In Node.js or Python Asyncio architectures, what happens if a developer executes a heavy CPU-bound loop (e.g., computing a billion prime numbers) in the main thread?',
    qId: 'Pada arsitektur Node.js atau Python Asyncio, apa yang terjadi jika pengembang menjalankan komputasi CPU berat (misalnya menghitung 1 miliar bilangan prima) di thread utama?',
    options: [
      { id: 'opt_a', textEn: 'The operating system automatically forks 1,000 threads to balance the load.', textId: 'Sistem operasi otomatis membuat 1.000 thread untuk membagi beban.', isCorrect: false },
      { id: 'opt_b', textEn: 'The event loop is blocked, causing all concurrent incoming HTTP requests to freeze until the calculation completes.', textId: 'Event loop terblokir total, menyebabkan seluruh permintaan HTTP dari pengguna lain membeku hingga perhitungan tersebut selesai.', isCorrect: true },
      { id: 'opt_c', textEn: 'The server switches from HTTP to UDP dynamically.', textId: 'Server otomatis beralih dari HTTP ke UDP secara dinamis.', isCorrect: false },
      { id: 'opt_d', textEn: 'Nothing; asynchronous runtimes handle CPU-bound tasks automatically.', textId: 'Tidak terjadi masalah apapun; runtime asinkron menanganinya otomatis.', isCorrect: false }
    ],
    expEn: 'The event loop runs on a single main thread. Long-running synchronous CPU operations starve the event loop, preventing it from handling incoming I/O events.',
    expId: 'Event loop berjalan pada satu thread utama. Operasi CPU sinkron yang berat akan memblokir siklus event loop sehingga server tidak dapat merespon permintaan klien lain.',
    hintEn: 'Single-threaded event loop blocking.',
    hintId: 'Karakteristik pembekuan pada single-threaded event loop.'
  },
  {
    idx: 16,
    qEn: 'What critical security vulnerability occurs when a backend developer concatenates raw client query parameters directly into an SQL string without parameterization?',
    qId: 'Kerentanan keamanan kritis apa yang terjadi saat pengembang backend menggabungkan parameter input klien langsung ke dalam string SQL tanpa parameterisasi?',
    options: [
      { id: 'opt_a', textEn: 'Cross-Site Request Forgery (CSRF)', textId: 'Cross-Site Request Forgery (CSRF)', isCorrect: false },
      { id: 'opt_b', textEn: 'SQL Injection (SQLi)', textId: 'SQL Injection (SQLi)', isCorrect: true },
      { id: 'opt_c', textEn: 'Buffer Overflow', textId: 'Buffer Overflow', isCorrect: false },
      { id: 'opt_d', textEn: 'DNS Cache Poisoning', textId: 'DNS Cache Poisoning', isCorrect: false }
    ],
    expEn: 'Direct string concatenation allows attackers to inject arbitrary SQL statements (e.g., OR 1=1; DROP TABLE users;), leading to data theft or destruction.',
    expId: 'Penggabungan string mentah memungkinkan penyerang menyisipkan perintah SQL berbahaya yang dapat membocorkan seluruh isi tabel atau menghapus basis data.',
    hintEn: 'Manipulating SQL queries via input text.',
    hintId: 'Penyusupan perintah manipulasi query SQL.'
  },
  {
    idx: 17,
    qEn: 'Why must backend collection endpoints (such as /api/v1/orders) enforce mandatory pagination limits?',
    qId: 'Mengapa endpoint daftar koleksi backend (seperti /api/v1/orders) wajib memberlakukan batasan paginasi (*pagination*)?',
    options: [
      { id: 'opt_a', textEn: 'To prevent unindexed full-table reads from exhausting server RAM and crashing the database.', textId: 'Untuk mencegah pembacaan jutaan baris data sekaligus yang dapat menguras memori RAM dan melumpuhkan server.', isCorrect: true },
      { id: 'opt_b', textEn: 'Because HTTP/1.1 cannot transmit more than 10 records per packet.', textId: 'Karena HTTP/1.1 tidak dapat mentransmisikan lebih dari 10 data.', isCorrect: false },
      { id: 'opt_c', textEn: 'To encrypt database primary keys automatically.', textId: 'Untuk mengenkripsi kunci utama basis data secara otomatis.', isCorrect: false },
      { id: 'opt_d', textEn: 'To avoid generating JSON syntax.', textId: 'Untuk menghindari pembentukan format JSON.', isCorrect: false }
    ],
    expEn: 'Unbounded queries like SELECT * FROM orders without limits will fetch millions of rows, exhausting server memory and saturating network interfaces.',
    expId: 'Kueri tanpa batas akan menarik jutaan baris data sekaligus ke dalam memori, menyebabkan server kehabisan RAM dan mengalami *crash*.',
    hintEn: 'Memory management on large datasets.',
    hintId: 'Pengendalian memori saat menangani jutaan baris data.'
  },
  {
    idx: 18,
    qEn: 'In a microservice or multi-server architecture, where should user session data be stored to preserve stateless application nodes?',
    qId: 'Dalam arsitektur multi-server atau microservice, di manakah data sesi pengguna harus disimpan agar node aplikasi tetap berstatus stateless?',
    options: [
      { id: 'opt_a', textEn: 'In local text files stored on each individual server hard drive.', textId: 'Di dalam berkas teks lokal pada hard drive masing-masing server.', isCorrect: false },
      { id: 'opt_b', textEn: 'In an in-memory global array variable inside the application process.', textId: 'Di dalam variabel array global pada memori proses aplikasi lokal.', isCorrect: false },
      { id: 'opt_c', textEn: 'In a centralized, shared in-memory datastore such as a Redis or Memcached cluster.', textId: 'Pada penyimpanan memori terpusat yang diakses bersama seperti kluster Redis atau Memcached.', isCorrect: true },
      { id: 'opt_d', textEn: 'In the client browser cookies in plaintext format.', textId: 'Di dalam cookie peramban klien dalam format teks polos tanpa enkripsi.', isCorrect: false }
    ],
    expEn: 'Shared Redis clusters allow any application node to retrieve session state in sub-millisecond time regardless of which server handled the previous request.',
    expId: 'Kluster Redis terpusat memungkinkan server aplikasi mana pun mengakses data sesi dalam hitungan sub-milidetik secara konsisten.',
    hintEn: 'A fast, centralized in-memory caching engine.',
    hintId: 'Mesin penyimpanan cache berbasis memori terpusat yang sangat cepat.'
  },
  {
    idx: 19,
    qEn: 'Which HTTP response header tells the client that the payload body format is JSON encoded in UTF-8?',
    qId: 'Header respon HTTP manakah yang memberi tahu klien bahwa format isi pesan adalah data JSON dengan pengkodean UTF-8?',
    options: [
      { id: 'opt_a', textEn: 'Accept: text/html', textId: 'Accept: text/html', isCorrect: false },
      { id: 'opt_b', textEn: 'Content-Type: application/json; charset=utf-8', textId: 'Content-Type: application/json; charset=utf-8', isCorrect: true },
      { id: 'opt_c', textEn: 'Transfer-Encoding: chunked', textId: 'Transfer-Encoding: chunked', isCorrect: false },
      { id: 'opt_d', textEn: 'Server: Apache/2.4', textId: 'Server: Apache/2.4', isCorrect: false }
    ],
    expEn: 'Content-Type indicates the media type of the underlying entity body.',
    expId: 'Header Content-Type mendeklarasikan tipe media dari payload badan respon yang dikirimkan.',
    hintEn: 'Content-Type declares MIME formats.',
    hintId: 'Header yang menyatakan format tipe konten data.'
  },
  {
    idx: 20,
    qEn: 'During a flash sale spike, why is atomic inventory decrement in Redis preferred over direct database row updates?',
    qId: 'Saat terjadi lonjakan flash sale, mengapa pengurangan stok secara atomik di Redis lebih diutamakan daripada pembaruan baris basis data langsung?',
    options: [
      { id: 'opt_a', textEn: 'Because Redis does not require electricity.', textId: 'Karena Redis tidak membutuhkan daya listrik.', isCorrect: false },
      { id: 'opt_b', textEn: 'Because Redis executes in-memory atomic operations in single-digit microseconds, shielding the relational database from thousands of concurrent row lock contentions.', textId: 'Karena Redis menjalankan operasi atomik di memori dalam kecepatan mikrodetik, melindungi basis data relasional dari perebutan kunci baris (*row lock contention*) oleh ribuan koneksi bersamaan.', isCorrect: true },
      { id: 'opt_c', textEn: 'Because relational databases cannot store integer numbers.', textId: 'Karena basis data relasional tidak dapat menyimpan angka integer.', isCorrect: false },
      { id: 'opt_d', textEn: 'Because Redis automatically refunds failed payments.', textId: 'Karena Redis otomatis mengembalikan dana pembayaran yang gagal.', isCorrect: false }
    ],
    expEn: 'In-memory atomic counters (DECR) prevent database connection saturation and deadlocks under massive concurrent traffic.',
    expId: 'Operasi memori atomik (DECR) pada Redis mencegah kemacetan antrean koneksi (*deadlock*) pada basis data utama saat ribuan pengguna berebut stok terbatas.',
    hintEn: 'In-memory single-threaded atomicity vs disk write locks.',
    hintId: 'Kecepatan operasi atomik di memori dibanding penguncian baris di media cakram.'
  }
];

// Insert 20 Questions into SQLite
console.log(`Inserting ${QUESTIONS_DATA.length} unique assessment questions for Backend Chapter 01...`);
QUESTIONS_DATA.forEach(q => {
  const qId = `asmt_q_pathway_07_ch1_${q.idx}`;
  const optionsJson = JSON.stringify(q.options.map(opt => ({
    id: opt.id,
    text: opt.textId, // default ID
    text_en: opt.textEn,
    text_id: opt.textId,
    isCorrect: opt.isCorrect
  })));

  const correctOpt = q.options.find(o => o.isCorrect)?.id || 'opt_a';

  insertQuestion.run(
    qId,
    assessmentId,
    q.qId, // default
    optionsJson,
    correctOpt,
    q.expId, // default
    q.idx,
    q.qEn,
    q.qId,
    q.expEn,
    q.expId,
    q.hintEn,
    q.hintId
  );
});

console.log('Successfully seeded 20 deep substantive sections and 20 assessment questions for Backend Chapter 01!');
db.close();
