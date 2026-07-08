# Middleware Stack

## Order (outermost first)
1. CORSMiddleware - Cross-origin headers
2. RequestLoggingMiddleware - Log requests + response time
3. CorrelationIdMiddleware - X-Request-ID header

## Request Flow
```
Client -> CORS -> Logging -> Correlation -> Route Handler
                                         <- Response
```

## Logging Format
```
INFO: GET /api/v1/internships 200 45ms
INFO: POST /api/v1/applications 201 120ms
```
