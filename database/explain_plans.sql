-- EXPLAIN ANALYZE for key queries

-- Internship listing with filters
EXPLAIN ANALYZE
SELECT i.*, c.company_name
FROM internships i
JOIN companies c ON i.company_id = c.company_id
WHERE i.status = 'Open'
ORDER BY i.application_deadline ASC
LIMIT 20;

-- Application listing for student
EXPLAIN ANALYZE
SELECT a.*, c.company_name
FROM applications a
JOIN companies c ON a.company_id = c.company_id
WHERE a.student_id = 1
  AND a.is_archived = FALSE
ORDER BY a.updated_at DESC;
