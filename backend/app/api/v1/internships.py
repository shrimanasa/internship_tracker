from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, delete

from app.db.session import get_db
from app.models.models import Internship, InternshipRequiredSkill, SavedInternship, StudentProfile, Company, User, StudentSkill
from app.schemas.schemas import InternshipCreate, InternshipResponse, InternshipDetailsResponse, SavedInternshipResponse
from app.api.deps import get_current_student, get_current_admin, get_current_active_user, oauth2_scheme
from app.services.matching import calculate_skill_match_py
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter()

# Optional student loader to compute matching scores
async def get_optional_student(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[StudentProfile]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            return None
        
        # Load user and profile
        res_u = await db.execute(select(User).where(User.email == email))
        user = res_u.scalars().first()
        if not user or user.role != "student":
            return None
            
        res_sp = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user.user_id))
        return res_sp.scalars().first()
    except Exception:
        return None

@router.get("", response_model=List[InternshipDetailsResponse])
async def get_internships(
    search: Optional[str] = None,
    location: Optional[str] = None,
    work_mode: Optional[str] = None,
    internship_type: Optional[str] = None,
    min_stipend: Optional[float] = None,
    eligible_only: Optional[bool] = False,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    student: Optional[StudentProfile] = Depends(get_optional_student)
):
    # Only list Open/Active internships for general browsing
    query = (
        select(Internship)
        .options(
            selectinload(Internship.company),
            selectinload(Internship.required_skills).selectinload(InternshipRequiredSkill.skill)
        )
        .where(Internship.status == "Open")
    )
    
    conditions = []
    if search:
        conditions.append(or_(
            Internship.title.ilike(f"%{search}%"),
            Internship.description.ilike(f"%{search}%")
        ))
    if location:
        conditions.append(Internship.location.ilike(f"%{location}%"))
    if work_mode:
        conditions.append(Internship.work_mode == work_mode)
    if internship_type:
        conditions.append(Internship.internship_type == internship_type)
    if min_stipend:
        conditions.append(Internship.stipend_max >= min_stipend)
    if eligible_only and student:
        conditions.append(Internship.eligibility_cgpa <= student.cgpa)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    query = query.order_by(Internship.application_deadline.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    internships = result.scalars().all()
    
    # Calculate matching scores if student is logged in
    res_list = []
    student_skills = []
    if student:
        # Load student skills
        res_skills = await db.execute(
            select(StudentSkill)
            .options(selectinload(StudentSkill.skill))
            .where(StudentSkill.student_id == student.student_id)
        )
        student_skills = res_skills.scalars().all()
        
    for i in internships:
        # Convert model to schema dict for manual loading of skill_match
        item = InternshipDetailsResponse.model_validate(i)
        if student:
            # Perform calculations in python
            item.skill_match = calculate_skill_match_py(
                student_skills, i.required_skills, float(student.cgpa), float(i.eligibility_cgpa)
            )
        res_list.append(item)
        
    return res_list

@router.get("/saved", response_model=List[SavedInternshipResponse])
async def get_saved_internships(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SavedInternship)
        .options(
            selectinload(SavedInternship.internship).selectinload(Internship.company)
        )
        .where(SavedInternship.student_id == student.student_id)
    )
    return result.scalars().all()

@router.get("/{internship_id}", response_model=InternshipDetailsResponse)
async def get_internship_details(
    internship_id: int,
    db: AsyncSession = Depends(get_db),
    student: Optional[StudentProfile] = Depends(get_optional_student)
):
    result = await db.execute(
        select(Internship)
        .options(
            selectinload(Internship.company),
            selectinload(Internship.required_skills).selectinload(InternshipRequiredSkill.skill)
        )
        .where(Internship.internship_id == internship_id)
    )
    internship = result.scalars().first()
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship posting not found."
        )
        
    item = InternshipDetailsResponse.model_validate(internship)
    if student:
        # Load student skills
        res_skills = await db.execute(
            select(StudentSkill)
            .options(selectinload(StudentSkill.skill))
            .where(StudentSkill.student_id == student.student_id)
        )
        student_skills = res_skills.scalars().all()
        item.skill_match = calculate_skill_match_py(
            student_skills, internship.required_skills, float(student.cgpa), float(internship.eligibility_cgpa)
        )
    return item

@router.post("/{internship_id}/save", response_model=SavedInternshipResponse)
async def save_internship(
    internship_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Verify internship exists
    check_int = await db.execute(select(Internship).where(Internship.internship_id == internship_id))
    if not check_int.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found."
        )
        
    # Check if already saved
    check_dup = await db.execute(
        select(SavedInternship).where(
            SavedInternship.student_id == student.student_id,
            SavedInternship.internship_id == internship_id
        )
    )
    if check_dup.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Internship is already saved."
        )
        
    new_save = SavedInternship(student_id=student.student_id, internship_id=internship_id)
    db.add(new_save)
    await db.commit()
    
    # Reload details for response
    result = await db.execute(
        select(SavedInternship)
        .options(selectinload(SavedInternship.internship).selectinload(Internship.company))
        .where(SavedInternship.saved_internship_id == new_save.saved_internship_id)
    )
    return result.scalars().first()

@router.delete("/{internship_id}/unsave", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_internship(
    internship_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SavedInternship).where(
            SavedInternship.student_id == student.student_id,
            SavedInternship.internship_id == internship_id
        )
    )
    saved = result.scalars().first()
    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship was not saved."
        )
    await db.delete(saved)
    await db.commit()
    return


# ==========================================
# ADMIN POSTING CREATION & MODIFICATION
# ==========================================

@router.post("", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
async def create_internship(
    int_in: InternshipCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Verify company exists
    comp_check = await db.execute(select(Company).where(Company.company_id == int_in.company_id))
    if not comp_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Linked company ID not found in database."
        )
        
    # Extract required skills to insert separately
    skills_data = int_in.required_skills
    int_dict = int_in.model_dump(exclude={"required_skills"})
    
    new_int = Internship(**int_dict, created_by=admin.user_id)
    db.add(new_int)
    await db.flush() # Yields new_int.internship_id
    
    # Save skills
    for s in skills_data:
        req_skill = InternshipRequiredSkill(
            internship_id=new_int.internship_id,
            **s.model_dump()
        )
        db.add(req_skill)
        
    await db.commit()
    
    # Fetch reloaded response
    res = await db.execute(
        select(Internship)
        .options(selectinload(Internship.company))
        .where(Internship.internship_id == new_int.internship_id)
    )
    return res.scalars().first()

@router.put("/{internship_id}", response_model=InternshipResponse)
async def update_internship(
    internship_id: int,
    int_in: InternshipCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Internship).where(Internship.internship_id == internship_id))
    internship = result.scalars().first()
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found."
        )
        
    # Update base fields
    int_dict = int_in.model_dump(exclude={"required_skills"})
    for field, val in int_dict.items():
        setattr(internship, field, val)
        
    # Re-sync skills (delete existing and rewrite)
    await db.execute(delete(InternshipRequiredSkill).where(InternshipRequiredSkill.internship_id == internship_id))
    for s in int_in.required_skills:
        req_skill = InternshipRequiredSkill(
            internship_id=internship_id,
            **s.model_dump()
        )
        db.add(req_skill)
        
    await db.commit()
    
    # Fetch reloaded
    res = await db.execute(
        select(Internship)
        .options(selectinload(Internship.company))
        .where(Internship.internship_id == internship_id)
    )
    return res.scalars().first()
