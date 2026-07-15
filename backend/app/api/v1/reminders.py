from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_

from app.db.session import get_db
from app.models.models import Reminder, StudentProfile, Application
from app.schemas.schemas import ReminderCreate, ReminderResponse
from app.api.deps import get_current_student

router = APIRouter()

@router.get("", response_model=List[ReminderResponse])
async def get_reminders(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Reminder)
        .where(Reminder.student_id == student.student_id)
        .order_by(Reminder.reminder_datetime.asc())
    )
    return result.scalars().all()

@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    rem_in: ReminderCreate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Verify application if provided
    if rem_in.application_id:
        app_check = await db.execute(
            select(Application).where(Application.application_id == rem_in.application_id, Application.student_id == student.student_id)
        )
        if not app_check.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Linked application not found or unauthorized access."
            )
            
    new_rem = Reminder(
        student_id=student.student_id,
        is_completed=False,
        **rem_in.model_dump()
    )
    db.add(new_rem)
    await db.commit()
    await db.refresh(new_rem)
    return new_rem

@router.post("/{reminder_id}/complete", response_model=ReminderResponse)
async def toggle_reminder_complete(
    reminder_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Reminder).where(Reminder.reminder_id == reminder_id, Reminder.student_id == student.student_id)
    )
    rem = result.scalars().first()
    if not rem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found."
        )
        
    rem.is_completed = not rem.is_completed
    db.add(rem)
    await db.commit()
    await db.refresh(rem)
    return rem

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Reminder).where(Reminder.reminder_id == reminder_id, Reminder.student_id == student.student_id)
    )
    rem = result.scalars().first()
    if not rem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found."
        )
    await db.delete(rem)
    await db.commit()
    return
