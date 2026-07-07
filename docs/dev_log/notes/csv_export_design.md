# CSV Export Design

## Client-Side (Frontend)
- Generate CSV from in-memory data
- Trigger browser download via Blob URL
- No server round-trip needed
- Supports custom column ordering

## Server-Side (Backend)
- Streaming CSV response via StreamingResponse
- For large datasets that exceed browser memory
- Used in admin export endpoints

## Columns Exported
- Application: company, role, status, applied_date, priority
- Interviews: company, type, date, result
- Offers: company, stipend, status, joining_date
