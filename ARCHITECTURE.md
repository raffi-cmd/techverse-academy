# TechVerse Academy - System Architecture & Technical Specifications

This document outlines the architectural blueprint, data layer design, credential lifecycle, and security model of TechVerse Academy.

---

## 1. Relational Database Architecture

The data tier is backed by SQLite via Node.js native `DatabaseSync` (`node:sqlite`), configured with WAL (Write-Ahead Logging) mode and enforced foreign key constraints (`PRAGMA foreign_keys = ON;`).

```
+--------------------+        +--------------------+
|  pathway_categories | 1----* |  learning_pathways |
+--------------------+        +--------------------+
                                         | 1
                                         | *
                              +--------------------+
                              |  pathway_modules   |
                              +--------------------+
                                         | 1
                                         | *
                              +--------------------+
                              |      chapters      |
                              +--------------------+
                                    | 1        | 1
                                    | *        | 1
                     +------------------+   +------------------+
                     |     lessons      |   |   assessments    |
                     +------------------+   +------------------+
                                                      | 1
                                                      | *
                                            +------------------+
                                            |assessment_quest. |
                                            +------------------+
```

### Relational Tables
1. **`users`**: User identity, role-based authorization (`learner`, `admin`, `super_admin`), salted PBKDF2 hash.
2. **`user_profiles`**: Display names, certificate recipient names, career targets.
3. **`learning_pathways`**: 60 pathways catalog with outcomes, prerequisites, metadata.
4. **`pathway_modules`**: 10 modules per track organizing chapters sequentially.
5. **`chapters`**: 50 chapters per complete track with curriculum versions.
6. **`lessons`**: Multi-section educational content in Markdown.
7. **`assessments`**: Chapter mastery evaluations with 80% passing thresholds and maximum attempts.
8. **`assessment_questions`**: Sanitized question sets with points and explanations.
9. **`assessment_attempts`**: Audit record of student answers, scores, and pass/fail states.
10. **`chapter_progress`**: Real-time completion status and completion timestamps.
11. **`certificates`**: Authoritative issued credentials with unique IDs and checksums.
12. **`certificate_verifications`**: Telemetry log of public registry verifications (IP, User-Agent, status).
13. **`audit_logs`**: Immutable security stream recording logins, registrations, claims, and revocations.

---

## 2. Authentication & Authorization Model

- **Password Storage:** Salted PBKDF2 (`crypto.pbkdf2Sync`) with 100,000 iterations using SHA-512 and unique 16-byte random salts.
- **Session Tokens:** Stateless, tamper-resistant HMAC-SHA256 tokens stored in `httpOnly`, `sameSite=lax` cookies.
- **Role Enforcement:** Server components and API route handlers verify the session token against `users.role` before granting administrative privileges.

---

## 3. Credential Lifecycle & Verification Engine

```
[Student Completes Lessons] 
         ¦
         ?
[Takes Chapter Assessment] --(Fails < 80%)--? [Review Content & Retry]
         ¦
  (Passes >= 80%)
         ¦
         ?
[POST /api/certificates/claim]
         ¦
         +-? 1. Server recalculates passing score directly from database
         +-? 2. Idempotency check (prevents duplicate certs for same version)
         +-? 3. Generates Unique Number: TV-YYYY-XXXX-XXXX
         +-? 4. Vector PDF-1.4 Generated & Saved to public/certificates/
         +-? 5. Audit Log Recorded
```

### PDF Engine Architecture
The certificate generator (`src/lib/certificate-pdf.ts`) generates standards-compliant vector PDF-1.4 documents without native binary dependencies or headless browser overhead:
- **Geometry:** Landscape A4 (841.89 pt x 595.28 pt).
- **Styling:** Dual gold borders (`#c5a059`), Deep Navy `#070b19` certificate background, crisp typography.
- **Embedded Metadata:** Recipient legal name, chapter title, learning pathway, issue date, unique verification URL, and sha256 checksum.

---

## 4. NeoVision Design System Implementation

The user interface follows the high-contrast NeoVision design language:
- **Hero Segment:** `#f5f6f8` stark light background with stylized editorial typography (`font-display-title` and italicized accent).
- **Diagonal Polygon Split:** CSS clip-path `.hero-diagonal-split` angled down into pure Obsidian Dark `#07070a`.
- **Bento Grid Layouts:** Multi-column asymmetric cards (`.neo-card`) with subtle white borders (`rgba(255,255,255,0.08)`), radial neon glow accents, and monospace technical chips.
- **Interactive Controls:** Floating pill navigation, micro-interactions, and accessible high-contrast color pairings.
