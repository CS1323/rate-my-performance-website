
import { useTranslation } from 'react-i18next';
import { gaEvent } from '../utils/ga';
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';
import PuckLogo from '../assets/images/icons/cfu-puck.svg';
import ListIcon from '../assets/images/icons/list.svg';
import './Header.css';

export function Header({ onToggleSidebar, sidebarOpen }) {
  const { t } = useTranslation();
  return (
    <>
      <a href="#main" className="skip-link">{t('header.skipToContent')}</a>
      <header>
      <div className="header-left">
        <button 
          className="hamburger-btn" 
          onClick={onToggleSidebar}
          aria-label={t('header.toggleNav')}
          title={t('header.toggleMenu')}
        >
          <img src={ListIcon} alt={t('header.menuAlt')} className="puck-toggle-logo" />
        </button>
        <img src={PuckLogo} alt={t('header.logoAlt')} className="puck-logo-static" />
        <span className="header-title">{t('header.siteTitle')}</span>
      </div>
      <div className="socials">
        <a href="https://www.facebook.com/cadencekeysauthor" target="_blank" rel="noopener noreferrer" onClick={() => gaEvent({ category: 'social', action: 'social_click', label: 'facebook' })}>
          <FacebookIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer" onClick={() => gaEvent({ category: 'social', action: 'social_click', label: 'instagram' })}>
          <InstagramIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer" onClick={() => gaEvent({ category: 'social', action: 'social_click', label: 'tiktok' })}>
          <TikTokIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer" onClick={() => gaEvent({ category: 'social', action: 'social_click', label: 'youtube' })}>
          <YouTubeIcon size={28} color="#fff" className="social-icon" />
        </a>
      </div>
    </header>
    </>
  );
}