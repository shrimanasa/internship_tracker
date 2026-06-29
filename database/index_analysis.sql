-- Index performance analysis

SELECT schemaname, tablename, indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size,
    idx_scan AS times_used
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Unused indexes
SELECT tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
