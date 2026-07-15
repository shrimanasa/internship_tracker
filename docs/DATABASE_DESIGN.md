# InternTrack Database Design

This document details the schema design, normalisation analysis, structural constraints, indexing strategies, and database views implemented in the **InternTrack** DBMS project.

---

## 1. Normalisation Analysis (1NF, 2NF, 3NF)

To ensure high data integrity, minimize redundancy, and prevent modification anomalies, the InternTrack schema has been structured to satisfy **Third Normal Form (3NF)**.

### First Normal Form (1NF)
* **Rule**: All table cells contain only atomic (indivisible) values, and there are no repeating groups or multi-valued attributes.
* **Implementation**: 
  * Contact information and preferred roles are stored as atomic fields or structured relations.
  * In `student_profiles`, instead of holding multiple skills in a single text string, we separate them into a relation table `student_skills`.
  * The `education` history is split into independent rows linked to a student ID, rather than nested CSV arrays.

### Second Normal Form (2NF)
* **Rule**: Satisfies 1NF, and all non-key attributes are fully functionally dependent on the entire Primary Key (no partial dependencies on composite keys).
* **Implementation**:
  * In the composite-key join table `student_skills(student_id, skill_id)`, the non-key columns `proficiency_level` and `years_of_experience` describe the *relation* itself (how experienced *this* student is in *this* skill). They do not depend only on `student_id` or only on `skill_id`.
  * The `skills` catalog has its own independent key `skill_id` and tables to avoid duplicate text storage.

### Third Normal Form (3NF)
* **Rule**: Satisfies 2NF, and no non-key attribute is transitively dependent on the Primary Key (no transitive dependencies via other non-key columns).
* **Implementation**:
  * Instead of storing department names directly in the `student_profiles` table (which would create a transitive dependency `student_id -> department_id -> department_name`), we extract department codes and names to a lookup table `departments`. `student_profiles` holds only the foreign key `department_id`.
  * In `applications`, company descriptions and website details are referenced via `company_id` to the `companies` master table, preventing redundancy anomalies when company parameters change.

---

## 2. Integrity Constraints & Domain Constraints

We enforce strong structural constraints directly within the PostgreSQL engine to guarantee relational integrity.

### Primary Keys (PK) and Foreign Keys (FK)
* Every table has an auto-incrementing integer identifier (`SERIAL PRIMARY KEY`).
* Relational dependencies are enforced using `FOREIGN KEY` constraints.
* Referential actions like `ON DELETE CASCADE` are utilized where child records have no independent lifecycle (e.g., deleting a student profile cascades to their `education` records and `student_skills` mapping).

### Check Constraints (CHECK)
Domain constraints are enforced to validate numeric bounds:
```sql
ALTER TABLE student_profiles ADD CONSTRAINT chk_cgpa CHECK (cgpa >= 0.0 AND cgpa <= 10.0);
ALTER TABLE student_profiles ADD CONSTRAINT chk_semester CHECK (current_semester >= 1 AND current_semester <= 8);
ALTER TABLE internships ADD CONSTRAINT chk_stipend CHECK (stipend_max >= stipend_min);
ALTER TABLE required_skills ADD CONSTRAINT chk_importance CHECK (importance_level IN ('High', 'Medium', 'Low'));
```

### Uniqueness Constraints (UNIQUE)
* User emails are restricted via `UNIQUE` index constraints to secure logins.
* Student register numbers (`register_number`) must be unique college-wide.
* `UNIQUE(student_id, internship_id)` in `saved_internships` prevents double-saving the same position.

---

## 3. Query Optimization and Indexing Strategies

Indexes are selectively defined on columns frequently referenced in JOIN conditions, WHERE search criteria, or ORDER BY clauses:

1. **Email Lookup**: Unique B-Tree index on `users(email)` for fast login checks.
2. **Student Identity**: Unique B-Tree index on `student_profiles(register_number)` to prevent student duplication.
3. **Application Pipeline**: Indexes on `applications(student_id)`, `applications(internship_id)`, and `applications(company_id)` to speed up list views on dashboards.
4. **Deadlines & Schedules**: Indexes on `internships(application_deadline)` and `interviews(scheduled_start)` to optimize temporal sorting.

---

## 4. Administrative Database Views

To abstract complex relational aggregates, five core PostgreSQL database views are created:

1. **`student_application_summary`**: Aggregates totals of applied, active, interview, and offer stages per student.
2. **`internship_application_statistics`**: Counts applications, average stipend, and open positions grouped by company.
3. **`upcoming_student_events`**: Merges application deadlines, scheduled interviews, and personal reminders into a single chronological stream.
4. **`student_skill_gap_view`**: Compares mandatory skills of applied internships against the student's listed skills to pinpoint missing qualifications.
5. **`placement_dashboard_summary`**: Provides college-wide placement statistics, including total students, placed count, placement rate, and average stipend.
