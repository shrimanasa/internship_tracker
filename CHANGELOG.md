# Changelog

All notable changes to the InternTrack project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-23

### Added
- **Correlation ID Middleware**: Added `CorrelationIdMiddleware` to attach a unique `X-Request-ID` header to all incoming requests for distributed tracing.
- **Security Headers Middleware**: Implemented `SecurityHeadersMiddleware` setting `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Content-Security-Policy`.
- **Health Endpoint Metrics**: Enhanced `/health` route to return detailed database status and latency timings (`db_latency_ms`).
- **Middleware Test Suite**: Added dedicated unit test coverage in `test_correlation_middleware.py` and `test_security_middleware.py`.

## [1.1.0] - 2026-07-22

### Added
- Document upload signature verification for file integrity checking.
- Automated API reference documentation updates.

### Fixed
- Query parameter defaults and pagination handling in student and application routes.
