const http = require('node:http');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (_) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log("=================================================");
  console.log("   TECHVERSE ACADEMY - AUTHORITATIVE E2E SUITE   ");
  console.log("=================================================\n");

  // Load DB directly to find correct answers for testing full grading lifecycle
  const db = (await import('../src/lib/db.ts')).default;

  // 1. Homepage
  const home = await request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
  console.log(`[1] Homepage GET: Status ${home.statusCode}`);
  assert.strictEqual(home.statusCode, 200, "Homepage must return 200");
  assert.ok(home.body.includes("DIGITAL") && home.body.includes("UNIVERSE"), "Homepage contains NeoVision hero header");

  // 2. Pathways Catalog
  const pathways = await request({ hostname: 'localhost', port: 3000, path: '/pathways', method: 'GET' });
  console.log(`[2] Pathways Catalog GET: Status ${pathways.statusCode}`);
  assert.strictEqual(pathways.statusCode, 200, "Pathways catalog must return 200");

  // 3. Pathway Syllabus (Computer & IT Fundamentals)
  const pathwaySyllabus = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/pathways/computer-and-it-fundamentals',
    method: 'GET'
  });
  console.log(`[3] Pathway Syllabus GET: Status ${pathwaySyllabus.statusCode}`);
  assert.strictEqual(pathwaySyllabus.statusCode, 200, "Pathway syllabus must return 200");
  assert.ok(pathwaySyllabus.body.includes("Orientation"), "Syllabus includes chapter titles");

  // 4. Register a new candidate
  const candidateEmail = `candidate_${Date.now()}@techverse.academy`;
  const candidateName = 'Alex Candidate';
  const registerRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: candidateName,
    email: candidateEmail,
    password: 'CandidatePass123!'
  });
  console.log(`[4] Candidate Register POST: Status ${registerRes.statusCode}, Email: ${candidateEmail}`);
  assert.strictEqual(registerRes.statusCode, 200, "Registration must succeed");
  const cookieHeader = registerRes.headers['set-cookie'];
  assert.ok(cookieHeader && cookieHeader.length > 0, "Registration must set session cookie");
  const learnerCookie = cookieHeader[0].split(';')[0];

  // 5. Check Auth Me with cookie
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Cookie': learnerCookie }
  });
  console.log(`[5] /api/auth/me GET: Status ${meRes.statusCode}, User: ${meRes.json.user.email}`);
  assert.strictEqual(meRes.statusCode, 200);
  assert.strictEqual(meRes.json.user.email, candidateEmail);

  // 6. Chapter Data & Sanitized Quiz Questions
  const chapterData = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/chapters/data?pathway=computer-and-it-fundamentals&chapter=ch-1-orientation-foundations-part-1',
    method: 'GET',
    headers: { 'Cookie': learnerCookie }
  });
  console.log(`[6] Chapter Data GET: Status ${chapterData.statusCode}`);
  assert.strictEqual(chapterData.statusCode, 200);
  assert.ok(chapterData.json.chapter.title.includes("Orientation"));
  assert.ok(chapterData.json.lessons.length >= 2, "Chapter has lessons");
  const assessment = chapterData.json.assessment;
  assert.ok(assessment && assessment.questions.length > 0, "Assessment has questions");
  assert.strictEqual(assessment.questions[0].correct_answer, undefined, "Sanitized: must not leak answer key");

  // 7. Assessment Submit with Correct Answers
  // Look up correct options from DB for assessment questions
  const dbQuestions = db.prepare('SELECT id, options FROM assessment_questions WHERE assessment_id = ?').all(assessment.id);
  const responses = dbQuestions.map(q => {
    const opts = JSON.parse(q.options || '[]');
    const correctOpt = opts.find(o => o.isCorrect === true);
    return {
      questionId: q.id,
      answer: correctOpt ? correctOpt.id : (opts[0] ? opts[0].id : 'opt-1')
    };
  });

  const submitRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/assessments/${assessment.id}/submit`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': learnerCookie
    }
  }, { responses, timeSpent: 180 });
  console.log(`[7] Assessment Submit POST: Status ${submitRes.statusCode}, Score: ${submitRes.json.score}/${submitRes.json.maxScore} (${submitRes.json.percentage}%), Passed: ${submitRes.json.passed}`);
  assert.strictEqual(submitRes.statusCode, 200);
  assert.strictEqual(submitRes.json.passed, true, "Must pass assessment with >= 80% score");
  assert.strictEqual(submitRes.json.percentage, 100, "Percentage must be 100%");

  // 8. Claim Certificate (Authoritative Server Issuance & PDF Generation)
  const claimRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/certificates/claim',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': learnerCookie
    }
  }, {
    chapterId: chapterData.json.chapter.id,
    recipientName: candidateName
  });
  console.log(`[8] Certificate Claim POST: Status ${claimRes.statusCode}, Number: ${claimRes.json.certificate?.certificateNumber}`);
  assert.strictEqual(claimRes.statusCode, 200);
  const certNumber = claimRes.json.certificate.certificateNumber;
  assert.ok(certNumber.startsWith('TV-'), "Certificate number must follow TV-YYYY-XXXX format");

  // Verify PDF exists on filesystem
  const pdfPath = path.join(__dirname, '..', 'public', 'certificates', `${certNumber}.pdf`);
  assert.ok(fs.existsSync(pdfPath), `PDF file must exist at ${pdfPath}`);
  const pdfBytes = fs.readFileSync(pdfPath);
  assert.ok(pdfBytes.length > 500, "PDF must not be empty");
  assert.strictEqual(pdfBytes.subarray(0, 5).toString('ascii'), '%PDF-', "PDF file header must be %PDF-");
  console.log(`    [PASS] PDF verified on disk: ${pdfBytes.length} bytes (PDF-1.4 binary)`);

  // 9. Public Certificate Verification API & Permalink Page
  const verifyApiRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/certificates/verify/${certNumber}`,
    method: 'GET'
  });
  console.log(`[9a] Public Verification API GET: Status ${verifyApiRes.statusCode}, Result: ${verifyApiRes.json.result}`);
  assert.strictEqual(verifyApiRes.statusCode, 200);
  assert.strictEqual(verifyApiRes.json.result, 'valid');
  assert.strictEqual(verifyApiRes.json.certificate.recipientName, candidateName);

  const verifyPageRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/verify/${certNumber}`,
    method: 'GET'
  });
  console.log(`[9b] Public Verification Permalink GET: Status ${verifyPageRes.statusCode}`);
  assert.strictEqual(verifyPageRes.statusCode, 200);
  assert.ok(verifyPageRes.body.includes(certNumber), "Permalink renders certificate number");
  assert.ok(verifyPageRes.body.includes(candidateName), "Permalink renders recipient name");

  // 10. Admin Console Login & Metric Telemetry
  const adminLoginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@techverse.academy',
    password: 'AdminPass123!'
  });
  console.log(`[10a] Admin Login POST: Status ${adminLoginRes.statusCode}`);
  assert.strictEqual(adminLoginRes.statusCode, 200);
  const adminCookie = adminLoginRes.headers['set-cookie'][0].split(';')[0];

  const metricsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/metrics',
    method: 'GET',
    headers: { 'Cookie': adminCookie }
  });
  console.log(`[10b] Admin Metrics GET: Status ${metricsRes.statusCode}, Pathways: ${metricsRes.json?.metrics?.activePathways}, Certs: ${metricsRes.json?.metrics?.certificatesIssued}`);
  assert.strictEqual(metricsRes.statusCode, 200);
  assert.ok(metricsRes.json.metrics.activePathways >= 5);
  assert.ok(metricsRes.json.metrics.certificatesIssued >= 1);
  assert.ok(metricsRes.json.recentLogs.length > 0, "Audit logs must record system events");

  // 11. Administrative Revocation
  const revokeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/certificates/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': adminCookie
    }
  }, {
    certificateNumber: certNumber,
    reason: 'QA Audit Revocation Verification Test'
  });
  console.log(`[11a] Admin Revoke POST: Status ${revokeRes.statusCode}, Revoked: ${revokeRes.json.success}`);
  assert.strictEqual(revokeRes.statusCode, 200);

  // Check that public verification now reflects revoked state
  const verifyRevoked = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/certificates/verify/${certNumber}`,
    method: 'GET'
  });
  console.log(`[11b] Verification after revocation: Result: ${verifyRevoked.json.result}`);
  assert.strictEqual(verifyRevoked.statusCode, 200);
  assert.strictEqual(verifyRevoked.json.result, 'revoked');
  assert.strictEqual(verifyRevoked.json.certificate.revokedReason, 'QA Audit Revocation Verification Test');

  console.log("\n=================================================");
  console.log("   ALL 11 PRODUCTION E2E TESTS PASSED CLEANLY!   ");
  console.log("   0 ERRORS, 0 MOCKS, 100% REAL PERSISTENT DB!   ");
  console.log("=================================================");
}

run().catch(err => {
  console.error("\nE2E Test Failed:", err);
  process.exit(1);
});
