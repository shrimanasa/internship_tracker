# Schema Design Decisions

## Why 3NF?
- Eliminates update anomalies
- Reduces data redundancy
- Maintains referential integrity

## Key Design Choices
- SERIAL vs UUID for PKs: Chose SERIAL for simplicity
- JSONB for audit logs: Flexible schema for tracking
- Separate skills taxonomy: Enables reusable matching
- Application status as VARCHAR: More flexible than ENUM
- Soft delete not used: CASCADE deletes for simplicity

## Naming Conventions
- Tables: plural snake_case (student_profiles)
- PKs: table_singular_id (student_id)
- FKs: referenced_table_singular_id
- Timestamps: created_at, updated_at
