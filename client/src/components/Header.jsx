import FacebookIcon from '../assets/images/icons/facebook.svg';
import InstagramIcon from '../assets/images/icons/instagram.svg';
import YouTubeIcon from '../assets/images/icons/youtube.svg';
import './Header.css';

export function Header() {
  return (
    <header>
      <div className="header-title">Rate My Performance</div>
      <div className="socials">
        <a href="https://www.facebook.com/cadencekeysauthor" target="_blank">
          <img src={FacebookIcon} />
        </a>
        <a href="https://www.instagram.com/cadencekeysauthor/" target="_blank">
          <img src={InstagramIcon} />
        </a>
        <a href="https://www.youtube.com/channel/UCR2EQ8F1x3olZDs1JrE7z4g" target="_blank">
          <img src={YouTubeIcon} />
        </a>
      </div>
    </header>
  );
}