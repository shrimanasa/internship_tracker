import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("interntrack")
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Logs every incoming HTTP request with method, path, status code, and response time."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        logger.info(
            f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)"
        )
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        return response
