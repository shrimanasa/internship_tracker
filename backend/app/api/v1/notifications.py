from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, update

from app.db.session import get_db
from app.models.models import Notification, User
from app.schemas.schemas import NotificationResponse
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: Optional[bool] = False,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Notification).where(Notification.user_id == current_user.user_id)
    if unread_only:
        query = query.where(Notification.is_read == False)
        
    result = await db.execute(query.order_by(Notification.created_at.desc()))
    return result.scalars().all()

@router.post("/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.user_id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.commit()
    return

@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_single_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification).where(
            Notification.notification_id == notification_id, 
            Notification.user_id == current_user.user_id
        )
    )
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )
    notif.is_read = True
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification).where(
            Notification.notification_id == notification_id, 
            Notification.user_id == current_user.user_id
        )
    )
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )
    await db.delete(notif)
    await db.commit()
    return
