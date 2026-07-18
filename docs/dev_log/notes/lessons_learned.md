# Lessons Learned

## What Worked Well
- FastAPI's async support for concurrent requests
- Pydantic v2 for strict validation
- Docker Compose for reproducible dev environment
- Tab-based SPA for intuitive navigation
- Glassmorphism design for visual appeal

## What Could Improve
- Add Alembic for database migrations
- Implement WebSocket for real-time notifications
- Add E2E tests with Playwright
- Set up proper error monitoring (Sentry)
- Add Redis caching for frequent queries

## Technical Debt
- Some components > 500 lines (need splitting)
- In-memory rate limiter (needs Redis)
- No pagination on some list endpoints
- Missing comprehensive input sanitization
