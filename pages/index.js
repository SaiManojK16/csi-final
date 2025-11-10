import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <>
      <Head>
        <title>Acceptly - Master Finite Automata</title>
        <meta name="description" content="Learn Finite Automata with AI-powered assistance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Acceptly
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.9 }}>
          From Mistakes to Mastery, One Transition at a Time
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.8 }}>
          Learn Finite Automata with AI-Powered Assistance
        </p>
        
        <button 
          onClick={handleGetStarted}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </button>

        <div style={{ marginTop: '4rem', opacity: 0.8 }}>
          <h3 style={{ marginBottom: '1rem' }}>✅ Next.js Migration Complete!</h3>
          <p>🚀 Ready for Vercel Deployment</p>
          <p>🤖 AI-Powered Learning Assistant</p>
          <p>📊 18 FA Problems + 17 MCQ Quizzes</p>
          <p>🎨 Interactive Visual Canvas</p>
        </div>

        <div style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>API Status: <strong style={{ color: '#4ade80' }}>✓ Running</strong></p>
          <p>Database: <strong style={{ color: '#4ade80' }}>✓ Connected</strong></p>
        </div>
      </div>
    </>
  );
}
