# Database Normalization Analysis

## 1NF (First Normal Form)
- All columns are atomic values
- No repeating groups
- Each table has a primary key

## 2NF (Second Normal Form)
- Meets 1NF requirements
- No partial dependencies on composite keys
- All non-key columns depend on entire PK

## 3NF (Third Normal Form)
- Meets 2NF requirements
- No transitive dependencies
- Example: student_profiles.department_name removed
  (depends on department_id, not student_id)

## Denormalization Decisions
- application.external_company_name: Cached for external apps
- views.sql: Pre-computed for dashboard performance
