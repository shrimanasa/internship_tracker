from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func, text

from app.db.session import get_db
from app.models.models import StudentProfile, Application, Interview, Offer, Internship, StudentSkill, InternshipRequiredSkill
from app.schemas.schemas import InternshipDetailsResponse
from app.api.deps import get_current_student, get_current_active_user, get_current_admin
from app.services.matching import calculate_skill_match_py

router = APIRouter()

@router.get("/student/dashboard")
async def get_student_dashboard_analytics(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # 1. Base counts
    res_apps_total = await db.execute(
        select(func.count(Application.application_id))
        .where(Application.student_id == student.student_id, Application.is_archived == False)
    )
    total_apps = res_apps_total.scalar() or 0

    res_apps_active = await db.execute(
        select(func.count(Application.application_id))
        .where(
            Application.student_id == student.student_id,
            Application.is_archived == False,
            Application.current_status.in_(["Applied", "Under Review", "Online Assessment", "Shortlisted", "Interview Scheduled", "Interview Completed"])
        )
    )
    active_apps = res_apps_active.scalar() or 0

    res_intvs = await db.execute(
        select(func.count(Interview.interview_id))
        .join(Application)
        .where(
            Application.student_id == student.student_id,
            Interview.interview_status.in_(["Scheduled", "Rescheduled"])
        )
    )
    scheduled_intvs = res_intvs.scalar() or 0

    res_offers = await db.execute(
        select(func.count(Offer.offer_id))
        .join(Application)
        .where(
            Application.student_id == student.student_id,
            Offer.offer_status == "Pending"
        )
    )
    received_offers = res_offers.scalar() or 0

    # 2. Upcoming deadlines (Call stored function get_upcoming_deadlines)
    # Stored function returns (event_category, event_title, deadline_time)
    deadlines_res = await db.execute(
        text(f"SELECT event_category, event_title, deadline_time FROM get_upcoming_deadlines({student.student_id}) LIMIT 5")
    )
    upcoming_events = [
        {"category": row[0], "title": row[1], "deadline": row[2]} 
        for row in deadlines_res.fetchall()
    ]

    # 3. Status distribution for chart
    status_res = await db.execute(
        select(Application.current_status, func.count(Application.application_id))
        .where(Application.student_id == student.student_id, Application.is_archived == False)
        .group_by(Application.current_status)
    )
    status_distribution = [{"status": row[0], "count": row[1]} for row in status_res.fetchall()]

    # 4. Applications by month for area chart
    # Use strftime or date_part depending on dialect; for PG, date_part is robust
    month_res = await db.execute(
        text("""
            SELECT TO_CHAR(applied_date, 'Mon') AS month, COUNT(application_id) AS count
            FROM applications
            WHERE student_id = :student_id AND is_archived = FALSE
            GROUP BY TO_CHAR(applied_date, 'Mon'), DATE_TRUNC('month', applied_date)
            ORDER BY DATE_TRUNC('month', applied_date)
        """),
        {"student_id": student.student_id}
    )
    apps_by_month = [{"month": row[0], "count": row[1]} for row in month_res.fetchall()]

    # 5. Top 3 matched internships (discovered internally)
    res_int = await db.execute(
        select(Internship)
        .options(
            selectinload(Internship.company),
            selectinload(Internship.required_skills).selectinload(InternshipRequiredSkill.skill)
        )
        .where(Internship.status == "Open")
    )
    internships = res_int.scalars().all()
    
    # Load student skills
    res_skills = await db.execute(
        select(StudentSkill)
        .options(selectinload(StudentSkill.skill))
        .where(StudentSkill.student_id == student.student_id)
    )
    student_skills = res_skills.scalars().all()
    
    matched_internships = []
    for i in internships:
        match_info = calculate_skill_match_py(
            student_skills, i.required_skills, float(student.cgpa), float(i.eligibility_cgpa)
        )
        matched_internships.append({
            "internship_id": i.internship_id,
            "title": i.title,
            "company_name": i.company.company_name,
            "location": i.location,
            "stipend": f"{i.stipend_max} {i.currency}",
            "match_percentage": match_info.match_percentage,
            "eligible": match_info.eligible
        })
    # Sort by match percentage desc
    matched_internships.sort(key=lambda x: x["match_percentage"], reverse=True)
    top_matches = matched_internships[:3]

    return {
        "full_name": student.user.full_name if student.user else "",
        "profile_completion": student.profile_completion_percentage,
        "total_applications": total_apps,
        "active_applications": active_apps,
        "interviews_scheduled": scheduled_intvs,
        "offers_received": received_offers,
        "upcoming_deadlines": upcoming_events,
        "status_distribution": status_distribution,
        "applications_by_month": apps_by_month,
        "top_matches": top_matches
    }

@router.get("/admin/dashboard")
async def get_admin_dashboard_analytics(
    admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Query placement_dashboard_summary view
    view_res = await db.execute(
        text("SELECT total_students, placed_students, placement_rate, active_companies, open_internships, total_applications, pending_interviews, average_placed_stipend FROM placement_dashboard_summary")
    )
    row = view_res.fetchone()
    if not row:
        raise HTTPException(status_code=500, detail="Could not retrieve placement dashboard summary view.")
        
    stats = {
        "total_students": row[0],
        "placed_students": row[1],
        "placement_rate": float(row[2]) if row[2] else 0.0,
        "active_companies": row[3],
        "open_internships": row[4],
        "total_applications": row[5],
        "pending_interviews": row[6],
        "average_placed_stipend": float(row[7]) if row[7] else 0.0
    }

    # Department placement ratios for chart
    dept_res = await db.execute(
        text("""
            SELECT d.department_code, COUNT(sp.student_id) AS total,
                   COUNT(CASE WHEN EXISTS (
                       SELECT 1 FROM applications a 
                       WHERE a.student_id = sp.student_id AND a.current_status = 'Offer Accepted'
                   ) THEN 1 END) AS placed
            FROM departments d
            LEFT JOIN student_profiles sp ON d.department_id = sp.department_id
            GROUP BY d.department_code
        """)
    )
    dept_stats = [
        {"department": r[0], "total": r[1], "placed": r[2], "rate": round((r[2]*100.0/r[1]), 2) if r[1] > 0 else 0.0}
        for r in dept_res.fetchall()
    ]

    # Application funnel statistics
    funnel_res = await db.execute(
        text("""
            SELECT current_status, COUNT(*) AS count
            FROM applications
            GROUP BY current_status
            ORDER BY count DESC
        """)
    )
    funnel_stats = [{"stage": r[0], "count": r[1]} for r in funnel_res.fetchall()]

    # Popular skills demanded by companies
    skills_res = await db.execute(
        text("""
            SELECT s.skill_name, COUNT(irs.internship_skill_id) AS count
            FROM skills s
            JOIN internship_required_skills irs ON s.skill_id = irs.skill_id
            GROUP BY s.skill_name
            ORDER BY count DESC
            LIMIT 5
        """)
    )
    popular_skills = [{"skill": r[0], "count": r[1]} for r in skills_res.fetchall()]

    return {
        "stats": stats,
        "department_placements": dept_stats,
        "application_funnel": funnel_stats,
        "popular_skills": popular_skills
    }
