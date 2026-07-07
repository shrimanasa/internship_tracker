-- Extended analytics queries

-- Application funnel conversion rates
WITH funnel AS (
    SELECT
        COUNT(*) AS total,
        COUNT(CASE WHEN current_status NOT IN ('Interested') THEN 1 END) AS applied,
        COUNT(CASE WHEN current_status IN ('Interview Scheduled', 'Interview Completed', 'Offer Received', 'Offer Accepted') THEN 1 END) AS interviewed,
        COUNT(CASE WHEN current_status IN ('Offer Received', 'Offer Accepted') THEN 1 END) AS offered,
        COUNT(CASE WHEN current_status = 'Offer Accepted' THEN 1 END) AS accepted
    FROM applications
    WHERE is_archived = FALSE
)
SELECT
    total,
    applied,
    ROUND(applied::NUMERIC / NULLIF(total, 0) * 100, 1) AS apply_rate,
    interviewed,
    ROUND(interviewed::NUMERIC / NULLIF(applied, 0) * 100, 1) AS interview_rate,
    offered,
    ROUND(offered::NUMERIC / NULLIF(interviewed, 0) * 100, 1) AS offer_rate,
    accepted,
    ROUND(accepted::NUMERIC / NULLIF(offered, 0) * 100, 1) AS accept_rate
FROM funnel;
