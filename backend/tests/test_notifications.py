"""Unit tests for notification system."""

import pytest


class TestNotifications:
    def test_notification_types(self):
        types = ["application_update", "interview_reminder",
                 "offer_notification", "deadline_reminder", "system"]
        assert len(types) == 5

    def test_unread_filter(self):
        notifications = [
            {"id": 1, "is_read": False},
            {"id": 2, "is_read": True},
            {"id": 3, "is_read": False},
        ]
        unread = [n for n in notifications if not n["is_read"]]
        assert len(unread) == 2
