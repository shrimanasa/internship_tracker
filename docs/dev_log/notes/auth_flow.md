# Authentication Flow

## Registration
1. Client POST /api/v1/auth/register
2. Server validates email uniqueness
3. Password hashed with bcrypt
4. User + StudentProfile created atomically

## Login
1. Client POST /api/v1/auth/login (OAuth2 form)
2. Rate limit check (5 per 60 seconds)
3. bcrypt password verification
4. JWT token with email + role claims

## Protected Routes
1. Bearer token in Authorization header
2. get_current_user decodes JWT
3. get_current_student validates role
4. get_current_admin validates admin
