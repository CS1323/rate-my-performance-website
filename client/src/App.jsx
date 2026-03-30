import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import ReactGA from 'react-ga4';
import { HomePage } from './pages/home/HomePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

const CFUBoyfriendQuiz = lazy(() =>
  import('./pages/quiz/CFUBoyfriendQuiz').then((m) => ({ default: m.CFUBoyfriendQuiz }))
);
const AboutMe = lazy(() =>
  import('./pages/about-me/AboutMe').then((m) => ({ default: m.AboutMe }))
);
const Rules = lazy(() =>
  import('./pages/rules/Rules').then((m) => ({ default: m.Rules }))
);
const PrivacyPolicy = lazy(() =>
  import('./pages/privacy-policy/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicy }))
);
const UserAgreement = lazy(() =>
  import('./pages/user-agreement/UserAgreement').then((m) => ({ default: m.UserAgreement }))
);
const Accessibility = lazy(() =>
  import('./pages/accessibility/Accessibility').then((m) => ({ default: m.Accessibility }))
);

function App() {
  const location = useLocation();

  // Track page views with Google Analytics
  useEffect(() => {
    // Check if GA is initialized
    if (import.meta.env.VITE_GA_ID) {
      const gaLaunchDate = import.meta.env.VITE_GA_LAUNCH_DATE 
        ? new Date(import.meta.env.VITE_GA_LAUNCH_DATE) 
        : null;
      
      const isGAEnabled = gaLaunchDate && new Date() >= gaLaunchDate;
      
      if (isGAEnabled) {
        ReactGA.send({ hitType: 'pageview', page: location.pathname });
      }
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <Routes>
        <Route index element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
        <Route path="cfu-boyfriend-quiz" element={<CFUBoyfriendQuiz />} />
        <Route path="about-me" element={<AboutMe />} />
        <Route path="rules" element={<Rules />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="user-agreement" element={<UserAgreement />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;