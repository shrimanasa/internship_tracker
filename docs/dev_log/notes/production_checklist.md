# Production Deployment Checklist

## Pre-Deploy
- [ ] All tests passing
- [ ] .env configured with real secrets
- [ ] CORS origins restricted
- [ ] Debug mode disabled
- [ ] HTTPS configured

## Deploy
- [ ] Database migrations applied
- [ ] Docker images built
- [ ] Health check passing
- [ ] Monitoring configured

## Post-Deploy
- [ ] Smoke test all endpoints
- [ ] Verify email notifications
- [ ] Check audit logs working
- [ ] Monitor error rates
