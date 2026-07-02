# Testing Strategy

## Test Pyramid
- Unit Tests (pytest)
- Integration Tests (pytest + httpx)
- E2E Tests (Playwright - planned)

## Running Tests
```bash
cd backend
pytest -v
pytest -v -k matching
```
