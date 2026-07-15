from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.models import User, StudentProfile, StudentSkill, Education, Skill, Department
from app.schemas.schemas import (
    StudentProfileDetailsResponse, StudentProfileUpdate, 
    StudentSkillCreate, StudentSkillResponse, 
    EducationCreate, EducationResponse, SkillResponse, DepartmentResponse
)
from app.api.deps import get_current_student, get_current_active_user

router = APIRouter()

# Helper function to trigger profile percentage update in SQL
async def refresh_profile_completion(student_id: int, db: AsyncSession):
    # Runs the PostgreSQL stored function 'calculate_profile_completion'
    res = await db.execute(f"SELECT calculate_profile_completion({student_id})")
    percentage = res.scalar() or 0
    
    # Update row
    res_prof = await db.execute(select(StudentProfile).where(StudentProfile.student_id == student_id))
    profile = res_prof.scalars().first()
    if profile:
        profile.profile_completion_percentage = percentage
        await db.commit()

@router.get("/profile", response_model=StudentProfileDetailsResponse)
async def get_student_profile(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Load profile with relationships
    result = await db.execute(
        select(StudentProfile)
        .options(
            selectinload(StudentProfile.user),
            selectinload(StudentProfile.department),
            selectinload(StudentProfile.education),
            selectinload(StudentProfile.skills).selectinload(StudentSkill.skill)
        )
        .where(StudentProfile.student_id == student.student_id)
    )
    profile_details = result.scalars().first()
    return profile_details

@router.put("/profile", response_model=StudentProfileDetailsResponse)
async def update_student_profile(
    profile_in: StudentProfileUpdate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Update fields in StudentProfile
    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(student, field, val)
    
    db.add(student)
    await db.commit()
    
    # Update completion percentage
    await refresh_profile_completion(student.student_id, db)
    
    # Fetch updated profile
    result = await db.execute(
        select(StudentProfile)
        .options(
            selectinload(StudentProfile.user),
            selectinload(StudentProfile.department),
            selectinload(StudentProfile.education),
            selectinload(StudentProfile.skills).selectinload(StudentSkill.skill)
        )
        .where(StudentProfile.student_id == student.student_id)
    )
    return result.scalars().first()


# ==========================================
# EDUCATION SECTION
# ==========================================

@router.post("/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def add_education_record(
    edu_in: EducationCreate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    new_edu = Education(
        student_id=student.student_id,
        **edu_in.model_dump()
    )
    db.add(new_edu)
    await db.commit()
    
    # Update completion percentage
    await refresh_profile_completion(student.student_id, db)
    
    await db.refresh(new_edu)
    return new_edu

@router.delete("/education/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education_record(
    education_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Education).where(Education.education_id == education_id, Education.student_id == student.student_id)
    )
    edu = result.scalars().first()
    if not edu:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education record not found or unauthorized access."
        )
    await db.delete(edu)
    await db.commit()
    
    # Update completion percentage
    await refresh_profile_completion(student.student_id, db)
    return


# ==========================================
# SKILLS SECTION
# ==========================================

@router.get("/skills/master", response_model=List[SkillResponse])
async def get_master_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.skill_name))
    return result.scalars().all()

@router.post("/skills", response_model=StudentSkillResponse, status_code=status.HTTP_201_CREATED)
async def add_student_skill(
    skill_in: StudentSkillCreate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Check if skill exists in master table
    skill_check = await db.execute(select(Skill).where(Skill.skill_id == skill_in.skill_id))
    if not skill_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested Skill ID is not in the system master taxonomy."
        )

    # Check for duplicate
    dup_check = await db.execute(
        select(StudentSkill).where(
            StudentSkill.student_id == student.student_id, 
            StudentSkill.skill_id == skill_in.skill_id
        )
    )
    if dup_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This skill is already listed in your profile."
        )

    new_skill = StudentSkill(
        student_id=student.student_id,
        **skill_in.model_dump()
    )
    db.add(new_skill)
    await db.commit()
    
    # Update completion percentage
    await refresh_profile_completion(student.student_id, db)
    
    # Fetch response with skill info
    result = await db.execute(
        select(StudentSkill)
        .options(selectinload(StudentSkill.skill))
        .where(StudentSkill.student_skill_id == new_skill.student_skill_id)
    )
    return result.scalars().first()

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_student_skill(
    skill_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(StudentSkill).where(
            StudentSkill.skill_id == skill_id, 
            StudentSkill.student_id == student.student_id
        )
    )
    std_skill = result.scalars().first()
    if not std_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found in your profile."
        )
    await db.delete(std_skill)
    await db.commit()
    
    # Update completion percentage
    await refresh_profile_completion(student.student_id, db)
    return


# ==========================================
# SYSTEM INFO ENDPOINTS
# ==========================================

@router.get("/departments", response_model=List[DepartmentResponse])
async def get_all_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).order_by(Department.department_name))
    return result.scalars().all()
