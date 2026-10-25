import db, { hashPassword, generateId } from './db';

export function runSeed() {
  console.log('--- Commencing TechVerse Database Seed ---');

  // 1. Seed Product Plans
  const plans = [
    {
      id: 'plan_free',
      name: 'Free Starter',
      slug: 'free',
      description: 'Explore introductory chapters and foundational IT concepts.',
      price_monthly: 0,
      features: JSON.stringify([
        'Access to introductory chapters',
        'Basic progress tracking',
        'Selected chapter completion certificates',
        'Community discussion access'
      ]),
      is_active: 1
    },
    {
      id: 'plan_premium',
      name: 'Professional Learner',
      slug: 'premium',
      description: 'Full access to all 60 pathways, 50+ chapters, projects, and AI assistant.',
      price_monthly: 29,
      features: JSON.stringify([
        'Full access to all 60 IT learning pathways',
        '50+ chapters per complete curriculum',
        'AI Learning Assistant tutor',
        'Verifiable chapter completion certificates (PDF & online)',
        'Hands-on project portfolios',
        'Detailed skill analytics and study metrics'
      ]),
      is_active: 1
    },
    {
      id: 'plan_institutional',
      name: 'Institutional Academy',
      slug: 'institutional',
      description: 'Designed for universities, bootcamps, and enterprise engineering teams.',
      price_monthly: 99,
      features: JSON.stringify([
        'Multi-seat organization management',
        'Cohort progress analytics and gradebook',
        'Custom curriculum paths',
        'Dedicated onboarding engineer'
      ]),
      is_active: 1
    }
  ];

  const planStmt = db.prepare(`
    INSERT OR REPLACE INTO product_plans (id, name, slug, description, price_monthly, features, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of plans) {
    planStmt.run(p.id, p.name, p.slug, p.description, p.price_monthly, p.features, p.is_active);
  }

  // 2. Seed Default Users
  const adminId = 'user_admin_001';
  const adminHash = hashPassword('AdminPass123!');
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, role, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin@techverse.academy', adminHash, 'System Administrator', 'admin', 1);

  db.prepare(`
    INSERT OR REPLACE INTO user_profiles (user_id, display_name, certificate_name, bio, experience_level)
    VALUES (?, ?, ?, ?, ?)
  `).run(adminId, 'Admin', 'TechVerse Lead Administrator', 'Platform administrator & curriculum architect.', 'expert');

  const learnerId = 'user_learner_001';
  const learnerHash = hashPassword('LearnerPass123!');
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, role, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(learnerId, 'learner@techverse.academy', learnerHash, 'Alex Rivera', 'learner', 1);

  db.prepare(`
    INSERT OR REPLACE INTO user_profiles (user_id, display_name, certificate_name, bio, experience_level)
    VALUES (?, ?, ?, ?, ?)
  `).run(learnerId, 'Alex Rivera', 'Alex Rivera', 'Aspiring Full-Stack Software Engineer & AI enthusiast.', 'beginner');

  db.prepare(`
    INSERT OR REPLACE INTO user_preferences (user_id, theme, study_time_goal, preferred_difficulty)
    VALUES (?, ?, ?, ?)
  `).run(learnerId, 'dark', 45, 'adaptive');

  // 3. Seed Categories
  const categories = [
    { id: 'cat_fundamentals', name: 'Computer & IT Foundations', slug: 'fundamentals', description: 'Core hardware, OS, networking, and digital literacy basics.', icon: 'Laptop' },
    { id: 'cat_programming', name: 'Software Development & Languages', slug: 'programming', description: 'Programming fundamentals in Python, JavaScript, TypeScript, and modern languages.', icon: 'Code' },
    { id: 'cat_web', name: 'Web & Full-Stack Engineering', slug: 'web-development', description: 'Modern frontend, backend, APIs, and end-to-end web architecture.', icon: 'Globe' },
    { id: 'cat_data_ai', name: 'Artificial Intelligence & Data', slug: 'data-ai', description: 'Machine learning, deep learning, LLMs, prompt engineering, and data science.', icon: 'Brain' },
    { id: 'cat_cloud_devops', name: 'Cloud, Infrastructure & DevOps', slug: 'cloud-devops', description: 'Cloud platforms, containers, CI/CD, Kubernetes, and Site Reliability.', icon: 'Cloud' },
    { id: 'cat_security', name: 'Cybersecurity & Defensive Ops', slug: 'security', description: 'Defensive security, SOC operations, network defense, and app security.', icon: 'Shield' },
    { id: 'cat_systems', name: 'Systems & Architecture', slug: 'systems', description: 'Linux administration, system design, databases, and distributed systems.', icon: 'Server' }
  ];

  const catStmt = db.prepare(`
    INSERT OR REPLACE INTO pathway_categories (id, name, slug, description, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  categories.forEach((c, idx) => catStmt.run(c.id, c.name, c.slug, c.description, c.icon, idx));

  // 4. Seed all 60 Learning Pathways (as mandated by SPEC)
  const pathwaysList = [
    { num: 1, name: 'Computer and IT Fundamentals', cat: 'cat_fundamentals', level: 'beginner', duration: '50 hours', published: 50, featured: 1 },
    { num: 2, name: 'Programming Fundamentals', cat: 'cat_programming', level: 'beginner', duration: '60 hours', published: 50, featured: 1 },
    { num: 3, name: 'Python Development', cat: 'cat_programming', level: 'beginner', duration: '65 hours', published: 50, featured: 1 },
    { num: 4, name: 'JavaScript Development', cat: 'cat_programming', level: 'beginner', duration: '65 hours', published: 50, featured: 1 },
    { num: 5, name: 'TypeScript Development', cat: 'cat_programming', level: 'intermediate', duration: '55 hours', published: 50, featured: 0 },
    { num: 6, name: 'Frontend Development', cat: 'cat_web', level: 'beginner', duration: '70 hours', published: 50, featured: 1 },
    { num: 7, name: 'Backend Development', cat: 'cat_web', level: 'intermediate', duration: '75 hours', published: 50, featured: 1 },
    { num: 8, name: 'Full-Stack Development', cat: 'cat_web', level: 'intermediate', duration: '90 hours', published: 50, featured: 1 },
    { num: 9, name: 'Software Engineering', cat: 'cat_programming', level: 'intermediate', duration: '80 hours', published: 50, featured: 0 },
    { num: 10, name: 'Data Structures and Algorithms', cat: 'cat_programming', level: 'intermediate', duration: '70 hours', published: 50, featured: 0 },
    { num: 11, name: 'Database Engineering', cat: 'cat_systems', level: 'intermediate', duration: '60 hours', published: 50, featured: 0 },
    { num: 12, name: 'SQL and Database Administration', cat: 'cat_systems', level: 'beginner', duration: '50 hours', published: 50, featured: 0 },
    { num: 13, name: 'Mobile Application Development', cat: 'cat_web', level: 'intermediate', duration: '65 hours', published: 50, featured: 0 },
    { num: 14, name: 'Android Development', cat: 'cat_web', level: 'intermediate', duration: '70 hours', published: 0, featured: 0 },
    { num: 15, name: 'iOS Development', cat: 'cat_web', level: 'intermediate', duration: '70 hours', published: 0, featured: 0 },
    { num: 16, name: 'UI/UX Engineering', cat: 'cat_web', level: 'beginner', duration: '45 hours', published: 0, featured: 0 },
    { num: 17, name: 'Web Performance Engineering', cat: 'cat_web', level: 'advanced', duration: '40 hours', published: 0, featured: 0 },
    { num: 18, name: 'API Engineering', cat: 'cat_web', level: 'intermediate', duration: '50 hours', published: 50, featured: 0 },
    { num: 19, name: 'Software Testing and QA', cat: 'cat_programming', level: 'beginner', duration: '50 hours', published: 50, featured: 0 },
    { num: 20, name: 'Automation Engineering', cat: 'cat_programming', level: 'intermediate', duration: '55 hours', published: 0, featured: 0 },
    { num: 21, name: 'Artificial Intelligence Engineering', cat: 'cat_data_ai', level: 'intermediate', duration: '85 hours', published: 50, featured: 1 },
    { num: 22, name: 'Machine Learning Engineering', cat: 'cat_data_ai', level: 'intermediate', duration: '80 hours', published: 0, featured: 0 },
    { num: 23, name: 'Deep Learning', cat: 'cat_data_ai', level: 'advanced', duration: '75 hours', published: 0, featured: 0 },
    { num: 24, name: 'Generative AI Engineering', cat: 'cat_data_ai', level: 'intermediate', duration: '60 hours', published: 50, featured: 1 },
    { num: 25, name: 'Large Language Model Engineering', cat: 'cat_data_ai', level: 'advanced', duration: '70 hours', published: 0, featured: 0 },
    { num: 26, name: 'Prompt Engineering', cat: 'cat_data_ai', level: 'beginner', duration: '35 hours', published: 50, featured: 0 },
    { num: 27, name: 'AI Application Development', cat: 'cat_data_ai', level: 'intermediate', duration: '60 hours', published: 0, featured: 0 },
    { num: 28, name: 'Data Analytics', cat: 'cat_data_ai', level: 'beginner', duration: '50 hours', published: 50, featured: 0 },
    { num: 29, name: 'Data Engineering', cat: 'cat_data_ai', level: 'intermediate', duration: '75 hours', published: 0, featured: 0 },
    { num: 30, name: 'Data Science', cat: 'cat_data_ai', level: 'intermediate', duration: '80 hours', published: 50, featured: 0 },
    { num: 31, name: 'Business Intelligence', cat: 'cat_data_ai', level: 'beginner', duration: '45 hours', published: 0, featured: 0 },
    { num: 32, name: 'Cloud Computing', cat: 'cat_cloud_devops', level: 'beginner', duration: '60 hours', published: 50, featured: 1 },
    { num: 33, name: 'Cloud Architecture', cat: 'cat_cloud_devops', level: 'advanced', duration: '70 hours', published: 0, featured: 0 },
    { num: 34, name: 'DevOps Engineering', cat: 'cat_cloud_devops', level: 'intermediate', duration: '80 hours', published: 50, featured: 1 },
    { num: 35, name: 'Site Reliability Engineering', cat: 'cat_cloud_devops', level: 'advanced', duration: '70 hours', published: 0, featured: 0 },
    { num: 36, name: 'Platform Engineering', cat: 'cat_cloud_devops', level: 'advanced', duration: '65 hours', published: 0, featured: 0 },
    { num: 37, name: 'Cybersecurity Fundamentals', cat: 'cat_security', level: 'beginner', duration: '60 hours', published: 50, featured: 1 },
    { num: 38, name: 'Defensive Security and SOC Fundamentals', cat: 'cat_security', level: 'intermediate', duration: '70 hours', published: 0, featured: 0 },
    { num: 39, name: 'Application Security', cat: 'cat_security', level: 'intermediate', duration: '65 hours', published: 0, featured: 0 },
    { num: 40, name: 'Secure Software Development', cat: 'cat_security', level: 'intermediate', duration: '60 hours', published: 0, featured: 0 },
    { num: 41, name: 'Network Engineering', cat: 'cat_systems', level: 'beginner', duration: '55 hours', published: 0, featured: 0 },
    { num: 42, name: 'Linux System Administration', cat: 'cat_systems', level: 'beginner', duration: '60 hours', published: 50, featured: 0 },
    { num: 43, name: 'Windows System Administration', cat: 'cat_systems', level: 'beginner', duration: '50 hours', published: 0, featured: 0 },
    { num: 44, name: 'Infrastructure Automation', cat: 'cat_cloud_devops', level: 'intermediate', duration: '60 hours', published: 0, featured: 0 },
    { num: 45, name: 'Blockchain Development', cat: 'cat_programming', level: 'intermediate', duration: '65 hours', published: 0, featured: 0 },
    { num: 46, name: 'Game Development', cat: 'cat_programming', level: 'intermediate', duration: '75 hours', published: 0, featured: 0 },
    { num: 47, name: 'Technical Writing', cat: 'cat_fundamentals', level: 'beginner', duration: '35 hours', published: 0, featured: 0 },
    { num: 48, name: 'Software Architecture', cat: 'cat_systems', level: 'advanced', duration: '70 hours', published: 0, featured: 0 },
    { num: 49, name: 'Distributed Systems', cat: 'cat_systems', level: 'advanced', duration: '80 hours', published: 0, featured: 0 },
    { num: 50, name: 'Open-Source Software Development', cat: 'cat_programming', level: 'intermediate', duration: '40 hours', published: 0, featured: 0 },
    { num: 51, name: 'IT Project Management', cat: 'cat_fundamentals', level: 'beginner', duration: '40 hours', published: 0, featured: 0 },
    { num: 52, name: 'System Design', cat: 'cat_systems', level: 'advanced', duration: '65 hours', published: 50, featured: 1 },
    { num: 53, name: 'Computer Science Fundamentals', cat: 'cat_fundamentals', level: 'beginner', duration: '70 hours', published: 0, featured: 0 },
    { num: 54, name: 'Computer Vision', cat: 'cat_data_ai', level: 'advanced', duration: '65 hours', published: 0, featured: 0 },
    { num: 55, name: 'Natural Language Processing', cat: 'cat_data_ai', level: 'advanced', duration: '70 hours', published: 0, featured: 0 },
    { num: 56, name: 'MLOps Engineering', cat: 'cat_data_ai', level: 'advanced', duration: '65 hours', published: 0, featured: 0 },
    { num: 57, name: 'Data Governance and Data Quality', cat: 'cat_data_ai', level: 'intermediate', duration: '45 hours', published: 0, featured: 0 },
    { num: 58, name: 'Observability and Monitoring', cat: 'cat_cloud_devops', level: 'intermediate', duration: '50 hours', published: 0, featured: 0 },
    { num: 59, name: 'Web Accessibility Engineering', cat: 'cat_web', level: 'beginner', duration: '40 hours', published: 0, featured: 0 },
    { num: 60, name: 'Performance and Reliability Engineering', cat: 'cat_systems', level: 'advanced', duration: '60 hours', published: 0, featured: 0 },
  ];

  const pathwayStmt = db.prepare(`
    INSERT OR REPLACE INTO learning_pathways (
      id, name, slug, short_description, detailed_description,
      category_id, difficulty_level, prerequisites, recommended_knowledge,
      learning_outcomes, technology_stack, career_applications,
      estimated_duration, total_chapters, published_chapters, status, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const moduleStmt = db.prepare(`
    INSERT OR REPLACE INTO pathway_modules (id, pathway_id, name, slug, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const chapterStmt = db.prepare(`
    INSERT OR REPLACE INTO chapters (
      id, module_id, pathway_id, title, slug, description,
      learning_objectives, estimated_time, difficulty_level, sort_order, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const lessonStmt = db.prepare(`
    INSERT OR REPLACE INTO lessons (
      id, chapter_id, title, slug, content, content_type, sort_order, estimated_time, is_required, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const assessmentStmt = db.prepare(`
    INSERT OR REPLACE INTO assessments (id, chapter_id, title, description, passing_score, max_attempts)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const questionStmt = db.prepare(`
    INSERT OR REPLACE INTO assessment_questions (id, assessment_id, question_text, question_type, options, points, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of pathwaysList) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `pathway_${String(p.num).padStart(2, '0')}`;
    const shortDesc = `Master ${p.name} with industry-aligned concepts, hands-on tasks, and verifiable completion certification.`;
    const detailedDesc = `${p.name} is a comprehensive learning pathway designed to build rigorous technical expertise. From fundamental mental models to scalable engineering execution, this track ensures learners gain battle-tested competence required by modern technology teams.`;
    const outcomes = JSON.stringify([
      `Understand core principles and theoretical foundations of ${p.name}`,
      `Implement production-grade patterns and resolve common technical pitfalls`,
      `Design, build, and debug real-world projects with modern industry tools`,
      `Verify knowledge retention through rigorous chapter assessments and earn certificates`
    ]);
    const techStack = JSON.stringify(['Modern Tooling', 'CLI', 'Git', 'Testing Frameworks', 'Production Runtimes']);
    const careers = JSON.stringify([`${p.name} Specialist`, 'Software Engineer', 'Technical Consultant']);

    const totalChapters = p.published > 0 ? 50 : 0;
    const status = p.published > 0 ? 'published' : 'in_review';

    pathwayStmt.run(
      id, p.name, slug, shortDesc, detailedDesc,
      p.cat, p.level, JSON.stringify([]), 'Basic computer literacy',
      outcomes, techStack, careers, p.duration,
      totalChapters, p.published, status, p.featured
    );

    // If pathway is published with 50 chapters, generate all 50 chapters across 10 modules!
    if (p.published === 50) {
      // 10 modules x 5 chapters = 50 distinct chapters per pathway
      const moduleTitles = [
        'Orientation & Foundations',
        'Core Syntax & Mental Models',
        'Data Representation & Structures',
        'Program Flow & Control Logic',
        'Functional Units & Architecture',
        'Error Handling & Reliability',
        'Testing, Debugging & Verification',
        'Security & Hardening Best Practices',
        'Performance & System Optimization',
        'Capstone Implementation & Certification Review'
      ];

      for (let mIdx = 0; mIdx < moduleTitles.length; mIdx++) {
        const modTitle = moduleTitles[mIdx];
        const modSlug = `mod-${mIdx + 1}-${modTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const modId = `${id}_m${mIdx + 1}`;

        moduleStmt.run(modId, id, `Module ${mIdx + 1}: ${modTitle}`, modSlug, `Comprehensive training on ${modTitle}`, mIdx + 1);

        for (let cIdx = 1; cIdx <= 5; cIdx++) {
          const chapNumber = mIdx * 5 + cIdx;
          const chapId = `${id}_ch${chapNumber}`;
          const chapTitle = `${p.name}: Chapter ${chapNumber} - ${modTitle} (Part ${cIdx})`;
          const chapSlug = `ch-${chapNumber}-${modTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-part-${cIdx}`;
          const chapDesc = `Detailed study of ${modTitle} (Part ${cIdx}) within the ${p.name} specialization track. Focuses on actionable technical execution, code analysis, and best practices.`;

          chapterStmt.run(
            chapId, modId, id, chapTitle, chapSlug, chapDesc,
            JSON.stringify([
              `Analyze the core concepts of Chapter ${chapNumber}`,
              `Apply theoretical principles to practical engineering tasks`,
              `Pass the comprehensive chapter assessment with >= 80% score`
            ]),
            35, p.level, chapNumber, 'published'
          );

          // Seed at least 2 structured lessons per chapter
          const lesson1Id = `${chapId}_l1`;
          const lesson1Title = `Theory & Architecture`;
          const lesson1Content = `# ${chapTitle}

## 1. Architectural Foundations
In modern ${p.name}, understanding the foundational mental models is critical to building scalable, resilient software systems.

### Key Principles
- **Separation of Concerns:** Keep modular boundaries clearly defined.
- **Fail-Safe Defaults:** Systems should always handle edge cases gracefully.
- **Deterministic Outcomes:** Ensure your logic produces predictable behavior under all inputs.

\`\`\`typescript
// Production pattern demonstration
export function validateState<T>(state: T, rules: Array<(s: T) => boolean>): boolean {
  return rules.every(rule => rule(state));
}
\`\`\`

## 2. Practical Takeaways
1. Always validate inputs before executing state mutations.
2. Maintain clean audit logs for security-sensitive operations.
3. Test edge conditions repeatedly before deploying to staging environments.
`;

          lessonStmt.run(lesson1Id, chapId, lesson1Title, 'theory-and-architecture', lesson1Content, 'markdown', 1, 15, 1, 'published');

          const lesson2Id = `${chapId}_l2`;
          const lesson2Title = `Implementation & Real-World Application`;
          const lesson2Content = `# Hands-On Implementation Guide

## Implementation Workflow
To apply the concepts learned in this chapter:
1. Initialize your local working environment.
2. Implement your business logic adhering strictly to the specifications.
3. Write automated unit test assertions to verify each requirement.

### Common Pitfalls
- **Unchecked null values:** Always sanitize inputs at the trust boundary.
- **Leaked credentials:** Never place secrets or private access tokens in client-side code.
- **Premature optimization:** Prioritize correctness, readability, and security before micro-benchmarks.
`;

          lessonStmt.run(lesson2Id, chapId, lesson2Title, 'implementation-guide', lesson2Content, 'markdown', 2, 20, 1, 'published');

          // Seed Chapter Assessment (Quiz)
          const assessmentId = `asmt_${chapId}`;
          assessmentStmt.run(assessmentId, chapId, `${chapTitle} Assessment`, `Evaluate mastery of Chapter ${chapNumber} to qualify for your verifiable completion certificate.`, 80, 3);

          // Seed 2 assessment questions
          const q1Id = `${assessmentId}_q1`;
          questionStmt.run(
            q1Id, assessmentId,
            `What is the primary architectural principle emphasized in Chapter ${chapNumber}?`,
            'single_choice',
            JSON.stringify([
              { id: 'opt_a', text: 'Separation of concerns and deterministic execution', isCorrect: true },
              { id: 'opt_b', text: 'Hardcoding sensitive API keys directly in client templates', isCorrect: false },
              { id: 'opt_c', text: 'Skipping automated tests to maximize deployment frequency', isCorrect: false },
              { id: 'opt_d', text: 'Bypassing input validation when under high load', isCorrect: false }
            ]),
            1, 1
          );

          const q2Id = `${assessmentId}_q2`;
          questionStmt.run(
            q2Id, assessmentId,
            `True or False: In production environments, sensitive secrets and private database credentials must never be exposed to the browser.`,
            'true_false',
            JSON.stringify([
              { id: 'opt_true', text: 'True - credentials must remain securely confined to server-side environments', isCorrect: true },
              { id: 'opt_false', text: 'False - client-side code should have direct root database access', isCorrect: false }
            ]),
            1, 2
          );
        }
      }
    }
  }

  // 5. Seed a sample earned certificate for learner to test instant verification & PDF download
  const sampleCertId = 'cert_sample_001';
  const sampleCertNum = 'TV-2024-ALPHA-7721';
  const sampleChapterId = 'pathway_01_ch1';
  const samplePathwayId = 'pathway_01';
  const verifyUrl = `http://localhost:3000/verify/${sampleCertNum}`;

  db.prepare(`
    INSERT OR REPLACE INTO chapter_completions (id, user_id, chapter_id, curriculum_version, completed_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run('comp_sample_001', learnerId, sampleChapterId, '1.0.0');

  db.prepare(`
    INSERT OR REPLACE INTO certificates (
      id, certificate_number, user_id, chapter_id, pathway_id,
      recipient_name, chapter_title, pathway_name, curriculum_version,
      status, pdf_filename, verification_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sampleCertId, sampleCertNum, learnerId, sampleChapterId, samplePathwayId,
    'Alex Rivera', 'Computer and IT Fundamentals: Chapter 1 - Orientation & Foundations (Part 1)',
    'Computer and IT Fundamentals', '1.0.0', 'valid', `${sampleCertNum}.pdf`, verifyUrl
  );

  console.log('--- TechVerse Database Seed Finished Successfully! ---');
}
