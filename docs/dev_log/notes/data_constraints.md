# Data Integrity Constraints

## CHECK Constraints
- users.role IN ('student', 'admin')
- applications.priority IN ('Low', 'Medium', 'High', 'Critical')
- student_profiles.cgpa BETWEEN 0 AND 10
- offers.offer_status IN ('Pending', 'Accepted', 'Declined', 'Expired')

## UNIQUE Constraints
- users.email
- student_profiles.register_number
- One offer per application

## NOT NULL
- All PKs, FKs, status fields
- user.email, user.password_hash
- application.applied_date, student_id, company_id
