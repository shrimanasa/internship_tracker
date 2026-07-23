"""Unit tests for SecurityHeadersMiddleware."""

import pytest
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.testclient import TestClient
from app.middleware.security import SecurityHeadersMiddleware


def create_security_test_app():
    """Creates a minimal Starlette app with SecurityHeadersMiddleware attached."""
    app = Starlette()
    app.add_middleware(SecurityHeadersMiddleware)

    @app.route("/secure-endpoint")
    async def endpoint(request):
        return PlainTextResponse("SECURE_CONTENT")

    return app


class TestSecurityHeadersMiddleware:
    """Test suite verifying defensive HTTP headers are attached."""

    def test_attaches_security_headers(self):
        """Should attach all required security headers to response."""
        client = TestClient(create_security_test_app())
        response = client.get("/secure-endpoint")

        assert response.status_code == 200
        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert response.headers.get("X-XSS-Protection") == "1; mode=block"
        assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
        assert "default-src 'self'" in response.headers.get("Content-Security-Policy", "")
