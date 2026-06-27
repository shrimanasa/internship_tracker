-- Document management statistics

SELECT
    document_type,
    COUNT(*) AS total,
    COUNT(CASE WHEN verification_status = 'Verified' THEN 1 END) AS verified
FROM documents
GROUP BY document_type
ORDER BY total DESC;
