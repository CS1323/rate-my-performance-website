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
        <div className="sidebar-link">
          <img src={HomeIcon} />
            <div>Home</div>
        </div>
        <div className="sidebar-link">
          <img src={FileTextIcon} />
            <div>CFU Boyfriend Quiz</div>
        </div>
        <div className="sidebar-link">
          <img src={UserIcon} />
            <div>About Me</div>
        </div>
      </div>
      {/* <!-- bottom section: website compliance --> */}
      <div>
        <div className="sidebar-link">
          <img src={BookOpenIcon} />
            <div>Rules</div>
        </div>
        <div className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>Privacy Policy</div>
        </div>
        <div className="sidebar-link">
          <img src={ClipboardIcon} />
            <div>User Agreement</div>
        </div>
        <div className="sidebar-link">
          <span className="material-symbols-outlined">
            settings_accessibility
          </span>
          <div>Accessibility</div>
        </div>
        {/* <!-- copyright --> */}
        <p className="copyright">
          &copy; 2025 Cadence Keys
        </p>
      </div>
    </nav>
  );
}