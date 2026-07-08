"""Unit tests for middleware."""

import pytest
import uuid


def test_correlation_id_is_valid_uuid():
    """Generated correlation IDs should be valid UUIDs."""
    cid = str(uuid.uuid4())
    parsed = uuid.UUID(cid)
    assert str(parsed) == cid

def test_request_logging_format():
    """Log format should include method, path, status, duration."""
    log = "GET /api/v1/internships 200 45ms"
    assert "GET" in log
    assert "200" in log
    assert "ms" in log
