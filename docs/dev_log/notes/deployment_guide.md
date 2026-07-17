# Deployment Guide

## Development
```bash
cp .env.example .env
docker-compose up --build
```

## Production
1. Set real JWT_SECRET
2. Configure CORS_ORIGINS
3. Set SMTP credentials
4. Use managed PostgreSQL
5. Enable HTTPS via reverse proxy
6. Set --workers 4 in uvicorn

## Monitoring
- Health check: GET /health
- Request logs via middleware
- Audit logs in database
- Error tracking (Sentry planned)
