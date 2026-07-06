# Security Checklist

## Authentication
- [x] JWT with HS256 signing
- [x] bcrypt password hashing
- [x] Rate limiting on login
- [x] Password strength validation

## Authorization
- [x] Role-based access control
- [x] Resource ownership verification
- [x] Admin-only endpoints protected

## Data
- [x] SQLAlchemy parameterized queries
- [x] Input validation via Pydantic
- [x] File upload magic byte check
- [x] Sanitized error responses

## Infrastructure
- [x] CORS configuration
- [x] Non-root Docker user
- [x] .env for secrets
- [ ] HTTPS (production)
- [ ] CSP headers (planned)
