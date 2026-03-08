import { NavLink } from 'react-router';
import { useLocation } from 'react-router';

// Navigation Icons
import HomeIcon from '../assets/images/icons/home.svg';
import FileTextIcon from '../assets/images/icons/file-text.svg';
import UserIcon from '../assets/images/icons/user.svg';
import BookOpenIcon from '../assets/images/icons/book-open.svg';
import ClipboardIcon from '../assets/images/icons/clipboard.svg';

// Social Icons
import { FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from './icons';

import './NavSidebar.css';

// Helper component for accessible NavLink with aria-current
function AccessibleNavLink({ to, children, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink 
      to={to}
      className={`sidebar-link${isActive ? ' active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <img src={icon} alt="" />
      <div>{children}</div>
    </NavLink>
  );
}

export function NavSidebar() {
  const location = useLocation();
  const isAccessibilityActive = location.pathname === '/accessibility';
  
  return (
    <nav className="left sidebar">
      {/* <!-- top section: navigation--> */}
      <div>
        <AccessibleNavLink to="/" icon={HomeIcon}>Home</AccessibleNavLink>
        <AccessibleNavLink to="/cfu-boyfriend-quiz" icon={FileTextIcon}>CFU Boyfriend Quiz</AccessibleNavLink>
        <AccessibleNavLink to="/about-me" icon={UserIcon}>About Me</AccessibleNavLink>
      </div>
      {/* <!-- bottom section: website compliance --> */}
      <div>
        <AccessibleNavLink to="/rules" icon={BookOpenIcon}>Rules</AccessibleNavLink>
        <AccessibleNavLink to="/privacy-policy" icon={ClipboardIcon}>Privacy Policy</AccessibleNavLink>
        <AccessibleNavLink to="/user-agreement" icon={ClipboardIcon}>User Agreement</AccessibleNavLink>
        <NavLink 
          to="/accessibility" 
          className={`sidebar-link${isAccessibilityActive ? ' active' : ''}`}
          aria-current={isAccessibilityActive ? 'page' : undefined}
        >
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
          &copy; 2026 Cadence Keys
        </p>
      </div>
    </nav>
  );
}