# Docker Setup Guide

## Quick Start
```bash
cp .env.example .env
docker-compose up --build
```

## Services
- db: PostgreSQL 15 (port 5434)
- backend: FastAPI (port 8000)
- frontend: Next.js (port 3001)

## Database Init
1. Docker mounts database/ to initdb.d/
2. init-db.sh runs SQL files in order
3. Schema -> constraints -> triggers -> views -> seed

## Reset
```bash
docker-compose down -v
docker-compose up --build
```
