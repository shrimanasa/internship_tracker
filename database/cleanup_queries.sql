-- Cleanup queries for maintenance

-- Delete old read notifications (> 90 days)
DELETE FROM notifications
WHERE is_read = TRUE
  AND created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';

-- Archive old completed applications
UPDATE applications
SET is_archived = TRUE
WHERE current_status IN ('Offer Accepted', 'Offer Declined', 'Rejected', 'Withdrawn')
  AND updated_at < CURRENT_TIMESTAMP - INTERVAL '180 days';
