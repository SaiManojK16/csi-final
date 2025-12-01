# Quick Deployment Checklist

Follow these steps to deploy your website for free:

## 🚀 Quick Steps

### 1. MongoDB Atlas (5 minutes)
- [ ] Sign up at https://www.mongodb.com/cloud/atlas/register
- [ ] Create free cluster
- [ ] Create database user (save password!)
- [ ] Whitelist IP: `0.0.0.0/0` (allow all)
- [ ] Copy connection string (replace `<password>` and `<dbname>`)

### 2. Render Backend (10 minutes)
- [ ] Sign up at https://render.com (use GitHub)
- [ ] New Web Service → Connect GitHub repo
- [ ] Settings:
  - Name: `acceptly-backend`
  - Build: `npm install`
  - Start: `node server/server.js`
  - Plan: **Free**
- [ ] Environment Variables:
  ```
  NODE_ENV=production
  PORT=10000
  MONGODB_URI=<your-mongodb-connection-string>
  JWT_SECRET=<random-secret-key>
  ```
- [ ] Deploy → Copy URL (e.g., `https://acceptly-backend.onrender.com`)

### 3. Vercel Frontend (5 minutes)
- [ ] Sign up at https://vercel.com (use GitHub)
- [ ] Import Project → Select your repo
- [ ] Framework: **Create React App**
- [ ] Environment Variables:
  ```
  REACT_APP_API_URL=https://acceptly-backend.onrender.com
  REACT_APP_GEMINI_API_KEY=<your-gemini-key>
  ```
- [ ] Deploy → Your site is live! 🎉

## ✅ Test Checklist
- [ ] Visit your Vercel URL
- [ ] Test signup/login
- [ ] Test dashboard
- [ ] Test problems page
- [ ] Test FA simulation

## 🔧 Troubleshooting

**Backend not working?**
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

**Frontend can't reach backend?**
- Verify `REACT_APP_API_URL` in Vercel
- Check CORS in server.js
- Test backend health: `https://your-backend.onrender.com/api/health`

**Need help?** See `DEPLOYMENT.md` for detailed instructions.

