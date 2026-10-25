# TechVerse Academy - Next-Generation IT Learning & Certification Platform

A production-ready IT curriculum and credentialing platform engineered with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Node.js 24 native SQLite.

---

## 1. System Overview

TechVerse Academy delivers structured, career-grade curriculum across 60 modern IT pathways, paired with an authoritative, server-evaluated assessment and credential verification engine.

### Key Architectural Pillars
- **Authoritative Grading Engine:** Client submissions are graded strictly on the server against persisted answer keys with sanitized question payloads.
- **80% Passing Threshold & Eligibility Recalculation:** Certificates cannot be requested without verified completion of required assessments and lessons.
- **Idempotent Certificate Issuance:** Unique credential identifiers formatted as `TV-YYYY-XXXX-XXXX` with SHA-256 fingerprinting and persistent storage.
- **Native Vector PDF Generator:** High-resolution landscape A4 PDF-1.4 generation (navy/gold borders, micro-typography, QR verification metadata).
- **Public Verification Portal:** Live credential verification at `/verify` and permalinks `/verify/[number]` with revocation detection and audit logging.
- **Futuristic NeoVision Aesthetic:** High-contrast light hero with stylized italic display typography (`NEW DIGITAL UNIVERSE`), angled diagonal polygon transitions, and deep obsidian dark (`#07070a`) bento grids.

---

## 2. Seeded Credentials & Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Platform Administrator** | `admin@techverse.academy` | `AdminPass123!` | System metrics, audit logs, credential revocation |
| **Enrolled Learner** | `learner@techverse.academy` | `LearnerPass123!` | Dashboard, quiz submissions, certificate claims |

---

## 3. Curriculum Architecture

- **60 Complete Pathways:** Across 7 categories (Fundamentals, Programming, Web, Data & AI, Cloud & DevOps, Security, Systems & Architecture).
- **50 Structured Chapters:** Organized into 10 progressive modules per track with 2,500 interactive lessons and 1,250 assessments in the persistent SQLite database.
- **Curriculum Versioning:** All progress and certificates are pinned to curriculum versions (e.g. `v1.0.0`) to preserve historical integrity.

---

## 4. Technology Stack

- **Framework:** Next.js 16.4.3 (App Router with Turbopack)
- **Frontend:** React 19, Tailwind CSS v4, Lucide React
- **Database:** Node 24 native `node:sqlite` (`DatabaseSync`) in WAL mode with enforced foreign keys
- **Security & Auth:** Native PBKDF2 password hashing (100,000 iterations, 16-byte random salt) + HMAC-SHA256 session cookies
- **Document Engine:** Zero-dependency vector PDF-1.4 landscape generator (`certificate-pdf.ts`)

---

## 5. Getting Started

### Prerequisites
- Node.js v24.x (uses built-in `node:sqlite` and `node:crypto`)
- npm v10+

### Installation & Execution
```bash
# Install dependencies
npm install

# Run database seed (if starting from scratch)
node tests/run-tests.js

# Build production bundle
npm run build

# Start production server
npm run start
```
The server will be available at `http://localhost:3000`.

---

## 6. Verification & Automated Testing

TechVerse Academy includes two comprehensive test suites:

### 1. Core Subsystem Unit Suite
Tests database schema, foreign key enforcement, 60 pathways, 50 chapters, PBKDF2 hashing, PDF binary validation, and scoring rules:
```bash
node tests/run-tests.js
```

### 2. Live HTTP End-to-End Test Suite
Tests candidate registration, authentication cookies, chapter data sanitization, real-time quiz grading, certificate claiming, on-disk PDF validation, public verification permalinks, and administrative revocation:
```bash
node tests/e2e-http-test.js
```

---

## 7. Key Application Routes

- `/`: NeoVision High-Contrast Landing Page
- `/pathways`: Catalog of 60 IT Learning Pathways
- `/pathways/[slug]`: 10-Module / 50-Chapter Curriculum Syllabus
- `/pathways/[slug]/[chapterSlug]`: Interactive Learning Workspace (Lessons, Quiz Engine, AI Assistant, Certificate Claim)
- `/verify`: Public Credential Verification Portal
- `/verify/[number]`: Public Certificate Permalink
- `/dashboard`: Learner Progression & Enrolled Pathways
- `/admin`: Administrative Telemetry & Certificate Revocation Console
- `/onboarding`: 6-Step Career Orientation Assessment
