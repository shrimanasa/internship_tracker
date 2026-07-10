# Bug Fix Log

| Date | Bug | Fix | File |
|------|-----|-----|------|
| Jul 18 | Wrong interview attrs in email | Use interview_round, interview_type | interviews.py |
| Jul 18 | Missing datetime import | Added import | documents.py |
| Jul 18 | Raw SQL string | Wrapped with text() | documents.py |
| Jul 18 | Deprecated utcnow | Used timezone-aware now() | models.py |
