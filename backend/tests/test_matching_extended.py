"""Extended matching engine tests."""

import pytest


def test_proficiency_values_ordered():
    """Proficiency levels should have increasing numeric values."""
    from app.services.matching import PROFICIENCY_VALUES
    assert PROFICIENCY_VALUES["Beginner"] < PROFICIENCY_VALUES["Intermediate"]
    assert PROFICIENCY_VALUES["Intermediate"] < PROFICIENCY_VALUES["Advanced"]

def test_importance_weights_ordered():
    from app.services.matching import IMPORTANCE_WEIGHTS
    assert IMPORTANCE_WEIGHTS["Low"] < IMPORTANCE_WEIGHTS["Medium"]
    assert IMPORTANCE_WEIGHTS["Medium"] < IMPORTANCE_WEIGHTS["High"]
