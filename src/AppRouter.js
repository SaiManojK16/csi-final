import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';

// Pages
import LandingPage from './pages/LandingPage';
import UnifiedAuthPage from './pages/UnifiedAuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import ProblemSelection from './pages/ProblemSelection';
import FASimulation from './pages/FASimulation';
import QuizPage from './pages/QuizPage';
import Insights from './pages/Insights';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Wrapper component to force remount on route param change
const KeyedFASimulation = () => {
  const location = useLocation();
  const { problemId } = useParams();
  // Use problemId, timestamp, navCounter, and location.key to ensure unique key
  const timestamp = location.state?.timestamp || Date.now();
  const navCounter = location.state?.navCounter || 0;
  const locationKey = location.key || location.pathname;
  // Create a truly unique key that changes on every navigation
  const navigationKey = `${problemId}-${timestamp}-${navCounter}-${locationKey}`;
  return <FASimulation key={`fa-${navigationKey}`} />;
};

const KeyedQuizPage = () => {
  const location = useLocation();
  const { quizId } = useParams();
  return <QuizPage key={`quiz-${quizId}-${location.key || location.pathname}`} />;
};

function AppContent() {
  const location = useLocation();
  const hideGlobalHeader = location.pathname.startsWith('/practice/fa/') || location.pathname.startsWith('/practice/quiz/');
  
  return (
    <div className="App">
      {!hideGlobalHeader && <Header />}
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<PublicRoute><UnifiedAuthPage /></PublicRoute>} />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/signup" element={<Navigate to="/auth" />} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/problems" element={<ProtectedRoute><ProblemSelection /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/practice/fa/:problemId" element={<ProtectedRoute><KeyedFASimulation /></ProtectedRoute>} />
            <Route path="/practice/quiz/:quizId" element={<ProtectedRoute><KeyedQuizPage /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;

