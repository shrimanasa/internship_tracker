"""Unit tests for the skill matching service."""

import pytest
from unittest.mock import MagicMock
from app.services.matching import calculate_skill_match_py, PROFICIENCY_VALUES, IMPORTANCE_WEIGHTS


def _make_student_skill(skill_id: int, proficiency: str, skill_name: str) -> MagicMock:
    """Helper to create a mock StudentSkill object."""
    ss = MagicMock()
    ss.skill_id = skill_id
    ss.proficiency_level = proficiency
    ss.skill = MagicMock()
    ss.skill.skill_name = skill_name
    return ss


def _make_required_skill(skill_id: int, proficiency: str, importance: str, mandatory: bool, skill_name: str) -> MagicMock:
    """Helper to create a mock InternshipRequiredSkill object."""
    rs = MagicMock()
    rs.skill_id = skill_id
    rs.minimum_proficiency = proficiency
    rs.importance_level = importance
    rs.is_mandatory = mandatory
    rs.skill = MagicMock()
    rs.skill.skill_name = skill_name
    return rs


class TestSkillMatching:
    """Tests for calculate_skill_match_py function."""

    def test_no_required_skills_returns_100_percent(self):
        """When no skills are required, match should be 100%."""
        student_skills = [_make_student_skill(1, "Advanced", "Python")]
        result = calculate_skill_match_py(student_skills, [], 8.0, 7.0)
        assert result.match_percentage == 100.0
        assert result.eligible is True

    def test_perfect_match(self):
        """Student has all required skills at or above required proficiency."""
        student_skills = [
            _make_student_skill(1, "Advanced", "Python"),
            _make_student_skill(2, "Intermediate", "SQL"),
        ]
        required_skills = [
            _make_required_skill(1, "Intermediate", "High", True, "Python"),
            _make_required_skill(2, "Beginner", "Medium", False, "SQL"),
        ]
        result = calculate_skill_match_py(student_skills, required_skills, 8.5, 7.0)
        assert result.match_percentage == 100.0
        assert len(result.matched_skills) == 2
        assert len(result.missing_skills) == 0

    def test_missing_skills_reduce_percentage(self):
        """Missing required skills should reduce match percentage."""
        student_skills = [_make_student_skill(1, "Advanced", "Python")]
        required_skills = [
            _make_required_skill(1, "Beginner", "Medium", False, "Python"),
            _make_required_skill(2, "Intermediate", "High", True, "React"),
        ]
        result = calculate_skill_match_py(student_skills, required_skills, 8.0, 7.0)
        assert result.match_percentage < 100.0
        assert "React" in result.missing_skills

    def test_proficiency_gap_partial_credit(self):
        """Student with lower proficiency than required gets partial credit."""
        student_skills = [_make_student_skill(1, "Beginner", "Python")]
        required_skills = [
            _make_required_skill(1, "Advanced", "Medium", False, "Python"),
        ]
        result = calculate_skill_match_py(student_skills, required_skills, 8.0, 7.0)
        assert 0 < result.match_percentage < 100.0
        assert len(result.proficiency_gaps) == 1
        assert result.proficiency_gaps[0]["skill_name"] == "Python"

    def test_cgpa_eligibility_check(self):
        """Student below required CGPA should be ineligible."""
        result = calculate_skill_match_py([], [], 6.5, 7.0)
        assert result.eligible is False

    def test_cgpa_eligible_when_above_threshold(self):
        """Student at or above required CGPA should be eligible."""
        result = calculate_skill_match_py([], [], 7.5, 7.0)
        assert result.eligible is True

    def test_mandatory_skills_have_double_weight(self):
        """Mandatory skills should impact score more than optional ones."""
        student_skills = [_make_student_skill(2, "Advanced", "SQL")]
        # Missing mandatory Python but having optional SQL
        required_skills = [
            _make_required_skill(1, "Beginner", "Medium", True, "Python"),   # mandatory, missing
            _make_required_skill(2, "Beginner", "Medium", False, "SQL"),     # optional, present
        ]
        result = calculate_skill_match_py(student_skills, required_skills, 8.0, 7.0)
        # SQL weight = 2*1 = 2, Python weight = 2*2 = 4, total = 6, earned = 2
        assert result.match_percentage == pytest.approx(33.33, abs=0.01)
