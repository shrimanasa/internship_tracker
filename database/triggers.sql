-- triggers.sql: Define custom triggers for auditing, auto-timestamps, status logging, notifications, and validations.

-- =========================================================================
-- 1. Auto-update Timestamp Trigger
-- =========================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at column
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_student_profiles_modtime BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_internships_modtime BEFORE UPDATE ON internships FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_applications_modtime BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_interviews_modtime BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_offers_modtime BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_notes_modtime BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_modified_column();


-- =========================================================================
-- 2. Validate Application Submission (Enforces boundaries & prevents duplicates)
-- =========================================================================
CREATE OR REPLACE FUNCTION validate_application_submission()
RETURNS TRIGGER AS $$
DECLARE
    int_deadline TIMESTAMP WITH TIME ZONE;
    int_status VARCHAR(20);
    exists_count INTEGER;
BEGIN
    -- Only validate if it's an internal internship posting
    IF NEW.internship_id IS NOT NULL THEN
        -- Fetch deadline and status
        SELECT application_deadline, status INTO int_deadline, int_status
        FROM internships
        WHERE internship_id = NEW.internship_id;

        -- Enforce deadline checks
        IF int_deadline < CURRENT_TIMESTAMP OR int_status <> 'Open' THEN
            RAISE EXCEPTION 'Cannot apply: This internship is either closed or the application deadline has passed.';
        END IF;

        -- Enforce duplicate application check
        SELECT COUNT(*) INTO exists_count
        FROM applications
        WHERE student_id = NEW.student_id AND internship_id = NEW.internship_id;

        IF exists_count > 0 THEN
            RAISE EXCEPTION 'Duplicate application: You have already applied for this internship.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_application
BEFORE INSERT ON applications
FOR EACH ROW EXECUTE FUNCTION validate_application_submission();


-- =========================================================================
-- 3. Application Status History Logging
-- =========================================================================
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
    student_user_id INTEGER;
    changed_by_user INTEGER;
BEGIN
    -- Retrieve user_id of student who owns this application
    SELECT user_id INTO student_user_id
    FROM student_profiles
    WHERE student_id = NEW.student_id;

    -- If a specific user is set in database session variable, use it. Otherwise, default to the student user.
    BEGIN
        changed_by_user := NULLIF(current_setting('app.current_user_id', true), '')::INT;
    EXCEPTION WHEN OTHERS THEN
        changed_by_user := NULL;
    END;

    IF changed_by_user IS NULL THEN
        changed_by_user := student_user_id;
    END IF;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, change_note)
        VALUES (NEW.application_id, NULL, NEW.current_status, changed_by_user, 'Application initial status');
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.current_status IS DISTINCT FROM NEW.current_status THEN
            INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, change_note)
            VALUES (NEW.application_id, OLD.current_status, NEW.current_status, changed_by_user, 'Application status updated to ' || NEW.current_status);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_application_status
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION log_application_status_change();


-- =========================================================================
-- 4. Notification trigger for Scheduled Interviews
-- =========================================================================
CREATE OR REPLACE FUNCTION notify_interview_scheduled()
RETURNS TRIGGER AS $$
DECLARE
    student_user_id INTEGER;
    company_name_val VARCHAR(100);
    role_title_val VARCHAR(100);
BEGIN
    -- Fetch student user_id and company/role names
    SELECT sp.user_id, c.company_name, COALESCE(a.external_role_title, i.title, 'Internship') 
    INTO student_user_id, company_name_val, role_title_val
    FROM applications a
    JOIN student_profiles sp ON a.student_id = sp.student_id
    JOIN companies c ON a.company_id = c.company_id
    LEFT JOIN internships i ON a.internship_id = i.internship_id
    WHERE a.application_id = NEW.application_id;

    IF student_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, notification_type, related_entity_type, related_entity_id)
        VALUES (
            student_user_id,
            'Interview Scheduled',
            'Your interview round ' || NEW.interview_round || ' (' || NEW.interview_type || ') for ' || role_title_val || ' at ' || company_name_val || ' has been scheduled on ' || TO_CHAR(NEW.scheduled_start, 'DD-Mon-YYYY HH:MI AM'),
            'Interview',
            'Interview',
            NEW.interview_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_interview
AFTER INSERT ON interviews
FOR EACH ROW WHEN (NEW.interview_status = 'Scheduled')
EXECUTE FUNCTION notify_interview_scheduled();


-- =========================================================================
-- 5. Generic Row Auditing Trigger for critical tables (student_profiles, offers, documents)
-- =========================================================================
CREATE OR REPLACE FUNCTION audit_row_changes()
RETURNS TRIGGER AS $$
DECLARE
    user_id_val INT;
    ent_id INT;
BEGIN
    -- Get current user from session variable if possible
    BEGIN
        user_id_val := NULLIF(current_setting('app.current_user_id', true), '')::INT;
    EXCEPTION WHEN OTHERS THEN
        user_id_val := NULL;
    END;

    IF TG_OP = 'INSERT' THEN
        -- Extract primary key value dynamically based on table name
        IF TG_TABLE_NAME = 'student_profiles' THEN ent_id := NEW.student_id;
        ELSIF TG_TABLE_NAME = 'offers' THEN ent_id := NEW.offer_id;
        ELSIF TG_TABLE_NAME = 'documents' THEN ent_id := NEW.document_id;
        ELSE ent_id := 0;
        END IF;

        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (user_id_val, 'CREATE', TG_TABLE_NAME, ent_id, row_to_json(NEW)::jsonb);
        
    ELSIF TG_OP = 'UPDATE' THEN
        IF TG_TABLE_NAME = 'student_profiles' THEN ent_id := NEW.student_id;
        ELSIF TG_TABLE_NAME = 'offers' THEN ent_id := NEW.offer_id;
        ELSIF TG_TABLE_NAME = 'documents' THEN ent_id := NEW.document_id;
        ELSE ent_id := 0;
        END IF;

        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (user_id_val, 'UPDATE', TG_TABLE_NAME, ent_id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'student_profiles' THEN ent_id := OLD.student_id;
        ELSIF TG_TABLE_NAME = 'offers' THEN ent_id := OLD.offer_id;
        ELSIF TG_TABLE_NAME = 'documents' THEN ent_id := OLD.document_id;
        ELSE ent_id := 0;
        END IF;

        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (user_id_val, 'DELETE', TG_TABLE_NAME, ent_id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_student_profiles AFTER INSERT OR UPDATE OR DELETE ON student_profiles FOR EACH ROW EXECUTE FUNCTION audit_row_changes();
CREATE TRIGGER audit_offers AFTER INSERT OR UPDATE OR DELETE ON offers FOR EACH ROW EXECUTE FUNCTION audit_row_changes();
CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON documents FOR EACH ROW EXECUTE FUNCTION audit_row_changes();
