# InternTrack

### Smart Internship Application & Progress Management System

**InternTrack** is a college DBMS project designed as a complete, functional, database-driven web application. It connects a FastAPI (Python) backend to a PostgreSQL relational database and provides a Next.js frontend with Apple-style Glassmorphism aesthetics.

---

## 1. Project Architecture & Features

The system is structured as follows:

* **Student Portal**:
  * Dashboard overview with stats and circular profile completion widget.
  * Internship Explorer with dynamic weight-based match scoring and eligibility checks.
  * Kanban Board/Table views of application tracks.
  * Drag-and-Drop styled document library (resumes, certificates) with verification states.
  * Reminders, notifications, and personal analytics graphs (Recharts).
* **Placement Administration Console**:
  * Metrics dashboard (placement rate, active postings).
  * Company CRUD manager and Internship publisher (dynamic skill configuration).
  * Student directory, CSV report exports (placed students, skill gaps), and system Audit Logs.
* **Database (PostgreSQL)**:
  * 19 core tables with complete PK/FK relations, constraints, indexes, views, and PL/pgSQL routines.
  * Session-context trigger-based auditing logs table changes to `audit_logs` automatically.

---

## 2. Technology Stack

* **Frontend**: Next.js 15 (React, TypeScript), Tailwind CSS, Lucide Icons, Recharts.
* **Backend**: FastAPI, SQLAlchemy (asyncpg), Pydantic, JWT Auth, Bcrypt.
* **Database**: PostgreSQL 15, PL/pgSQL procedural triggers/functions.
* **Orchestration**: Docker, Docker Compose.

---

## 3. Quick Start Guide

Verify that you have **Docker** and **Docker Compose** installed on your system.

### Build and Run Containers
Run the following command in the root folder to boot up all services (database, backend, and frontend):
```bash
docker-compose up --build
```

The database container will start, run the sequential initialization shell script (`database/init-db.sh`), and seed the database automatically.

### Access Portals
* **Frontend Portal**: [http://localhost:3000](http://localhost:3000)
* **Backend API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 4. Demo Login Credentials

Use the following credentials to sign in and explore features:

### 1. Placement Verification Officer (Admin)
* **Email**: `admin@interntrack.com`
* **Password**: `Admin@123`

### 2. Candidate (Student Profile)
* **Email**: `aarav.patel@student.edu`
* **Password**: `Student@123`

---

## 5. Project Documentation

Refer to the following Markdown documents under the `docs/` folder:
* **[ER_DIAGRAM.md](docs/ER_DIAGRAM.md)**: Visual Mermaid ER diagram and table schemas.
* **[DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md)**: Normalisation (3NF), Check constraints, and B-Tree indexes.
* **[DBMS_CONCEPTS.md](docs/DBMS_CONCEPTS.md)**: ACID mapping, TCL transactional controls, Joins, and Triggers.
* **[VIVA_GUIDE.md](docs/VIVA_GUIDE.md)**: Viva-voce Q&A and project explanations.
