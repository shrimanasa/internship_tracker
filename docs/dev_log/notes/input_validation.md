# Input Validation Rules

## User Registration
- full_name: 2-100 chars
- email: Valid format (EmailStr)
- password: 8+ chars, upper, lower, digit, special
- role: 'student' or 'admin' only

## Application
- applied_date: Valid date, not future
- priority: Low/Medium/High/Critical
- status: Must be valid pipeline stage

## Internship
- stipend_min <= stipend_max
- deadline >= today (on creation)
- min_cgpa: 0.0 to 10.0
