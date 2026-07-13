# Null Value Handling

## Backend
- Optional fields use `Optional[T] = None`
- Pydantic validates nullability
- SQLAlchemy uses `nullable=True/False`

## Frontend
- Optional chaining: `data?.field`
- Nullish coalescing: `value ?? default`
- Empty state components for zero data

## Database
- COALESCE for null fallbacks
- LEFT JOIN for optional relations
- IS NOT NULL in filters
