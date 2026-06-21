"""Shared pytest fixtures for InternTrack backend tests."""

import pytest

TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5434/interntrack_test"

@pytest.fixture
def sample_student_data():
    return {
        "full_name": "Test Student",
        "email": "test@interntrack.com",
        "password": "Test@1234",
        "role": "student",
        "register_number": "TEST001",
        "department_id": 1,
        "graduation_year": 2027
    }

@pytest.fixture
def sample_company_data():
    return {
        "company_name": "Test Corp",
        "industry": "Technology",
        "company_website": "https://testcorp.com",
        "company_size": "1000-5000",
        "headquarters_location": "Bangalore, India"
    }
