-- Audit log analysis queries

SELECT table_name, action_type,
    COUNT(*) AS changes,
    MIN(changed_at) AS first_change,
    MAX(changed_at) AS last_change
FROM audit_logs
GROUP BY table_name, action_type
ORDER BY changes DESC;

-- Recent changes by user
SELECT u.full_name, al.table_name, al.action_type,
    al.changed_at
FROM audit_logs al
JOIN users u ON al.changed_by = u.user_id
ORDER BY al.changed_at DESC
LIMIT 50;
