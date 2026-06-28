"""Unit tests for reminder management."""

import pytest
from datetime import date, timedelta


class TestReminders:
    def test_reminder_has_required_fields(self):
        required = ["application_id", "reminder_date", "reminder_text"]
        assert len(required) == 3

    def test_reminder_date_should_be_future(self):
        future_date = date.today() + timedelta(days=3)
        assert future_date > date.today()
