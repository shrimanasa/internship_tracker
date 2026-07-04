# Environment Variables

## Required
| Variable | Description | Default |
|----------|------------|--------|
| POSTGRES_HOST | DB hostname | db |
| POSTGRES_PORT | DB port | 5432 |
| POSTGRES_DB | DB name | interntrack |
| POSTGRES_USER | DB user | postgres |
| POSTGRES_PASSWORD | DB password | postgres |
| JWT_SECRET | Token signing key | (required) |

## Optional
| Variable | Description | Default |
|----------|------------|--------|
| CORS_ORIGINS | Allowed origins | * |
| ACCESS_TOKEN_EXPIRE_MINUTES | JWT expiry | 60 |
| SMTP_HOST | Email server | smtp.gmail.com |
| SMTP_USER | Email address | (none) |
| SMTP_PASSWORD | Email password | (none) |
| MAX_UPLOAD_SIZE | File limit bytes | 5242880 |
