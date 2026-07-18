"""Application status transition validation.

Defines the allowed state machine transitions for application tracking.
Prevents invalid status changes (e.g., jumping from 'Interested' to 'Offer Accepted').
"""

from typing import Dict, Set

# Valid transitions: current_status -> set of allowed next statuses
VALID_TRANSITIONS: Dict[str, Set[str]] = {
    "Interested": {"Applied", "Withdrawn"},
    "Applied": {"Under Review", "OA Received", "Rejected", "Withdrawn"},
    "Under Review": {"OA Received", "Interview Scheduled", "Rejected", "Withdrawn"},
    "OA Received": {"OA Completed", "Interview Scheduled", "Rejected", "Withdrawn"},
    "OA Completed": {"Interview Scheduled", "Rejected", "Withdrawn"},
    "Interview Scheduled": {"Interview Completed", "Rejected", "Withdrawn"},
    "Interview Completed": {"Offer Received", "Rejected", "Withdrawn", "Interview Scheduled"},
    "Offer Received": {"Offer Accepted", "Offer Declined"},
    "Offer Accepted": {"Joining Confirmed"},
    "Offer Declined": set(),
    "Rejected": set(),
    "Withdrawn": set(),
    "Joining Confirmed": set(),
}

ALL_STATUSES = set(VALID_TRANSITIONS.keys())


def is_valid_transition(current_status: str, new_status: str) -> bool:
    """Check if transitioning from current_status to new_status is allowed."""
    allowed = VALID_TRANSITIONS.get(current_status, set())
    return new_status in allowed


def get_allowed_transitions(current_status: str) -> set:
    """Return the set of statuses an application can move to from current_status."""
    return VALID_TRANSITIONS.get(current_status, set())
