"""Unit tests for CorrelationIdMiddleware."""

import pytest
import uuid
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.testclient import TestClient
from app.middleware.correlation import CorrelationIdMiddleware


def create_test_app():
    """Creates a minimal Starlette app with CorrelationIdMiddleware attached."""
    app = Starlette()
    app.add_middleware(CorrelationIdMiddleware)

    @app.route("/test")
    async def test_route(request):
        request_id = getattr(request.state, "request_id", None)
        return PlainTextResponse(f"OK:{request_id}")

    return app


class TestCorrelationIdMiddleware:
    """Test suite verifying correlation ID generation and propagation."""

    def test_generates_uuid_when_header_missing(self):
        """Should automatically generate a valid UUID when X-Request-ID is absent."""
        client = TestClient(create_test_app())
        response = client.get("/test")

        assert response.status_code == 200
        header_id = response.headers.get("X-Request-ID")
        assert header_id is not None
        # Verify it's a valid UUID string
        parsed_uuid = uuid.UUID(header_id)
        assert str(parsed_uuid) == header_id
        assert response.text == f"OK:{header_id}"

    def test_preserves_client_provided_correlation_id(self):
        """Should reuse existing X-Request-ID supplied by client caller."""
        client = TestClient(create_test_app())
        custom_id = "custom-trace-id-12345"
        response = client.get("/test", headers={"X-Request-ID": custom_id})

        assert response.status_code == 200
        assert response.headers.get("X-Request-ID") == custom_id
        assert response.text == f"OK:{custom_id}"
