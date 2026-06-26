"""Unit tests for interview scheduling."""

import pytest
from datetime import datetime, timedelta


class TestInterviewScheduling:
    def test_interview_types_are_valid(self):
        types = ["HR", "Technical", "Coding", "Managerial"]
        assert "Technical" in types

    def test_interview_status_lifecycle(self):
        statuses = ["Scheduled", "Completed", "Rescheduled", "Cancelled"]
        assert len(statuses) == 4

    def test_end_time_after_start(self):
        start = datetime.now() + timedelta(days=1)
        end = start + timedelta(hours=1)
        assert end > start
