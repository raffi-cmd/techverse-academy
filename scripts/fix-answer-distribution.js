/**
 * fix-answer-distribution.js
 * 
 * Memperbaiki distribusi jawaban benar yang bias di bank soal.
 * - Pathway 37 Ch1: 18/20 jawaban benar di opt_2 (90% bias) → didistribusikan merata
 * - Pathway 07 Ch1: 14/20 jawaban benar di opt_b (70% bias) → didistribusikan merata
 * - Soal generik (correct_answer NULL tapi punya isCorrect di JSON) → diperbaiki
 * 
 * Menggunakan Fisher-Yates shuffle pada opsi di tingkat data,
 * sehingga jawaban benar tersebar merata di posisi A/B/C/D.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('==========================================================');
console.log('   DEVORA — PERBAIKAN DISTRIBUSI JAWABAN BENAR DI DATABASE');
console.log('==========================================================\n');

// Fisher-Yates shuffle (unbiased)
function fisherYatesShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const optionLabels = ['opt_a', 'opt_b', 'opt_c', 'opt_d'];

function fixAssessmentQuestions(assessmentId, label) {
  const questions = db.prepare(
    'SELECT id, options, correct_answer FROM assessment_questions WHERE assessment_id = ? ORDER BY sort_order'
  ).all(assessmentId);

  if (questions.length === 0) {
    console.log(`  [LEWATI] ${label}: Tidak ada pertanyaan ditemukan untuk ${assessmentId}`);
    return { before: {}, after: {} };
  }

  // Hitung distribusi SEBELUM
  const beforeDist = {};
  for (const q of questions) {
    const ca = q.correct_answer || 'NULL';
    beforeDist[ca] = (beforeDist[ca] || 0) + 1;
  }

  console.log(`  [SEBELUM] ${label} (${assessmentId}): ${JSON.stringify(beforeDist)}`);

  const updateStmt = db.prepare(
    'UPDATE assessment_questions SET options = ?, correct_answer = ? WHERE id = ?'
  );

  for (const q of questions) {
    let options = [];
    try {
      options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
    } catch {
      continue;
    }

    // Hanya proses soal dengan tepat 4 opsi
    if (options.length !== 4) continue;

    // Cari opsi yang benar berdasarkan isCorrect
    const correctIdx = options.findIndex(o => o.isCorrect === true);
    if (correctIdx === -1) continue;

    // Acak posisi opsi
    const shuffled = fisherYatesShuffle(options);

    // Beri label baru pada setiap opsi
    const newOptions = shuffled.map((opt, idx) => ({
      ...opt,
      id: optionLabels[idx]
    }));

    // Temukan posisi baru jawaban benar
    const newCorrectOpt = newOptions.find(o => o.isCorrect === true);

    updateStmt.run(
      JSON.stringify(newOptions),
      newCorrectOpt.id,
      q.id
    );
  }

  // Hitung distribusi SESUDAH
  const afterQuestions = db.prepare(
    'SELECT correct_answer FROM assessment_questions WHERE assessment_id = ?'
  ).all(assessmentId);

  const afterDist = {};
  for (const q of afterQuestions) {
    const ca = q.correct_answer || 'NULL';
    afterDist[ca] = (afterDist[ca] || 0) + 1;
  }

  console.log(`  [SESUDAH] ${label} (${assessmentId}): ${JSON.stringify(afterDist)}`);
  return { before: beforeDist, after: afterDist };
}

// ============================================================
// 1. Perbaiki asesmen mendalam: Cybersecurity Ch1 & Backend Ch1
// ============================================================
console.log('--- Jalur Unggulan (Deep Content) ---');
fixAssessmentQuestions('asmt_pathway_37_ch1', 'Cybersecurity Fundamentals Bab 1');
fixAssessmentQuestions('asmt_pathway_07_ch1', 'Backend Development Bab 1');

// ============================================================
// 2. Perbaiki semua asesmen generik yang memiliki correct_answer NULL
//    tetapi memiliki isCorrect di dalam JSON options
// ============================================================
console.log('\n--- Asesmen Generik (correct_answer NULL) ---');

const nullAnswerAssessments = db.prepare(
  `SELECT DISTINCT assessment_id FROM assessment_questions 
   WHERE correct_answer IS NULL AND options IS NOT NULL AND options != '[]'`
).all();

let fixedCount = 0;
let skippedCount = 0;

for (const row of nullAnswerAssessments) {
  const questions = db.prepare(
    'SELECT id, options FROM assessment_questions WHERE assessment_id = ? AND correct_answer IS NULL ORDER BY sort_order'
  ).all(row.assessment_id);

  for (const q of questions) {
    let options = [];
    try {
      options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
    } catch {
      continue;
    }

    // Cari opsi benar
    const correctOpt = options.find(o => o.isCorrect === true);
    if (!correctOpt) {
      skippedCount++;
      continue;
    }

    // Jika ada tepat 4 opsi, acak posisinya
    if (options.length === 4) {
      const shuffled = fisherYatesShuffle(options);
      const newOptions = shuffled.map((opt, idx) => ({
        ...opt,
        id: optionLabels[idx]
      }));
      const newCorrectOpt = newOptions.find(o => o.isCorrect === true);

      db.prepare('UPDATE assessment_questions SET options = ?, correct_answer = ? WHERE id = ?')
        .run(JSON.stringify(newOptions), newCorrectOpt.id, q.id);
      fixedCount++;
    } else if (options.length === 2) {
      // True/false atau 2-opsi: cukup set correct_answer saja
      db.prepare('UPDATE assessment_questions SET correct_answer = ? WHERE id = ?')
        .run(correctOpt.id, q.id);
      fixedCount++;
    } else {
      skippedCount++;
    }
  }
}

console.log(`  Diperbaiki: ${fixedCount} pertanyaan`);
console.log(`  Dilewati: ${skippedCount} pertanyaan`);

// ============================================================
// 3. Verifikasi akhir: cek distribusi keseluruhan
// ============================================================
console.log('\n--- Verifikasi Distribusi Akhir ---');
const finalDist = db.prepare(
  'SELECT correct_answer, count(*) as count FROM assessment_questions GROUP BY correct_answer ORDER BY correct_answer'
).all();
console.log('Distribusi akhir seluruh DB:');
for (const row of finalDist) {
  console.log(`  ${row.correct_answer || 'NULL'}: ${row.count}`);
}

// Cek distribusi per asesmen unggulan
const flagshipAsmts = [
  { id: 'asmt_pathway_37_ch1', label: 'Cybersecurity Ch1' },
  { id: 'asmt_pathway_07_ch1', label: 'Backend Ch1' }
];

console.log('\nDistribusi per asesmen unggulan:');
for (const a of flagshipAsmts) {
  const dist = db.prepare(
    'SELECT correct_answer, count(*) as count FROM assessment_questions WHERE assessment_id = ? GROUP BY correct_answer'
  ).all(a.id);
  console.log(`  ${a.label}: ${JSON.stringify(dist.map(d => `${d.correct_answer}=${d.count}`).join(', '))}`);
}

// Validasi: setiap soal 4-opsi harus punya tepat 1 jawaban benar
const allQuestions = db.prepare(
  `SELECT id, options, correct_answer FROM assessment_questions WHERE options IS NOT NULL AND options != '[]'`
).all();

let invalidQuestions = 0;
for (const q of allQuestions) {
  let options = [];
  try {
    options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
  } catch {
    continue;
  }

  if (options.length < 2) continue;

  const correctCount = options.filter(o => o.isCorrect === true).length;
  if (correctCount !== 1) {
    invalidQuestions++;
    console.error(`  [ERROR] Pertanyaan ${q.id}: ${correctCount} jawaban benar (harus 1)`);
  }

  // Pastikan correct_answer cocok dengan isCorrect
  if (q.correct_answer) {
    const correctOpt = options.find(o => o.isCorrect === true);
    if (correctOpt && correctOpt.id !== q.correct_answer) {
      console.error(`  [ERROR] Pertanyaan ${q.id}: correct_answer=${q.correct_answer} tapi isCorrect ada di ${correctOpt.id}`);
      invalidQuestions++;
    }
  }
}

console.log(`\nValidasi integritas: ${invalidQuestions === 0 ? 'LULUS' : `${invalidQuestions} MASALAH DITEMUKAN`}`);

console.log('\n==========================================================');
console.log('   PERBAIKAN DISTRIBUSI JAWABAN SELESAI');
console.log('==========================================================\n');
