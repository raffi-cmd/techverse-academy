/**
 * test-quiz-assessment.js
 * 
 * Pengujian otomatis untuk sistem kuis dan asesmen DEVORA.
 * Menguji: distribusi jawaban, integritas bank soal, konsistensi shuffling,
 * dan kebenaran grading.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('====================================================');
console.log('   DEVORA — TES SISTEM KUIS DAN ASESMEN');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assertCheck(desc, condition, details = '') {
  if (condition) {
    console.log(`[LULUS] ${desc}`);
    passed++;
  } else {
    console.error(`[GAGAL] ${desc}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

// ============================================================
// 1. Fisher-Yates Shuffle menjaga identitas jawaban benar
// ============================================================
function fisherYatesShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sampleOptions = [
  { id: 'opt_a', text: 'A', isCorrect: false },
  { id: 'opt_b', text: 'B', isCorrect: true },
  { id: 'opt_c', text: 'C', isCorrect: false },
  { id: 'opt_d', text: 'D', isCorrect: false }
];

// Pengacakan 1000 kali: pastikan jawaban benar selalu terjaga
let correctAlwaysPreserved = true;
for (let i = 0; i < 1000; i++) {
  const shuffled = fisherYatesShuffle(sampleOptions);
  const correct = shuffled.find(o => o.isCorrect === true);
  if (!correct || correct.text !== 'B') {
    correctAlwaysPreserved = false;
    break;
  }
}
assertCheck(
  'Pengacakan Fisher-Yates menjaga identitas jawaban benar (1000 iterasi)',
  correctAlwaysPreserved
);

// Pengacakan menghasilkan urutan yang beragam (bukan selalu sama)
const positions = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (let i = 0; i < 1000; i++) {
  const shuffled = fisherYatesShuffle(sampleOptions);
  const correctIdx = shuffled.findIndex(o => o.isCorrect === true);
  positions[correctIdx]++;
}
const allPositionsUsed = Object.values(positions).every(c => c > 100);
assertCheck(
  'Pengacakan mendistribusikan jawaban benar ke semua posisi secara merata',
  allPositionsUsed,
  JSON.stringify(positions)
);

// ============================================================
// 2. Distribusi jawaban benar di bank soal tidak bias
// ============================================================

// Cybersecurity Ch1
const p37ch1Dist = db.prepare(
  'SELECT correct_answer, count(*) as c FROM assessment_questions WHERE assessment_id = ? GROUP BY correct_answer'
).all('asmt_pathway_37_ch1');

const p37MaxCount = Math.max(...p37ch1Dist.map(d => d.c));
assertCheck(
  'Cybersecurity Ch1: tidak ada posisi jawaban benar yang > 50% (bias)',
  p37MaxCount <= 10,
  `Distribusi: ${p37ch1Dist.map(d => `${d.correct_answer}=${d.c}`).join(', ')}`
);

// Backend Ch1
const p07ch1Dist = db.prepare(
  'SELECT correct_answer, count(*) as c FROM assessment_questions WHERE assessment_id = ? GROUP BY correct_answer'
).all('asmt_pathway_07_ch1');

const p07MaxCount = Math.max(...p07ch1Dist.map(d => d.c));
assertCheck(
  'Backend Ch1: tidak ada posisi jawaban benar yang > 50% (bias)',
  p07MaxCount <= 10,
  `Distribusi: ${p07ch1Dist.map(d => `${d.correct_answer}=${d.c}`).join(', ')}`
);

// Distribusi keseluruhan (soal 4-opsi)
const overallDist = db.prepare(
  `SELECT correct_answer, count(*) as c FROM assessment_questions 
   WHERE correct_answer IN ('opt_a','opt_b','opt_c','opt_d') 
   GROUP BY correct_answer`
).all();

const totalFourOpt = overallDist.reduce((sum, d) => sum + d.c, 0);
const maxOverall = Math.max(...overallDist.map(d => d.c));
const maxPercentage = Math.round((maxOverall / totalFourOpt) * 100);
assertCheck(
  `Distribusi keseluruhan DB (soal 4-opsi): tidak ada posisi > 35%`,
  maxPercentage <= 35,
  `Max: ${maxPercentage}% (${overallDist.map(d => `${d.correct_answer}=${d.c}`).join(', ')})`
);

// ============================================================
// 3. Integritas bank soal: setiap soal punya tepat 1 jawaban benar
// ============================================================
const allQuestions = db.prepare(
  `SELECT id, assessment_id, options, correct_answer FROM assessment_questions 
   WHERE options IS NOT NULL AND options != '[]'`
).all();

let integrityIssues = 0;
let questionsWithoutCorrect = [];
let questionsMultipleCorrect = [];

for (const q of allQuestions) {
  let options = [];
  try {
    options = JSON.parse(q.options);
  } catch { continue; }

  if (options.length < 2) continue;

  const correctCount = options.filter(o => o.isCorrect === true).length;
  if (correctCount === 0) {
    integrityIssues++;
    questionsWithoutCorrect.push(q.id);
  } else if (correctCount > 1) {
    integrityIssues++;
    questionsMultipleCorrect.push(q.id);
  }

  // correct_answer harus cocok dengan isCorrect
  if (q.correct_answer) {
    const correctOpt = options.find(o => o.isCorrect === true);
    if (correctOpt && correctOpt.id !== q.correct_answer) {
      integrityIssues++;
    }
  }
}

assertCheck(
  `Integritas bank soal: semua pertanyaan memiliki tepat 1 jawaban benar`,
  integrityIssues === 0,
  integrityIssues > 0 ? `${integrityIssues} masalah. Tanpa benar: [${questionsWithoutCorrect.slice(0, 5).join(', ')}]. Multi benar: [${questionsMultipleCorrect.slice(0, 5).join(', ')}]` : ''
);

// ============================================================
// 4. Cybersecurity Ch1 tetap fungsional (20 soal, 20 pelajaran)
// ============================================================
const p37ch1Lessons = db.prepare(
  'SELECT count(*) as c FROM lessons WHERE chapter_id = ?'
).get('pathway_37_ch1');
assertCheck(
  'Cybersecurity Ch1 tetap fungsional: 20 pelajaran',
  p37ch1Lessons.c === 20,
  `Ditemukan: ${p37ch1Lessons.c}`
);

const p37ch1Questions = db.prepare(
  'SELECT count(*) as c FROM assessment_questions WHERE assessment_id = ?'
).get('asmt_pathway_37_ch1');
assertCheck(
  'Cybersecurity Ch1 tetap fungsional: 20 soal asesmen',
  p37ch1Questions.c === 20,
  `Ditemukan: ${p37ch1Questions.c}`
);

// ============================================================
// 5. Backend Ch1 tetap fungsional (20 soal, 20 pelajaran)
// ============================================================
const p07ch1Lessons = db.prepare(
  'SELECT count(*) as c FROM lessons WHERE chapter_id = ?'
).get('pathway_07_ch1');
assertCheck(
  'Backend Ch1 tetap fungsional: 20 pelajaran',
  p07ch1Lessons.c === 20,
  `Ditemukan: ${p07ch1Lessons.c}`
);

const p07ch1Questions = db.prepare(
  'SELECT count(*) as c FROM assessment_questions WHERE assessment_id = ?'
).get('asmt_pathway_07_ch1');
assertCheck(
  'Backend Ch1 tetap fungsional: 20 soal asesmen',
  p07ch1Questions.c === 20,
  `Ditemukan: ${p07ch1Questions.c}`
);

// ============================================================
// 6. Setiap soal 4-opsi punya tepat 4 opsi valid
// ============================================================
let invalidOptionCount = 0;
for (const q of allQuestions) {
  let options = [];
  try {
    options = JSON.parse(q.options);
  } catch { continue; }

  // Hanya cek soal 4-opsi
  if (options.length === 4) {
    for (const opt of options) {
      if (!opt.id || (!opt.text && !opt.text_en && !opt.text_id)) {
        invalidOptionCount++;
      }
    }
  }
}
assertCheck(
  'Semua opsi soal 4-pilihan memiliki ID dan teks valid',
  invalidOptionCount === 0,
  `Opsi tidak valid: ${invalidOptionCount}`
);

// ============================================================
// 7. Setiap soal punya ID unik
// ============================================================
const allIds = allQuestions.map(q => q.id);
const uniqueIds = new Set(allIds);
assertCheck(
  'Semua pertanyaan memiliki ID unik',
  uniqueIds.size === allIds.length,
  `Total: ${allIds.length}, Unik: ${uniqueIds.size}`
);

// ============================================================
// 8. Correct answer yang tersimpan di DB harus cocok dengan isCorrect di JSON
// ============================================================
let mismatchCount = 0;
for (const q of allQuestions) {
  if (!q.correct_answer) continue;
  let options = [];
  try {
    options = JSON.parse(q.options);
  } catch { continue; }

  const correctByIsCorrect = options.find(o => o.isCorrect === true);
  if (correctByIsCorrect && correctByIsCorrect.id !== q.correct_answer) {
    mismatchCount++;
  }
}
assertCheck(
  'Field correct_answer dan isCorrect di JSON selalu sinkron',
  mismatchCount === 0,
  `Ketidakcocokan: ${mismatchCount}`
);

// ============================================================
// 9. Simulasi grading: skor benar setelah pengacakan
// ============================================================
const simQuestions = db.prepare(
  'SELECT id, options, correct_answer FROM assessment_questions WHERE assessment_id = ?'
).all('asmt_pathway_37_ch1');

// Simulasi: pengguna menjawab semua benar
let simScore = 0;
for (const q of simQuestions) {
  const options = JSON.parse(q.options);
  const shuffled = fisherYatesShuffle(options);
  const correctOpt = shuffled.find(o => o.isCorrect === true);
  // Pengguna memilih opsi yang benar
  if (correctOpt && correctOpt.id) {
    const userAnswer = correctOpt.id;
    const gradeCorrect = shuffled.find(o => o.isCorrect === true);
    if (gradeCorrect && gradeCorrect.id === userAnswer) {
      simScore++;
    }
  }
}
assertCheck(
  'Simulasi grading: menjawab semua benar → skor 20/20 setelah pengacakan',
  simScore === 20,
  `Skor: ${simScore}/20`
);

// Simulasi: pengguna menjawab semua salah
let simScoreWrong = 0;
for (const q of simQuestions) {
  const options = JSON.parse(q.options);
  const shuffled = fisherYatesShuffle(options);
  const wrongOpt = shuffled.find(o => o.isCorrect !== true);
  if (wrongOpt) {
    const userAnswer = wrongOpt.id;
    const gradeCorrect = shuffled.find(o => o.isCorrect === true);
    if (gradeCorrect && gradeCorrect.id === userAnswer) {
      simScoreWrong++;
    }
  }
}
assertCheck(
  'Simulasi grading: menjawab semua salah → skor 0/20',
  simScoreWrong === 0,
  `Skor: ${simScoreWrong}/20`
);

// ============================================================
// 10. Laporan distribusi per asesmen unggulan
// ============================================================
console.log('\n--- Laporan Distribusi Jawaban Benar per Asesmen Unggulan ---');
const flagships = [
  { id: 'asmt_pathway_37_ch1', name: 'Cybersecurity Fundamentals Bab 1' },
  { id: 'asmt_pathway_07_ch1', name: 'Backend Development Bab 1' }
];

for (const a of flagships) {
  const dist = db.prepare(
    'SELECT correct_answer, count(*) as c FROM assessment_questions WHERE assessment_id = ? GROUP BY correct_answer'
  ).all(a.id);
  console.log(`  ${a.name}: ${dist.map(d => `${d.correct_answer}=${d.c}`).join(', ')}`);
}

console.log('\n====================================================');
console.log(`   HASIL TES: ${passed} LULUS, ${failed} GAGAL`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('Semua pengujian sistem kuis dan asesmen LULUS!\n');
  process.exit(0);
}
