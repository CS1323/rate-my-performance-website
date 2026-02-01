import { Link } from 'react-router';

// Navigation Icons
import HomeIcon from '../assets/images/icons/home.svg';
import FileTextIcon from '../assets/images/icons/file-text.svg';
import UserIcon from '../assets/images/icons/user.svg';
import BookOpenIcon from '../assets/images/icons/book-open.svg';
import ClipboardIcon from '../assets/images/icons/clipboard.svg';

import './NavSidebar.css';

export function NavSidebar() {
  return (
    <nav className="left sidebar">
      {/* <!-- top section: navigation--> */}
      <div>
        <Link to="/" className="sidebar-link">
          <img src={HomeIcon} />
            <div>Home</div>
        </Link>
        <Link to="/cfu-boyfriend-quiz" className="sidebar-link">
          <img src={FileTextIcon} />
            <div>CFU Boyfriend Quiz</div>
        </Link>
        <Link to="/about-me" className="sidebar-link">
          <img src={UserIcon} />
            <div>About Me</div>
        </Link>
      </div>
      {/* <!-- bottom section: website compliance --> */}
      <div>
        <Link to="/rules" className="sidebar-link">
          <img src={BookOpenIcon} />
            <div>Rules</div>
        </Link>
        <Link to="/privacy-policy" className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>Privacy Policy</div>
        </Link>
        <Link to="/user-agreement" className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>User Agreement</div>
        </Link>
        <Link to="/accessibility" className="sidebar-link">
          <span className="material-symbols-outlined">
            settings_accessibility
          </span>
          <div>Accessibility</div>
        </Link>
        {/* <!-- copyright --> */}
        <p className="copyright">
          &copy; 2025 Cadence Keys
        </p>
      </div>
    </nav>
  );
}