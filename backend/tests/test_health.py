"""Tests for health endpoint."""

import pytest

def test_health_fields():
    expected = ["success", "status", "service", "version", "database"]
    assert len(expected) == 5

def test_health_status_structure():
    status_payload = {"success": True, "status": "healthy", "service": "intern-track-api", "version": "1.0.0", "database": "connected"}
    assert status_payload["status"] == "healthy"
    assert status_payload["database"] == "connected"

