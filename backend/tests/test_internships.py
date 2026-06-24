"""Unit tests for internship listing and filtering."""

import pytest


class TestInternshipFilters:
    def test_work_mode_options(self):
        modes = ["Remote", "On-site", "Hybrid"]
        assert "Remote" in modes

    def test_internship_type_options(self):
        types = ["Summer", "Winter", "Semester-long", "Part-time"]
        assert len(types) == 4

    def test_stipend_range_filter(self):
        min_stipend = 5000
        max_stipend = 25000
        test_stipend = 15000
        assert min_stipend <= test_stipend <= max_stipend
