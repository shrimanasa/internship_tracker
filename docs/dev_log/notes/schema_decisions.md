# Schema Design Decisions

## Why 3NF?
- Eliminates update anomalies
- Reduces data redundancy
- Maintains referential integrity

## Key Design Choices
- SERIAL vs UUID for PKs: Chose SERIAL for simplicity in college project
- JSONB for audit logs: Flexible schema for tracking changes
- Separate skills taxonomy: Enables reusable skill matching
- Application status as VARCHAR: More flexible than ENUM for iteration
