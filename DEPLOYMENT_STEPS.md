# 🚀 Quick Deployment Guide to Vercel

Follow these steps to deploy Acceptly to Vercel in under 10 minutes.

## ✅ Pre-Deployment Checklist

Before deploying, make sure you have:

1. **MongoDB Atlas Account** (free tier)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Get your connection string

2. **Google Gemini API Key**
   - Get from [ai.google.dev](https://ai.google.dev/)
   - Free tier available

3. **GitHub Account**
   - For connecting to Vercel

## 📦 Step 1: Prepare Your Code

```bash
# Install dependencies
cd /Users/saimanojk/Desktop/CSI
npm install

# Test locally
npm run dev
# Visit http://localhost:3000 - make sure it works!
```

## 🗂️ Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Next.js migration for Vercel deployment"

# Create GitHub repo and push
# Go to github.com → New Repository → Create "acceptly"
git remote add origin https://github.com/YOUR_USERNAME/acceptly.git
git branch -M main
git push -u origin main
```

## ☁️ Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `acceptly` repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected) ✅
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   Name: MONGODB_URI
   Value: mongodb+srv://username:password@cluster.mongodb.net/acceptly?retryWrites=true&w=majority
   ```
   
   ```
   Name: JWT_SECRET
   Value: your-super-secret-32-character-minimum-jwt-key-here
   ```
   
   ```
   Name: NEXT_PUBLIC_GEMINI_API_KEY
   Value: your-gemini-api-key-here
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL: `https://acceptly-abc123.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then set env vars:
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_GEMINI_API_KEY production

# Deploy to production
vercel --prod
```

## 🔐 Step 4: Configure MongoDB Atlas

**Important:** Vercel uses dynamic IPs, so you need to allow all IPs:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Add comment: "Vercel deployment"
5. Confirm

## ✅ Step 5: Test Your Deployment

Visit your Vercel URL and test:

1. **Health Check**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Sign Up**
   - Create a new account
   - Verify you can login

3. **Build FA**
   - Go to Problems
   - Select a problem
   - Build an automaton
   - Run tests
   - Submit

4. **Check Dashboard**
   - Verify progress is saved
   - Check if stats update

## 🐛 Troubleshooting

### Issue: "Database disconnected"
**Fix:** Check MongoDB Atlas IP whitelist, ensure 0.0.0.0/0 is allowed

### Issue: "Invalid JWT"
**Fix:** Check JWT_SECRET is set in Vercel env vars

### Issue: "AI not working"
**Fix:** Verify NEXT_PUBLIC_GEMINI_API_KEY is set and valid

### Issue: Build fails
**Fix:** Check build logs in Vercel dashboard, ensure all dependencies in package.json

## 🎨 Step 6: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `acceptly.com`)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-generated ✅

## 📊 Step 7: Monitor Your App

Vercel provides built-in monitoring:
- **Analytics:** Track page views, performance
- **Logs:** View API route logs in real-time
- **Metrics:** Monitor response times, errors

Access from: Vercel Dashboard → Your Project → Analytics/Logs

## 🔄 Future Updates

To deploy updates:

```bash
# Make changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel auto-deploys on push! 🎉
```

## 🌍 Your App is Live!

Congratulations! Acceptly is now live at:
```
https://your-project-name.vercel.app
```

Share it with students, add to your portfolio, or scale it up!

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **MongoDB Docs:** [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)

## 🎉 What's Next?

- Add custom domain
- Set up analytics
- Enable preview deployments
- Add more FA problems
- Invite beta testers
- Share on LinkedIn/Twitter!

**You did it! 🚀**

