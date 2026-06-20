# Database Migrations

Migration scripts for schema changes.
Currently using raw SQL scripts; Alembic integration planned.

## Migration Strategy
1. Write SQL migration script
2. Test on development database
3. Apply to staging
4. Deploy to production with backup
