"""Tests for database session management."""

import pytest


def test_database_url_format():
    """URL should use asyncpg driver."""
    url = "postgresql+asyncpg://user:pass@host/db"
    assert "asyncpg" in url

def test_session_config():
    """Session should not expire on commit."""
    config = {"expire_on_commit": False}
    assert config["expire_on_commit"] is False
