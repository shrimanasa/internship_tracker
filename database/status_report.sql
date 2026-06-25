-- status_report.sql: Pipeline health report

SELECT
    current_status,
    COUNT(*) AS count,
    ROUND(COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER () * 100, 1) AS pct
FROM applications
WHERE is_archived = FALSE
GROUP BY current_status
ORDER BY count DESC;
