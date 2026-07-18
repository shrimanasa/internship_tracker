from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from app.middleware.logging import RequestLoggingMiddleware

from app.core.config import settings
from app.api.v1 import auth, students, companies, internships, applications, interviews, offers, documents, reminders, notifications, analytics, admin

app = FastAPI(
    title="InternTrack API",
    description="Smart Internship Application and Progress Management System API backend",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Configure CORS (Cross-Origin Resource Sharing)
# Allowing frontend Dev server (Next.js) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, we allow all for simplicity. Can restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)

# Include Routers under /api/v1
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/v1/students", tags=["Student Profiles"])
app.include_router(companies.router, prefix="/api/v1/companies", tags=["Companies"])
app.include_router(internships.router, prefix="/api/v1/internships", tags=["Internships"])
app.include_router(applications.router, prefix="/api/v1/applications", tags=["Applications"])
app.include_router(interviews.router, prefix="/api/v1/interviews", tags=["Interviews"])
app.include_router(offers.router, prefix="/api/v1/offers", tags=["Offers"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(reminders.router, prefix="/api/v1/reminders", tags=["Reminders"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin Portal"])

# Serve static files for uploaded resumes/documents safely in local deployment
UPLOAD_DIR_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR_PATH, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR_PATH), name="uploads")

# Centralized Exception Handler for nice API responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected error occurred on the server.",
            "error_details": str(exc)
        }
    )

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "InternTrack Backend"
    }
