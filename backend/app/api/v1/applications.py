from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, delete

from app.db.session import get_db
from app.models.models import Application, ApplicationStatusHistory, StudentProfile, Company, Internship, User
from app.schemas.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApplicationDetailsResponse
from app.api.deps import get_current_student, get_current_active_user
from app.services.email import send_email_notification

router = APIRouter()

@router.get("", response_model=List[ApplicationResponse])
async def get_applications(
    status_filter: Optional[str] = None,
    priority: Optional[str] = None,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.internship).selectinload(Internship.company)
        )
        .where(Application.student_id == student.student_id, Application.is_archived == False)
    )
    
    conditions = []
    if status_filter:
        conditions.append(Application.current_status == status_filter)
    if priority:
        conditions.append(Application.priority == priority)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    result = await db.execute(query.order_by(Application.applied_date.desc()))
    return result.scalars().all()

@router.get("/{application_id}", response_model=ApplicationDetailsResponse)
async def get_application_details(
    application_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.internship).selectinload(Internship.company),
            selectinload(Application.status_history),
            selectinload(Application.interviews),
            selectinload(Application.offer),
            selectinload(Application.documents),
            selectinload(Application.reminders),
            selectinload(Application.notes_list)
        )
        .where(Application.application_id == application_id, Application.student_id == student.student_id)
    )
    app = result.scalars().first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or unauthorized access."
        )
    return app

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_in: ApplicationCreate,
    background_tasks: BackgroundTasks,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # If applying to an internal listing, load company_id from internship
    company_id_val = app_in.company_id
    if app_in.internship_id:
        result_int = await db.execute(select(Internship).where(Internship.internship_id == app_in.internship_id))
        internship = result_int.scalars().first()
        if not internship:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The requested internal internship ID does not exist."
            )
        company_id_val = internship.company_id
    else:
        # For manual applications, check if company_id is valid
        result_comp = await db.execute(select(Company).where(Company.company_id == app_in.company_id))
        if not result_comp.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Linked company ID not found in the database. Please select a valid company."
            )

    try:
        new_app = Application(
            student_id=student.student_id,
            company_id=company_id_val,
            **app_in.model_dump(exclude={"company_id"})
        )
        db.add(new_app)
        await db.commit() # Trigger will auto-enforce deadline constraints and record status history.
        await db.refresh(new_app)
    except Exception as e:
        # Check if the DB trigger raised an exception
        err_msg = str(e)
        if "Cannot apply" in err_msg or "Duplicate application" in err_msg:
            # Parse trigger custom exception
            cleaned_msg = err_msg.split("CONTEXT:")[0].split("ERROR:")[-1].strip()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=cleaned_msg
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database constraint error: {err_msg}"
        )

    # Reload repsonse
    res = await db.execute(
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.internship).selectinload(Internship.company)
        )
        .where(Application.application_id == new_app.application_id)
    )
    application = res.scalars().first()

    # Load student user to get their email address
    res_u = await db.execute(select(User).where(User.user_id == student.user_id))
    user = res_u.scalars().first()
    if user and user.email:
        company_name = application.company.company_name if application.company else (application.internship.company.company_name if application.internship and application.internship.company else "External Company")
        role_title = application.internship.title if application.internship else (application.external_role_title or "Internship Role")
        
        subject = f"Application Logged: {role_title} at {company_name}"
        body = f"""
        <p>Hi {user.full_name},</p>
        <p>Your application for <strong>{role_title}</strong> at <strong>{company_name}</strong> has been successfully registered in InternTrack!</p>
        <p><strong>Status:</strong> {application.current_status}</p>
        <p><strong>Date Applied:</strong> {application.applied_date}</p>
        <p>We'll notify you of updates or upcoming interviews.</p>
        """
        background_tasks.add_task(send_email_notification, user.email, subject, body)

    return application

@router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: int,
    app_in: ApplicationUpdate,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Application).where(Application.application_id == application_id, Application.student_id == student.student_id)
    )
    app = result.scalars().first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or unauthorized access."
        )

    # Set DB session variable for status history trigger context
    await db.execute(f"SET LOCAL app.current_user_id = '{student.user_id}';")

    for field, val in app_in.model_dump(exclude_unset=True).items():
        setattr(app, field, val)

    db.add(app)
    await db.commit()
    await db.refresh(app)
    
    # Reload details
    res = await db.execute(
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.internship).selectinload(Internship.company)
        )
        .where(Application.application_id == application_id)
    )
    return res.scalars().first()

@router.post("/{application_id}/archive", status_code=status.HTTP_204_NO_CONTENT)
async def archive_application(
    application_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Application).where(Application.application_id == application_id, Application.student_id == student.student_id)
    )
    app = result.scalars().first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or unauthorized access."
        )
    app.is_archived = True
    await db.commit()
    return

@router.get("/export/csv", tags=["Applications"])
async def export_applications_csv(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    """Export all student applications as CSV-formatted JSON for client-side download."""
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.internship)
        )
        .where(Application.student_id == student.student_id)
        .order_by(Application.applied_date.desc())
    )
    apps = result.scalars().all()

    rows = []
    for app in apps:
        company_name = app.company.company_name if app.company else (app.external_company_name or "N/A")
        role_title = app.internship.title if app.internship else (app.external_role_title or "N/A")
        rows.append({
            "company": company_name,
            "role": role_title,
            "status": app.current_status,
            "priority": app.priority,
            "applied_date": str(app.applied_date) if app.applied_date else "",
            "source": app.application_source or "",
            "expected_stipend": float(app.expected_stipend) if app.expected_stipend else 0,
            "notes": app.notes or ""
        })

    return {"count": len(rows), "data": rows}
