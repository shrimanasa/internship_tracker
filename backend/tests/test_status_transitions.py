"""Extended edge case tests for status transitions."""

import pytest
from app.services.status_transitions import is_valid_transition, VALID_TRANSITIONS


class TestTransitionEdgeCases:
    def test_same_status_is_invalid(self):
        for status in VALID_TRANSITIONS:
            assert is_valid_transition(status, status) is False

    def test_unknown_status_returns_false(self):
        assert is_valid_transition("NonExistent", "Applied") is False

    def test_interview_completed_can_loop_back(self):
        assert is_valid_transition("Interview Completed", "Interview Scheduled") is True
