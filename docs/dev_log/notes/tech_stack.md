# Technology Stack Decision

## Backend: FastAPI (Python)
- Async support for high concurrency
- Auto-generated OpenAPI docs
- Pydantic for validation
- SQLAlchemy 2.0 async ORM

## Frontend: Next.js 16 (React 19)
- App Router for modern routing
- Server Components for SEO
- TailwindCSS v4 for styling
- Recharts for data viz

## Database: PostgreSQL 15
- JSONB for flexible audit logs
- Triggers for automated tracking
- Views for dashboard queries
- Full-text search capability

## DevOps
- Docker Compose for local dev
- GitHub Actions for CI
- Nginx reverse proxy (production)
