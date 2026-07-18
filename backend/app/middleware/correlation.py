"""Request correlation ID middleware.

Assigns a unique X-Request-ID header to every incoming request for
distributed tracing and log correlation across services.
"""

import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Injects a unique request ID into every request/response cycle."""

    async def dispatch(self, request: Request, call_next):
        # Use client-provided ID if present, otherwise generate one
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Store on request state for downstream access
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
