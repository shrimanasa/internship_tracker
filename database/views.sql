-- views.sql: Creates SQL views to aggregate metrics and simplify analytics queries.

-- =========================================================================
-- 1. student_application_summary
-- =========================================================================
CREATE OR REPLACE VIEW student_application_summary AS
SELECT
    sp.student_id,
    u.full_name AS student_name,
    sp.register_number,
    d.department_code,
    COUNT(a.application_id) AS total_applications,
    COUNT(CASE WHEN a.current_status IN ('Applied', 'Under Review', 'Online Assessment', 'Shortlisted', 'Interview Scheduled', 'Interview Completed') THEN 1 END) AS active_applications,
    COUNT(CASE WHEN a.current_status IN ('Interview Scheduled', 'Interview Completed') THEN 1 END) AS total_interviews,
    COUNT(CASE WHEN a.current_status IN ('Offer Received', 'Offer Accepted') THEN 1 END) AS total_offers,
    COUNT(CASE WHEN a.current_status = 'Rejected' THEN 1 END) AS total_rejections
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
JOIN departments d ON sp.department_id = d.department_id
LEFT JOIN applications a ON sp.student_id = a.student_id
GROUP BY sp.student_id, u.full_name, sp.register_number, d.department_code;


-- =========================================================================
-- 2. internship_application_statistics
-- =========================================================================
CREATE OR REPLACE VIEW internship_application_statistics AS
SELECT
    i.internship_id,
    i.title AS internship_title,
    c.company_name,
    i.status AS internship_status,
    COUNT(a.application_id) AS total_applicants,
    COUNT(CASE WHEN a.current_status IN ('Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Offer Received', 'Offer Accepted') THEN 1 END) AS shortlisted_applicants,
    COUNT(CASE WHEN a.current_status IN ('Interview Scheduled', 'Interview Completed') OR EXISTS (
        SELECT 1 FROM interviews intv WHERE intv.application_id = a.application_id
    ) THEN 1 END) AS interviewed_applicants,
    COUNT(CASE WHEN a.current_status IN ('Offer Received', 'Offer Accepted', 'Offer Declined') THEN 1 END) AS offers_issued
FROM internships i
JOIN companies c ON i.company_id = c.company_id
LEFT JOIN applications a ON i.internship_id = a.internship_id
GROUP BY i.internship_id, i.title, c.company_name, i.status;


-- =========================================================================
-- 3. upcoming_student_events
-- =========================================================================
CREATE OR REPLACE VIEW upcoming_student_events AS
-- Upcoming Interviews
SELECT
    a.student_id,
    'Interview'::VARCHAR(30) AS event_type,
    ('Round ' || i.interview_round || ' Interview with ' || c.company_name)::VARCHAR(255) AS event_title,
    i.scheduled_start AS event_datetime,
    a.application_id AS related_entity_id,
    ('Type: ' || i.interview_type || ' | Link: ' || COALESCE(i.meeting_link, 'N/A'))::TEXT AS details
FROM interviews i
JOIN applications a ON i.application_id = a.application_id
JOIN companies c ON a.company_id = c.company_id
WHERE i.scheduled_start >= CURRENT_TIMESTAMP AND i.interview_status IN ('Scheduled', 'Rescheduled')

UNION ALL

-- Application Next Action Follow-ups
SELECT
    a.student_id,
    'Follow-up'::VARCHAR(30) AS event_type,
    ('Follow-up: ' || COALESCE(a.external_role_title, 'Internship') || ' at ' || c.company_name)::VARCHAR(255) AS event_title,
    a.next_action_date::TIMESTAMP WITH TIME ZONE AS event_datetime,
    a.application_id AS related_entity_id,
    ('Action: ' || COALESCE(a.next_action, 'Status Check') || ' | Notes: ' || COALESCE(a.notes, 'N/A'))::TEXT AS details
FROM applications a
JOIN companies c ON a.company_id = c.company_id
WHERE a.next_action_date >= CURRENT_DATE AND a.is_archived = FALSE AND a.current_status NOT IN ('Offer Accepted', 'Offer Declined', 'Rejected', 'Withdrawn')

UNION ALL

-- Offer Deadlines
SELECT
    a.student_id,
    'Offer Deadline'::VARCHAR(30) AS event_type,
    ('Respond to offer from ' || c.company_name)::VARCHAR(255) AS event_title,
    o.offer_deadline::TIMESTAMP WITH TIME ZONE AS event_datetime,
    a.application_id AS related_entity_id,
    ('Role: ' || o.offered_role || ' | Stipend: ' || o.stipend_amount || ' ' || o.currency)::TEXT AS details
FROM offers o
JOIN applications a ON o.application_id = a.application_id
JOIN companies c ON a.company_id = c.company_id
WHERE o.offer_deadline >= CURRENT_DATE AND o.offer_status = 'Pending'

UNION ALL

-- General/Deadline Reminders
SELECT
    r.student_id,
    'Reminder'::VARCHAR(30) AS event_type,
    r.title::VARCHAR(255) AS event_title,
    r.reminder_datetime AS event_datetime,
    r.application_id AS related_entity_id,
    r.description::TEXT AS details
FROM reminders r
WHERE r.reminder_datetime >= CURRENT_TIMESTAMP AND r.is_completed = FALSE;


-- =========================================================================
-- 4. student_skill_gap_view
-- =========================================================================
CREATE OR REPLACE VIEW student_skill_gap_view AS
WITH proficiency_map AS (
    SELECT 'Beginner' AS label, 1 AS val
    UNION ALL SELECT 'Intermediate', 2
    UNION ALL SELECT 'Advanced', 3
)
SELECT
    sp.student_id,
    u.full_name AS student_name,
    i.internship_id,
    i.title AS internship_title,
    c.company_name,
    s.skill_id,
    s.skill_name,
    irs.importance_level,
    irs.is_mandatory,
    irs.minimum_proficiency AS required_proficiency,
    ss.proficiency_level AS student_proficiency,
    CASE 
        WHEN ss.student_skill_id IS NULL THEN 'Missing Skill'
        WHEN pm_student.val < pm_req.val THEN 'Proficiency Gap'
        ELSE 'Matched'
    END AS gap_status
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
CROSS JOIN internships i
JOIN companies c ON i.company_id = c.company_id
JOIN internship_required_skills irs ON i.internship_id = irs.internship_id
JOIN skills s ON irs.skill_id = s.skill_id
JOIN proficiency_map pm_req ON irs.minimum_proficiency = pm_req.label
LEFT JOIN student_skills ss ON sp.student_id = ss.student_id AND s.skill_id = ss.skill_id
LEFT JOIN proficiency_map pm_student ON ss.proficiency_level = pm_student.label;


-- =========================================================================
-- 5. placement_dashboard_summary
-- =========================================================================
CREATE OR REPLACE VIEW placement_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM student_profiles) AS total_students,
    (SELECT COUNT(*) FROM student_profiles WHERE student_id IN (
        SELECT student_id FROM applications WHERE current_status = 'Offer Accepted'
    )) AS placed_students,
    ROUND(
        (SELECT COUNT(*) FROM student_profiles WHERE student_id IN (
            SELECT student_id FROM applications WHERE current_status = 'Offer Accepted'
        ))::NUMERIC * 100.0 / NULLIF((SELECT COUNT(*) FROM student_profiles), 0), 2
    ) AS placement_rate,
    (SELECT COUNT(*) FROM companies WHERE is_active = TRUE) AS active_companies,
    (SELECT COUNT(*) FROM internships WHERE status = 'Open') AS open_internships,
    (SELECT COUNT(*) FROM applications) AS total_applications,
    (SELECT COUNT(*) FROM interviews WHERE interview_status = 'Scheduled') AS pending_interviews,
    (SELECT COALESCE(AVG(stipend_amount), 0.00) FROM offers WHERE offer_status = 'Accepted') AS average_placed_stipend;
