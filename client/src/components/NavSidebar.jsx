import { NavLink } from 'react-router';

// Navigation Icons
import HomeIcon from '../assets/images/icons/home.svg';
import FileTextIcon from '../assets/images/icons/file-text.svg';
import UserIcon from '../assets/images/icons/user.svg';
import BookOpenIcon from '../assets/images/icons/book-open.svg';
import ClipboardIcon from '../assets/images/icons/clipboard.svg';

// Social Icons
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';

import './NavSidebar.css';

export function NavSidebar() {
  return (
    <nav className="left sidebar">
      {/* <!-- top section: navigation--> */}
      <div>
        <NavLink to="/" className="sidebar-link">
          <img src={HomeIcon} />
            <div>Home</div>
        </NavLink>
        <NavLink to="/cfu-boyfriend-quiz" className="sidebar-link">
          <img src={FileTextIcon} />
            <div>CFU Boyfriend Quiz</div>
        </NavLink>
        <NavLink to="/about-me" className="sidebar-link">
          <img src={UserIcon} />
            <div>About Me</div>
        </NavLink>
      </div>
      {/* <!-- bottom section: website compliance --> */}
      <div>
        <NavLink to="/rules" className="sidebar-link">
          <img src={BookOpenIcon} />
            <div>Rules</div>
        </NavLink>
        <NavLink to="/privacy-policy" className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>Privacy Policy</div>
        </NavLink>
        <NavLink to="/user-agreement" className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>User Agreement</div>
        </NavLink>
        <NavLink to="/accessibility" className="sidebar-link">
          <span className="material-symbols-outlined">
            settings_accessibility
          </span>
          <div>Accessibility</div>
        </NavLink>
        {/* <!-- social media icons (mobile only) --> */}
        <div className="sidebar-socials">
          <a href="https://www.facebook.com/cadencekeysauthor" target="_blank" rel="noopener noreferrer">
            <FacebookIcon size={24} color="#222" />
          </a>
          <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={24} color="#222" />
          </a>
          <a href="https://www.tiktok.com/@cadencekeysauthor" target="_blank" rel="noopener noreferrer">
            <TikTokIcon size={24} color="#222" />
          </a>
          <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank" rel="noopener noreferrer">
            <YouTubeIcon size={24} color="#222" playButtonColor="white" />
          </a>
        </div>
        {/* <!-- copyright --> */}
        <p className="copyright">
          &copy; 2025 Cadence Keys
        </p>
      </div>
    </nav>
  );
}