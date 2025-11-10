import dynamic from 'next/dynamic';

// Import LandingPage dynamically to avoid SSR issues with canvas
const LandingPage = dynamic(
  () => import('../components/pages/LandingPage'),
  { ssr: true }
);

export default function Home() {
  return <LandingPage />;
}

