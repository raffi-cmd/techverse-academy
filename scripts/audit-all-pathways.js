const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

const pathways = db.prepare(`
  SELECT p.id, p.name, p.slug, p.readiness_status, c.name as category,
         (SELECT COUNT(*) FROM chapters ch WHERE ch.pathway_id = p.id) as total_chapters,
         (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON l.chapter_id = ch.id WHERE ch.pathway_id = p.id) as total_lessons,
         (SELECT COUNT(*) FROM assessment_questions aq JOIN assessments a ON aq.assessment_id = a.id JOIN chapters ch ON a.chapter_id = ch.id WHERE ch.pathway_id = p.id) as total_questions,
         (SELECT COUNT(*) FROM chapters ch WHERE ch.pathway_id = p.id AND (ch.title LIKE '%Part 1%' OR ch.title LIKE '%Orientation & Foundations%')) as generic_chapters
  FROM learning_pathways p
  JOIN pathway_categories c ON p.category_id = c.id
  ORDER BY 
    CASE 
      WHEN p.readiness_status = 'ready' THEN 1
      WHEN p.readiness_status = 'curriculum_ready' THEN 2
      ELSE 3
    END, p.id ASC
`).all();

console.log('ID | Nama Jalur | Kategori | Status | Bab | Materi | Soal | Generik? | Status Audit');
console.log('---|---|---|---|---|---|---|---|---');

pathways.forEach(p => {
  let auditStatus = 'INCOMPLETE';
  let issues = 'Materi dalam pengembangan';
  let priority = 'Sedang';

  if (p.readiness_status === 'ready') {
    auditStatus = 'PASS';
    issues = 'Lengkap & tervalidasi';
    priority = 'Selesai';
  } else if (p.readiness_status === 'curriculum_ready') {
    auditStatus = 'NEEDS IMPROVEMENT';
    issues = 'Kurikulum 50 bab autentik siap, materi pembelajaran perlu pendalaman';
    priority = 'Tinggi';
  } else {
    auditStatus = 'INCOMPLETE';
    issues = 'Masih menggunakan kurikulum/template dasar, materi belum substantif';
    priority = 'Sedang';
  }

  console.log(`${p.id} | ${p.name} | ${p.category} | ${p.readiness_status} | ${p.total_chapters} | ${p.total_lessons} | ${p.total_questions} | ${p.generic_chapters > 0 ? 'Ya (' + p.generic_chapters + ')' : 'Tidak'} | ${auditStatus}`);
});
