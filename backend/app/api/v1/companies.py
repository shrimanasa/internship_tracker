from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_

from app.db.session import get_db
from app.models.models import Company, Internship, Application, User
from app.schemas.schemas import CompanyCreate, CompanyResponse
from app.api.deps import get_current_admin, get_current_active_user

router = APIRouter()

@router.get("", response_model=List[CompanyResponse])
async def get_companies(
    search: Optional[str] = None,
    industry: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Company).where(Company.is_active == True)
    
    conditions = []
    if search:
        conditions.append(Company.company_name.ilike(f"%{search}%"))
    if industry:
        conditions.append(Company.industry == industry)
        
    if conditions:
        query = query.where(and_(*conditions))
        
    result = await db.execute(query.order_by(Company.company_name))
    return result.scalars().all()

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company_by_id(company_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalars().first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )
    return company

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_in: CompanyCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Check duplicate name
    result = await db.execute(
        select(Company).where(Company.company_name == company_in.company_name)
    )
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A company with this name already exists."
        )
        
    new_company = Company(**company_in.model_dump())
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return new_company

@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: int,
    company_in: CompanyCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalars().first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )
        
    # Check duplicate name for OTHER companies
    name_check = await db.execute(
        select(Company).where(Company.company_name == company_in.company_name, Company.company_id != company_id)
    )
    if name_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Another company with this name already exists."
        )

    for field, val in company_in.model_dump().items():
        setattr(company, field, val)
        
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    company_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalars().first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )

    # Check dependencies before deleting (prevent if active internships/applications depend on it)
    int_check = await db.execute(
        select(Internship).where(Internship.company_id == company_id, Internship.status != 'Archived')
    )
    app_check = await db.execute(
        select(Application).where(Application.company_id == company_id, Application.is_archived == False)
    )
    
    if int_check.scalars().first() or app_check.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete company: active internships or student applications are linked to this company. Archive the company or delete dependent records first."
        )
        
    # Standard soft deletion or hard deletion
    # Let's perform a soft delete (mark as inactive) or hard delete if no dependencies at all.
    # The requirement: "Do not allow a company to be deleted when active internships or applications depend on it. Prefer soft deletion or archiving where necessary."
    company.is_active = False
    await db.commit()
    return
