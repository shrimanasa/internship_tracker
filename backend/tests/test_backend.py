import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.matching import calculate_skill_match_py
from app.models.models import StudentSkill, InternshipRequiredSkill, Skill
from app.schemas.schemas import SkillMatchResponse

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_invalid_login():
    response = client.post("/api/v1/auth/login", data={"username": "notexist@student.edu", "password": "wrongpassword"})
    assert response.status_code == 400
    assert "Incorrect email or password" in response.json()["detail"]

def test_registration_validation():
    # Attempt registration with short password
    payload = {
        "full_name": "Test Student",
        "email": "test@student.edu",
        "password": "123", # Too short
        "role": "student",
        "register_number": "REG123",
        "department_id": 1,
        "graduation_year": 2027
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422 # Unprocessable Entity due to validation error

def test_skill_matching_logic():
    # Create mock skill objects
    skill1 = Skill(skill_id=1, skill_name="React", category="Web")
    skill2 = Skill(skill_id=2, skill_name="Python", category="Programming")
    skill3 = Skill(skill_id=3, skill_name="FastAPI", category="Web")

    # Mock student skills
    # Student has React (Advanced - 3) and Python (Beginner - 1), but lacks FastAPI
    ss1 = StudentSkill(skill_id=1, proficiency_level="Advanced", skill=skill1)
    ss2 = StudentSkill(skill_id=2, proficiency_level="Beginner", skill=skill2)
    student_skills = [ss1, ss2]

    # Mock required internship skills
    # Internship requires:
    # 1. React (Intermediate - 2, High importance - 3, Mandatory)
    # 2. Python (Intermediate - 2, Medium importance - 2, Non-mandatory)
    # 3. FastAPI (Beginner - 1, Low importance - 1, Non-mandatory)
    irs1 = InternshipRequiredSkill(skill_id=1, importance_level="High", minimum_proficiency="Intermediate", is_mandatory=True, skill=skill1)
    irs2 = InternshipRequiredSkill(skill_id=2, importance_level="Medium", minimum_proficiency="Intermediate", is_mandatory=False, skill=skill2)
    irs3 = InternshipRequiredSkill(skill_id=3, importance_level="Low", minimum_proficiency="Beginner", is_mandatory=False, skill=skill3)
    required_skills = [irs1, irs2, irs3]

    # Let's calculate expected weights:
    # irs1: High (3) * Mandatory (2) = 6 weight. Student has Advanced (3) >= Required Intermediate (2). Student gets 6 points.
    # irs2: Medium (2) * Non-mandatory (1) = 2 weight. Student has Beginner (1) < Required Intermediate (2). Student gets 2 * (1/2) = 1 point.
    # irs3: Low (1) * Non-mandatory (1) = 1 weight. Student lacks it. Student gets 0 points.
    # Total possible weight = 6 + 2 + 1 = 9 points.
    # Student points = 6 (React) + 1 (Python) + 0 (FastAPI) = 7 points.
    # Expected match percentage = (7 / 9) * 100.0 = 77.78%

    match_result = calculate_skill_match_py(
        student_skills=student_skills,
        required_skills=required_skills,
        student_cgpa=8.5,
        required_cgpa=8.0
    )

    assert isinstance(match_result, SkillMatchResponse)
    assert match_result.match_percentage == 77.78
    assert match_result.eligible is True
    assert "React" in match_result.matched_skills
    assert "FastAPI" in match_result.missing_skills
    # Check Python in proficiency gaps
    gap_skills = [g["skill_name"] for g in match_result.proficiency_gaps]
    assert "Python" in gap_skills
