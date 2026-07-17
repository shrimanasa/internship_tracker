# Database Backup Strategy

## Development
- Docker volumes persist data
- `docker-compose down -v` to reset

## Production
```bash
# Full backup
pg_dump -U postgres interntrack > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres interntrack < backup_20260719.sql
```

## Schedule (Recommended)
- Daily full backup at 2 AM
- Keep 7 daily, 4 weekly backups
- Store in encrypted S3 bucket
