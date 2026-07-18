from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, Numeric, 
    ForeignKey, Text, UniqueConstraint, CheckConstraint
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.db.session import Base

# 1. User Model
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login_at = Column(DateTime(timezone=True))

    # Relationships
    student_profile = relationship("StudentProfile", uselist=False, back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")
    status_changes = relationship("ApplicationStatusHistory", back_populates="changed_by_user")
    created_internships = relationship("Internship", back_populates="creator")

# 2. Department Model
class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), unique=True, nullable=False)
    department_code = Column(String(10), unique=True, nullable=False)

    # Relationships
    students = relationship("StudentProfile", back_populates="department")

# 3. StudentProfile Model
class StudentProfile(Base):
    __tablename__ = "student_profiles"

    student_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    register_number = Column(String(20), unique=True, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.department_id", ondelete="RESTRICT"), nullable=False)
    phone_number = Column(String(15))
    graduation_year = Column(Integer, nullable=False)
    current_semester = Column(Integer, nullable=False)
    cgpa = Column(Numeric(4, 2), nullable=False)
    location = Column(String(100))
    preferred_work_mode = Column(String(20))
    preferred_roles = Column(String(255))
    bio = Column(Text)
    linkedin_url = Column(String(255))
    github_url = Column(String(255))
    portfolio_url = Column(String(255))
    profile_completion_percentage = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="student_profile")
    department = relationship("Department", back_populates="students")
    education = relationship("Education", back_populates="student", cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    saved_internships = relationship("SavedInternship", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="student", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="student", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="student", cascade="all, delete-orphan")

# 4. Education Model
class Education(Base):
    __tablename__ = "education"

    education_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    institution_name = Column(String(150), nullable=False)
    qualification = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    start_year = Column(Integer, nullable=False)
    end_year = Column(Integer, nullable=False)
    score = Column(Numeric(5, 2), nullable=False)
    score_type = Column(String(10), nullable=False)

    # Relationships
    student = relationship("StudentProfile", back_populates="education")

# 5. Skill Model
class Skill(Base):
    __tablename__ = "skills"

    skill_id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text)

    # Relationships
    student_skills = relationship("StudentSkill", back_populates="skill")
    internship_skills = relationship("InternshipRequiredSkill", back_populates="skill")

# 6. StudentSkill Model
class StudentSkill(Base):
    __tablename__ = "student_skills"
    __table_args__ = (UniqueConstraint('student_id', 'skill_id', name='uq_student_skills'),)

    student_skill_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.skill_id", ondelete="RESTRICT"), nullable=False)
    proficiency_level = Column(String(20), nullable=False) # 'Beginner', 'Intermediate', 'Advanced'
    years_of_experience = Column(Numeric(3, 1), default=0.0)
    verified = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("StudentProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="student_skills")

# 7. Company Model
class Company(Base):
    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(100), unique=True, nullable=False, index=True)
    industry = Column(String(100))
    company_size = Column(String(20))
    website_url = Column(String(255))
    linkedin_url = Column(String(255))
    headquarters = Column(String(150))
    description = Column(Text)
    logo_url = Column(String(255))
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    internships = relationship("Internship", back_populates="company", cascade="all, delete")
    applications = relationship("Application", back_populates="company")

# 8. Internship Model
class Internship(Base):
    __tablename__ = "internships"

    internship_id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.company_id", ondelete="RESTRICT"), nullable=False, index=True)
    title = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    location = Column(String(100))
    work_mode = Column(String(20), nullable=False) # 'Remote', 'On-site', 'Hybrid'
    internship_type = Column(String(20), nullable=False) # 'Paid', 'Unpaid', 'Performance-based'
    duration = Column(Integer, nullable=False) # in months
    stipend_min = Column(Numeric(10, 2), default=0.00)
    stipend_max = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(10), default="INR")
    eligibility_cgpa = Column(Numeric(4, 2), default=0.00)
    application_deadline = Column(DateTime(timezone=True), nullable=False, index=True)
    number_of_openings = Column(Integer, nullable=False, default=1)
    application_url = Column(String(255))
    source = Column(String(50), default="Internal") # 'Internal' or 'External'
    status = Column(String(20), nullable=False, default="Draft", index=True) # 'Draft', 'Open', 'Closed', 'Archived'
    created_by = Column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    company = relationship("Company", back_populates="internships")
    creator = relationship("User", back_populates="created_internships")
    required_skills = relationship("InternshipRequiredSkill", back_populates="internship", cascade="all, delete-orphan")
    saved_by_students = relationship("SavedInternship", back_populates="internship", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="internship", cascade="all, delete")

# 9. InternshipRequiredSkill Model
class InternshipRequiredSkill(Base):
    __tablename__ = "internship_required_skills"
    __table_args__ = (UniqueConstraint('internship_id', 'skill_id', name='uq_internship_required_skills'),)

    internship_skill_id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.skill_id", ondelete="RESTRICT"), nullable=False)
    importance_level = Column(String(20), nullable=False, default="Medium") # 'Low', 'Medium', 'High'
    minimum_proficiency = Column(String(20), nullable=False, default="Beginner") # 'Beginner', 'Intermediate', 'Advanced'
    is_mandatory = Column(Boolean, nullable=False, default=False)

    # Relationships
    internship = relationship("Internship", back_populates="required_skills")
    skill = relationship("Skill", back_populates="internship_skills")

# 10. SavedInternship Model
class SavedInternship(Base):
    __tablename__ = "saved_internships"
    __table_args__ = (UniqueConstraint('student_id', 'internship_id', name='uq_saved_internships'),)

    saved_internship_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("StudentProfile", back_populates="saved_internships")
    internship = relationship("Internship", back_populates="saved_by_students")

# 11. Application Model
class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False, index=True)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="SET NULL"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.company_id", ondelete="RESTRICT"), nullable=False, index=True)
    external_company_name = Column(String(100))
    external_role_title = Column(String(100))
    application_source = Column(String(50), nullable=False, default="Internal")
    applied_date = Column(Date, nullable=False, index=True)
    current_status = Column(String(30), nullable=False, default="Interested", index=True)
    priority = Column(String(10), nullable=False, default="Medium")
    application_url = Column(String(255))
    job_reference_id = Column(String(50))
    expected_stipend = Column(Numeric(10, 2), default=0.00)
    notes = Column(Text)
    next_action = Column(String(255))
    next_action_date = Column(Date)
    is_archived = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")
    company = relationship("Company", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
    offer = relationship("Offer", uselist=False, back_populates="application", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="application")
    reminders = relationship("Reminder", back_populates="application", cascade="all, delete-orphan")
    notes_list = relationship("Note", back_populates="application", cascade="all, delete-orphan")

# 12. ApplicationStatusHistory Model
class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    history_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(String(30))
    new_status = Column(String(30), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    change_note = Column(Text)
    changed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    application = relationship("Application", back_populates="status_history")
    changed_by_user = relationship("User", back_populates="status_changes")

# 13. Interview Model
class Interview(Base):
    __tablename__ = "interviews"

    interview_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, index=True)
    interview_round = Column(Integer, nullable=False, default=1)
    interview_type = Column(String(30), nullable=False) # 'HR', 'Technical', 'Coding', 'Managerial', etc.
    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)
    meeting_link = Column(String(255))
    location = Column(String(150))
    interviewer_name = Column(String(100))
    interview_status = Column(String(20), nullable=False, default="Scheduled") # 'Scheduled', 'Completed', 'Rescheduled', 'Cancelled'
    preparation_notes = Column(Text)
    feedback_notes = Column(Text)
    result = Column(String(20)) # 'Passed', 'Failed', 'Pending'
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    application = relationship("Application", back_populates="interviews")

# 14. Offer Model
class Offer(Base):
    __tablename__ = "offers"

    offer_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    offered_role = Column(String(100), nullable=False)
    stipend_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    currency = Column(String(10), default="INR")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    work_mode = Column(String(20), default="On-site")
    location = Column(String(100))
    offer_deadline = Column(Date)
    offer_status = Column(String(20), nullable=False, default="Pending") # 'Pending', 'Accepted', 'Declined', 'Expired'
    offer_letter_path = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    application = relationship("Application", back_populates="offer")

# 15. Document Model
class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="SET NULL"), nullable=True)
    document_type = Column(String(30), nullable=False) # 'Resume', 'Cover Letter', 'Certificate', etc.
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    verification_status = Column(String(20), nullable=False, default="Pending") # 'Pending', 'Verified', 'Rejected'
    uploaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    verified_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    student = relationship("StudentProfile", back_populates="documents")
    application = relationship("Application", back_populates="documents")

# 16. Reminder Model
class Reminder(Base):
    __tablename__ = "reminders"

    reminder_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=True)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    reminder_datetime = Column(DateTime(timezone=True), nullable=False, index=True)
    reminder_type = Column(String(30), nullable=False, default="Deadline")
    is_completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("StudentProfile", back_populates="reminders")
    application = relationship("Application", back_populates="reminders")

# 17. Notification Model
class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(30), nullable=False, default="System")
    is_read = Column(Boolean, nullable=False, default=False)
    related_entity_type = Column(String(50))
    related_entity_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="notifications")

# 18. Note Model
class Note(Base):
    __tablename__ = "notes"

    note_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("StudentProfile", back_populates="notes")
    application = relationship("Application", back_populates="notes_list")

# 19. AuditLog Model
class AuditLog(Base):
    __tablename__ = "audit_logs"

    audit_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False) # 'CREATE', 'UPDATE', 'DELETE', etc.
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=False)
    old_values = Column(JSONB, nullable=True)
    new_values = Column(JSONB, nullable=True)
    ip_address = Column(String(45))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="audit_logs")
