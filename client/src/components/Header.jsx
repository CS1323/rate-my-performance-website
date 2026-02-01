
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';
import PuckLogo from '../assets/images/icons/cfu-puck.svg';
import './Header.css';

export function Header() {
  return (
    <header>
      <div className="cfu-logo-title">
        <img src={PuckLogo} alt="CFU puck logo" className="cfu-puck-logo" />
        <span className="header-title">Rate My Performance</span>
      </div>
      <div className="socials">
        <a href="https://www.facebook.com/cadencekeysauthor" target="_blank" rel="noopener noreferrer">
          <FacebookIcon size={28} className="social-icon" />
        </a>
        <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer">
          <InstagramIcon size={28} className="social-icon" />
        </a>
        <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer">
          <TikTokIcon size={28} className="social-icon" />
        </a>
        <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer">
          <YouTubeIcon size={28} className="social-icon" />
        </a>
      </div>
    </header>
  );
}