# Milestone 6 Submission - Team B (SVSMC)

## Team Information
**Team:** B (SVSMC)  
**Members:**
- Sai Manoj Kartala
- Vinay Padala
- Siddartha Kurmashetti
- Sai Charan Reddy Kanukula
- Sushma Kasarla

**Course:** CS5610 - Web Development  
**Project:** Acceptly - Finite Automata Learning Platform

---

# Part 1: Project Summary

**Acceptly** is an interactive web-based drill and practice system for learning finite automata (FA) theory. The platform combines visual FA building, automated testing, and AI-powered tutoring to help students master automata concepts through hands-on practice.

## What It Does

The application provides:
- **Visual FA Builder**: Interactive canvas where users draw states and transitions to construct finite automata
- **Automated Testing**: Real-time validation of FA against predefined test cases with detailed feedback
- **AI-Powered Tutoring**: Google Gemini integration provides contextual hints, error analysis, and guided learning without giving direct answers
- **Progress Tracking**: User dashboard tracking completion rates, problem history, and learning insights
- **Problem Library**: 50+ FA problems and MCQ quizzes with varying difficulty levels
- **Interactive Playground**: Landing page demonstration tool for FA concepts

## Implementation Technologies

**Frontend:**
- React 18.2.0 (JavaScript)
- React Router 7.9.5 for navigation
- Canvas API for FA visualization
- Three.js for 3D graphics
- CSS3 with custom design system

**Backend:**
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.19.2 for data persistence
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- Nodemailer for email notifications

**AI Integration:**
- Google Generative AI (Gemini 2.0 Flash) for intelligent tutoring

**Deployment:**
- Frontend: Vercel (serverless hosting)
- Backend: Render (Node.js hosting)
- Database: MongoDB Atlas (cloud database)

## Key Features

1. **User Authentication**: Secure signup/login with email verification and password reset
2. **FA Simulation**: Drag-and-drop state creation, transition drawing, and real-time validation
3. **AI Assistant**: Context-aware hints that guide users toward solutions using Socratic method
4. **Progress Analytics**: Visual insights into learning patterns and problem-solving trends
5. **Responsive Design**: Mobile-friendly interface with modern UI/UX

## AI Usage (Optional Extra Credit)

**AI Software Used:** Cursor AI (powered by Claude/GPT-4) and Google Gemini API

**How AI Was Used:**
1. **Development Assistance**: Cursor AI was used for code generation, debugging, and refactoring throughout the project lifecycle
2. **AI Tutoring Feature**: Google Gemini API integrated to provide intelligent hints and explanations to users learning finite automata
3. **Code Review**: AI-assisted code review and optimization suggestions
4. **Documentation**: AI-assisted generation of code comments and documentation

The AI tutoring feature uses Google Gemini 2.0 Flash to analyze user's FA structure and provide contextual hints without revealing solutions, following a Socratic teaching approach.

---

# Part 2: Access Information

## Deployment URLs

**Frontend (Production):**  
https://csi-final-4gr04l1n3-kadthalamanoj16-4032s-projects.vercel.app

**Frontend (Alternative Domain):**  
https://csi-final-tau.vercel.app

**Backend API:**  
https://csi-final.onrender.com

## Instructor Access Credentials

For testing purposes, please use the following test account:

**Email:** instructor@acceptly.test  
**Password:** Instructor123!

**Alternative Test Account:**
**Email:** testuser@acceptly.test  
**Password:** TestUser123!

## How to Use the Software

### Using the Deployed Application

1. **Navigate to the frontend URL** (listed above)
2. **Sign up for a new account** or use the test credentials provided
3. **Explore the features:**
   - **Landing Page**: View the interactive FA playground
   - **Dashboard**: See your progress and statistics
   - **Problems**: Browse and select FA problems or MCQ quizzes
   - **FA Simulation**: Build finite automata on the interactive canvas
   - **AI Hints**: Click the AI assistant button for contextual help

### Key Features to Test

1. **User Registration/Login**
   - Sign up with email, username, and password
   - Login with existing credentials
   - Password reset functionality

2. **FA Building**
   - Click canvas to create states
   - Drag states to reposition
   - Right-click states for options (mark as accepting, set start state)
   - Click and drag between states to create transitions
   - Enter transition symbols (0, 1, etc.)

3. **Testing Your FA**
   - Click "Run Tests" button
   - View test results with pass/fail indicators
   - See execution paths for each test case

4. **AI Assistant**
   - Click "Get Hint" button
   - Receive contextual hints based on your current FA structure
   - Get error analysis if tests fail

5. **Progress Tracking**
   - View dashboard for completion statistics
   - Check Insights page for learning analytics
   - See problem history and performance metrics

### Local Setup (If Needed)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add required variables (MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, etc.)
3. **Start the development servers:**
   ```bash
   npm run dev
   ```
   - Frontend runs on http://localhost:3001
   - Backend runs on http://localhost:5001

### Troubleshooting

- If the frontend shows connection errors, check that the backend is running
- Clear browser cache if you see stale content
- Use Chrome or Firefox for best compatibility
- Ensure JavaScript is enabled

## Notes for Instructor

- The application requires JavaScript to be enabled
- Best viewed in Chrome, Firefox, or Safari (latest versions)
- Mobile responsive but optimized for desktop experience
- All user data is stored in MongoDB Atlas
- AI features require valid Google Gemini API key (configured in production)

## Contact Information

If you encounter any issues or have questions during evaluation, please contact the team via email. We will respond to any questions within 24 hours.

