"""Tests for custom validators."""

import pytest
from datetime import date


def test_cgpa_in_valid_range():
    for cgpa in [0.0, 5.0, 10.0]:
        assert 0.0 <= cgpa <= 10.0

def test_cgpa_out_of_range():
    assert not (0.0 <= -1.0 <= 10.0)
    assert not (0.0 <= 11.0 <= 10.0)

def test_graduation_year_range():
    current = date.today().year
    valid = range(current, current + 7)
    assert 2027 in valid

def test_semester_range():
    for sem in range(1, 9):
        assert 1 <= sem <= 8
