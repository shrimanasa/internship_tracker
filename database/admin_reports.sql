-- Admin reporting queries

SELECT sp.graduation_year,
    COUNT(DISTINCT sp.student_id) AS total_students,
    COUNT(DISTINCT CASE WHEN a.current_status = 'Offer Accepted' THEN sp.student_id END) AS placed
FROM student_profiles sp
LEFT JOIN applications a ON sp.student_id = a.student_id
GROUP BY sp.graduation_year
ORDER BY sp.graduation_year DESC;
