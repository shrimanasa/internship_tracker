from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.models import Offer, Application, StudentProfile
from app.schemas.schemas import OfferCreate, OfferUpdate, OfferResponse
from app.api.deps import get_current_student

router = APIRouter()

@router.get("/{offer_id}", response_model=OfferResponse)
async def get_offer_by_id(
    offer_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Offer)
        .join(Application)
        .where(Offer.offer_id == offer_id, Application.student_id == student.student_id)
    )
    offer = result.scalars().first()
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found."
        )
    return offer

@router.post("", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
async def record_offer(
    offer_in: OfferCreate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Verify application belongs to student
    app_check = await db.execute(
        select(Application).where(Application.application_id == offer_in.application_id, Application.student_id == student.student_id)
    )
    app = app_check.scalars().first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application not found or unauthorized access."
        )

    # Check if offer already recorded for this application
    dup_check = await db.execute(select(Offer).where(Offer.application_id == offer_in.application_id))
    if dup_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An offer is already recorded for this application."
        )

    new_offer = Offer(**offer_in.model_dump())
    db.add(new_offer)
    
    # Auto-adjust application status to 'Offer Received'
    app.current_status = "Offer Received"
    db.add(app)
    
    await db.commit()
    await db.refresh(new_offer)
    return new_offer

@router.put("/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: int,
    offer_in: OfferUpdate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Offer)
        .join(Application)
        .where(Offer.offer_id == offer_id, Application.student_id == student.student_id)
    )
    offer = result.scalars().first()
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found."
        )
        
    for field, val in offer_in.model_dump(exclude_unset=True).items():
        setattr(offer, field, val)
        
    # Auto-adjust application status based on offer status changes (TCL transaction)
    app_check = await db.execute(select(Application).where(Application.application_id == offer.application_id))
    app = app_check.scalars().first()
    
    if offer_in.offer_status == "Accepted":
        app.current_status = "Offer Accepted"
        db.add(app)
    elif offer_in.offer_status == "Declined":
        app.current_status = "Offer Declined"
        db.add(app)
        
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    return offer

@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_offer(
    offer_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Offer)
        .join(Application)
        .where(Offer.offer_id == offer_id, Application.student_id == student.student_id)
    )
    offer = result.scalars().first()
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found."
        )
    
    # Reset application status to Interview Completed if offer is deleted
    app_check = await db.execute(select(Application).where(Application.application_id == offer.application_id))
    app = app_check.scalars().first()
    if app and app.current_status in ["Offer Received", "Offer Accepted", "Offer Declined"]:
        app.current_status = "Interview Completed"
        db.add(app)
        
    await db.delete(offer)
    await db.commit()
    return
