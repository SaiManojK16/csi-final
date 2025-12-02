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

## Project Summary

**Acceptly** is an interactive web-based drill and practice system for learning finite automata (FA) theory. The platform combines visual FA building, automated testing, and AI-powered tutoring to help students master automata concepts through hands-on practice.

### What It Does

The application provides:
- **Visual FA Builder**: Interactive canvas where users draw states and transitions to construct finite automata
- **Automated Testing**: Real-time validation of FA against predefined test cases with detailed feedback
- **AI-Powered Tutoring**: Google Gemini integration provides contextual hints, error analysis, and guided learning without giving direct answers
- **Progress Tracking**: User dashboard tracking completion rates, problem history, and learning insights
- **Problem Library**: 50+ FA problems and MCQ quizzes with varying difficulty levels
- **Interactive Playground**: Landing page demonstration tool for FA concepts

### Implementation Technologies

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

### Key Features

1. **User Authentication**: Secure signup/login with email verification and password reset
2. **FA Simulation**: Drag-and-drop state creation, transition drawing, and real-time validation
3. **AI Assistant**: Context-aware hints that guide users toward solutions using Socratic method
4. **Progress Analytics**: Visual insights into learning patterns and problem-solving trends
5. **Responsive Design**: Mobile-friendly interface with modern UI/UX

---

## AI Usage (Optional Extra Credit)

**AI Software Used:** Cursor AI (powered by Claude/GPT-4) and Google Gemini API

**How AI Was Used:**
1. **Development Assistance**: Cursor AI was used for code generation, debugging, and refactoring throughout the project lifecycle
2. **AI Tutoring Feature**: Google Gemini API integrated to provide intelligent hints and explanations to users learning finite automata
3. **Code Review**: AI-assisted code review and optimization suggestions
4. **Documentation**: AI-assisted generation of code comments and documentation

The AI tutoring feature uses Google Gemini 2.0 Flash to analyze user's FA structure and provide contextual hints without revealing solutions, following a Socratic teaching approach.

