from typing import List, Dict, Tuple
from app.models.models import StudentProfile, Internship, StudentSkill, InternshipRequiredSkill, Skill
from app.schemas.schemas import SkillMatchResponse

PROFICIENCY_VALUES = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3
}

IMPORTANCE_WEIGHTS = {
    "Low": 1,
    "Medium": 2,
    "High": 3
}

def calculate_skill_match_py(
    student_skills: List[StudentSkill], 
    required_skills: List[InternshipRequiredSkill],
    student_cgpa: float,
    required_cgpa: float
) -> SkillMatchResponse:
    # 1. Map student skills for fast lookup
    # key: skill_id, value: proficiency_level
    student_skills_map = {}
    student_skills_names = {}
    for ss in student_skills:
        student_skills_map[ss.skill_id] = ss.proficiency_level
        student_skills_names[ss.skill_id] = ss.skill.skill_name if ss.skill else f"Skill {ss.skill_id}"

    # If no skills are required, 100% match
    if not required_skills:
        return SkillMatchResponse(
            match_percentage=100.0,
            eligible=student_cgpa >= required_cgpa,
            matched_skills=list(student_skills_names.values()),
            missing_skills=[],
            proficiency_gaps=[]
        )

    total_weight = 0
    student_weight = 0
    
    matched_skills = []
    missing_skills = []
    proficiency_gaps = []

    for req in required_skills:
        skill_name = req.skill.skill_name if req.skill else f"Skill {req.skill_id}"
        
        # Enforce importance weights
        base_w = IMPORTANCE_WEIGHTS.get(req.importance_level, 2)
        # Mandatory skills double the weight influence
        weight = base_w * 2 if req.is_mandatory else base_w
        total_weight += weight

        # Check if student has the skill
        if req.skill_id in student_skills_map:
            student_prof = student_skills_map[req.skill_id]
            req_prof = req.minimum_proficiency
            
            student_val = PROFICIENCY_VALUES.get(student_prof, 1)
            req_val = PROFICIENCY_VALUES.get(req_prof, 1)

            if student_val >= req_val:
                # Meets or exceeds required proficiency
                student_weight += weight
                matched_skills.append(skill_name)
            else:
                # Partial match (proportional points)
                ratio = student_val / req_val
                student_weight += weight * ratio
                proficiency_gaps.append({
                    "skill_name": skill_name,
                    "required": req_prof,
                    "student": student_prof
                })
        else:
            missing_skills.append(skill_name)

    # Calculate match percentage
    match_percentage = 100.0 if total_weight == 0 else round((student_weight / total_weight) * 100.0, 2)
    
    # Eligibility check
    eligible = student_cgpa >= required_cgpa

    return SkillMatchResponse(
        match_percentage=match_percentage,
        eligible=eligible,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        proficiency_gaps=proficiency_gaps
    )
