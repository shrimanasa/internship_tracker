"""Unit tests for core security utilities."""

import pytest
from app.core.security import get_password_hash, verify_password, validate_password_strength


class TestPasswordHashing:
    def test_hash_and_verify_correct_password(self):
        password = "SecurePass@123"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) is True

    def test_verify_wrong_password_fails(self):
        hashed = get_password_hash("CorrectPassword@1")
        assert verify_password("WrongPassword@1", hashed) is False

    def test_hash_is_not_plaintext(self):
        password = "MyPassword@123"
        hashed = get_password_hash(password)
        assert hashed != password
        assert len(hashed) > 50


class TestPasswordStrengthValidation:
    def test_short_password_rejected(self):
        is_valid, msg = validate_password_strength("Ab@1")
        assert is_valid is False

    def test_strong_password_accepted(self):
        is_valid, msg = validate_password_strength("Strong@Pass1")
        assert is_valid is True
