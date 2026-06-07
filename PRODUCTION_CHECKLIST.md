# 🚀 ScamShield AI — Production Deployment Checklist

## Pre-Deployment (DO THIS BEFORE DEPLOYING)

### 1. Security
- [ ] Generate new AUTH_SECRET: `openssl rand -base64 32`
- [ ] Store SECRET securely (NOT in .env)
- [ ] Verify Stripe webhook signing enabled
- [ ] Confirm database backups configured
- [ ] Enable 2FA on admin accounts

### 2. Environment Variables
Set these in Render dashboard (NOT in code):
```
NODE_ENV=production
AUTH_SECRET=<generated-random-32+-char-value>
AUTH_URL=https://scamshield-api.onrender.com
NEXTAUTH_URL=https://scamshield-api.onrender.com
NEXT_PUBLIC_APP_URL=https://scamsheildai-chi.vercel.app
AUTH_TRUST_HOST=true
DATABASE_URL=<auto-from-render-postgres>
```

### 3. Database
- [ ] Run migrations: `npm run db:push`
- [ ] Verify PostgreSQL connection
- [ ] Test backups restore
- [ ] Monitor disk space

### 4. Testing
- [ ] Test /api/health endpoint
- [ ] Verify rate limiting works
- [ ] Test scan endpoint: `POST /api/scan`
- [ ] Test chat endpoint: `POST /api/chat`
- [ ] Verify admin stats: `GET /api/admin/stats`
- [ ] Test error handling with invalid inputs

---

## Deployment Steps

### On Render Dashboard:
1. Click **New** → **Blueprint**
2. Connect GitHub repo
3. Render reads `render.yaml` and creates:
   - PostgreSQL database
   - Node.js web service
4. Add environment variables (see above)
5. Deploy
6. Wait for build to complete

### Verify Deployment:
```bash
# Check health
curl https://scamshield-api.onrender.com/api/health

# Expected response:
{
  "status": "ok",
  "services": {
    "database": true,
    "redis": false,
    "openai": false
  }
}
```

---

## Post-Deployment

### 1. Monitoring
- [ ] Enable Render logging
- [ ] Set up alerts for 5xx errors
- [ ] Monitor database connections
- [ ] Watch for rate limit violations

### 2. Performance
- [ ] Check response times (target: < 500ms)
- [ ] Verify no memory leaks
- [ ] Monitor CPU usage
- [ ] Check database query times

### 3. Security
- [ ] Verify HTTPS forced (HSTS headers)
- [ ] Test CSP headers
- [ ] Check for exposed secrets (git log)
- [ ] Verify auth sessions working

### 4. Backups
- [ ] Enable automated backups
- [ ] Test restore procedure
- [ ] Document backup schedule
- [ ] Set retention policy (30+ days)

---

## Troubleshooting

### Build Fails
```bash
# Check build logs
# Solution: Usually missing environment variable
# Check PRODUCTION_AUDIT.md for required vars
```

### 503 Service Unavailable
```bash
# Check if database is connected
# Verify DATABASE_URL is correct
# Check Render PostgreSQL service status
```

### 502 Bad Gateway
```bash
# Service crashed
# Check Render logs for errors
# Verify AUTH_SECRET is set correctly
```

### Rate Limit Issues
```bash
# Too many requests from single IP
# Check /api/health endpoint
# May need Redis for distributed rate limiting
```

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Verify backups completed
- [ ] Monitor user growth

### Monthly
- [ ] Review security logs
- [ ] Update dependencies (if needed)
- [ ] Test disaster recovery
- [ ] Update DNS records

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] Documentation update

---

## Emergency Contacts
- Render Support: https://render.com/support
- GitHub Status: https://www.githubstatus.com
- PostgreSQL Docs: https://www.postgresql.org/docs
