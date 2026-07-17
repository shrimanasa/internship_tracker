# 🚀 InternTrack: Smart Internship & Progress Manager

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%2015%20%7C%20React%2019-pink?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-ff69b4?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL%2015-db2777?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Container-Docker%20Compose-ec4899?style=for-the-badge&logo=docker" alt="Docker" />
</p>

**InternTrack** is a college Database Management System (DBMS) laboratory project. It is a full-stack, database-driven application connecting a PostgreSQL database, an async FastAPI backend, and an interactive Next.js frontend styled with a premium **Pink Glassmorphism (frosted glass)** user interface.

It helps college students track their internship application pipelines, matching skills, scheduling interviews, and managing credentials, while providing administrators with a placement console to publish offers, approve documentation, and audit transaction log records in real time.

---

## 🎨 Design System & Aesthetics
The application features a modern **Apple-inspired Glassmorphism** theme built with Tailwind CSS:
* **Frosted White Glass Elements**: Strategic use of `backdrop-filter: blur(24px)` on cards and menus.
* **Cutesy Pink Accents**: Curated pastel-pink highlights (`#ec4899`) and rose gradients.
* **Deep Berry Typography**: High-contrast rose-navy text (`#470a1e`) for a polished, readable look.

---

## 🌟 Key Functional Portals

### 🧑‍🎓 Student Portal
* **Dashboard Tab**: Displays circular profile completion percentage gauge, real-time KPI metrics, and upcoming deadlines.
* **Internship Explorer**: Interactive posting browser showing eligibility scores. Matches student skill levels against posting requirements with dynamic weighting (mandatory skill check).
* **My Tracks (Kanban Board)**: Drag-and-drop styled pipeline (Applied, Online Assessment, Interview Scheduled, Offer Received, Rejected) with customizable application sources.
* **Interviews Planner**: Scheduler to track technical/HR rounds, meeting link bindings, and feedback logs.
* **Document Locker**: File library restricting formats (PDF/Word/Image) and file sizes (< 5MB), and displaying admin verification labels.
* **Notification Drawer**: Active tray fetching alerts for follow-up reminders.

### 👩‍💼 Admin Placement Console
* **College Metrics**: Track placement rates, average stipend distributions, and top-performing engineering branches.
* **Student Roster**: Directory tracking student profile completeness index and account activation controls.
* **Company Manager**: CRUD repository for corporate partners.
* **Internship Publisher**: Custom configurator to set posting requirements, skill importance rankings, and minimum proficiencies.
* **Audit Logs Viewer**: Interactive table displaying transaction logs automatically populated by PostgreSQL trigger procedures.

---

## 🔄 Data Synchronization Flows

### 1. The Local-to-External Pipeline
Students do not apply directly from this portal. When applying to an internship:
1. The **Explore Postings** tab redirects the student to the company's external career URL.
2. After applying externally, the student fills in the internal tracker notes, expected stipend, and the platform source (e.g., *LinkedIn, Indeed, Internshala, Referral*).
3. The application is added to the student's **My Tracks** board for active stage management.

### 2. Gmail SMTP Alerts
* When a student records a new interview round, the backend triggers a background task utilizing **Gmail SMTP** to email a structured HTML notification summary (position details, round type, date, and link) to the student's email address.

---

## 🛠️ Technology Stack
* **Frontend**: Next.js 15, React 19, Tailwind CSS, Lucide Icons, Recharts (D3-based charts).
* **Backend**: FastAPI, SQLAlchemy 2.0 (Asyncpg client), Pydantic v2, Bcrypt, Pytest, Python-jose (JWT).
* **Database**: PostgreSQL 15, PL/pgSQL procedural functions/triggers.

---

## 🚀 Quick Start Guide

Verify that you have **Docker** and **Docker Compose** installed on your Mac/Windows.

### 1. Start the Containers
Open your terminal in the project directory (`internship_tracker`) and run:
```bash
docker-compose up --build
```
This builds the frontend/backend assets, starts PostgreSQL, and executes the database initialization script (`database/init-db.sh`) in the correct sequence.

### 2. Access the Applications
* **Frontend Interface**: [http://localhost:3001](http://localhost:3001)
* **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Demo login Credentials

Use these pre-seeded accounts to explore all portals:

| Role | Username / Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Placement Admin** | `admin@interntrack.com` | `Admin@123` | Student directory, company CRUD, audit logs, reports. |
| **Student Candidate** | `shrimanasa151106@gmail.com` | `Student@123` | Dashboard, Explorer, Kanban pipeline, scheduler. |

---

## ✨ Recent Feature Improvements

We have recently upgraded the platform with several modern and professional production features:
1. **GitHub Profile Integration & Achievements**: Students can now connect their GitHub accounts to display real-time credentials (followers, repos, bio) and unlock achievement badges (e.g., *DBMS Prodigy, Quickdraw, YOLO, Pull Shark*) based on their GitHub username and profile parameters.
2. **Interactive Confetti Celebrations**: Features a custom-coded vanilla canvas particle confetti animation on the Student Dashboard that fires dynamically when the student receives or accepts their dream internship offer.
3. **Database Performance Indexing**: Added a database B-Tree index on `internships(eligibility_cgpa)` to speed up range queries when students filter eligible postings.
4. **Secure Login Rate Limiting**: Added in-memory request tracking and rate limiting validation on auth endpoints (`/login`) to prevent brute-force attacks.
5. **SMTP Application Notifications**: Expanded the SMTP email service to trigger background notification emails to students immediately after they submit a new internship application.
6. **Backend Pagination**: Optimized backend endpoints with query pagination (`skip`/`limit` offsets) to efficiently handle large scales of internship postings.

---

## 📝 Lab Viva Documentation Reference
For detailed explanations for your laboratory viva-voce exams, refer to the documents in the `docs/` folder:
* 📊 **[ER_DIAGRAM.md](docs/ER_DIAGRAM.md)**: Conceptual relational layouts and mapping.
* 📐 **[DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md)**: Normalisation checks (3NF) and database indexes.
* 💾 **[DBMS_CONCEPTS.md](docs/DBMS_CONCEPTS.md)**: ACID transactions, SQL Joins, and Triggers.
* 🎓 **[VIVA_GUIDE.md](docs/VIVA_GUIDE.md)**: Laboratory viva questions & answer key.
