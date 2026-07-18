import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    # Read settings from env or .env file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Database Configurations
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "interntrack"
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: str = "5432"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/interntrack"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/interntrack"

    # Security Configurations
    JWT_SECRET: str = "8f45a6c1e345f09ab93a1c22d140e948fbd7454c34a2e23924c529ba42398fd1"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Admin Seed Account
    ADMIN_EMAIL: str = "admin@interntrack.com"
    ADMIN_PASSWORD: str = "Admin@123"

    # File Storage
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5 MB
    ALLOWED_EXTENSIONS: str = "pdf,doc,docx,png,jpg,jpeg"

    # SMTP Email Configurations
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [ext.strip().lower() for ext in self.ALLOWED_EXTENSIONS.split(",")]

settings = Settings()
