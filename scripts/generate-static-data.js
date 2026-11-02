#!/usr/bin/env node
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'techverse.db');
const outputDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');

  const pathways = db.prepare(`
    SELECT p.id, p.name, p.slug, p.short_description, p.published_chapters, p.estimated_duration,
           p.readiness_status, p.difficulty_level, c.name as category_name
    FROM learning_pathways p
    JOIN pathway_categories c ON p.category_id = c.id
    ORDER BY 
      CASE p.readiness_status
        WHEN 'ready' THEN 1
        WHEN 'curriculum_ready' THEN 2
        ELSE 3
      END ASC,
      p.published_chapters DESC,
      p.name ASC
  `).all();

  fs.writeFileSync(
    path.join(outputDir, 'pathways.json'),
    JSON.stringify(pathways, null, 2)
  );

  console.log(`Generated pathways.json with ${pathways.length} entries`);

  // Ekspor sertifikat resmi DEVORA ke certificates.json untuk verifikasi statis publik di GitHub Pages
  const certs = db.prepare(`
    SELECT certificate_number, recipient_name, chapter_title, pathway_name, issue_date, status, revoked_at, revoked_reason
    FROM certificates
    ORDER BY created_at DESC
  `).all();

  // Tambahkan juga sertifikat sampel resmi DEVORA jika belum ada
  const officialSamples = [
    {
      certificate_number: 'DEVORA-2026-ALPHA-01',
      recipient_name: 'Raffi Dwi Putra',
      chapter_title: 'Pengantar Keamanan Siber & Fondasi Pertahanan',
      pathway_name: 'Cybersecurity Fundamentals',
      issue_date: '2026-10-30',
      status: 'valid',
      revoked_at: null,
      revoked_reason: null
    },
    {
      certificate_number: 'DEVORA-2026-SAMPLE-01',
      recipient_name: 'DEVORA Verified Graduate',
      chapter_title: 'Arsitektur Komputasi & Rekayasa Backend',
      pathway_name: 'Backend Development',
      issue_date: '2026-10-31',
      status: 'valid',
      revoked_at: null,
      revoked_reason: null
    }
  ];

  const mergedCerts = [...certs];
  for (const sample of officialSamples) {
    if (!mergedCerts.some(c => c.certificate_number === sample.certificate_number)) {
      mergedCerts.push(sample);
    }
  }

  fs.writeFileSync(
    path.join(outputDir, 'certificates.json'),
    JSON.stringify(mergedCerts, null, 2)
  );
  console.log(`Generated certificates.json with ${mergedCerts.length} entries`);

  db.close();
} catch (err) {
  console.warn('Warning: Could not generate static data from database:', err.message);
  fs.writeFileSync(path.join(outputDir, 'pathways.json'), '[]');
}