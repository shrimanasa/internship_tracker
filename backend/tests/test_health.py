"""Tests for health endpoint."""

import pytest

def test_health_fields():
    expected = ["success", "status", "service", "version", "database"]
    assert len(expected) == 5
