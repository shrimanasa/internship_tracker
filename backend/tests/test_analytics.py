"""Unit tests for analytics."""

import pytest

def test_placement_rate():
    placed, total = 45, 100
    assert (placed / total) * 100 == 45.0

def test_department_list():
    depts = ["CSE", "ECE", "EEE", "ME", "CE", "IT"]
    assert len(depts) == 6
