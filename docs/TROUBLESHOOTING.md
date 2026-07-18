# 🔧 Troubleshooting Guide

Common issues and solutions when developing or deploying InternTrack.

## Docker Issues

### Database container won't start
```
ERROR: port 5434 is already allocated
```
**Solution**: Another PostgreSQL instance is using the port.
```bash
# Find and stop the conflicting process
lsof -i :5434
kill -9 <PID>
# Or change the port in docker-compose.yml
```

### Backend can't connect to database
```
Connection refused: db:5432
```
**Solution**: The database container may not be healthy yet.
```bash
# Check container health
docker ps
# Wait for "healthy" status, then restart backend
docker-compose restart backend
```

### Init scripts not running
**Cause**: PostgreSQL only runs init scripts on first volume creation.
```bash
# Reset the database volume
docker-compose down -v
docker-compose up --build
```

## Backend Issues

### "ModuleNotFoundError: No module named 'app'"
**Solution**: Ensure you're running from the `backend/` directory.
```bash
cd backend
uvicorn app.main:app --reload
```

### JWT token expired errors
**Solution**: Token expires after `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 60).
- Log in again to get a fresh token
- Increase the value in `.env` for development

### CORS errors in browser console
**Solution**: Ensure your frontend URL is in `CORS_ORIGINS`.
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Frontend Issues

### "Module not found" after pulling new code
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Hydration errors in console
**Cause**: Server-rendered HTML doesn't match client-side render.
**Solution**: Wrap browser-only code in `useEffect` or check `typeof window`.

### API calls return 401 Unauthorized
**Solution**: Token may be expired or missing.
1. Open DevTools > Application > Local Storage
2. Check if `token` key exists
3. If expired, log out and log in again

## Database Issues

### "relation does not exist" errors
**Solution**: Run the schema scripts in order.
```bash
psql -U postgres -d interntrack -f database/schema.sql
psql -U postgres -d interntrack -f database/constraints.sql
psql -U postgres -d interntrack -f database/indexes.sql
psql -U postgres -d interntrack -f database/seed.sql
```

### Slow queries on large datasets
**Solution**: Ensure indexes are created.
```bash
psql -U postgres -d interntrack -f database/indexes.sql
```

## Development Tips

- **Reset everything**: `docker-compose down -v && docker-compose up --build`
- **Check API docs**: Visit http://localhost:8000/api/docs
- **Test login**: Use `student1@interntrack.com` / `Student@123`
- **Admin login**: Use `admin@interntrack.com` / `Admin@123`
