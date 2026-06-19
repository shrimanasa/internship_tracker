# Entity Relationship Summary

## Core Entities (19 tables)

### User Management
- users (1) -> (1) student_profiles
- departments (1) -> (N) student_profiles

### Skills
- skills (N) <-> (N) student_profiles (via student_skills)
- skills (N) <-> (N) internships (via internship_required_skills)

### Companies
- companies (1) -> (N) internships
- companies (1) -> (N) applications

### Applications
- student_profiles (1) -> (N) applications
- applications (1) -> (N) application_status_history
- applications (1) -> (N) interviews
- applications (1) -> (1) offers
- applications (1) -> (N) documents
- applications (1) -> (N) reminders
- applications (1) -> (N) notes

### System
- users (1) -> (N) notifications
- audit_logs (standalone)
