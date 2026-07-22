"""Unit tests for file magic byte validation."""

import pytest
from app.services.file_validation import validate_file_signature


class TestFileValidation:
    def test_valid_pdf(self):
        content = b"%PDF-1.4 fake"
        is_valid, _ = validate_file_signature(content, "pdf")
        assert is_valid is True

    def test_valid_png(self):
        content = b"\x89PNG\r\n\x1a\n fake"
        is_valid, _ = validate_file_signature(content, "png")
        assert is_valid is True

    def test_invalid_pdf(self):
        content = b"Not a PDF"
        is_valid, err = validate_file_signature(content, "pdf")
        assert is_valid is False
        assert "does not match" in err

    def test_unknown_extension_passes(self):
        is_valid, _ = validate_file_signature(b"any", "xyz")
        assert is_valid is True

    def test_empty_bytes(self):
        is_valid, err = validate_file_signature(b"", "pdf")
        assert is_valid is False

