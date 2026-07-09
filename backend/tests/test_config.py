"""Tests for config validation."""

import pytest
from app.core.config import settings

def test_jwt_secret_not_empty():
    assert settings.JWT_SECRET != ""

def test_max_upload_size_positive():
    assert settings.MAX_UPLOAD_SIZE > 0
