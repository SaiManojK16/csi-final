# Milestone 6 Access Information - Team B (SVSMC)

## Deployment URLs

**Frontend (Production):**  
https://csi-final-4gr04l1n3-kadthalamanoj16-4032s-projects.vercel.app

**Frontend (Alternative Domain):**  
https://csi-final-tau.vercel.app

**Backend API:**  
https://csi-final.onrender.com

---

## Instructor Access Credentials

For testing purposes, please use the following test account:

**Email:** instructor@acceptly.test  
**Password:** Instructor123!

**Alternative Test Account:**
**Email:** testuser@acceptly.test  
**Password:** TestUser123!

---

## How to Use the Software

### Initial Setup (If Running Locally)

1. **Clone the repository** (if you have access to source files)
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add required variables (see `.env.example` if available)
4. **Start the development servers:**
   ```bash
   npm run dev
   ```
   - Frontend runs on http://localhost:3001
   - Backend runs on http://localhost:5001

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

### Troubleshooting

- If the frontend shows connection errors, check that the backend is running
- Clear browser cache if you see stale content
- Use Chrome or Firefox for best compatibility
- Ensure JavaScript is enabled

---

## Contact Information

If you encounter any issues or have questions during evaluation, please contact:

**Team Lead:** Sai Manoj Kartala  
**Email:** [Your email address]

We will respond to any questions via email within 24 hours.

---

## Notes for Instructor

- The application requires JavaScript to be enabled
- Best viewed in Chrome, Firefox, or Safari (latest versions)
- Mobile responsive but optimized for desktop experience
- All user data is stored in MongoDB Atlas
- AI features require valid Google Gemini API key (configured in production)

