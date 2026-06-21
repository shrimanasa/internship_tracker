# ORM Patterns Used

## Relationship Loading
- `selectinload` for eager loading in list queries
- `joinedload` for single-entity detail queries

## Session Management
- Async session with `expire_on_commit=False`
- Dependency injection via `get_db()`
- Auto-commit/rollback in session lifecycle

## Model Conventions
- All models inherit from `Base`
- Timestamps use `DateTime(timezone=True)`
- Soft delete not implemented (direct CASCADE)
