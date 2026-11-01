const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('========================================================================');
console.log('           DEVORA PLATFORM — AUDIT INVENTARISASI 60 PATHWAY             ');
console.log('========================================================================\n');

const pathways = db.prepare(`
  SELECT p.id, p.name, p.slug, p.category_id, p.difficulty_level, p.estimated_duration, p.readiness_status,
         (SELECT count(*) FROM chapters WHERE pathway_id = p.id) as chapter_count,
         (SELECT count(*) FROM lessons l JOIN chapters c ON l.chapter_id = c.id WHERE c.pathway_id = p.id) as lesson_count,
         (SELECT count(*) FROM assessments a JOIN chapters c ON a.chapter_id = c.id WHERE c.pathway_id = p.id) as asmt_count,
         (SELECT count(*) FROM assessment_questions q JOIN assessments a ON q.assessment_id = a.id JOIN chapters c ON a.chapter_id = c.id WHERE c.pathway_id = p.id) as question_count
  FROM learning_pathways p
  ORDER BY p.name ASC
`).all();

console.log(`Total Pathway Terdaftar di Database: ${pathways.length}\n`);

let total50 = 0;
let totalZero = 0;

console.log('| No | Nama Pathway | Slug | Bab | Pelajaran | Soal Asesmen | Status Kesiapan |');
console.log('|----|--------------|------|-----|-----------|--------------|-----------------|');

pathways.forEach((p, idx) => {
  console.log(`| ${String(idx + 1).padStart(2, ' ')} | ${p.name.padEnd(35, ' ')} | ${p.slug.padEnd(30, ' ')} | ${String(p.chapter_count).padStart(3, ' ')} | ${String(p.lesson_count).padStart(5, ' ')} | ${String(p.question_count).padStart(6, ' ')} | ${(p.readiness_status || 'unknown').padEnd(15, ' ')} |`);
  if (p.chapter_count === 50) total50++;
  if (p.chapter_count === 0) totalZero++;
});

console.log(`\nRingkasan:`);
console.log(`- Pathway dengan 50 Bab Lengkap : ${total50}`);
console.log(`- Pathway dengan 0 Bab           : ${totalZero}`);
console.log(`- Pathway Flagship (Ready/Curriculum Ready): ${pathways.filter(p => p.readiness_status === 'ready' || p.readiness_status === 'curriculum_ready').length}`);

db.close();
