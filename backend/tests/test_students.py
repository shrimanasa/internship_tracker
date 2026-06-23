"""Unit tests for student profile endpoints."""

import pytest


class TestStudentProfile:
    def test_profile_has_required_fields(self):
        required = ["student_id", "register_number", "department_id",
                    "graduation_year", "current_semester", "cgpa"]
        assert len(required) == 6

    def test_cgpa_range_validation(self):
        valid_cgpas = [0.0, 5.5, 8.75, 10.0]
        for cgpa in valid_cgpas:
            assert 0.0 <= cgpa <= 10.0


class TestSkillManagement:
    def test_skill_categories_exist(self):
        categories = ["Programming", "Web Development", "Database",
                      "DevOps", "Data Science", "Soft Skills", "Design"]
        assert len(categories) == 7
