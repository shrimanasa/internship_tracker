# DBMS Concepts Implementation Guide

This document maps theoretical Database Management System (DBMS) concepts to their concrete implementations inside the **InternTrack** codebase.

---

## 1. ACID Properties in Action

PostgreSQL guarantees the ACID model for database transactions, which is utilized throughout our application lifecycle:

* **Atomicity**: When creating a student profile, multiple rows must be written across `users`, `student_profiles`, and `education` tables. Under SQLAlchemy's AsyncSession transaction block, if any insert fails (e.g., due to a duplicate register number), the entire transaction is rolled back. No partial records remain.
* **Consistency**: Enforced through constraint checks. For example, if a script attempts to set a student's CGPA to `11.5`, PostgreSQL rejects the write with a constraint violation error, preserving the consistent state of data.
* **Isolation**: Supported using PostgreSQL's default `READ COMMITTED` transaction isolation level. While an administrator is verifying document uploads, changes are invisible to student dashboards until the transaction commits, preventing dirty reads.
* **Durability**: Committed transactions are written to write-ahead logs (WAL) on persistent Docker volumes. Even if the Docker host machine crashes, the data state is fully recovered upon container reboot.

---

## 2. Transaction Control Language (TCL)

In our Python backend codebase (`backend/app/db/session.py` and routers), transaction states are controlled using:

* **`BEGIN`**: Implicitly started when invoking a session block.
* **`COMMIT`**: Executed via `await db.commit()` after all schema queries execute successfully.
* **`ROLLBACK`**: Executed inside `try...except` exception blocks when an error occurs, undoing all pending changes in the current session.

---

## 3. SQL Joins in Database Views

To compile dashboard metrics, our `views.sql` file utilizes different join types to fetch records:

### Inner Join
Used when fetching matching rows from both tables. For example, joining `student_profiles` and `users` to display active profiles:
```sql
SELECT s.student_id, u.full_name 
FROM student_profiles s
JOIN users u ON s.user_id = u.user_id;
```

### Left Outer Join
Used to ensure all students are listed, even if they have zero applications:
```sql
SELECT s.student_id, COUNT(a.application_id)
FROM student_profiles s
LEFT JOIN applications a ON s.student_id = a.student_id
GROUP BY s.student_id;
```

### Right Outer Join / Full Outer Join
Mapped in analytics reports to correlate company listings against student applicant details.

---

## 4. Triggers and Stored Procedures (PL/pgSQL)

We write triggers and procedural code to automate audit logs and validation:

1. **`update_modified_column`**: Automatically updates `updated_at` column timestamps upon row edits.
2. **`validate_application_submission`**: Prevents students from submitting applications if the current date is past the internship deadline, or if they have already applied.
3. **`log_application_status_change`**: Writes status audit logs automatically to `status_history` on state changes.
4. **`notify_interview_scheduled`**: Generates a student notification row automatically whenever an interviewer schedules a round.
5. **`audit_row_changes`**: A generic trigger that audits insert/update/delete operations on student profiles, saving before/after values as JSONB.
