
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';
import PuckLogo from '../assets/images/icons/cfu-puck.svg';
import ListIcon from '../assets/images/icons/list.svg';
import './Header.css';

export function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header>
      <div className="header-left">
        <button 
          className="hamburger-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          title="Toggle menu"
        >
          <img src={ListIcon} alt="Menu" className="puck-toggle-logo" />
        </button>
        <img src={PuckLogo} alt="CFU puck logo" className="puck-logo-static" />
        <span className="header-title">RATE MY PERFORMANCE</span>
      </div>
      <div className="socials">
        <a href="https://www.facebook.com/cadencekeysauthor" target="_blank" rel="noopener noreferrer">
          <FacebookIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer">
          <InstagramIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer">
          <TikTokIcon size={28} color="#fff" className="social-icon" />
        </a>
        <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer">
          <YouTubeIcon size={28} color="#fff" className="social-icon" />
        </a>
      </div>
    </header>
  );
}