# 📡 API Endpoint Reference

All endpoints are prefixed with `/api/v1`. Authentication is via Bearer JWT tokens.

## 🔐 Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new student account | Public |
| POST | `/auth/login` | Login and receive JWT token | Public |
| GET | `/auth/me` | Get current user profile | Required |

## 👤 Student Profiles
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/students/profile` | Get student profile with skills | Student |
| PUT | `/students/profile` | Update student profile fields | Student |
| POST | `/students/skills` | Add a skill to profile | Student |
| DELETE | `/students/skills/{id}` | Remove a skill from profile | Student |

## 🏢 Companies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/companies` | List all companies | Required |
| POST | `/companies` | Create a new company | Admin |
| PUT | `/companies/{id}` | Update company details | Admin |
| DELETE | `/companies/{id}` | Remove a company | Admin |

## 💼 Internships
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/internships` | Browse open internships (paginated) | Optional |
| GET | `/internships/{id}` | Get internship details with skill match | Optional |
| POST | `/internships` | Publish a new internship | Admin |
| PUT | `/internships/{id}` | Edit an internship | Admin |

## 📋 Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications` | List student's applications | Student |
| GET | `/applications/{id}` | Get application details | Student |
| POST | `/applications` | Submit a new application | Student |
| PUT | `/applications/{id}` | Update application status/notes | Student |
| DELETE | `/applications/{id}` | Archive an application | Student |
| GET | `/applications/export/csv` | Export applications as data | Student |

## 🎤 Interviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/interviews` | List scheduled interviews | Student |
| POST | `/interviews` | Schedule a new interview | Student |
| PUT | `/interviews/{id}` | Update interview details | Student |

## 📄 Documents
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/documents` | List uploaded documents | Student |
| POST | `/documents/upload` | Upload a document (max 5MB) | Student |
| DELETE | `/documents/{id}` | Delete a document | Student |

## 📊 Analytics & Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/analytics/dashboard` | Get student dashboard metrics | Student |
| GET | `/admin/students` | List all students | Admin |
| GET | `/admin/audit-logs` | View system audit logs | Admin |
| GET | `/admin/reports` | Generate placement reports | Admin |

## 🔧 System
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Service health + DB connectivity | Public |

---

> **Interactive Docs**: When running locally, visit [http://localhost:8000/api/docs](http://localhost:8000/api/docs) for the auto-generated Swagger UI.
