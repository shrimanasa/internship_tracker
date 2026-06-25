"""Unit tests for application tracking endpoints."""

import pytest
from app.services.status_transitions import is_valid_transition, get_allowed_transitions


class TestStatusTransitions:
    def test_interested_to_applied(self):
        assert is_valid_transition("Interested", "Applied") is True

    def test_interested_cannot_jump_to_offer(self):
        assert is_valid_transition("Interested", "Offer Received") is False

    def test_rejected_is_terminal(self):
        assert len(get_allowed_transitions("Rejected")) == 0

    def test_offer_can_accept_or_decline(self):
        allowed = get_allowed_transitions("Offer Received")
        assert "Offer Accepted" in allowed
        assert "Offer Declined" in allowed
