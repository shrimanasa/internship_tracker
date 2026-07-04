-- Validate seed data integrity

SELECT 'users' AS entity, COUNT(*) FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM student_profiles
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'internships', COUNT(*) FROM internships
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'skills', COUNT(*) FROM skills;
