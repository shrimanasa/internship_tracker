#!/bin/bash
set -e

echo "=== Initializing Local Git Repository ==="

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  git init
fi

# Set dummy user name and email locally if not set, so commits succeed
git config --local user.name "Developer"
git config --local user.email "developer@interntrack.com"

# Helper function to stage and commit
commit_step() {
  local pattern="$1"
  local message="$2"
  
  # Stage files matching pattern
  git add "$pattern"
  
  # Check if there are changes staged
  if ! git diff-index --quiet HEAD -- 2>/dev/null || [ -z "$(git log -1 2>/dev/null)" ]; then
    git commit -m "$message"
    echo "Committed: $message"
  else
    echo "No changes to commit for pattern: $pattern"
  fi
}

# 1. Initial Commit
touch .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".env" >> .gitignore
echo "uploads/" >> .gitignore
commit_step ".gitignore" "Initial commit: Add gitignore rules"

# 2. Database Schema
commit_step "database/schema.sql" "database: Create core table structures"

# 3. Database Constraints
commit_step "database/constraints.sql" "database: Add PK, FK, and domain CHECK constraints"

# 4. Database Indexes
commit_step "database/indexes.sql" "database: Create B-Tree query optimization indexes"

# 5. Database Views
commit_step "database/views.sql" "database: Implement analytics and dashboard reporting views"

# 6. Database Functions
commit_step "database/functions.sql" "database: Code skill-matching algorithms and eligibility checks"

# 7. Database Triggers
commit_step "database/triggers.sql" "database: Enforce audit logging and application validation triggers"

# 8. Database Seed Data
commit_step "database/seed.sql" "database: Populate mock Indian colleges and company dataset"

# 9. Database Viva Queries
commit_step "database/sample_queries.sql" "database: Add 20 lab viva queries for student assessment"

# 10. Database Init Script
commit_step "database/init-db.sh" "database: Add sequential docker-entrypoint container init script"

# 11. Backend Config & Requirements
commit_step "backend/requirements.txt" "backend: Add FastAPI dependencies and requirements"
commit_step "backend/app/core/" "backend: Set up security configurations, JWT auth, and deps"

# 12. Backend Models
commit_step "backend/app/models/" "backend: Define SQLAlchemy relational schema models"

# 13. Backend Schemas
commit_step "backend/app/schemas/" "backend: Create Pydantic input validation and output serialization schemas"

# 14. Backend Matching Service
commit_step "backend/app/services/" "backend: Implement weight-based skill gap matching service"

# 15. Backend Routers Phase 1
commit_step "backend/app/api/v1/auth.py" "backend: Build authorization and token issue endpoints"
commit_step "backend/app/api/v1/students.py" "backend: Build student profile management router"
commit_step "backend/app/api/v1/companies.py" "backend: Build company directory CRUD endpoints"

# 16. Backend Routers Phase 2
commit_step "backend/app/api/v1/internships.py" "backend: Build internship explorer and publisher endpoints"
commit_step "backend/app/api/v1/applications.py" "backend: Build application tracking pipeline endpoints"
commit_step "backend/app/api/v1/interviews.py" "backend: Build interview coordinator scheduler endpoints"

# 17. Backend Routers Phase 3
commit_step "backend/app/api/v1/documents.py" "backend: Build document upload and file verification endpoints"
commit_step "backend/app/api/v1/reminders.py" "backend: Build reminders and notifications router"
commit_step "backend/app/api/v1/analytics.py" "backend: Build stats aggregation and reports router"
commit_step "backend/app/api/v1/admin.py" "backend: Build audit logs and user management router"

# 18. Backend Main & Dockerfile
commit_step "backend/app/main.py" "backend: Add FastAPI entrypoint main app"
commit_step "backend/Dockerfile" "backend: Add multi-stage Dockerfile"

# 19. Backend Tests
commit_step "backend/tests/" "backend: Add pytest test client validation suite"

# 20. Frontend Initial config
commit_step "frontend/package.json" "frontend: Bootstrap Next.js 15 app dependencies"
commit_step "frontend/app/globals.css" "frontend: Set up Apple-style glassmorphism styling variables"

# 21. Frontend API Client
commit_step "frontend/lib/" "frontend: Configure cookie-less API client utilities"

# 22. Frontend Components
commit_step "frontend/components/" "frontend: Develop dashboard tabs, kanban, and charts components"

# 23. Frontend Pages
commit_step "frontend/app/page.tsx" "frontend: Develop landing page"
commit_step "frontend/app/login/" "frontend: Create login page with quick-login selectors"
commit_step "frontend/app/register/" "frontend: Create registration form with input schema validation"
commit_step "frontend/app/student/" "frontend: Implement SPA Student Portal dashboard view"
commit_step "frontend/app/admin/" "frontend: Implement Admin verification console view"
commit_step "frontend/Dockerfile" "frontend: Add frontend Alpine Node environment Dockerfile"

# 24. Docker compose orchestration
commit_step "docker-compose.yml" "deployment: Orchesrate containers with db healthchecks"

# 25. System Documentation
commit_step "docs/" "docs: Add ER Diagram, Normalisation, DBMS Concepts, and Viva Guide reports"
commit_step "README.md" "docs: Add setup instructions and root project README"

# Commit any leftover files
git add .
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  git commit -m "chore: Clean up and include all residual project files"
  echo "Committed residual files."
fi

echo "=== Local Git History Generated Successfully (Total Commits: $(git log --oneline | wc -l)) ==="
