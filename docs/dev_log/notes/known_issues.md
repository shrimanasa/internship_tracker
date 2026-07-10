# Known Issues

## Low Priority
- [ ] Pagination offset can exceed total count (returns empty)
- [ ] Long company names overflow card width on mobile
- [ ] Chart tooltips hidden behind sidebar on tablet

## Medium Priority
- [ ] Rate limiter uses in-memory store (resets on restart)
- [ ] File upload accepts duplicate filenames (UUID prevents conflict)

## Resolved
- [x] Interview email wrong attributes (fixed Jul 18)
- [x] datetime.utcnow deprecation (fixed Jul 18)
- [x] Error details exposed in production (fixed Jul 18)
