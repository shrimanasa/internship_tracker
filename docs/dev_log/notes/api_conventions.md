# API Conventions

## URL Structure
- Base: `/api/v1/`
- Resources: plural nouns
- CRUD: GET (list), POST (create), PUT (update), DELETE (remove)

## HTTP Status Codes
- 200: Success
- 201: Created
- 204: Deleted
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 429: Rate limited
- 500: Server error

## Auth Header
- `Authorization: Bearer <jwt_token>`
