# Database Layer

PostgreSQL 15 database scripts for InternTrack.

## Files
- `schema.sql` - Table definitions (19 tables)
- `constraints.sql` - Foreign keys, CHECK, UNIQUE constraints
- `indexes.sql` - B-tree indexes for query optimization
- `triggers.sql` - Audit logging and status tracking
- `functions.sql` - Stored functions
- `views.sql` - Pre-computed dashboard summaries
- `seed.sql` - Sample data for development
- `init-db.sh` - Docker initialization script

## Running Manually
```bash
psql -U postgres -d interntrack -f database/schema.sql
psql -U postgres -d interntrack -f database/seed.sql
```
