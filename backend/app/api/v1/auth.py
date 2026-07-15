from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.session import get_db
from app.models.models import User, StudentProfile, Department
from app.schemas.schemas import UserCreate, Token, UserResponse, UserLogin
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_student(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # If student role, check registration number and department ID
    if user_in.role == "student":
        if not user_in.register_number or not user_in.department_id or not user_in.graduation_year:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration number, department, and graduation year are required for student accounts."
            )
        
        # Check if register number exists
        reg_result = await db.execute(
            select(StudentProfile).where(StudentProfile.register_number == user_in.register_number)
        )
        if reg_result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A student with this register number is already registered."
            )
        
        # Check if department exists
        dept_result = await db.execute(
            select(Department).where(Department.department_id == user_in.department_id)
        )
        if not dept_result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid department selection."
            )

    # Create new User inside a transaction (handled automatically by get_db dependency yielding session)
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        password_hash=hashed_pwd,
        role=user_in.role,
        is_active=True
    )
    db.add(new_user)
    await db.flush() # Flushes user to generate user_id

    # Create Student Profile if role is student
    if user_in.role == "student":
        new_profile = StudentProfile(
            user_id=new_user.user_id,
            register_number=user_in.register_number,
            department_id=user_in.department_id,
            graduation_year=user_in.graduation_year,
            current_semester=1, # Default starting semester
            cgpa=0.00, # Default starting CGPA
            profile_completion_percentage=0
        )
        db.add(new_profile)
    
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve user by email
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password. Please try again."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account is currently deactivated. Please contact an administrator."
        )

    # Update last login time
    user.last_login_at = datetime.utcnow()
    await db.commit()

    # Generate JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, role=user.role, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "user_id": user.user_id
    }

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
