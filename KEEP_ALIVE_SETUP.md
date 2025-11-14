# Keep Render Service Alive (Free Tier)

Render's free tier services **spin down after 15 minutes of inactivity**. The first request after spin-down takes **~30 seconds** to wake up, which causes slow login times.

## Solution: Keep-Alive Service

Ping your Render service every 14 minutes to keep it awake.

---

## Option 1: UptimeRobot (Recommended - Free & Easy)

1. **Sign up**: Go to [UptimeRobot.com](https://uptimerobot.com) (free account)

2. **Add Monitor**:
   - Click "Add New Monitor"
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Acceptly Backend Keep-Alive
   - **URL**: `https://csi-final.onrender.com/api/ping`
   - **Monitoring Interval**: 5 minutes (free tier allows 5 min minimum)
   - Click "Create Monitor"

3. **Done!** UptimeRobot will ping your service every 5 minutes, keeping it awake.

---

## Option 2: Cron-Job.org (Free)

1. **Sign up**: Go to [Cron-Job.org](https://cron-job.org) (free account)

2. **Create Cron Job**:
   - Click "Create cronjob"
   - **Title**: Keep Render Alive
   - **Address**: `https://csi-final.onrender.com/api/ping`
   - **Schedule**: Every 14 minutes (`*/14 * * * *`)
   - Click "Create cronjob"

3. **Done!** It will ping every 14 minutes.

---

## Option 3: GitHub Actions (Free)

1. Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Render Alive

on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render Service
        run: |
          curl -f https://csi-final.onrender.com/api/ping || exit 1
```

2. Commit and push to GitHub
3. GitHub Actions will run automatically

---

## Option 4: Upgrade Render (Paid)

If you want zero downtime and faster response:
- **Starter Plan**: $9/month
- No spin-downs
- Better performance
- SSH access

---

## Test Your Keep-Alive

After setting up, test it:

```bash
curl https://csi-final.onrender.com/api/ping
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "Service is alive"
}
```

---

## Recommended: UptimeRobot

**Why UptimeRobot?**
- ✅ Free forever
- ✅ Easy setup (2 minutes)
- ✅ Reliable
- ✅ Email alerts if service goes down
- ✅ Dashboard to monitor uptime

**Setup Time**: 2 minutes  
**Cost**: $0/month  
**Result**: Fast login times, no spin-down delays

---

## After Setup

1. Wait 15 minutes
2. Try logging in - should be fast now!
3. Check UptimeRobot dashboard to see ping history

Your service will stay awake and respond quickly! 🚀

