import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, or_, text

from app.db.session import get_db
from app.models.models import User, StudentProfile, Application, AuditLog, Department, Company
from app.schemas.schemas import UserResponse, StudentProfileResponse, ApplicationResponse, AuditLogResponse
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/students", response_model=List[StudentProfileResponse])
async def get_all_students(
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    min_cgpa: Optional[float] = None,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(StudentProfile)
        .options(
            selectinload(StudentProfile.user),
            selectinload(StudentProfile.department)
        )
    )
    
    conditions = []
    if search:
        conditions.append(or_(
            StudentProfile.register_number.ilike(f"%{search}%"),
            StudentProfile.location.ilike(f"%{search}%")
        ))
    if department_id:
        conditions.append(StudentProfile.department_id == department_id)
    if min_cgpa:
        conditions.append(StudentProfile.cgpa >= min_cgpa)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/students/{student_id}", response_model=StudentProfileResponse)
async def get_student_by_id(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(StudentProfile)
        .options(
            selectinload(StudentProfile.user),
            selectinload(StudentProfile.department),
            selectinload(StudentProfile.education),
            selectinload(StudentProfile.skills)
        )
        .where(StudentProfile.student_id == student_id)
    )
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return student

@router.post("/students/{student_id}/toggle-active", response_model=UserResponse)
async def toggle_student_active(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result_sp = await db.execute(select(StudentProfile).where(StudentProfile.student_id == student_id))
    student = result_sp.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
        
    result_u = await db.execute(select(User).where(User.user_id == student.user_id))
    user = result_u.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    # Toggle state
    user.is_active = not user.is_active
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/applications", response_model=List[ApplicationResponse])
async def get_all_applications(
    status_filter: Optional[str] = None,
    company_id: Optional[int] = None,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Application)
        .options(
            selectinload(Application.company),
            selectinload(Application.student).selectinload(StudentProfile.user),
            selectinload(Application.student).selectinload(StudentProfile.department)
        )
    )
    
    conditions = []
    if status_filter:
        conditions.append(Application.current_status == status_filter)
    if company_id:
        conditions.append(Application.company_id == company_id)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    result = await db.execute(query.order_by(Application.applied_date.desc()))
    return result.scalars().all()

@router.post("/applications/{application_id}/status", response_model=ApplicationResponse)
async def update_official_application_status(
    application_id: int,
    new_status: str,
    change_note: Optional[str] = "Admin status update",
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Application).where(Application.application_id == application_id))
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    # Set local DB session context for history logging trigger
    from sqlalchemy import text
    await db.execute(text(f"SET LOCAL app.current_user_id = '{admin.user_id}';"))

    app.current_status = new_status
    app.notes = f"{app.notes or ''}\n[Admin Note]: {change_note}"
    
    db.add(app)
    await db.commit()
    
    # Reload response
    res = await db.execute(
        select(Application)
        .options(selectinload(Application.company))
        .where(Application.application_id == application_id)
    )
    return res.scalars().first()

@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(AuditLog)
    
    conditions = []
    if action:
        conditions.append(AuditLog.action == action)
    if entity_type:
        conditions.append(AuditLog.entity_type == entity_type)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    result = await db.execute(query.order_by(AuditLog.created_at.desc()))
    return result.scalars().all()


# ==========================================
# CSV REPORT EXPORTS
# ==========================================

@router.get("/reports/csv/students-no-apps")
async def export_students_no_applications_csv(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Query students without active applications
    res = await db.execute(
        text("""
            SELECT sp.register_number, u.full_name, d.department_code, sp.cgpa, sp.phone_number
            FROM student_profiles sp
            JOIN users u ON sp.user_id = u.user_id
            JOIN departments d ON sp.department_id = d.department_id
            WHERE sp.student_id NOT IN (SELECT DISTINCT student_id FROM applications)
        """)
    )
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Register Number", "Student Name", "Department", "CGPA", "Phone Number"])
    
    for row in res.fetchall():
        writer.writerow([row[0], row[1], row[2], row[3], row[4]])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students_no_applications.csv"}
    )

@router.get("/reports/csv/students-offers")
async def export_students_with_offers_csv(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        text("""
            SELECT sp.register_number, u.full_name, d.department_code, c.company_name, o.offered_role, o.stipend_amount, o.offer_status
            FROM offers o
            JOIN applications a ON o.application_id = a.application_id
            JOIN student_profiles sp ON a.student_id = sp.student_id
            JOIN users u ON sp.user_id = u.user_id
            JOIN departments d ON sp.department_id = d.department_id
            JOIN companies c ON a.company_id = c.company_id
        """)
    )
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Register Number", "Student Name", "Department", "Company", "Role Offered", "Stipend", "Status"])
    
    for row in res.fetchall():
        writer.writerow([row[0], row[1], row[2], row[3], row[4], row[5], row[6]])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students_with_offers.csv"}
    )
