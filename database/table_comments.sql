-- table_comments.sql: PostgreSQL COMMENT statements for schema documentation
-- These make the schema self-documenting when inspected via pgAdmin, psql \d+, etc.

COMMENT ON TABLE users IS 'Central authentication table storing login credentials and roles for students and admins.';
COMMENT ON TABLE departments IS 'Academic departments offered by the college (CSE, ECE, etc).';
COMMENT ON TABLE student_profiles IS 'Extended profile for student users with academic details, skills, and contact information.';
COMMENT ON TABLE education IS 'Education history records linked to student profiles (degree, institution, year).';
COMMENT ON TABLE skills IS 'Master taxonomy of technical and soft skills used for matching.';
COMMENT ON TABLE student_skills IS 'Junction table mapping students to skills with proficiency levels (Beginner/Intermediate/Advanced).';
COMMENT ON TABLE companies IS 'Company directory storing employer details, industry, and contact information.';
COMMENT ON TABLE internships IS 'Internship listings published by companies with requirements, stipend, and deadlines.';
COMMENT ON TABLE internship_required_skills IS 'Skills required for an internship with importance level and mandatory flag.';
COMMENT ON TABLE saved_internships IS 'Bookmarked internships saved by students for later review.';
COMMENT ON TABLE applications IS 'Core tracking table for student internship applications with status pipeline.';
COMMENT ON TABLE application_status_history IS 'Audit trail of all status transitions for each application.';
COMMENT ON TABLE interviews IS 'Scheduled and completed interview rounds linked to applications.';
COMMENT ON TABLE offers IS 'Offer details received by students including stipend, joining date, and acceptance status.';
COMMENT ON TABLE documents IS 'Uploaded files (resumes, certificates) with verification status tracking.';
COMMENT ON TABLE reminders IS 'User-created reminders for application deadlines and follow-ups.';
COMMENT ON TABLE notifications IS 'System-generated notifications for application updates and events.';
COMMENT ON TABLE notes IS 'Free-form notes attached to applications for personal tracking.';
COMMENT ON TABLE audit_logs IS 'System audit log recording all data modifications with old/new values in JSONB.';

-- Column-level comments for key fields
COMMENT ON COLUMN applications.current_status IS 'Pipeline stage: Interested > Applied > Under Review > OA > Interview > Offer > Accepted/Rejected';
COMMENT ON COLUMN applications.priority IS 'User-assigned priority: Low, Medium, High, Critical';
COMMENT ON COLUMN student_profiles.profile_completion_percentage IS 'Auto-calculated via PostgreSQL function based on filled profile fields.';
COMMENT ON COLUMN internships.min_cgpa_required IS 'Minimum CGPA threshold for eligibility filtering.';
COMMENT ON COLUMN offers.offer_status IS 'Lifecycle: Pending > Accepted/Declined/Expired';
COMMENT ON COLUMN audit_logs.changed_data IS 'JSONB payload storing old_values and new_values for the modification.';
