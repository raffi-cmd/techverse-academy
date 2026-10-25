import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'techverse.db');

// Singleton database instance
class DatabaseManager {
  private static instance: DatabaseSync | null = null;

  public static getDb(): DatabaseSync {
    if (!this.instance) {
      this.instance = new DatabaseSync(dbPath);
      this.instance.exec('PRAGMA foreign_keys = ON;');
      this.instance.exec('PRAGMA journal_mode = WAL;');
      this.initSchema(this.instance);
    }
    return this.instance;
  }

  private static initSchema(db: DatabaseSync) {
    db.exec(`
      -- Users & Authentication
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        name TEXT,
        role TEXT DEFAULT 'learner', -- 'learner', 'instructor', 'admin', 'super_admin'
        image TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        display_name TEXT,
        certificate_name TEXT,
        bio TEXT,
        location TEXT,
        experience_level TEXT DEFAULT 'beginner',
        preferred_language TEXT DEFAULT 'en',
        github_url TEXT,
        linkedin_url TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id TEXT PRIMARY KEY,
        theme TEXT DEFAULT 'dark',
        email_notifications INTEGER DEFAULT 1,
        study_time_goal INTEGER DEFAULT 30,
        preferred_difficulty TEXT DEFAULT 'adaptive',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Onboarding Responses & Recommendations
      CREATE TABLE IF NOT EXISTS onboarding_responses (
        user_id TEXT PRIMARY KEY,
        learning_goals TEXT DEFAULT '[]',
        experience_level TEXT DEFAULT 'beginner',
        known_technologies TEXT DEFAULT '[]',
        preferred_activities TEXT DEFAULT '[]',
        learning_preferences TEXT DEFAULT '{}',
        equipment_info TEXT,
        recommendations TEXT DEFAULT '[]',
        completed_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Pathway Categories
      CREATE TABLE IF NOT EXISTS pathway_categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        sort_order INTEGER DEFAULT 0
      );

      -- Learning Pathways (60 Pathways)
      CREATE TABLE IF NOT EXISTS learning_pathways (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        short_description TEXT NOT NULL,
        detailed_description TEXT NOT NULL,
        category_id TEXT NOT NULL,
        difficulty_level TEXT DEFAULT 'beginner',
        prerequisites TEXT DEFAULT '[]',
        recommended_knowledge TEXT DEFAULT '',
        learning_outcomes TEXT DEFAULT '[]',
        technology_stack TEXT DEFAULT '[]',
        career_applications TEXT DEFAULT '[]',
        estimated_duration TEXT DEFAULT '40 hours',
        total_chapters INTEGER DEFAULT 0,
        published_chapters INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published', -- 'draft', 'in_review', 'published', 'archived'
        is_featured INTEGER DEFAULT 0,
        curriculum_version TEXT DEFAULT '1.0.0',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(category_id) REFERENCES pathway_categories(id)
      );

      -- Pathway Modules
      CREATE TABLE IF NOT EXISTS pathway_modules (
        id TEXT PRIMARY KEY,
        pathway_id TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY(pathway_id) REFERENCES learning_pathways(id) ON DELETE CASCADE,
        UNIQUE(pathway_id, slug)
      );

      -- Chapters (min 50 per pathway)
      CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        module_id TEXT NOT NULL,
        pathway_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT NOT NULL,
        learning_objectives TEXT DEFAULT '[]',
        prerequisites TEXT DEFAULT '[]',
        estimated_time INTEGER DEFAULT 30, -- minutes
        difficulty_level TEXT DEFAULT 'beginner',
        sort_order INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published',
        curriculum_version TEXT DEFAULT '1.0.0',
        references_json TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(module_id) REFERENCES pathway_modules(id) ON DELETE CASCADE,
        FOREIGN KEY(pathway_id) REFERENCES learning_pathways(id) ON DELETE CASCADE,
        UNIQUE(pathway_id, slug)
      );

      -- Lessons
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        chapter_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        content TEXT NOT NULL,
        content_type TEXT DEFAULT 'markdown',
        sort_order INTEGER DEFAULT 0,
        estimated_time INTEGER DEFAULT 10,
        is_required INTEGER DEFAULT 1,
        status TEXT DEFAULT 'published',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        UNIQUE(chapter_id, slug)
      );

      -- Quizzes & Assessments
      CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        chapter_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        passing_score INTEGER DEFAULT 80,
        max_attempts INTEGER DEFAULT 3,
        time_limit_min INTEGER,
        status TEXT DEFAULT 'published',
        FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assessment_questions (
        id TEXT PRIMARY KEY,
        assessment_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        question_type TEXT DEFAULT 'single_choice', -- 'single_choice', 'multiple_choice', 'true_false', 'code_output'
        options TEXT DEFAULT '[]', -- JSON array of {id, text, isCorrect}
        correct_answer TEXT,
        explanation TEXT,
        points INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY(assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        assessment_id TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        max_score INTEGER DEFAULT 0,
        percentage REAL DEFAULT 0,
        passed INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        started_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        responses_json TEXT DEFAULT '[]',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
      );

      -- Progress Tracking
      CREATE TABLE IF NOT EXISTS learning_enrollments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        pathway_id TEXT NOT NULL,
        status TEXT DEFAULT 'active', -- 'active', 'completed'
        enrolled_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(pathway_id) REFERENCES learning_pathways(id) ON DELETE CASCADE,
        UNIQUE(user_id, pathway_id)
      );

      CREATE TABLE IF NOT EXISTS lesson_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        status TEXT DEFAULT 'not_started', -- 'in_progress', 'completed'
        started_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        time_spent INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS chapter_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        status TEXT DEFAULT 'not_started', -- 'in_progress', 'completed'
        percentage REAL DEFAULT 0,
        started_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        UNIQUE(user_id, chapter_id)
      );

      -- Chapter Completion Authoritative Record
      CREATE TABLE IF NOT EXISTS chapter_completions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        curriculum_version TEXT NOT NULL,
        completed_at TEXT DEFAULT (datetime('now')),
        verified_at TEXT DEFAULT (datetime('now')),
        verification_data TEXT DEFAULT '{}',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        UNIQUE(user_id, chapter_id, curriculum_version)
      );

      -- Certificates (Strict Server-Side Generated & Verifiable)
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        certificate_number TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        pathway_id TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        chapter_title TEXT NOT NULL,
        pathway_name TEXT NOT NULL,
        issue_date TEXT DEFAULT (datetime('now')),
        curriculum_version TEXT NOT NULL,
        status TEXT DEFAULT 'valid', -- 'valid', 'revoked'
        revoked_at TEXT,
        revoked_reason TEXT,
        pdf_filename TEXT,
        verification_url TEXT NOT NULL,
        metadata TEXT DEFAULT '{}',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(chapter_id) REFERENCES chapters(id),
        FOREIGN KEY(pathway_id) REFERENCES learning_pathways(id),
        UNIQUE(user_id, chapter_id, curriculum_version)
      );

      CREATE TABLE IF NOT EXISTS certificate_verifications (
        id TEXT PRIMARY KEY,
        certificate_id TEXT NOT NULL,
        verified_at TEXT DEFAULT (datetime('now')),
        ip_address TEXT,
        user_agent TEXT,
        result TEXT NOT NULL, -- 'valid', 'revoked', 'not_found'
        FOREIGN KEY(certificate_id) REFERENCES certificates(id) ON DELETE CASCADE
      );

      -- Projects & Portfolios
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        chapter_id TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT DEFAULT 'beginner',
        category TEXT DEFAULT 'exercise',
        requirements TEXT DEFAULT '[]',
        acceptance_criteria TEXT DEFAULT '[]',
        FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS project_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        repository_url TEXT,
        live_url TEXT,
        description TEXT,
        status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewed'
        submitted_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- Notes, Bookmarks & Notifications
      CREATE TABLE IF NOT EXISTS personal_notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        chapter_id TEXT,
        lesson_id TEXT,
        title TEXT,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        target_type TEXT NOT NULL, -- 'lesson', 'chapter', 'pathway'
        target_id TEXT NOT NULL,
        title TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, target_type, target_id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL, -- 'completion', 'certificate', 'assessment', 'system'
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT DEFAULT '{}',
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Audit Logs (Mandatory for administration & security)
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_id TEXT,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT,
        metadata TEXT DEFAULT '{}',
        ip_address TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );

      -- Commercial Plans & Subscriptions
      CREATE TABLE IF NOT EXISTS product_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price_monthly REAL DEFAULT 0,
        features TEXT DEFAULT '[]',
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        current_period_start TEXT DEFAULT (datetime('now')),
        current_period_end TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(plan_id) REFERENCES product_plans(id)
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_chapters_pathway ON chapters(pathway_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
      CREATE INDEX IF NOT EXISTS idx_progress_user ON chapter_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_cert_num ON certificates(certificate_number);
      CREATE INDEX IF NOT EXISTS idx_cert_user ON certificates(user_id);
    `);
  }
}

export const db = DatabaseManager.getDb();

// Cryptographic helpers using Node built-in crypto (OWASP standard PBKDF2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateId(prefix: string = ''): string {
  const random = crypto.randomBytes(8).toString('hex');
  return prefix ? `${prefix}_${random}` : random;
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const part1 = crypto.randomBytes(3).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TV-${year}-${part1}-${part2}`;
}

export default db;
