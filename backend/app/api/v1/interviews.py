from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_

from app.db.session import get_db
from app.models.models import Interview, Application, StudentProfile
from app.schemas.schemas import InterviewCreate, InterviewUpdate, InterviewResponse
from app.api.deps import get_current_student

router = APIRouter()

@router.get("", response_model=List[InterviewResponse])
async def get_interviews(
    upcoming: Optional[bool] = None,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Interview)
        .join(Application)
        .where(Application.student_id == student.student_id)
    )
    
    if upcoming:
        query = query.where(Interview.interview_status.in_(["Scheduled", "Rescheduled"]))
        
    result = await db.execute(query.order_by(Interview.scheduled_start.asc()))
    return result.scalars().all()

@router.get("/{interview_id}", response_model=InterviewResponse)
async def get_interview_by_id(
    interview_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Interview)
        .join(Application)
        .where(Interview.interview_id == interview_id, Application.student_id == student.student_id)
    )
    intv = result.scalars().first()
    if not intv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found."
        )
    return intv

@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
async def schedule_interview(
    int_in: InterviewCreate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Verify application belongs to the student
    app_check = await db.execute(
        select(Application).where(Application.application_id == int_in.application_id, Application.student_id == student.student_id)
    )
    app = app_check.scalars().first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The requested application was not found under your student profile."
        )
        
    new_intv = Interview(**int_in.model_dump())
    db.add(new_intv)
    
    # Auto update application status to 'Interview Scheduled' if it was not already
    if app.current_status not in ["Interview Scheduled", "Interview Completed", "Offer Received", "Offer Accepted"]:
        app.current_status = "Interview Scheduled"
        db.add(app)
        
    await db.commit()
    await db.refresh(new_intv)
    return new_intv

@router.put("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: int,
    int_in: InterviewUpdate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Interview)
        .join(Application)
        .where(Interview.interview_id == interview_id, Application.student_id == student.student_id)
    )
    intv = result.scalars().first()
    if not intv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found."
        )
        
    for field, val in int_in.model_dump(exclude_unset=True).items():
        setattr(intv, field, val)
        
    # Auto-adjust application status based on result or status update
    app_check = await db.execute(select(Application).where(Application.application_id == intv.application_id))
    app = app_check.scalars().first()
    
    if int_in.interview_status == "Completed" and app.current_status == "Interview Scheduled":
        app.current_status = "Interview Completed"
        db.add(app)
        
    db.add(intv)
    await db.commit()
    await db.refresh(intv)
    return intv

@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_interview(
    interview_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Interview)
        .join(Application)
        .where(Interview.interview_id == interview_id, Application.student_id == student.student_id)
    )
    intv = result.scalars().first()
    if not intv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found."
        )
    await db.delete(intv)
    await db.commit()
    return
