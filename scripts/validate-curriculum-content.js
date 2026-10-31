const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('====================================================');
console.log('   DEVORA - CURRICULUM CONTENT REGRESSION VALIDATOR   ');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assertCheck(desc, condition, details = '') {
  if (condition) {
    console.log(`[PASS] ${desc}`);
    passed++;
  } else {
    console.error(`[FAIL] ${desc}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

// 1. Cybersecurity Chapter 01 Deep Content Validation
const ch1Lessons = db.prepare(`
  SELECT id, sort_order, title_en, title_id, 
         length(content_en) as len_en, length(content_id) as len_id,
         content_en, content_id
  FROM lessons 
  WHERE chapter_id = 'pathway_37_ch1'
  ORDER BY sort_order
`).all();

assertCheck('Cybersecurity Chapter 1 has exactly 20 structured sections', ch1Lessons.length === 20, `Found: ${ch1Lessons.length}`);

let allSectionsSubstantive = true;
let shortSections = [];
let placeholderFound = false;

for (const lesson of ch1Lessons) {
  if (!lesson.len_en || lesson.len_en < 1000 || !lesson.len_id || lesson.len_id < 1000) {
    allSectionsSubstantive = false;
    shortSections.push(`Sec ${lesson.sort_order} (${lesson.title_en}): EN=${lesson.len_en}, ID=${lesson.len_id}`);
  }
  if (
    lesson.content_en?.includes('validateState<T>') || 
    lesson.content_id?.includes('validateState<T>') ||
    lesson.content_en?.includes('TODO:')
  ) {
    placeholderFound = true;
  }
}

assertCheck(
  'All 20 Chapter 1 sections have substantive bilingual content (>1000 chars)',
  allSectionsSubstantive,
  shortSections.join('; ')
);

assertCheck(
  'No generic boilerplate (validateState<T> or TODO) in Chapter 1 content',
  !placeholderFound
);

// 2. Cybersecurity Pathway 37 Comprehensive Curriculum
const chCount = db.prepare("SELECT COUNT(*) as c FROM chapters WHERE pathway_id = 'pathway_37'").get().c;
assertCheck('Cybersecurity Fundamentals has all 50 chapters defined', chCount === 50, `Found: ${chCount}`);

const totalLessonsP37 = db.prepare(`
  SELECT COUNT(*) as c FROM lessons 
  WHERE chapter_id LIKE 'pathway_37_%'
`).get().c;
assertCheck('Cybersecurity Fundamentals has >= 265 total lessons', totalLessonsP37 >= 265, `Found: ${totalLessonsP37}`);

const totalQuestionsP37 = db.prepare(`
  SELECT COUNT(*) as c FROM assessment_questions 
  WHERE assessment_id LIKE '%pathway_37_%'
`).get().c;
assertCheck('Cybersecurity Fundamentals has >= 1000 assessment questions', totalQuestionsP37 >= 1000, `Found: ${totalQuestionsP37}`);

// 3. Flagship Curricula Integrity (Check for generic "Part 1" duplicate patterns)
const flagships = [
  { id: 'pathway_21', name: 'AI Engineering' },
  { id: 'pathway_07', name: 'Backend Development' },
  { id: 'pathway_09', name: 'Software Engineering' },
  { id: 'pathway_06', name: 'Frontend Development' },
  { id: 'pathway_32', name: 'Cloud Computing' }
];

for (const p of flagships) {
  const chapters = db.prepare('SELECT title FROM chapters WHERE pathway_id = ?').all(p.id);
  const genericCount = chapters.filter(c => c.title.includes('Part 1') || c.title.includes('Part 2') || c.title.includes('Orientation & Foundations')).length;
  assertCheck(
    `Flagship track '${p.name}' (${p.id}) has authentic domain-specific chapters (no generic templates)`,
    genericCount === 0 && chapters.length === 50,
    `Generic count: ${genericCount}, Total: ${chapters.length}`
  );
}

// 4. Learning Pathway Readiness Statuses
const readyPathways = db.prepare("SELECT COUNT(*) as c FROM learning_pathways WHERE readiness_status = 'ready'").get().c;
assertCheck("Exactly 1 pathway is marked 'ready' (Cybersecurity Fundamentals)", readyPathways === 1, `Found: ${readyPathways}`);

const curriculumReady = db.prepare("SELECT COUNT(*) as c FROM learning_pathways WHERE readiness_status = 'curriculum_ready'").get().c;
assertCheck("Exactly 5 flagship pathways are marked 'curriculum_ready'", curriculumReady === 5, `Found: ${curriculumReady}`);

console.log('\n====================================================');
console.log(`   VALIDATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All curriculum content regression assertions PASSED successfully!\n');
  process.exit(0);
}
