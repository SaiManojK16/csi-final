# Vercel Environment Variables Setup

## Issue: Frontend Cannot Connect to Backend

If you're seeing "unable to connect to server" errors on the deployed Vercel frontend, you need to set the `REACT_APP_API_URL` environment variable in Vercel.

## Steps to Fix

### 1. Go to Vercel Dashboard

1. Navigate to https://vercel.com/dashboard
2. Select your project: `csi-final`
3. Go to **Settings** → **Environment Variables**

### 2. Add Environment Variable

Add the following environment variable:

**Variable Name:** `REACT_APP_API_URL`  
**Value:** `https://csi-final.onrender.com`  
**Environment:** Production, Preview, Development (select all)

### 3. Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

### 4. Verify

After redeployment, check:

1. Open browser console (F12)
2. Try to log in
3. Check Network tab for API requests
4. They should be going to: `https://csi-final.onrender.com/api/auth/login`

## Alternative: Check Current Configuration

You can verify if the variable is set by:

1. Going to Vercel project settings
2. Checking Environment Variables section
3. Looking for `REACT_APP_API_URL`

## Current Backend URL

**Backend API:** `https://csi-final.onrender.com`

Make sure `REACT_APP_API_URL` is set to this value (without `/api` at the end - the code adds it automatically).

## Troubleshooting

### If still not working:

1. **Check Render backend is running:**
   - Visit: https://csi-final.onrender.com/api/health
   - Should return: `{"status":"ok","message":"Acceptly API is running"}`

2. **Check CORS:**
   - Backend should allow your Vercel frontend URL
   - Check Render logs for CORS errors

3. **Check browser console:**
   - Look for CORS errors
   - Look for network errors
   - Check the actual URL being called

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

5. **Wait for cold start:**
   - Render free tier may take 10-30 seconds to wake up
   - Try again after waiting

## Code Changes Made

The code has been updated to:
- Default to `https://csi-final.onrender.com/api` if `REACT_APP_API_URL` is not set
- Better CORS handling on backend to allow Vercel URLs
- Improved error logging

