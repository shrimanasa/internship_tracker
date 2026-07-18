"""File content validation using magic bytes (file signatures).

Validates uploaded files by checking their binary headers to prevent
extension spoofing attacks (e.g., a .exe renamed to .pdf).
"""

from typing import Optional, Tuple

# Magic byte signatures for allowed file types
FILE_SIGNATURES = {
    "pdf": [(b"%PDF", 0)],
    "png": [(b"\x89PNG\r\n\x1a\n", 0)],
    "jpg": [(b"\xff\xd8\xff", 0)],
    "jpeg": [(b"\xff\xd8\xff", 0)],
    "doc": [(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1", 0)],  # OLE2 compound format
    "docx": [(b"PK\x03\x04", 0)],  # ZIP archive (OOXML)
}


def validate_file_signature(content: bytes, declared_extension: str) -> Tuple[bool, Optional[str]]:
    """Validate that file content matches its declared extension.

    Args:
        content: The raw file bytes (at least first 16 bytes).
        declared_extension: The file extension (without dot), e.g. 'pdf'.

    Returns:
        Tuple of (is_valid, error_message).
    """
    ext = declared_extension.lower().strip(".")

    if ext not in FILE_SIGNATURES:
        return True, None  # No signature check available for this type

    signatures = FILE_SIGNATURES[ext]
    for magic_bytes, offset in signatures:
        if content[offset:offset + len(magic_bytes)] == magic_bytes:
            return True, None

    return False, f"File content does not match declared .{ext} format. Upload rejected for security."
