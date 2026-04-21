# Rollback Strategy & Recovery Procedures

**Last Updated**: April 20, 2026  
**Target Launch Date**: April 20, 2026

---

## Overview

This document outlines the procedures to rollback **Rate My Performance CFU** in case of critical issues requiring recovery from production deployment.

**Scope**: Covers both frontend (Vercel) and backend (Render) with database migration rollback.

---

## Pre-Rollback Checklist

Before executing a rollback:

1. **Assess severity**: Is the issue blocking core functionality (comments, voting, page loading)?
2. **Verify recovery method**: Determine if rollback is needed or if a hot-fix is faster
3. **Notify stakeholders**: Inform testers/clients of expected downtime (typically 5-10 minutes)
4. **Back up current state**: Document the current commit SHA and deployment IDs for reference
5. **Test rollback locally** (if time permits): Verify the previous version runs locally

---

## Frontend Rollback (Vercel)

### **Option 1: Quick Rollback via Vercel Dashboard (Recommended)**

**Time**: ~2 minutes  
**Risk**: Very low

1. Go to [vercel.com](https://vercel.com)
2. Select **Rate My Performance** project
3. Click **Deployments** tab
4. Find the last known good deployment (most recent before the failed one)
5. Click **...** menu and select **Rollback to this deployment**
6. Confirm the rollback
7. Vercel will immediately promote the previous deployment to production

**Verify**: 
- Visit `https://ratemyperformancecfu.com` in a new browser
- Check that pages load and comments/voting work
- Check browser console for errors

---

### **Option 2: Redeploy Previous Commit (Manual)**

**Time**: ~5-10 minutes  
**Risk**: Low; allows verification before deploy

1. Identify the previous good commit:
   ```powershell
   git log --oneline -10
   ```
2. Note the commit SHA of the last stable version
3. Go to Vercel dashboard → **Git** settings
4. Manually trigger a deploy from that commit:
   ```powershell
   git checkout <previous-commit-sha>
   git push origin main --force
   ```
   ⚠️ **Only use `--force` if absolutely necessary; coordinate with team first**

5. Or: In Vercel dashboard, go to **Deployments** → select previous commit → trigger redeploy

**Verify**: Same as Option 1

---

## Backend Rollback (Render)

### **Database Migration Rollback (CRITICAL)**

⚠️ **Database rollbacks require careful coordination. Do NOT skip this step.**

#### Step 1: Identify the last known good migration

1. SSH into the Render container or use Render's shell:
   ```powershell
   cd /app/server
   npm run prisma:migrate
   ```
   This will list all applied migrations and their status.

2. Note the migration name/timestamp of the last stable version

#### Step 2: Rollback the migration

1. In the Render environment, execute:
   ```powershell
   npm run prisma:migrate resolve --rolled-back <migration_name>
   ```
   Example:
   ```powershell
   npm run prisma:migrate resolve --rolled-back 20260330_add_analytics_fields
   ```

2. This marks the migration as "rolled back" in the `_prisma_migrations` table

#### Step 3: Redeploy the backend server

**Option A: Via Git (Cleanest)**
```powershell
git checkout <previous-stable-commit>
git push origin main
# Render will auto-detect and redeploy
```

**Option B: Via Render Dashboard**
1. Go to [render.com](https://render.com)
2. Select **Rate My Performance API** service
3. Click **Manual Deploy**
4. Select the branch/commit to redeploy

---

### **Backend Code Rollback (without DB changes)**

If the issue is in application logic (not database schema):

1. Identify the last good commit
2. In your local repo:
   ```powershell
   git checkout <previous-commit>
   git push origin main  # Render watches main branch
   ```
3. Render will auto-detect and redeploy

---

## Data Recovery (If Needed)

### **Scenario: Accidental data deletion or corruption**

⚠️ **Database backups are critical; verify backups exist before launch**

1. **Check Render's automated backups**:
   - Go to Render dashboard → **PostgreSQL** database
   - Look for **Backups** section (usually available in paid plans)
   - Restore from the most recent backup before the incident

2. **Manual restoration (if no Render backups)**:
   - Contact your database provider or restore from your own backup service
   - Restore to a point-in-time before the corruption

3. **Verify data integrity**:
   ```powershell
   psql <database-url> -c "SELECT COUNT(*) FROM comments;"
   psql <database-url> -c "SELECT COUNT(*) FROM votes;"
   ```

---

## Post-Rollback Verification

After any rollback, verify the following:

### **Frontend Checks**
- [ ] Home page loads without errors (check console)
- [ ] Post displays with comments
- [ ] Can post a new comment (without actual submission, just form interaction)
- [ ] Like/dislike voting UI responds
- [ ] Navigation to other pages works (Rules, Privacy, etc.)
- [ ] Mobile layout is responsive

### **Backend Checks**
- [ ] API endpoints respond:
  ```powershell
  curl https://api.ratemyperformance.com/api/posts
  curl https://api.ratemyperformance.com/api/comments
  ```
- [ ] No error logs in Render
- [ ] Database connection is active

### **Integration Checks**
- [ ] Submit a test comment end-to-end
- [ ] Vote on a comment
- [ ] Report a comment (moderation flow)
- [ ] Check Sentry for errors (should see none or only expected errors)

---

## Escalation & Communication

### **If rollback fails or issues persist:**

1. **Document the failure**:
   - Screenshots of errors
   - Server logs from Render
   - Browser console errors
   - Commit SHA and deployment ID of the failed attempt

2. **Escalate to team**:
   - Notify project lead
   - Share diagnostics with backend/frontend lead
   - Convene incident review meeting

3. **Alternative: Partial rollback**
   - Roll back only the problematic component (e.g., GA, comments feature)
   - Keep stable features live
   - Hot-fix the broken component separately

---

## Prevention & Monitoring

### **Before each deployment:**
- [ ] Run all tests locally: `npm test` (client + server)
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Verify environment variables are set in Vercel/Render
- [ ] Review Sentry for any lingering error spikes

### **After deployment:**
- [ ] Monitor Sentry dashboard for errors (next 1 hour)
- [ ] Check Render logs for issues
- [ ] Have rollback-ready team on standby (30 min post-deploy)

---

## Quick Reference: Rollback Timeline

| Scenario | Method | Time | Risk |
|----------|--------|------|------|
| **Frontend bug (urgent)** | Vercel Dashboard Rollback | 2 min | Very Low |
| **Backend bug (no DB change)** | Git revert + push | 5 min | Low |
| **DB migration broke app** | `prisma:migrate resolve --rolled-back` + redeploy | 10-15 min | Medium |
| **Data corruption** | Restore from backup | 15-60 min | Medium |
| **Both frontend & backend broke** | Frontend rollback (2 min) + Backend rollback (10 min) | 12 min | Low |

---

## Contact & Resources

- **Vercel Dashboard**: https://vercel.com/rate-my-performance
- **Render Dashboard**: https://render.com/rate-my-performance
- **Repository**: https://github.com/yourorg/rate-my-performance
- **Sentry Monitoring**: https://sentry.io/rate-my-performance

---

**Last Tested**: March 30, 2026  
**Next Review**: Post-launch (April 30, 2026)
