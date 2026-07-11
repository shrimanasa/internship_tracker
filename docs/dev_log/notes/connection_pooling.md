# Database Connection Pooling

## SQLAlchemy AsyncEngine Config
```python
create_async_engine(
    DATABASE_URL,
    pool_size=10,        # Persistent connections
    max_overflow=20,     # Burst capacity
    pool_timeout=30,     # Wait for connection
    pool_recycle=1800,   # Recycle after 30min
    echo=False,          # No SQL logging in prod
)
```

## Why Pooling Matters
- Connection creation: ~50ms
- Pool reuse: ~0.1ms
- 500x improvement on repeated queries
