# Local Development Setup Guide

## ✅ Current Status

Your Acceptly application is now running locally!

### Running Services

- **Backend Server**: http://localhost:5001
  - Status: ✅ Running
  - Database: ✅ Connected to MongoDB
  - Health Check: http://localhost:5001/api/health

- **Frontend Server**: http://localhost:3000
  - Status: Starting...
  - Will open automatically in your browser

## 🚀 Quick Start Commands

### Start Both Servers (Recommended)
```bash
npm run dev
```
This starts both the backend and frontend concurrently.

### Start Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 📋 Environment Variables

Your `.env` file should contain:

```env
# Required for Backend
MONGODB_URI=mongodb://localhost:27017/acceptly
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/acceptly

JWT_SECRET=your-super-secret-jwt-key-change-this

# Optional
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Required for Frontend (AI Features)
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
```

## 🔍 Verify Setup

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok","message":"Acceptly API is running","database":"connected"}`

2. **Check Frontend:**
   - Open http://localhost:3000 in your browser
   - You should see the Acceptly landing page

3. **Check MongoDB:**
   - Make sure MongoDB is running locally, OR
   - Use MongoDB Atlas connection string in `.env`

## 🛠️ Troubleshooting

### Backend Won't Start
- **Missing MONGODB_URI**: Check `.env` file has MongoDB connection string
- **Missing JWT_SECRET**: Add JWT_SECRET to `.env`
- **Port 5001 in use**: Change PORT in `.env` or kill process using port 5001

### Frontend Won't Start
- **Port 3000 in use**: Kill process using port 3000 or change React port
- **Missing dependencies**: Run `npm install`

### Database Connection Issues
- **Local MongoDB**: Make sure MongoDB is running (`mongod`)
- **MongoDB Atlas**: Check connection string is correct
- **Network issues**: Verify internet connection for Atlas

### AI Features Not Working
- **Missing API Key**: Add `REACT_APP_GEMINI_API_KEY` to `.env`
- **Invalid API Key**: Verify key is correct at https://makersuite.google.com/app/apikey
- **API Quota**: Check Gemini API quota hasn't been exceeded

## 📝 Development Workflow

1. **Make Changes:**
   - Frontend: Edit files in `src/`
   - Backend: Edit files in `server/`
   - Changes auto-reload (hot reload)

2. **View Logs:**
   - Backend logs: Check terminal running `npm run server`
   - Frontend logs: Check terminal running `npm start`
   - Browser console: Open DevTools (F12)

3. **Test Changes:**
   - Frontend: Refresh browser
   - Backend: Check API endpoints with curl or Postman
   - Run tests: `npm test`

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Sign up for a new account
3. Try building your first Finite Automaton!
4. Use the AI assistant for hints

## 📚 Additional Resources

- **API Documentation**: http://localhost:5001/api/health
- **Project README**: See README.md
- **Finishing Touches**: See FINISHING_TOUCHES.md

---

**Happy Coding! 🚀**

