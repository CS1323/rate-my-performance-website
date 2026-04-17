import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation, useParams, Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gaSend } from './utils/ga';
import { supportedLanguages } from './i18n';
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

function LocaleLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  const isValidLang = !lang || supportedLanguages.includes(lang);

  // Sync i18n language with URL param
  useEffect(() => {
    if (!isValidLang) return;
    const targetLang = lang || 'en';
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [lang, i18n, isValidLang]);

  // Set html lang attribute and hreflang link tags
  useEffect(() => {
    if (!isValidLang) return;
    const currentLang = lang || 'en';
    document.documentElement.lang = currentLang;

    // Build path without the lang prefix
    const pathWithoutLang = lang
      ? location.pathname.replace(`/${lang}`, '') || '/'
      : location.pathname;

    // Remove any existing hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    const origin = window.location.origin;
    supportedLanguages.forEach((lng) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lng;
      link.href = lng === 'en'
        ? `${origin}${pathWithoutLang}`
        : `${origin}/${lng}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
      document.head.appendChild(link);
    });

    // x-default points to English (no prefix)
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${origin}${pathWithoutLang}`;
    document.head.appendChild(xDefault);
  }, [lang, location.pathname, isValidLang]);

  // Redirect invalid lang codes to English equivalent (after all hooks)
  if (!isValidLang) {
    const rest = location.pathname.replace(`/${lang}`, '') || '/';
    return <Navigate to={rest} replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <>
      <Route index element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
      <Route path="cfu-boyfriend-quiz" element={<CFUBoyfriendQuiz />} />
      <Route path="about-me" element={<AboutMe />} />
      <Route path="rules" element={<Rules />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="user-agreement" element={<UserAgreement />} />
      <Route path="accessibility" element={<Accessibility />} />
    </>
  );
}

function ScrollRestoration() {
  const location = useLocation();
  const scrollPositions = useRef({});
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Save scroll position of the page we're leaving
    scrollPositions.current[prevPath.current] = window.scrollY;

    // Restore saved position or scroll to top for new pages
    const saved = scrollPositions.current[location.pathname];
    if (saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    } else {
      window.scrollTo(0, 0);
    }

    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
}

function App() {
  const location = useLocation();

  // Track page views with Google Analytics
  useEffect(() => {
    gaSend({ hitType: 'pageview', page: location.pathname + location.search, title: document.title });
  }, [location.pathname, location.search]);

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <ScrollRestoration />
      <Routes>
        {/* English routes (no prefix) */}
        <Route element={<LocaleLayout />}>
          {AppRoutes()}
        </Route>
        {/* Localized routes (/:lang prefix) */}
        <Route path=":lang" element={<LocaleLayout />}>
          {AppRoutes()}
        </Route>
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;