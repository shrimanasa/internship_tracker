# Performance Benchmarks

## API Response Times (dev environment)
| Endpoint | Method | Avg | P95 |
|----------|--------|-----|-----|
| /internships | GET | 45ms | 120ms |
| /applications | GET | 60ms | 150ms |
| /auth/login | POST | 180ms | 250ms |
| /analytics/dashboard | GET | 95ms | 200ms |

## Database Query Times
| Query | Avg |
|-------|-----|
| List internships (indexed) | 12ms |
| Skill match calculation | 25ms |
| Dashboard aggregation | 45ms |
