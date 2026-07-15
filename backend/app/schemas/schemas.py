from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, Field, EmailStr, HttpUrl
from decimal import Decimal

# ==========================================
# 1. AUTH & USER SCHEMAS
# ==========================================

class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: str = Field("student", pattern="^(student|admin)$")
    # For Student registration, extra fields are collected on register
    register_number: Optional[str] = None
    department_id: Optional[int] = None
    graduation_year: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    user_id: int
    role: str
    is_active: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str
    user_id: int

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ==========================================
# 2. DEPARTMENT SCHEMAS
# ==========================================

class DepartmentBase(BaseModel):
    department_name: str
    department_code: str

class DepartmentResponse(DepartmentBase):
    department_id: int

    class Config:
        from_attributes = True


# ==========================================
# 3. EDUCATION SCHEMAS
# ==========================================

class EducationBase(BaseModel):
    institution_name: str = Field(..., min_length=2)
    qualification: str
    specialization: str
    start_year: int
    end_year: int
    score: float
    score_type: str = Field("CGPA", pattern="^(CGPA|Percentage)$")

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    education_id: int
    student_id: int

    class Config:
        from_attributes = True


# ==========================================
# 4. SKILL SCHEMAS
# ==========================================

class SkillBase(BaseModel):
    skill_name: str
    category: str
    description: Optional[str] = None

class SkillResponse(SkillBase):
    skill_id: int

    class Config:
        from_attributes = True

class StudentSkillBase(BaseModel):
    skill_id: int
    proficiency_level: str = Field("Beginner", pattern="^(Beginner|Intermediate|Advanced)$")
    years_of_experience: float = Field(0.0, ge=0.0)

class StudentSkillCreate(StudentSkillBase):
    pass

class StudentSkillResponse(StudentSkillBase):
    student_skill_id: int
    student_id: int
    verified: bool
    created_at: datetime
    skill: SkillResponse

    class Config:
        from_attributes = True


# ==========================================
# 5. COMPANY SCHEMAS
# ==========================================

class CompanyBase(BaseModel):
    company_name: str
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    headquarters: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    company_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 6. INTERNSHIP SCHEMAS
# ==========================================

class InternshipRequiredSkillBase(BaseModel):
    skill_id: int
    importance_level: str = Field("Medium", pattern="^(Low|Medium|High)$")
    minimum_proficiency: str = Field("Beginner", pattern="^(Beginner|Intermediate|Advanced)$")
    is_mandatory: bool = False

class InternshipRequiredSkillCreate(InternshipRequiredSkillBase):
    pass

class InternshipRequiredSkillResponse(InternshipRequiredSkillBase):
    internship_skill_id: int
    internship_id: int
    skill: SkillResponse

    class Config:
        from_attributes = True

class InternshipBase(BaseModel):
    company_id: int
    title: str = Field(..., min_length=2)
    description: str
    location: Optional[str] = None
    work_mode: str = Field("Remote", pattern="^(Remote|On-site|Hybrid)$")
    internship_type: str = Field("Paid", pattern="^(Paid|Unpaid|Performance-based)$")
    duration: int = Field(..., ge=1)
    stipend_min: float = Field(0.0, ge=0.0)
    stipend_max: float = Field(0.0, ge=0.0)
    currency: str = "INR"
    eligibility_cgpa: float = Field(0.0, ge=0.0, le=10.0)
    application_deadline: datetime
    number_of_openings: int = Field(1, ge=1)
    application_url: Optional[str] = None
    source: str = "Internal"
    status: str = Field("Draft", pattern="^(Draft|Open|Closed|Archived)$")

class InternshipCreate(InternshipBase):
    required_skills: List[InternshipRequiredSkillCreate] = []

class InternshipResponse(InternshipBase):
    internship_id: int
    company: CompanyResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SkillMatchResponse(BaseModel):
    match_percentage: float
    eligible: bool
    matched_skills: List[str]
    missing_skills: List[str]
    proficiency_gaps: List[dict] # {skill_name: str, required: str, student: str}

class InternshipDetailsResponse(InternshipResponse):
    required_skills: List[InternshipRequiredSkillResponse] = []
    skill_match: Optional[SkillMatchResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# 7. PROFILE SCHEMAS (STUDENT)
# ==========================================

class StudentProfileBase(BaseModel):
    phone_number: Optional[str] = None
    graduation_year: int = Field(..., ge=2020, le=2100)
    current_semester: int = Field(..., ge=1, le=8)
    cgpa: float = Field(..., ge=0.0, le=10.0)
    location: Optional[str] = None
    preferred_work_mode: str = Field("Remote", pattern="^(Remote|On-site|Hybrid)$")
    preferred_roles: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    register_number: str = Field(..., min_length=3)
    department_id: int

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    student_id: int
    user_id: int
    register_number: str
    department_id: int
    profile_completion_percentage: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse
    department: DepartmentResponse

    class Config:
        from_attributes = True

class StudentProfileDetailsResponse(StudentProfileResponse):
    education: List[EducationResponse] = []
    skills: List[StudentSkillResponse] = []

    class Config:
        from_attributes = True


# ==========================================
# 8. SAVED INTERNSHIPS
# ==========================================

class SavedInternshipResponse(BaseModel):
    saved_internship_id: int
    student_id: int
    internship: InternshipResponse
    saved_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 9. INTERVIEW SCHEMAS
# ==========================================

class InterviewBase(BaseModel):
    interview_round: int = Field(1, ge=1)
    interview_type: str = Field("Technical", pattern="^(HR|Technical|Coding|Managerial|Group Discussion|Other)$")
    scheduled_start: datetime
    scheduled_end: datetime
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    interviewer_name: Optional[str] = None
    interview_status: str = Field("Scheduled", pattern="^(Scheduled|Completed|Rescheduled|Cancelled)$")
    preparation_notes: Optional[str] = None
    feedback_notes: Optional[str] = None
    result: Optional[str] = Field("Pending", pattern="^(Passed|Failed|Pending)$")

class InterviewCreate(InterviewBase):
    application_id: int

class InterviewUpdate(InterviewBase):
    pass

class InterviewResponse(InterviewBase):
    interview_id: int
    application_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 10. OFFER SCHEMAS
# ==========================================

class OfferBase(BaseModel):
    offered_role: str
    stipend_amount: float = Field(0.0, ge=0.0)
    currency: str = "INR"
    start_date: date
    end_date: Optional[date] = None
    work_mode: str = Field("On-site", pattern="^(Remote|On-site|Hybrid)$")
    location: Optional[str] = None
    offer_deadline: Optional[date] = None
    offer_status: str = Field("Pending", pattern="^(Pending|Accepted|Declined|Expired)$")
    offer_letter_path: Optional[str] = None
    notes: Optional[str] = None

class OfferCreate(OfferBase):
    application_id: int

class OfferUpdate(OfferBase):
    pass

class OfferResponse(OfferBase):
    offer_id: int
    application_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 11. DOCUMENT SCHEMAS
# ==========================================

class DocumentResponse(BaseModel):
    document_id: int
    student_id: int
    application_id: Optional[int] = None
    document_type: str
    original_filename: str
    stored_filename: str
    file_path: str
    mime_type: str
    file_size: int
    verification_status: str
    uploaded_at: datetime
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==========================================
# 12. REMINDER SCHEMAS
# ==========================================

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=2)
    description: Optional[str] = None
    reminder_datetime: datetime
    reminder_type: str = Field("Deadline", pattern="^(Deadline|Interview|Follow-up)$")

class ReminderCreate(ReminderBase):
    application_id: Optional[int] = None

class ReminderResponse(ReminderBase):
    reminder_id: int
    student_id: int
    application_id: Optional[int] = None
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 13. NOTE SCHEMAS
# ==========================================

class NoteBase(BaseModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    application_id: Optional[int] = None

class NoteResponse(NoteBase):
    note_id: int
    student_id: int
    application_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 14. APPLICATION SCHEMAS
# ==========================================

class ApplicationBase(BaseModel):
    internship_id: Optional[int] = None
    company_id: int
    external_company_name: Optional[str] = None
    external_role_title: Optional[str] = None
    application_source: str = "Internal"
    applied_date: date
    current_status: str = Field("Interested", pattern="^(Interested|Saved|Applied|Under Review|Online Assessment|Shortlisted|Interview Scheduled|Interview Completed|Offer Received|Offer Accepted|Offer Declined|Rejected|Withdrawn)$")
    priority: str = Field("Medium", pattern="^(Low|Medium|High)$")
    application_url: Optional[str] = None
    job_reference_id: Optional[str] = None
    expected_stipend: float = Field(0.0, ge=0.0)
    notes: Optional[str] = None
    next_action: Optional[str] = None
    next_action_date: Optional[date] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    current_status: Optional[str] = None
    priority: Optional[str] = None
    expected_stipend: Optional[float] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None
    next_action_date: Optional[date] = None
    is_archived: Optional[bool] = None

class ApplicationResponse(ApplicationBase):
    application_id: int
    student_id: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    company: CompanyResponse
    internship: Optional[InternshipResponse] = None

    class Config:
        from_attributes = True

class ApplicationStatusHistoryResponse(BaseModel):
    history_id: int
    application_id: int
    old_status: Optional[str] = None
    new_status: str
    changed_by: int
    change_note: Optional[str] = None
    changed_at: datetime

    class Config:
        from_attributes = True

class ApplicationDetailsResponse(ApplicationResponse):
    status_history: List[ApplicationStatusHistoryResponse] = []
    interviews: List[InterviewResponse] = []
    offer: Optional[OfferResponse] = None
    documents: List[DocumentResponse] = []
    reminders: List[ReminderResponse] = []
    notes_list: List[NoteResponse] = []

    class Config:
        from_attributes = True


# ==========================================
# 15. NOTIFICATION SCHEMAS
# ==========================================

class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 16. AUDIT LOG & REPORT SCHEMAS
# ==========================================

class AuditLogResponse(BaseModel):
    audit_id: int
    user_id: Optional[int] = None
    action: str
    entity_type: str
    entity_id: int
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_applications: int
    active_applications: int
    interviews_scheduled: int
    offers_received: int
    profile_completion: int
