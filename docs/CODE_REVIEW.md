# Code Review Checklist

## General
- [ ] Follows naming conventions
- [ ] No hardcoded values
- [ ] Error handling appropriate
- [ ] No sensitive data in logs

## Backend
- [ ] Type hints on functions
- [ ] Docstrings on public functions
- [ ] Async/await for DB ops
- [ ] Parameterized queries

## Frontend
- [ ] No `any` types
- [ ] Components < 300 lines
- [ ] Toast instead of alert()
- [ ] Loading states shown
