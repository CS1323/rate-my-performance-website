import { NavLink, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';

// Navigation Icons
import HomeIcon from '../assets/images/icons/home.svg';
import FileTextIcon from '../assets/images/icons/file-text.svg';
import UserIcon from '../assets/images/icons/user.svg';
import BookOpenIcon from '../assets/images/icons/book-open.svg';
import ClipboardIcon from '../assets/images/icons/clipboard.svg';

// Social Icons
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';
import { LanguageSelector } from './LanguageSelector';

import './NavSidebar.css';

// Build locale-prefixed path
function useLocalePath(path) {
  const { lang } = useParams();
  if (!lang || lang === 'en') return path;
  return `/${lang}${path === '/' ? '' : path}`;
}

// Helper component for accessible NavLink with aria-current
function AccessibleNavLink({ to, children, icon, onLinkClick }) {
  const location = useLocation();
  const localeTo = useLocalePath(to);
  const isActive = location.pathname === localeTo;
  
  return (
    <NavLink 
      to={localeTo}
      className={`sidebar-link${isActive ? ' active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={isActive ? onLinkClick : undefined}
    >
      <img src={icon} alt="" />
      <div>{children}</div>
    </NavLink>
  );
}

export function NavSidebar({ onLinkClick }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { lang } = useParams();
  const accessibilityPath = useLocalePath('/accessibility');
  const isAccessibilityActive = location.pathname === accessibilityPath;
  
  return (
    <nav className="left sidebar">
      {/* <!-- top section: navigation--> */}
      <div>
        <AccessibleNavLink to="/" icon={HomeIcon} onLinkClick={onLinkClick}>{t('nav.home')}</AccessibleNavLink>
        <AccessibleNavLink to="/cfu-boyfriend-quiz" icon={FileTextIcon} onLinkClick={onLinkClick}>{t('nav.quiz')}</AccessibleNavLink>
        <AccessibleNavLink to="/about-me" icon={UserIcon} onLinkClick={onLinkClick}>{t('nav.aboutMe')}</AccessibleNavLink>
      </div>
      {/* <!-- bottom section: website compliance --> */}
      <div>
        <AccessibleNavLink to="/rules" icon={BookOpenIcon} onLinkClick={onLinkClick}>{t('nav.rules')}</AccessibleNavLink>
        <AccessibleNavLink to="/privacy-policy" icon={ClipboardIcon} onLinkClick={onLinkClick}>{t('nav.privacyPolicy')}</AccessibleNavLink>
        <AccessibleNavLink to="/user-agreement" icon={ClipboardIcon} onLinkClick={onLinkClick}>{t('nav.userAgreement')}</AccessibleNavLink>
        <NavLink 
          to={accessibilityPath}
          className={`sidebar-link${isAccessibilityActive ? ' active' : ''}`}
          aria-current={isAccessibilityActive ? 'page' : undefined}
          onClick={isAccessibilityActive ? onLinkClick : undefined}
        >
          <span className="material-symbols-outlined">
            settings_accessibility
          </span>
          <div>{t('nav.accessibility')}</div>
        </NavLink>
        {/* <!-- social media icons (mobile only) --> */}
        <div className="sidebar-socials">
          <a href="https://www.facebook.com/cadencekeysauthor" target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'social', action: 'social_click', label: 'facebook' })}>
            <FacebookIcon size={24} color="#222" />
          </a>
          <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'social', action: 'social_click', label: 'instagram' })}>
            <InstagramIcon size={24} color="#222" />
          </a>
          <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'social', action: 'social_click', label: 'tiktok' })}>
            <TikTokIcon size={24} color="#222" />
          </a>
          <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'social', action: 'social_click', label: 'youtube' })}>
            <YouTubeIcon size={24} color="#222" playButtonColor="white" />
          </a>
        </div>
        {/* <!-- language selector --> */}
        <LanguageSelector />
        {/* <!-- copyright --> */}
        <p className="copyright">
          {t('nav.copyright')}
        </p>
      </div>
    </nav>
  );
}