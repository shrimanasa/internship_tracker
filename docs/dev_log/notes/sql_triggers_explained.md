# PostgreSQL Triggers

## Audit Log Trigger
- Fires on INSERT/UPDATE/DELETE
- Captures old + new row values as JSONB
- Stores in audit_logs table
- Records user ID and timestamp

## Status History Trigger
- Fires on UPDATE of applications.current_status
- Creates record in application_status_history
- Tracks old_status -> new_status transition

## Profile Completion Trigger
- Fires on UPDATE of student_profiles
- Calls calculate_profile_completion() function
- Updates profile_completion_percentage column
