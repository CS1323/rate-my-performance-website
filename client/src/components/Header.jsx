
import FacebookIcon from '../assets/images/icons/facebook.svg';
import InstagramIcon from '../assets/images/icons/instagram.svg';
import YouTubeIcon from '../assets/images/icons/youtube.svg';
import TikTokIcon from '../assets/images/icons/tiktok.svg';
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
          <img src={FacebookIcon} />
        </a>
        <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer">
          <img src={InstagramIcon} />
        </a>
        <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer">
          <img src={YouTubeIcon} />
        </a>
        <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer">
          <img src={TikTokIcon} alt="TikTok" />
        </a>
      </div>
    </header>
  );
}