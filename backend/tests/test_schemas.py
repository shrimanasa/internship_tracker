"""Unit tests for Pydantic schemas."""

import pytest
from app.schemas.schemas import PaginatedResponse


def test_paginated_defaults():
    resp = PaginatedResponse(items=[], total=0)
    assert resp.page == 1
    assert resp.page_size == 20
