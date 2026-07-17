-- indexes.sql: Create database indexes to optimize query performance for common searches and joins.

-- Index for searching users by email (useful if query doesn't use the PK)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Index for searching student profiles by register number
CREATE INDEX IF NOT EXISTS idx_student_profiles_register ON student_profiles (register_number);

-- Index for searching companies by name (case-insensitive search helper)
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (company_name);

-- Index for searching internships by title and deadline
CREATE INDEX IF NOT EXISTS idx_internships_title ON internships (title);
CREATE INDEX IF NOT EXISTS idx_internships_deadline ON internships (application_deadline);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships (status);

-- Indexes for application queries
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications (student_id);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications (company_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (current_status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications (applied_date);

-- Index for reminders sorting/filtering by time
CREATE INDEX IF NOT EXISTS idx_reminders_datetime ON reminders (reminder_datetime);
CREATE INDEX IF NOT EXISTS idx_reminders_student ON reminders (student_id);

-- Index for notification lookups for users
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read);

-- Indexes for relationship joins
CREATE INDEX IF NOT EXISTS idx_student_skills_lookup ON student_skills (student_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_internship_skills_lookup ON internship_required_skills (internship_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews (application_id);
CREATE INDEX IF NOT EXISTS idx_offers_application ON offers (application_id);
CREATE INDEX IF NOT EXISTS idx_documents_student ON documents (student_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs (user_id);

-- Index for optimizing student eligibility queries by CGPA threshold
CREATE INDEX IF NOT EXISTS idx_internships_eligibility_cgpa ON internships (eligibility_cgpa);
