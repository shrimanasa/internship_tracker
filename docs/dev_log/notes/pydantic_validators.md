# Custom Pydantic Validators

## Email Normalization
- Trim whitespace
- Convert to lowercase
- Validate format via EmailStr

## Date Validation
- applied_date cannot be in the future
- deadline must be >= today on creation
- scheduled_end must be after scheduled_start

## Numeric Ranges
- CGPA: 0.0 to 10.0
- Stipend: >= 0
- Semester: 1 to 8
- Graduation year: current year to +6
