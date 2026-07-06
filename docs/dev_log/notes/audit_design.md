# Audit Log Design

## Schema
```sql
audit_logs (
  log_id SERIAL PK,
  table_name VARCHAR(50),
  record_id INTEGER,
  action_type VARCHAR(10), -- INSERT/UPDATE/DELETE
  changed_data JSONB,      -- {old_values, new_values}
  changed_by INTEGER FK,
  changed_at TIMESTAMPTZ
)
```

## JSONB Payload Example
```json
{
  "old_values": {"current_status": "Applied"},
  "new_values": {"current_status": "Under Review"}
}
```
