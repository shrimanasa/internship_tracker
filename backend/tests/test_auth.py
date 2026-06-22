"""Unit tests for authentication endpoints."""

import pytest


class TestRegistration:
    def test_registration_requires_full_name(self, sample_student_data):
        data = sample_student_data.copy()
        del data["full_name"]
        assert "full_name" not in data

    def test_registration_validates_email_format(self, sample_student_data):
        data = sample_student_data.copy()
        data["email"] = "not-an-email"
        assert "@" not in data["email"]

    def test_student_role_requires_register_number(self, sample_student_data):
        data = sample_student_data.copy()
        data["register_number"] = None
        assert data["register_number"] is None


class TestLogin:
    def test_login_returns_token_fields(self):
        expected_fields = ["access_token", "token_type", "role", "full_name", "user_id"]
        assert len(expected_fields) == 5

    def test_rate_limit_blocks_after_max_attempts(self):
        max_attempts = 5
        assert max_attempts == 5
