-- integrity_checks.sql: Data integrity validation queries
-- Run periodically or before reports to detect orphaned/inconsistent data.

-- 1. Find applications referencing non-existent students
SELECT a.application_id, a.student_id
FROM applications a
LEFT JOIN student_profiles sp ON a.student_id = sp.student_id
WHERE sp.student_id IS NULL;

-- 2. Find student profiles without a linked user account
SELECT sp.student_id, sp.register_number
FROM student_profiles sp
LEFT JOIN users u ON sp.user_id = u.user_id
WHERE u.user_id IS NULL;

-- 3. Find offers without a valid application
SELECT o.offer_id, o.application_id
FROM offers o
LEFT JOIN applications a ON o.application_id = a.application_id
WHERE a.application_id IS NULL;

-- 4. Detect applications with status 'Offer Accepted' but no offer record
SELECT a.application_id, a.current_status
FROM applications a
LEFT JOIN offers o ON a.application_id = o.application_id
WHERE a.current_status IN ('Offer Received', 'Offer Accepted', 'Offer Declined')
  AND o.offer_id IS NULL;

-- 5. Check for duplicate student registrations (same register_number)
SELECT register_number, COUNT(*) AS duplicate_count
FROM student_profiles
GROUP BY register_number
HAVING COUNT(*) > 1;

-- 6. Verify all interviews are linked to valid applications
SELECT i.interview_id, i.application_id
FROM interviews i
LEFT JOIN applications a ON i.application_id = a.application_id
WHERE a.application_id IS NULL;

-- 7. Check for skills with no category assigned
SELECT skill_id, skill_name
FROM skills
WHERE skill_category IS NULL OR skill_category = '';

-- 8. Find internships past deadline that are still marked 'Open'
SELECT internship_id, title, application_deadline
FROM internships
WHERE status = 'Open'
  AND application_deadline < CURRENT_DATE;
