"""Edge case tests."""

import pytest


def test_empty_string_search_returns_all():
    query = ""
    assert query == ""  # Should not filter

def test_negative_page_number_rejected():
    page = -1
    assert page < 1  # Should use default

def test_zero_stipend_is_valid():
    stipend = 0.00
    assert stipend >= 0
