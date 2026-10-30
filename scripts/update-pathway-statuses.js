const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(process.cwd(), 'data', 'techverse.db');
const db = new DatabaseSync(dbPath);

console.log('--- UPDATING PATHWAY READINESS STATUSES ---');

try {
  db.exec("ALTER TABLE learning_pathways ADD COLUMN readiness_status TEXT DEFAULT 'in_development';");
  console.log('Added readiness_status column.');
} catch (e) {
  console.log('Column note:', e.message);
}

// 1. Mark Cybersecurity Fundamentals as 'ready' (fully verified reference track with 20 deep lessons in Ch 1 & 1300 questions)
db.prepare("UPDATE learning_pathways SET readiness_status = 'ready', status = 'published' WHERE id = 'pathway_37'").run();

// 2. Mark Flagship tracks as 'curriculum_ready' (10 domain modules & 50 authentic chapters)
const flagshipIds = ['pathway_21', 'pathway_07', 'pathway_09', 'pathway_06', 'pathway_32'];
const flagStmt = db.prepare("UPDATE learning_pathways SET readiness_status = 'curriculum_ready', status = 'published' WHERE id = ?");
flagshipIds.forEach(id => flagStmt.run(id));

// 3. For all other pathways, set readiness_status to 'in_development'
const otherStmt = db.prepare(`
  UPDATE learning_pathways
  SET readiness_status = 'in_development'
  WHERE id NOT IN ('pathway_37', 'pathway_21', 'pathway_07', 'pathway_09', 'pathway_06', 'pathway_32')
`);
otherStmt.run();

console.log('Pathway statuses updated successfully:');
const summary = db.prepare('SELECT readiness_status, count(*) as count FROM learning_pathways GROUP BY readiness_status').all();
console.log(summary);

db.close();
