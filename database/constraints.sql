-- constraints.sql: Enforces relational constraints, check constraints, and unique indices for InternTrack.

-- ==========================================
-- 1. FOREIGN KEY CONSTRAINTS
-- ==========================================

-- student_profiles references users and departments
ALTER TABLE student_profiles
    ADD CONSTRAINT fk_student_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_student_profile_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT;

-- education references student_profiles
ALTER TABLE education
    ADD CONSTRAINT fk_education_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE;

-- student_skills references student_profiles and skills
ALTER TABLE student_skills
    ADD CONSTRAINT fk_student_skills_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_student_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE RESTRICT;

-- internships references companies and users
ALTER TABLE internships
    ADD CONSTRAINT fk_internships_company FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_internships_creator FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT;

-- internship_required_skills references internships and skills
ALTER TABLE internship_required_skills
    ADD CONSTRAINT fk_required_skills_internship FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_required_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE RESTRICT;

-- saved_internships references student_profiles and internships
ALTER TABLE saved_internships
    ADD CONSTRAINT fk_saved_internships_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_saved_internships_internship FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE;

-- applications references student_profiles, internships, and companies
ALTER TABLE applications
    ADD CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_applications_internship FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_applications_company FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE RESTRICT;

-- application_status_history references applications and users
ALTER TABLE application_status_history
    ADD CONSTRAINT fk_status_history_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_status_history_user FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE RESTRICT;

-- interviews references applications
ALTER TABLE interviews
    ADD CONSTRAINT fk_interviews_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE;

-- offers references applications
ALTER TABLE offers
    ADD CONSTRAINT fk_offers_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE;

-- documents references student_profiles, applications, and users
ALTER TABLE documents
    ADD CONSTRAINT fk_documents_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_documents_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_documents_verifier FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL;

-- reminders references student_profiles and applications
ALTER TABLE reminders
    ADD CONSTRAINT fk_reminders_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_reminders_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE;

-- notifications references users
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- notes references student_profiles and applications
ALTER TABLE notes
    ADD CONSTRAINT fk_notes_student FOREIGN KEY (student_id) REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_notes_application FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE;

-- audit_logs references users
ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL;


-- ==========================================
-- 2. UNIQUE CONSTRAINTS
-- ==========================================

-- User email must be unique
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

-- Department name and code must be unique
ALTER TABLE departments 
    ADD CONSTRAINT uq_departments_name UNIQUE (department_name),
    ADD CONSTRAINT uq_departments_code UNIQUE (department_code);

-- Student register number must be unique, and user_id must be unique (1-to-1 profile)
ALTER TABLE student_profiles 
    ADD CONSTRAINT uq_student_profiles_register UNIQUE (register_number),
    ADD CONSTRAINT uq_student_profiles_user UNIQUE (user_id);

-- Skill name must be unique
ALTER TABLE skills ADD CONSTRAINT uq_skills_name UNIQUE (skill_name);

-- Company name must be unique
ALTER TABLE companies ADD CONSTRAINT uq_companies_name UNIQUE (company_name);

-- Prevent duplicate student and skill combinations
ALTER TABLE student_skills ADD CONSTRAINT uq_student_skills UNIQUE (student_id, skill_id);

-- Prevent duplicate internship and required-skill combinations
ALTER TABLE internship_required_skills ADD CONSTRAINT uq_internship_required_skills UNIQUE (internship_id, skill_id);

-- Prevent duplicate saved internships
ALTER TABLE saved_internships ADD CONSTRAINT uq_saved_internships UNIQUE (student_id, internship_id);

-- Prevent duplicate applications to the SAME internal internship by a student
-- Manual external applications (where internship_id IS NULL) can co-exist
CREATE UNIQUE INDEX uq_student_internship_app ON applications(student_id, internship_id) 
WHERE internship_id IS NOT NULL;


-- ==========================================
-- 3. CHECK CONSTRAINTS
-- ==========================================

-- Users role validation
ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('student', 'admin'));

-- CGPA must be between 0.00 and 10.00, semesters between 1 and 8, graduation year reasonable, and profile completion 0 to 100
ALTER TABLE student_profiles 
    ADD CONSTRAINT chk_student_profiles_cgpa CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    ADD CONSTRAINT chk_student_profiles_semester CHECK (current_semester >= 1 AND current_semester <= 8),
    ADD CONSTRAINT chk_student_profiles_grad_year CHECK (graduation_year >= 2020 AND graduation_year <= 2100),
    ADD CONSTRAINT chk_student_profiles_completion CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100),
    ADD CONSTRAINT chk_student_profiles_work_mode CHECK (preferred_work_mode IN ('Remote', 'On-site', 'Hybrid'));

-- Education: score checks and end year >= start year
ALTER TABLE education 
    ADD CONSTRAINT chk_education_years CHECK (end_year >= start_year),
    ADD CONSTRAINT chk_education_score CHECK (score >= 0.00),
    ADD CONSTRAINT chk_education_score_type CHECK (score_type IN ('CGPA', 'Percentage'));

-- Skills proficiency validation and non-negative years of experience
ALTER TABLE student_skills 
    ADD CONSTRAINT chk_student_skills_proficiency CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced')),
    ADD CONSTRAINT chk_student_skills_exp CHECK (years_of_experience >= 0.0);

-- Internships stipend, mode, type, status, and duration checks
ALTER TABLE internships
    ADD CONSTRAINT chk_internships_stipend CHECK (stipend_min >= 0.00 AND stipend_max >= stipend_min),
    ADD CONSTRAINT chk_internships_work_mode CHECK (work_mode IN ('Remote', 'On-site', 'Hybrid')),
    ADD CONSTRAINT chk_internships_type CHECK (internship_type IN ('Paid', 'Unpaid', 'Performance-based')),
    ADD CONSTRAINT chk_internships_status CHECK (status IN ('Draft', 'Open', 'Closed', 'Archived')),
    ADD CONSTRAINT chk_internships_duration CHECK (duration > 0),
    ADD CONSTRAINT chk_internships_cgpa CHECK (eligibility_cgpa >= 0.00 AND eligibility_cgpa <= 10.00),
    ADD CONSTRAINT chk_internships_openings CHECK (number_of_openings > 0);

-- Required skills levels
ALTER TABLE internship_required_skills
    ADD CONSTRAINT chk_req_skills_importance CHECK (importance_level IN ('Low', 'Medium', 'High')),
    ADD CONSTRAINT chk_req_skills_proficiency CHECK (minimum_proficiency IN ('Beginner', 'Intermediate', 'Advanced'));

-- Application priority and status checks
ALTER TABLE applications
    ADD CONSTRAINT chk_applications_priority CHECK (priority IN ('Low', 'Medium', 'High')),
    ADD CONSTRAINT chk_applications_status CHECK (current_status IN (
        'Interested', 'Saved', 'Applied', 'Under Review', 'Online Assessment',
        'Shortlisted', 'Interview Scheduled', 'Interview Completed',
        'Offer Received', 'Offer Accepted', 'Offer Declined', 'Rejected', 'Withdrawn'
    )),
    ADD CONSTRAINT chk_applications_stipend CHECK (expected_stipend >= 0.00);

-- Interview rounds, status, type, and start/end time validation
ALTER TABLE interviews
    ADD CONSTRAINT chk_interviews_round CHECK (interview_round >= 1),
    ADD CONSTRAINT chk_interviews_status CHECK (interview_status IN ('Scheduled', 'Completed', 'Rescheduled', 'Cancelled')),
    ADD CONSTRAINT chk_interviews_type CHECK (interview_type IN ('HR', 'Technical', 'Coding', 'Managerial', 'Group Discussion', 'Other')),
    ADD CONSTRAINT chk_interviews_result CHECK (result IN ('Passed', 'Failed', 'Pending')),
    ADD CONSTRAINT chk_interviews_time CHECK (scheduled_end > scheduled_start);

-- Offers stipend, status, mode, and dates validation
ALTER TABLE offers
    ADD CONSTRAINT chk_offers_status CHECK (offer_status IN ('Pending', 'Accepted', 'Declined', 'Expired')),
    ADD CONSTRAINT chk_offers_work_mode CHECK (work_mode IN ('Remote', 'On-site', 'Hybrid')),
    ADD CONSTRAINT chk_offers_stipend CHECK (stipend_amount >= 0.00),
    ADD CONSTRAINT chk_offers_dates CHECK (end_date IS NULL OR end_date >= start_date),
    ADD CONSTRAINT chk_offers_deadline CHECK (offer_deadline IS NULL OR offer_deadline <= start_date);

-- Documents verification status, file size, and types
ALTER TABLE documents
    ADD CONSTRAINT chk_documents_status CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')),
    ADD CONSTRAINT chk_documents_size CHECK (file_size > 0),
    ADD CONSTRAINT chk_documents_type CHECK (document_type IN ('Resume', 'Cover Letter', 'Certificate', 'Offer Letter', 'Recommendation Letter', 'Transcript', 'Other'));
