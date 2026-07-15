# InternTrack DBMS Viva Questions & Project Guide

This guide is prepared to help you ace your college DBMS laboratory viva-voce examination for the **InternTrack** project.

---

## 1. Project Overview & Architecture

**InternTrack** is a college DBMS project designed as a complete, functional, database-driven web application. It helps students manage their internship pipeline while allowing placement administrators to track compliance and audit changes.

### Tech Stack Architecture
* **Frontend**: Next.js (TypeScript) + Tailwind CSS + Recharts (rendered in SPA mode to prevent page reload blinks).
* **Backend**: FastAPI (Python) + SQLAlchemy (AsyncSession ORM) + Pydantic.
* **Database**: PostgreSQL (relational DBMS storing tables, constraints, triggers, functions, and views).
* **Orchestration**: Docker & Docker Compose.

---

## 2. Relational Schema & Normalization

* **Tables**: 19 tables in total (users, departments, profiles, education, skills, student_skills, companies, internships, required_skills, applications, status_history, interviews, offers, documents, reminders, notifications, notes, audit_logs).
* **Normalisation**: Fully normalised up to **3NF** to prevent insert/update/delete anomalies.
  * *1NF*: Atomic values only (e.g., individual skill rows instead of CSV strings).
  * *2NF*: No partial dependencies (e.g., in `student_skills`, experience depends on the composite PK `(student_id, skill_id)`).
  * *3NF*: No transitive dependencies (e.g., department codes are extracted to `departments` instead of redundant text in `student_profiles`).

---

## 3. Procedural SQL (PL/pgSQL) Features

Our database does not just store data; it actively processes logic using:
1. **Views**: Aggregated reports like `student_skill_gap_view` comparing student skills vs required internship skills.
2. **Functions**: `calculate_skill_match` weight-based matching algorithm (Mandatory skill mismatch reduces score; matching adds percentage weight).
3. **Triggers**:
  * `validate_application_submission` checks deadlines and duplicate applications.
  * `audit_row_changes` logs modifications (INSERT, UPDATE, DELETE) on profiles, saving history into `audit_logs` as JSONB.

---

## 4. Key Viva Questions & Answers

### Q1: What is the difference between SQL and NoSQL databases? Why did you choose PostgreSQL?
* **Answer**: SQL databases are relational, structured, schema-bound, and guarantee strict ACID compliance, making them perfect for financial, billing, or student records. NoSQL databases are document or key-value stores (e.g., MongoDB), which scale horizontally easily but sacrifice schema consistency.
* We chose PostgreSQL because **InternTrack** requires relational integrity (e.g., a student application cannot exist without a valid student and internship ID) and advanced features like PL/pgSQL triggers, constraints, and audit log generation.

### Q2: What is the purpose of database indexes? How do B-Trees work?
* **Answer**: Indexes speed up data retrieval queries at the cost of slower write operations and extra storage.
* PostgreSQL uses **B-Tree indexes** by default. A B-Tree is a self-balancing search tree that keeps data sorted and allows logarithmic time search, insertion, and deletion. It minimizes disk I/O operations by storing a large number of keys in each node.

### Q3: What is the difference between Inner, Left, Right, and Full Joins?
* **Answer**:
  * **INNER JOIN**: Returns records only if there is a match in *both* tables.
  * **LEFT JOIN**: Returns all records from the left table and matched records from the right table. If no match, NULL values are returned for the right table.
  * **RIGHT JOIN**: Returns all records from the right table and matched records from the left table.
  * **FULL JOIN**: Returns all records when there is a match in either left or right table.

### Q4: Explain the ACID properties with respect to your project.
* **Answer**:
  * **Atomicity**: During signup, if the student profile insert succeeds but education details fail, the database rolls back the transaction. No partial user is created.
  * **Consistency**: CGPA is restricted to `0.0 - 10.0` by a CHECK constraint. Entering `12.5` rejects the transaction.
  * **Isolation**: Administrative status changes (e.g., "Placed") are hidden from other sessions until the transaction commits.
  * **Durability**: All modifications are written to WAL logs on persistent Docker volumes, ensuring they survive server restarts.

### Q5: How did you implement administrative audit logs in this database?
* **Answer**: We created a PostgreSQL trigger function named `audit_row_changes()` in PL/pgSQL. It checks the trigger action (`TG_OP`). If it's an `UPDATE`, it copies the old and new values using `to_jsonb(OLD)` and `to_jsonb(NEW)` and stores them in the `audit_logs` table along with the transaction session context variable `app.current_user_id` to identify the actor.
