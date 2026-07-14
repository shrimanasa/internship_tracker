# Integration Test Plan

## Scenarios
1. Student registration -> login -> view internships
2. Apply to internship -> status changes -> email sent
3. Schedule interview -> auto-status update
4. Record offer -> accept -> status cascade
5. Upload document -> admin verify

## Tools
- pytest + httpx (async HTTP client)
- TestClient from FastAPI
- Separate test database

## Setup
```bash
cd backend
pytest tests/integration/ -v
```
