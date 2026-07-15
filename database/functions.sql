-- functions.sql: Creates stored PostgreSQL functions for InternTrack.

-- =========================================================================
-- 1. calculate_profile_completion
-- =========================================================================
CREATE OR REPLACE FUNCTION calculate_profile_completion(student_id_param INT)
RETURNS INTEGER AS $$
DECLARE
    completion INTEGER := 0;
    profile_rec RECORD;
    has_edu BOOLEAN := FALSE;
    has_skills BOOLEAN := FALSE;
BEGIN
    -- Fetch the student profile
    SELECT * INTO profile_rec FROM student_profiles WHERE student_id = student_id_param;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- Basic Information (Maximum 30%)
    IF profile_rec.register_number IS NOT NULL AND profile_rec.register_number <> '' THEN completion := completion + 6; END IF;
    IF profile_rec.department_id IS NOT NULL THEN completion := completion + 6; END IF;
    IF profile_rec.graduation_year IS NOT NULL THEN completion := completion + 6; END IF;
    IF profile_rec.current_semester IS NOT NULL THEN completion := completion + 6; END IF;
    IF profile_rec.cgpa IS NOT NULL AND profile_rec.cgpa > 0.00 THEN completion := completion + 6; END IF;

    -- Additional Details (Maximum 15%)
    IF profile_rec.phone_number IS NOT NULL AND profile_rec.phone_number <> '' THEN completion := completion + 5; END IF;
    IF profile_rec.location IS NOT NULL AND profile_rec.location <> '' THEN completion := completion + 5; END IF;
    IF profile_rec.bio IS NOT NULL AND profile_rec.bio <> '' THEN completion := completion + 5; END IF;

    -- Social links (Maximum 15%)
    IF profile_rec.linkedin_url IS NOT NULL AND profile_rec.linkedin_url <> '' THEN completion := completion + 5; END IF;
    IF profile_rec.github_url IS NOT NULL AND profile_rec.github_url <> '' THEN completion := completion + 5; END IF;
    IF profile_rec.portfolio_url IS NOT NULL AND profile_rec.portfolio_url <> '' THEN completion := completion + 5; END IF;

    -- Education records check (20%)
    SELECT EXISTS(SELECT 1 FROM education WHERE student_id = student_id_param) INTO has_edu;
    IF has_edu THEN
        completion := completion + 20;
    END IF;

    -- Skills check (20%)
    SELECT EXISTS(SELECT 1 FROM student_skills WHERE student_id = student_id_param) INTO has_skills;
    IF has_skills THEN
        completion := completion + 20;
    END IF;

    RETURN completion;
END;
$$ LANGUAGE plpgsql;


-- =========================================================================
-- 2. calculate_skill_match
-- =========================================================================
CREATE OR REPLACE FUNCTION calculate_skill_match(student_id_param INT, internship_id_param INT)
RETURNS NUMERIC AS $$
DECLARE
    total_weight NUMERIC := 0;
    student_weight NUMERIC := 0;
    req_rec RECORD;
    student_prof_val INTEGER;
    req_prof_val INTEGER;
    match_percentage NUMERIC := 0;
BEGIN
    -- Check if internship has any required skills. If none, return 100% match.
    IF NOT EXISTS (SELECT 1 FROM internship_required_skills WHERE internship_id = internship_id_param) THEN
        RETURN 100.00;
    END IF;

    -- Loop through all required skills of the internship
    FOR req_rec IN 
        SELECT 
            irs.skill_id,
            irs.importance_level,
            irs.minimum_proficiency,
            irs.is_mandatory,
            ss.proficiency_level AS student_proficiency
        FROM internship_required_skills irs
        LEFT JOIN student_skills ss ON ss.student_id = student_id_param AND ss.skill_id = irs.skill_id
        WHERE irs.internship_id = internship_id_param
    LOOP
        -- Determine base skill weight
        -- High = 3, Medium = 2, Low = 1
        DECLARE
            base_w INTEGER := 1;
            item_w INTEGER := 1;
        BEGIN
            IF req_rec.importance_level = 'High' THEN
                base_w := 3;
            ELSIF req_rec.importance_level = 'Medium' THEN
                base_w := 2;
            ELSE
                base_w := 1;
            END IF;

            -- Mandatory skills contribute more strongly (doubled weight)
            IF req_rec.is_mandatory THEN
                item_w := base_w * 2;
            ELSE
                item_w := base_w;
            END IF;

            total_weight := total_weight + item_w;

            -- If student has the skill
            IF req_rec.student_proficiency IS NOT NULL THEN
                -- Map student proficiency
                IF req_rec.student_proficiency = 'Advanced' THEN student_prof_val := 3;
                ELSIF req_rec.student_proficiency = 'Intermediate' THEN student_prof_val := 2;
                ELSE student_prof_val := 1;
                END IF;

                -- Map required proficiency
                IF req_rec.minimum_proficiency = 'Advanced' THEN req_prof_val := 3;
                ELSIF req_rec.minimum_proficiency = 'Intermediate' THEN req_prof_val := 2;
                ELSE req_prof_val := 1;
                END IF;

                -- Score calculation
                IF student_prof_val >= req_prof_val THEN
                    -- Exceeds or meets: Full points
                    student_weight := student_weight + item_w;
                ELSE
                    -- Partial match: proportion of proficiency
                    -- e.g., Beginner (1) / Intermediate (2) = 50% score
                    student_weight := student_weight + (item_w * (student_prof_val::NUMERIC / req_prof_val::NUMERIC));
                END IF;
            END IF;
        END;
    END LOOP;

    IF total_weight = 0 THEN
        RETURN 100.00;
    END IF;

    match_percentage := ROUND((student_weight / total_weight) * 100.00, 2);
    RETURN match_percentage;
END;
$$ LANGUAGE plpgsql;


-- =========================================================================
-- 3. is_student_eligible
-- =========================================================================
CREATE OR REPLACE FUNCTION is_student_eligible(student_id_param INT, internship_id_param INT)
RETURNS BOOLEAN AS $$
DECLARE
    student_cgpa NUMERIC(4, 2);
    required_cgpa NUMERIC(4, 2);
    internship_status VARCHAR(20);
    deadline TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Fetch student CGPA
    SELECT cgpa INTO student_cgpa FROM student_profiles WHERE student_id = student_id_param;
    
    -- Fetch internship eligibility criteria
    SELECT eligibility_cgpa, status, application_deadline 
    INTO required_cgpa, internship_status, deadline 
    FROM internships 
    WHERE internship_id = internship_id_param;

    -- If student or internship does not exist, return false
    IF student_cgpa IS NULL OR required_cgpa IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if internship is open and deadline is in the future
    IF internship_status <> 'Open' OR deadline < CURRENT_TIMESTAMP THEN
        RETURN FALSE;
    END IF;

    -- Check CGPA eligibility
    IF student_cgpa >= required_cgpa THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- =========================================================================
-- 4. get_applications_by_status
-- =========================================================================
CREATE OR REPLACE FUNCTION get_applications_by_status(student_id_param INT)
RETURNS TABLE (
    status_name VARCHAR(30),
    app_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        current_status AS status_name,
        COUNT(*) AS app_count
    FROM applications
    WHERE student_id = student_id_param AND is_archived = FALSE
    GROUP BY current_status;
END;
$$ LANGUAGE plpgsql;


-- =========================================================================
-- 5. get_upcoming_deadlines
-- =========================================================================
CREATE OR REPLACE FUNCTION get_upcoming_deadlines(student_id_param INT)
RETURNS TABLE (
    event_category VARCHAR(30),
    event_title VARCHAR(255),
    deadline_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    -- Saved internships closing soon
    SELECT 
        'Saved Internship Deadline'::VARCHAR(30) AS event_category,
        (i.title || ' at ' || c.company_name)::VARCHAR(255) AS event_title,
        i.application_deadline AS deadline_time
    FROM saved_internships si
    JOIN internships i ON si.internship_id = i.internship_id
    JOIN companies c ON i.company_id = c.company_id
    WHERE si.student_id = student_id_param AND i.status = 'Open' AND i.application_deadline >= CURRENT_TIMESTAMP

    UNION ALL

    -- Upcoming Interviews
    SELECT 
        'Scheduled Interview'::VARCHAR(30) AS event_category,
        ('Interview Round ' || intv.interview_round || ' - ' || c.company_name)::VARCHAR(255) AS event_title,
        intv.scheduled_start AS deadline_time
    FROM interviews intv
    JOIN applications a ON intv.application_id = a.application_id
    JOIN companies c ON a.company_id = c.company_id
    WHERE a.student_id = student_id_param AND intv.interview_status IN ('Scheduled', 'Rescheduled') AND intv.scheduled_start >= CURRENT_TIMESTAMP

    UNION ALL

    -- Offer Deadlines
    SELECT 
        'Offer Acceptance Deadline'::VARCHAR(30) AS event_category,
        ('Offer Response - ' || c.company_name)::VARCHAR(255) AS event_title,
        o.offer_deadline::TIMESTAMP WITH TIME ZONE AS deadline_time
    FROM offers o
    JOIN applications a ON o.application_id = a.application_id
    JOIN companies c ON a.company_id = c.company_id
    WHERE a.student_id = student_id_param AND o.offer_status = 'Pending' AND o.offer_deadline >= CURRENT_DATE

    UNION ALL

    -- Pending reminders
    SELECT 
        'Personal Reminder'::VARCHAR(30) AS event_category,
        r.title::VARCHAR(255) AS event_title,
        r.reminder_datetime AS deadline_time
    FROM reminders r
    WHERE r.student_id = student_id_param AND r.is_completed = FALSE AND r.reminder_datetime >= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
