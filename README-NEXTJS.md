# Acceptly - Next.js Version 🚀

**From Mistakes to Mastery, One Transition at a Time**

A full-stack educational platform for learning Finite Automata (FA) theory with AI-powered assistance, now built with Next.js for seamless Vercel deployment.

## 🆕 What's New in Next.js Version

- **Next.js 14:** Latest React framework with App Router support
- **Serverless API Routes:** No separate backend server needed
- **Vercel-Ready:** One-click deployment to Vercel
- **Better Performance:** Automatic code splitting and optimization
- **SSR Support:** Server-side rendering for better SEO
- **Edge Functions:** Fast API responses globally

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (free tier works great)
- Google Gemini API Key

### Installation

1. **Clone and Install**
   ```bash
   cd acceptly
   npm install
   ```

2. **Set up Environment Variables**
   
   Create `.env.local` file in the root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/acceptly?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
   ```

   > **⚠️ Security:** Use strong, random secrets. Never commit `.env.local` to git!

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure (Next.js)

```
acceptly/
├── pages/
│   ├── api/                  # API Routes (serverless functions)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── problems/        # Problem data endpoints
│   │   └── progress/        # Progress tracking endpoints
│   ├── _app.js              # App wrapper with providers
│   ├── _document.js         # HTML document structure
│   └── index.js             # Home page (landing)
├── components/              # React components
│   ├── pages/              # Page components
│   ├── AutomataBuilder.js  # FA builder
│   ├── AIHelper.js         # AI assistant
│   └── ...                 # Other UI components
├── lib/                    # Utility libraries
│   ├── mongodb.js          # MongoDB connection (serverless)
│   └── auth.js             # JWT authentication
├── models/                 # Mongoose models
│   └── User.js             # User schema
├── services/               # Client-side services
│   ├── apiService.js       # API client
│   └── geminiService.js    # Google Gemini AI
├── context/                # React Context
│   └── AuthContext.js      # Auth state management
├── data/                   # Static data
│   └── problemsData.js     # FA problems & MCQs
├── styles/                 # CSS styles
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies
```

## 🚢 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Next.js migration"
   git remote add origin https://github.com/yourusername/acceptly.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js ✅

3. **Add Environment Variables**
   In Vercel project settings → Environment Variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Strong random secret (min 32 chars)
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Your Gemini API key

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get a live URL: `https://acceptly-yourproject.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables (interactive)
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere - Vercel has dynamic IPs)
5. Get connection string and add to `.env.local`

### Google Gemini API Setup

1. Go to [ai.google.dev](https://ai.google.dev/)
2. Get API key
3. Add to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

## 🆚 Differences from React Version

| Feature | React Version | Next.js Version |
|---------|--------------|-----------------|
| **Routing** | React Router | Next.js File-based |
| **Backend** | Express (separate) | API Routes (integrated) |
| **API Calls** | Proxy to :5001 | Direct `/api/*` |
| **Deployment** | 2 servers needed | Single deployment |
| **SSR** | Client-side only | Server + Client |
| **Dev Server** | `npm start` + `npm run server` | `npm run dev` |

## 📝 API Routes Documentation

All API routes are serverless functions in `pages/api/`:

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/check-email` - Check if email exists

### Problems
- `GET /api/problems` - Get all problems (protected)
- `GET /api/problems/[id]` - Get specific problem (protected)

### Progress
- `GET /api/progress` - Get user progress (protected)
- `POST /api/progress/fa/[problemId]` - Update FA progress (protected)
- `POST /api/progress/quiz/[quizId]` - Update quiz progress (protected)

### Health
- `GET /api/health` - Check API status

## 🔒 Security

- **JWT Authentication:** 7-day expiration, secure httpOnly recommended
- **Password Hashing:** bcrypt with salt rounds (10)
- **API Protection:** Middleware on all protected routes
- **Environment Variables:** Never committed to git
- **MongoDB:** User credentials required, IP whitelist
- **CORS:** Configured in `next.config.js`

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: MongooseServerSelectionError
```
**Solution:** Check MongoDB URI, verify IP whitelist includes `0.0.0.0/0`

### JWT Errors
```
Error: Invalid token
```
**Solution:** Clear localStorage, login again. Check JWT_SECRET is set.

### Gemini API Errors
```
Error: API key not found
```
**Solution:** Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set. Must start with `NEXT_PUBLIC_` for client-side access.

### Build Errors on Vercel
```
Module not found: Can't resolve 'fs'
```
**Solution:** Already configured in `next.config.js` webpack section. If persists, check dynamic imports.

## 🎯 Performance Optimization

The Next.js version includes:
- ✅ Automatic code splitting
- ✅ Image optimization (next/image)
- ✅ Font optimization
- ✅ API route caching
- ✅ Static generation where possible
- ✅ Edge function support
- ✅ Incremental Static Regeneration (ISR)

## 📱 Mobile Support

The app is responsive and works on:
- Desktop (optimal experience)
- Tablet (good experience)
- Mobile (functional, canvas may be small)

## 🚀 Advanced Deployment

### Custom Domain
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Environment-Specific Configs
- **Development:** `.env.local`
- **Preview:** Vercel auto-generates preview URLs
- **Production:** Set env vars in Vercel Dashboard

### Monitoring
Vercel provides built-in:
- Analytics
- Logs
- Performance metrics
- Error tracking

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Google Gemini AI Docs](https://ai.google.dev/docs)

## 🙋 Support

**Issues?** Check:
1. Environment variables are set correctly
2. MongoDB connection string is valid
3. API keys are active
4. Latest `npm install` run

## 📄 License

MIT License - Educational purposes

---

**Happy Learning on Next.js! 🎓**

*Deployed on Vercel, powered by Next.js, MongoDB, and Google Gemini AI*

