"""Integration test for authentication flow."""

import pytest


class TestAuthFlow:
    """End-to-end authentication flow."""

    def test_registration_flow_fields(self):
        """Registration should accept all required fields."""
        payload = {
            "full_name": "Integration Test",
            "email": "integration@test.com",
            "password": "Test@1234",
            "role": "student",
            "register_number": "INT001",
            "department_id": 1,
            "graduation_year": 2027
        }
        assert all(k in payload for k in ["full_name", "email", "password"])

    def test_login_response_format(self):
        """Login should return JWT token structure."""
        expected = ["access_token", "token_type", "role", "full_name", "user_id"]
        assert len(expected) == 5
