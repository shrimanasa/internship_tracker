-- procedures.sql: Stored procedures for automated business logic

-- Generate reminder notifications for applications with upcoming deadlines
-- This procedure finds applications where next_action_date is within N days
-- and creates notification records for the owning students.
CREATE OR REPLACE FUNCTION generate_deadline_reminders(days_ahead INTEGER DEFAULT 3)
RETURNS INTEGER AS $$
DECLARE
    reminder_count INTEGER := 0;
    app_record RECORD;
BEGIN
    FOR app_record IN
        SELECT
            a.application_id,
            a.student_id,
            sp.user_id,
            a.next_action,
            a.next_action_date,
            COALESCE(c.company_name, a.external_company_name, 'Unknown') AS company_name
        FROM applications a
        JOIN student_profiles sp ON a.student_id = sp.student_id
        LEFT JOIN companies c ON a.company_id = c.company_id
        WHERE a.next_action_date IS NOT NULL
          AND a.next_action_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + days_ahead)
          AND a.current_status NOT IN ('Rejected', 'Withdrawn', 'Offer Accepted', 'Offer Declined')
          AND NOT EXISTS (
              SELECT 1 FROM notifications n
              WHERE n.user_id = sp.user_id
                AND n.notification_type = 'deadline_reminder'
                AND n.message LIKE '%' || a.application_id || '%'
                AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
          )
    LOOP
        INSERT INTO notifications (user_id, message, notification_type, is_read, created_at)
        VALUES (
            app_record.user_id,
            'Upcoming deadline for ' || app_record.company_name || ': ' ||
            COALESCE(app_record.next_action, 'Action required') || ' on ' ||
            app_record.next_action_date || ' (App #' || app_record.application_id || ')',
            'deadline_reminder',
            FALSE,
            NOW()
        );
        reminder_count := reminder_count + 1;
    END LOOP;

    RETURN reminder_count;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT generate_deadline_reminders(3);  -- Generates reminders for next 3 days
-- Can be scheduled via pg_cron or called from the backend on a timer.
