-- analytical_queries.sql: Advanced analytical queries for placement trend analysis
-- These queries demonstrate window functions, CTEs, and aggregate reporting.

-- 1. Monthly Application Trend Analysis
-- Shows the number of applications submitted per month with running total
SELECT
    DATE_TRUNC('month', applied_date) AS month,
    COUNT(*) AS monthly_count,
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', applied_date)) AS cumulative_total
FROM applications
GROUP BY DATE_TRUNC('month', applied_date)
ORDER BY month;

-- 2. Top 5 Companies by Application Volume with Acceptance Rate
SELECT
    c.company_name,
    COUNT(a.application_id) AS total_applications,
    COUNT(CASE WHEN a.current_status = 'Offer Accepted' THEN 1 END) AS accepted,
    ROUND(
        COUNT(CASE WHEN a.current_status = 'Offer Accepted' THEN 1 END)::NUMERIC /
        NULLIF(COUNT(a.application_id), 0) * 100, 2
    ) AS acceptance_rate_pct
FROM companies c
JOIN applications a ON c.company_id = a.company_id
GROUP BY c.company_name
ORDER BY total_applications DESC
LIMIT 5;

-- 3. Student Skill Gap Report (CTE)
-- Identifies the most commonly missing skills across all applications
WITH required AS (
    SELECT s.skill_name, COUNT(*) AS demand_count
    FROM internship_required_skills irs
    JOIN skills s ON irs.skill_id = s.skill_id
    GROUP BY s.skill_name
),
supplied AS (
    SELECT s.skill_name, COUNT(DISTINCT ss.student_id) AS student_count
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.skill_id
    GROUP BY s.skill_name
)
SELECT
    r.skill_name,
    r.demand_count AS required_by_internships,
    COALESCE(sp.student_count, 0) AS students_with_skill,
    r.demand_count - COALESCE(sp.student_count, 0) AS skill_gap
FROM required r
LEFT JOIN supplied sp ON r.skill_name = sp.skill_name
ORDER BY skill_gap DESC;

-- 4. Department-wise Placement Statistics using Window Functions
SELECT
    d.department_name,
    COUNT(DISTINCT sp.student_id) AS total_students,
    COUNT(DISTINCT CASE WHEN a.current_status = 'Offer Accepted' THEN sp.student_id END) AS placed_students,
    ROUND(
        COUNT(DISTINCT CASE WHEN a.current_status = 'Offer Accepted' THEN sp.student_id END)::NUMERIC /
        NULLIF(COUNT(DISTINCT sp.student_id), 0) * 100, 2
    ) AS placement_rate,
    RANK() OVER (
        ORDER BY COUNT(DISTINCT CASE WHEN a.current_status = 'Offer Accepted' THEN sp.student_id END) DESC
    ) AS department_rank
FROM departments d
JOIN student_profiles sp ON d.department_id = sp.department_id
LEFT JOIN applications a ON sp.student_id = a.student_id
GROUP BY d.department_name;

-- 5. Average Stipend by Work Mode (Pivot-style)
SELECT
    work_mode,
    COUNT(*) AS offer_count,
    ROUND(AVG(stipend_amount), 2) AS avg_stipend,
    MIN(stipend_amount) AS min_stipend,
    MAX(stipend_amount) AS max_stipend
FROM offers
GROUP BY work_mode
ORDER BY avg_stipend DESC;
