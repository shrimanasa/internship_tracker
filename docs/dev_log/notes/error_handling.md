# Error Handling Strategy

## Backend
- HTTPException for expected errors (400, 404)
- Global exception handler for unexpected errors
- Sanitized messages in production
- Full stack trace in server logs only

## Frontend
- ErrorBoundary component wraps each tab
- Toast notifications for API errors
- Retry button on failure states
- Empty states for zero data
