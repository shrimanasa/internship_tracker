# Contributing to InternTrack

Thank you for your interest in contributing to InternTrack! This document provides guidelines for setting up, developing, and submitting changes.

## 🚀 Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ and npm
- Python 3.11+

### Quick Start
```bash
# Clone the repository
git clone https://github.com/shrimanasa/internship_tracker.git
cd internship_tracker

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build
```

### Manual Development
```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Coding Standards

### Python (Backend)
- Follow PEP 8 style guidelines
- Use type hints for all function signatures
- Write docstrings for public functions
- Use `async/await` for database operations

### TypeScript (Frontend)
- Use functional components with hooks
- Prefer named exports for components
- Use TypeScript interfaces for all props
- Follow the existing glassmorphism design system

### SQL (Database)
- Use uppercase for SQL keywords
- Include comments for complex queries
- Name constraints with descriptive prefixes (`fk_`, `chk_`, `uq_`, `idx_`)

## 🔀 Git Workflow

1. Create a feature branch from `main`
2. Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `backend:` / `frontend:` / `database:` for scoped changes
3. Keep commits atomic and well-described
4. Submit a pull request with a clear description

## 🧪 Testing

```bash
# Run backend tests
cd backend && pytest

# Run frontend type checks
cd frontend && npx tsc --noEmit
```

## 📂 Project Structure

```
internship_tracker/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/   # REST API route handlers
│   │   ├── core/     # Config, security, dependencies
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── schemas/  # Pydantic validation schemas
│   │   ├── services/ # Business logic layer
│   │   └── middleware/ # Custom middleware
│   └── tests/        # Pytest test suite
├── frontend/         # Next.js 15 React frontend
│   ├── app/          # App router pages
│   ├── components/   # Reusable UI components
│   └── lib/          # Utilities and API client
├── database/         # PostgreSQL SQL scripts
└── docs/             # Lab documentation
```
