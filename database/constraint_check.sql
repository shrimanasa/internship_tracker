-- Verify constraint violations

-- Check CGPA out of range
SELECT student_id, cgpa
FROM student_profiles
WHERE cgpa < 0 OR cgpa > 10;

-- Check invalid application statuses
SELECT application_id, current_status
FROM applications
WHERE current_status NOT IN (
    'Interested', 'Applied', 'Under Review',
    'OA Received', 'OA Completed',
    'Interview Scheduled', 'Interview Completed',
    'Offer Received', 'Offer Accepted', 'Offer Declined',
    'Rejected', 'Withdrawn', 'Joining Confirmed'
);
