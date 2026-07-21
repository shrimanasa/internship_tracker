# 🏗️ System Architecture

InternTrack follows a **3-tier architecture** with clear separation between presentation, business logic, and data layers.

## Component Diagram

```mermaid
graph TB
    subgraph Client["Frontend (Next.js 16)"]
        LP[Landing Page]
        AUTH[Login / Register]
        SD[Student Dashboard]
        AD[Admin Dashboard]
        API_CLIENT[API Client - lib/api.ts]
    end

    subgraph Server["Backend (FastAPI)"]
        MW[Middleware Layer]
        ROUTES[API Routes - /api/v1/*]
        SERVICES[Service Layer]
        MODELS[ORM Models]
        SCHEMAS[Pydantic Schemas]
    end

    subgraph Data["PostgreSQL 15"]
        TABLES[(19 Tables)]
        VIEWS[(Views)]
        FUNCS[(Functions)]
        TRIGGERS[(Triggers)]
    end

    LP --> AUTH
    AUTH --> SD
    AUTH --> AD
    SD --> API_CLIENT
    AD --> API_CLIENT
    API_CLIENT -->|HTTP/JSON + JWT| MW
    MW --> ROUTES
    ROUTES --> SERVICES
    ROUTES --> MODELS
    ROUTES --> SCHEMAS
    SERVICES --> MODELS
    MODELS -->|SQLAlchemy async| TABLES
    TABLES --> VIEWS
    TABLES --> FUNCS
    TABLES --> TRIGGERS
```

## Layer Responsibilities

### Frontend (Presentation Layer)
| Component | Responsibility |
|-----------|---------------|
| `app/` | Next.js App Router pages (landing, login, register, student, admin) |
| `components/` | Tab-based UI components for student and admin portals |
| `lib/api.ts` | Centralized API client with JWT auth headers |
| `lib/toast.ts` | User feedback notifications |
| `lib/dates.ts` | Date formatting utilities |
| `lib/types.ts` | Shared TypeScript interfaces |

### Database Resilience & Connection Pooling
- PostgreSQL connection pooling managed asynchronously via SQLAlchemy 2.0 and `asyncpg`.
- Configured connection recycling and max overflow safeguards for high concurrency.


### Backend (Business Logic Layer)
| Component | Responsibility |
|-----------|---------------|
| `api/v1/` | 12 REST API route modules (auth, students, companies, etc.) |
| `core/` | Config, security (JWT/bcrypt), CORS, response wrappers |
| `services/` | Skill matching engine, email service, status transitions, file validation |
| `middleware/` | Request logging with response time tracking |
| `models/` | 19 SQLAlchemy ORM models with relationships |
| `schemas/` | Pydantic v2 request/response validation schemas |

### Database (Data Layer)
| Component | Responsibility |
|-----------|---------------|
| `schema.sql` | 19 normalized tables (3NF) |
| `constraints.sql` | Foreign keys, CHECK constraints, UNIQUE constraints |
| `indexes.sql` | B-tree indexes for query optimization |
| `triggers.sql` | Audit logging, status history tracking |
| `functions.sql` | Profile completion calculation, upcoming deadlines |
| `views.sql` | Pre-computed placement dashboard summaries |

## Data Flow

```mermaid
sequenceDiagram
    participant U as Student Browser
    participant F as Next.js Frontend
    participant B as FastAPI Backend
    participant D as PostgreSQL

    U->>F: Login with credentials
    F->>B: POST /api/v1/auth/login
    B->>D: SELECT user by email
    D-->>B: User record
    B-->>F: JWT token + role
    F->>F: Store token in localStorage

    U->>F: Browse internships
    F->>B: GET /api/v1/internships (Bearer JWT)
    B->>B: Middleware: log request + verify JWT
    B->>D: SELECT internships with filters
    D-->>B: Internship list
    B->>B: Compute skill match scores
    B-->>F: JSON response with match %
    F->>U: Render internship cards
```

## Security Architecture

- **Authentication**: JWT tokens with HS256 signing, configurable expiry
- **Password Storage**: bcrypt hashing with random salt
- **Authorization**: Role-based (student/admin) via JWT claims
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: In-memory per-email login throttle (5 attempts/60s)
- **File Upload**: Extension whitelist + magic byte validation + 5MB size cap
- **SQL Injection**: SQLAlchemy ORM parameterized queries throughout
- **Error Handling**: Sanitized error responses (no stack traces in production)
