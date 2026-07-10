-- Fix stale data scripts

-- Update internships past deadline to 'Closed'
UPDATE internships
SET status = 'Closed'
WHERE status = 'Open'
  AND application_deadline < CURRENT_DATE;

-- Expire old pending offers (30+ days)
UPDATE offers
SET offer_status = 'Expired'
WHERE offer_status = 'Pending'
  AND response_deadline < CURRENT_DATE;
