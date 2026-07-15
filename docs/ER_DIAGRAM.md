# InternTrack Entity-Relationship (ER) Diagram

This document contains the complete database ER diagram representing the **InternTrack** relational schema, implemented using Mermaid notation.

## Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o| student_profiles : "has profile"
    users ||--o| audit_logs : "performs changes"
    departments ||--o{ student_profiles : "belongs to"
    student_profiles ||--o{ education : "records"
    student_profiles ||--o{ student_skills : "has skills"
    student_profiles ||--o{ saved_internships : "saves"
    student_profiles ||--o{ applications : "submits"
    student_profiles ||--o{ reminders : "receives"
    student_profiles ||--o{ notifications : "reads"
    student_profiles ||--o{ notes : "writes"
    skills ||--o{ student_skills : "mapped to student"
    skills ||--o{ required_skills : "demanded by internship"
    companies ||--o{ internships : "posts"
    companies ||--o{ applications : "hires via"
    internships ||--o{ required_skills : "requires"
    internships ||--o{ saved_internships : "is saved"
    internships ||--o{ applications : "receives"
    applications ||--o{ status_history : "tracks stages"
    applications ||--o{ interviews : "schedules"
    applications ||--o{ offers : "results in"
    applications ||--o{ documents : "attaches"
    applications ||--o{ reminders : "triggers"
    applications ||--o{ notes : "logs comments"

    users {
        int user_id PK
        varchar full_name
        varchar email UK
        varchar hashed_password
        varchar role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    departments {
        int department_id PK
        varchar department_name UK
        varchar department_code UK
    }

    student_profiles {
        int student_id PK
        int user_id FK
        varchar register_number UK
        int department_id FK
        varchar phone_number
        int graduation_year
        int current_semester
        numeric cgpa
        varchar location
        varchar preferred_work_mode
        varchar preferred_roles
        text bio
        varchar linkedin_url
        varchar github_url
        varchar portfolio_url
        int profile_completion_percentage
        timestamp updated_at
    }

    education {
        int education_id PK
        int student_id FK
        varchar institution_name
        varchar qualification
        varchar specialization
        int start_year
        int end_year
        numeric score
        varchar score_type
    }

    skills {
        int skill_id PK
        varchar skill_name UK
        varchar category
    }

    student_skills {
        int student_id PK, FK
        int skill_id PK, FK
        varchar proficiency_level
        numeric years_of_experience
        boolean verified
        timestamp updated_at
    }

    companies {
        int company_id PK
        varchar company_name UK
        varchar industry
        varchar company_size
        varchar website_url
        varchar linkedin_url
        varchar headquarters
        text description
        varchar logo_url
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    internships {
        int internship_id PK
        int company_id FK
        varchar title
        text description
        varchar location
        varchar work_mode
        varchar internship_type
        int duration
        numeric stipend_min
        numeric stipend_max
        varchar currency
        numeric eligibility_cgpa
        timestamp application_deadline
        int number_of_openings
        varchar application_url
        varchar source
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    required_skills {
        int internship_skill_id PK
        int internship_id FK
        int skill_id FK
        varchar importance_level
        varchar minimum_proficiency
        boolean is_mandatory
    }

    saved_internships {
        int student_id PK, FK
        int internship_id PK, FK
        timestamp saved_at
    }

    applications {
        int application_id PK
        int student_id FK
        int internship_id FK
        int company_id FK
        varchar external_company_name
        varchar external_role_title
        varchar application_source
        date applied_date
        varchar current_status
        varchar priority
        varchar application_url
        varchar job_reference_id
        numeric expected_stipend
        text notes
        varchar next_action
        date next_action_date
        boolean is_archived
        timestamp created_at
        timestamp updated_at
    }

    status_history {
        int status_history_id PK
        int application_id FK
        varchar old_status
        varchar new_status
        text change_remarks
        timestamp changed_at
        int changed_by FK
    }

    interviews {
        int interview_id PK
        int application_id FK
        int interview_round
        varchar interview_type
        timestamp scheduled_start
        timestamp scheduled_end
        varchar meeting_link
        varchar location
        varchar interviewer_name
        varchar interview_status
        text preparation_notes
        text feedback_notes
        varchar result
        timestamp created_at
        timestamp updated_at
    }

    offers {
        int offer_id PK
        int application_id FK
        numeric offered_stipend
        date offer_date
        date joining_date
        date deadline_date
        varchar offer_letter_path
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    documents {
        int document_id PK
        int student_id FK
        int application_id FK
        varchar document_type
        varchar original_filename
        varchar stored_filename
        varchar file_path
        varchar mime_type
        int file_size
        varchar verification_status
        timestamp uploaded_at
        int verified_by FK
    }

    reminders {
        int reminder_id PK
        int student_id FK
        int application_id FK
        varchar title
        text description
        timestamp reminder_datetime
        varchar reminder_type
        boolean is_completed
        timestamp created_at
    }

    notifications {
        int notification_id PK
        int user_id FK
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    notes {
        int note_id PK
        int student_id FK
        varchar title
        text content
        timestamp created_at
        timestamp updated_at
    }

    audit_logs {
        int audit_id PK
        varchar table_name
        varchar action_type
        int record_id
        jsonb old_value
        jsonb new_value
        int performed_by FK
        timestamp timestamp
    }
```
