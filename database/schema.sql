-- schema.sql: Base Schema for InternTrack Application

-- Enable uuid-ossp extension in case UUIDs are needed, but we will use auto-incrementing integers for primary keys as per request.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' or 'admin'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. departments
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) NOT NULL
);

-- 3. student_profiles
CREATE TABLE student_profiles (
    student_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    register_number VARCHAR(20) NOT NULL,
    department_id INTEGER NOT NULL,
    phone_number VARCHAR(15),
    graduation_year INTEGER NOT NULL,
    current_semester INTEGER NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL,
    location VARCHAR(100),
    preferred_work_mode VARCHAR(20), -- 'Remote', 'On-site', 'Hybrid'
    preferred_roles VARCHAR(255),
    bio TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    profile_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. education
CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    institution_name VARCHAR(150) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    score_type VARCHAR(10) NOT NULL -- 'CGPA' or 'Percentage'
);

-- 5. skills
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Programming', 'Database', 'Web Development', 'AI/ML', etc.
    description TEXT
);

-- 6. student_skills
CREATE TABLE student_skills (
    student_skill_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
    years_of_experience NUMERIC(3, 1) DEFAULT 0.0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. companies
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(20),
    website_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    headquarters VARCHAR(150),
    description TEXT,
    logo_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. internships
CREATE TABLE internships (
    internship_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    work_mode VARCHAR(20) NOT NULL, -- 'Remote', 'On-site', 'Hybrid'
    internship_type VARCHAR(20) NOT NULL, -- 'Paid', 'Unpaid', 'Performance-based'
    duration INTEGER NOT NULL, -- in months
    stipend_min NUMERIC(10, 2) DEFAULT 0.00,
    stipend_max NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    eligibility_cgpa NUMERIC(4, 2) DEFAULT 0.00,
    application_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    number_of_openings INTEGER NOT NULL DEFAULT 1,
    application_url VARCHAR(255),
    source VARCHAR(50) DEFAULT 'Internal', -- 'Internal' or 'External'
    status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft', 'Open', 'Closed', 'Archived'
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. internship_required_skills
CREATE TABLE internship_required_skills (
    internship_skill_id SERIAL PRIMARY KEY,
    internship_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    importance_level VARCHAR(20) NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    minimum_proficiency VARCHAR(20) NOT NULL DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE
);

-- 10. saved_internships
CREATE TABLE saved_internships (
    saved_internship_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    internship_id INTEGER NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. applications
CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    internship_id INTEGER, -- Nullable for manual external applications
    company_id INTEGER NOT NULL, -- Mandatory, links to company
    external_company_name VARCHAR(100), -- Used if company is not in database (optional reference)
    external_role_title VARCHAR(100), -- Used if internship is not in database (optional reference)
    application_source VARCHAR(50) NOT NULL DEFAULT 'Internal', -- 'Internal', 'LinkedIn', 'Indeed', 'Referral', etc.
    applied_date DATE NOT NULL,
    current_status VARCHAR(30) NOT NULL DEFAULT 'Interested',
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    application_url VARCHAR(255),
    job_reference_id VARCHAR(50),
    expected_stipend NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    next_action VARCHAR(255),
    next_action_date DATE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. application_status_history
CREATE TABLE application_status_history (
    history_id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by INTEGER NOT NULL,
    change_note TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. interviews
CREATE TABLE interviews (
    interview_id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL,
    interview_round INTEGER NOT NULL DEFAULT 1,
    interview_type VARCHAR(30) NOT NULL, -- 'HR', 'Technical', 'Coding', 'Managerial', etc.
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_link VARCHAR(255),
    location VARCHAR(150),
    interviewer_name VARCHAR(100),
    interview_status VARCHAR(20) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Rescheduled', 'Cancelled'
    preparation_notes TEXT,
    feedback_notes TEXT,
    result VARCHAR(20), -- 'Passed', 'Failed', 'Pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. offers
CREATE TABLE offers (
    offer_id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL,
    offered_role VARCHAR(100) NOT NULL,
    stipend_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    start_date DATE NOT NULL,
    end_date DATE,
    work_mode VARCHAR(20) DEFAULT 'On-site',
    location VARCHAR(100),
    offer_deadline DATE,
    offer_status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Accepted', 'Declined', 'Expired'
    offer_letter_path VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. documents
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    application_id INTEGER, -- Nullable, can be general resume or application-specific
    document_type VARCHAR(30) NOT NULL, -- 'Resume', 'Cover Letter', 'Certificate', etc.
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by INTEGER,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 16. reminders
CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    application_id INTEGER,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    reminder_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_type VARCHAR(30) NOT NULL DEFAULT 'Deadline', -- 'Deadline', 'Interview', 'Follow-up'
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL DEFAULT 'System', -- 'System', 'Interview', 'Application', 'Reminder'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. notes
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    application_id INTEGER,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. audit_logs
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INTEGER, -- Nullable for system actions or unregistered users
    action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
