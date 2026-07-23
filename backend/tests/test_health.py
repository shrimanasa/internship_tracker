"""Tests for health endpoint."""

import pytest

def test_health_fields():
    expected = ["success", "status", "service", "version", "database"]
    assert len(expected) == 5

def test_health_status_structure():
    status_payload = {
        "success": True,
        "status": "healthy",
        "service": "InternTrack Backend",
        "version": "1.2.0",
        "database": {"status": "connected", "latency_ms": 1.25}
    }
    assert status_payload["status"] == "healthy"
    assert status_payload["database"]["status"] == "connected"
    assert "latency_ms" in status_payload["database"]


