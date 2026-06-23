-- skill_categories.sql: Skill taxonomy reference

SELECT skill_category, COUNT(*) AS skill_count
FROM skills
GROUP BY skill_category
ORDER BY skill_count DESC;

-- Skills with most student proficiency
SELECT
    s.skill_name,
    s.skill_category,
    COUNT(ss.student_skill_id) AS students_with_skill,
    ROUND(AVG(CASE
        WHEN ss.proficiency_level = 'Beginner' THEN 1
        WHEN ss.proficiency_level = 'Intermediate' THEN 2
        WHEN ss.proficiency_level = 'Advanced' THEN 3
    END), 1) AS avg_proficiency
FROM skills s
LEFT JOIN student_skills ss ON s.skill_id = ss.skill_id
GROUP BY s.skill_name, s.skill_category
ORDER BY students_with_skill DESC;
