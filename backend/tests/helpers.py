"""Test helper utilities."""

import random
import string
from datetime import date, timedelta


def random_email() -> str:
    prefix = "".join(random.choices(string.ascii_lowercase, k=8))
    return f"{prefix}@test.interntrack.com"

def random_register_number() -> str:
    return f"TEST{random.randint(10000, 99999)}"

def future_date(days: int = 30) -> date:
    return date.today() + timedelta(days=days)
