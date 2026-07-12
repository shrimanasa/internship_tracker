# Code Comment Standards

## When to Comment
- Complex algorithms (matching engine)
- Non-obvious business logic (status transitions)
- Workarounds with TODO markers
- Public API function docstrings

## When NOT to Comment
- Self-explanatory variable names
- Simple CRUD operations
- Obvious type annotations

## Format
```python
# Single line for brief notes

"""Docstring for functions.

Args:
    param: Description

Returns:
    Description
"""
```
