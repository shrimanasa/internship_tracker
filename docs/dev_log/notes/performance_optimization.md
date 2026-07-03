# Performance Optimization Notes

## Database
- B-tree indexes on FKs and filter columns
- selectinload for eager loading
- Materialized views for dashboard

## Frontend
- Loading skeletons prevent CLS
- Debounced search inputs
- localStorage for tab persistence
- Lazy loading for charts

## Backend
- Async SQLAlchemy + asyncpg
- Connection pooling via engine
- Background tasks for email
- Response caching (planned)
