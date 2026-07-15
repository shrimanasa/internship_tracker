import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.db.session import get_db
from app.models.models import Document, StudentProfile, Application, User
from app.schemas.schemas import DocumentResponse
from app.api.deps import get_current_student, get_current_admin

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def is_allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in settings.allowed_extensions_list

@router.get("", response_model=List[DocumentResponse])
async def get_documents(
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).where(Document.student_id == student.student_id))
    return result.scalars().all()

@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    document_type: str = Form(...), # 'Resume', 'Cover Letter', etc.
    application_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    # Enforce type check
    valid_types = ['Resume', 'Cover Letter', 'Certificate', 'Offer Letter', 'Recommendation Letter', 'Transcript', 'Other']
    if document_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid document type. Allowed types are: {', '.join(valid_types)}"
        )

    # Verify size (limit to 5MB)
    content = await file.read()
    file_size = len(content)
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE // (1024*1024)} MB."
        )
    
    # Reset read pointer
    await file.seek(0)
    
    # Verify extension
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension not allowed. Approved: {settings.ALLOWED_EXTENSIONS}"
        )

    # Optional application check
    if application_id:
        app_check = await db.execute(
            select(Application).where(Application.application_id == application_id, Application.student_id == student.student_id)
        )
        if not app_check.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The linked application ID does not exist under your student profile."
            )

    # Secure filename generation
    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    physical_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    
    # Save physical file
    with open(physical_path, "wb") as f:
        f.write(content)
        
    # Write to database
    new_doc = Document(
        student_id=student.student_id,
        application_id=application_id,
        document_type=document_type,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=f"uploads/{unique_filename}", # Relative path for serving
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        verification_status="Pending"
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    return new_doc

@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document).where(Document.document_id == document_id, Document.student_id == student.student_id)
    )
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or access denied."
        )
        
    physical_path = os.path.join(UPLOAD_FOLDER, doc.stored_filename)
    if not os.path.exists(physical_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The file could not be found on the server filesystem."
        )
        
    return FileResponse(
        path=physical_path,
        filename=doc.original_filename,
        media_type=doc.mime_type
    )

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int,
    student: StudentProfile = Depends(get_current_student),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document).where(Document.document_id == document_id, Document.student_id == student.student_id)
    )
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )
        
    # Delete physical file
    physical_path = os.path.join(UPLOAD_FOLDER, doc.stored_filename)
    if os.path.exists(physical_path):
        try:
            os.remove(physical_path)
        except Exception:
            pass # Continue even if file is missing physically
            
    await db.delete(doc)
    await db.commit()
    return


# ==========================================
# ADMIN VERIFICATION ENDPOINT
# ==========================================

@router.post("/{document_id}/verify", response_model=DocumentResponse)
async def verify_document(
    document_id: int,
    verification_status: str, # 'Verified' or 'Rejected'
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    if verification_status not in ["Verified", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status selection. Choose 'Verified' or 'Rejected'."
        )
        
    result = await db.execute(select(Document).where(Document.document_id == document_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Set DB session variable for audit log context
    await db.execute(f"SET LOCAL app.current_user_id = '{admin.user_id}';")

    doc.verification_status = verification_status
    doc.verified_by = admin.user_id
    doc.verified_at = datetime.utcnow()
    
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc
