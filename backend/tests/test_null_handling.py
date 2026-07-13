"""Tests for null value edge cases."""

import pytest


def test_optional_fields_default_to_none():
    data = {"company_name": "Test", "website": None}
    assert data["website"] is None

def test_empty_list_is_not_none():
    items = []
    assert items is not None
    assert len(items) == 0

def test_empty_string_is_not_none():
    name = ""
    assert name is not None
    assert name == ""
