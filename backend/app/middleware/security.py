"""Security headers middleware.

Injects standard HTTP security headers into all outgoing API responses
to harden the application against XSS, clickjacking, and MIME sniffing attacks.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces defensive HTTP security headers on all HTTP responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Protect against framing/clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Enable XSS filtering in legacy browsers
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Restrict referrer information sent with requests
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Basic Content Security Policy for API endpoints
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"

        return response
