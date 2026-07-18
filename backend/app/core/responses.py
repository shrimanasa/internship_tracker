"""Standardized API response wrappers for consistent JSON output."""

from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    data: Any = None,
    message: str = "Request processed successfully.",
    status_code: int = 200
) -> JSONResponse:
    """Return a standardized success JSON response."""
    content = {
        "success": True,
        "message": message,
    }
    if data is not None:
        content["data"] = data
    return JSONResponse(status_code=status_code, content=content)


def error_response(
    message: str = "An error occurred.",
    status_code: int = 400,
    errors: Optional[list] = None
) -> JSONResponse:
    """Return a standardized error JSON response."""
    content = {
        "success": False,
        "message": message,
    }
    if errors:
        content["errors"] = errors
    return JSONResponse(status_code=status_code, content=content)
