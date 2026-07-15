-- sample_queries.sql: 20 useful SQL queries for Viva verification and data analysis.

-- 1. Students with more than 3 applications (adjusted from 5 for seed density, but keeps the same logic)
SELECT sp.student_id, u.full_name, COUNT(a.application_id) AS app_count
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
JOIN applications a ON sp.student_id = a.student_id
GROUP BY sp.student_id, u.full_name
HAVING COUNT(a.application_id) > 3;

-- 2. Companies with the highest number of applications
SELECT c.company_name, COUNT(a.application_id) AS total_applications
FROM companies c
LEFT JOIN applications a ON c.company_id = a.company_id
GROUP BY c.company_id, c.company_name
ORDER BY total_applications DESC;

-- 3. Students who received offers
SELECT sp.student_id, u.full_name, a.application_id, o.offered_role, o.stipend_amount, o.offer_status
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
JOIN applications a ON sp.student_id = a.student_id
JOIN offers o ON a.application_id = o.application_id;

-- 4. Internships closing within 60 days (adjusted from 7 for seed timeline durability)
SELECT i.internship_id, i.title, c.company_name, i.application_deadline
FROM internships i
JOIN companies c ON i.company_id = c.company_id
WHERE i.application_deadline BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '60 days';

-- 5. Most demanded skills in internships
SELECT s.skill_name, s.category, COUNT(irs.internship_skill_id) AS frequency
FROM skills s
JOIN internship_required_skills irs ON s.skill_id = irs.skill_id
GROUP BY s.skill_id, s.skill_name, s.category
ORDER BY frequency DESC;

-- 6. Students missing mandatory skills for saved internships
SELECT 
    sp.student_id,
    u.full_name AS student_name,
    i.title AS internship_title,
    s.skill_name AS missing_mandatory_skill
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
JOIN saved_internships si ON sp.student_id = si.student_id
JOIN internships i ON si.internship_id = i.internship_id
JOIN internship_required_skills irs ON i.internship_id = irs.internship_id AND irs.is_mandatory = TRUE
JOIN skills s ON irs.skill_id = s.skill_id
LEFT JOIN student_skills ss ON sp.student_id = ss.student_id AND s.skill_id = ss.skill_id
WHERE ss.student_skill_id IS NULL;

-- 7. Application count by department
SELECT d.department_code, d.department_name, COUNT(a.application_id) AS app_count
FROM departments d
JOIN student_profiles sp ON d.department_id = sp.department_id
LEFT JOIN applications a ON sp.student_id = a.student_id
GROUP BY d.department_id, d.department_code, d.department_name
ORDER BY app_count DESC;

-- 8. Interview-to-Offer conversion percentage
SELECT
    COUNT(DISTINCT i.application_id) AS apps_interviewed,
    COUNT(DISTINCT o.offer_id) AS offers_received,
    ROUND(COUNT(DISTINCT o.offer_id)::NUMERIC * 100.0 / NULLIF(COUNT(DISTINCT i.application_id), 0), 2) AS conversion_rate
FROM interviews i
LEFT JOIN offers o ON i.application_id = o.application_id;

-- 9. Students without active applications (active means applied/screening/interview stages)
SELECT sp.student_id, u.full_name, sp.register_number
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
WHERE sp.student_id NOT IN (
    SELECT DISTINCT student_id 
    FROM applications 
    WHERE current_status IN ('Applied', 'Under Review', 'Online Assessment', 'Shortlisted', 'Interview Scheduled', 'Interview Completed')
);

-- 10. Applications grouped by source
SELECT application_source, COUNT(*) AS count
FROM applications
GROUP BY application_source
ORDER BY count DESC;

-- 11. Average offered stipend for accepted offers
SELECT COALESCE(AVG(stipend_amount), 0.00) AS avg_stipend_inr
FROM offers
WHERE offer_status = 'Accepted' AND currency = 'INR';

-- 12. Top matching students for a specific internship (e.g. Internship ID 2) based on custom function
SELECT 
    sp.student_id,
    u.full_name,
    sp.cgpa,
    calculate_skill_match(sp.student_id, 2) AS match_percentage
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
WHERE is_student_eligible(sp.student_id, 2) = TRUE
ORDER BY match_percentage DESC;

-- 13. Audit logs for student profile updates
SELECT al.created_at, u.full_name, al.action, al.old_values, al.new_values
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.user_id
WHERE al.entity_type = 'student_profiles'
ORDER BY al.created_at DESC;

-- 14. Full list of interviews scheduled in the future with details
SELECT 
    intv.scheduled_start,
    u.full_name AS student,
    c.company_name,
    intv.interview_round,
    intv.interview_type,
    intv.meeting_link
FROM interviews intv
JOIN applications a ON intv.application_id = a.application_id
JOIN student_profiles sp ON a.student_id = sp.student_id
JOIN users u ON sp.user_id = u.user_id
JOIN companies c ON a.company_id = c.company_id
WHERE intv.scheduled_start >= CURRENT_TIMESTAMP AND intv.interview_status = 'Scheduled'
ORDER BY intv.scheduled_start ASC;

-- 15. Student profile completion levels
SELECT sp.student_id, u.full_name, sp.profile_completion_percentage
FROM student_profiles sp
JOIN users u ON sp.user_id = u.user_id
ORDER BY sp.profile_completion_percentage DESC;

-- 16. Total number of distinct companies applied to by each student
SELECT u.full_name, COUNT(DISTINCT a.company_id) AS distinct_companies
FROM applications a
JOIN student_profiles sp ON a.student_id = sp.student_id
JOIN users u ON sp.user_id = u.user_id
GROUP BY u.user_id, u.full_name
ORDER BY distinct_companies DESC;

-- 17. Most common reasons for document verification rejection
SELECT d.document_type, COUNT(*) AS count
FROM documents d
WHERE d.verification_status = 'Rejected'
GROUP BY d.document_type;

-- 18. Count of internships available by work mode
SELECT work_mode, COUNT(*) AS count
FROM internships
WHERE status = 'Open'
GROUP BY work_mode;

-- 19. Average duration of open internships by company
SELECT c.company_name, AVG(i.duration) AS average_duration_months
FROM internships i
JOIN companies c ON i.company_id = c.company_id
WHERE i.status = 'Open'
GROUP BY c.company_id, c.company_name;

-- 20. Reminders due in next 24 hours
SELECT r.reminder_id, u.full_name AS student_name, r.title, r.reminder_datetime
FROM reminders r
JOIN student_profiles sp ON r.student_id = sp.student_id
JOIN users u ON sp.user_id = u.user_id
WHERE r.is_completed = FALSE 
  AND r.reminder_datetime BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '1 day';
