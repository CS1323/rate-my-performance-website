import DukesAd from '../assets/images/dukes-ad.png';
import './AdsSidebar.css';

export function AdsSidebar() {
  return (
    <aside className="right sidebar">
      <a href="" target="_blank">
        <img className="ad-image" src={DukesAd} alt="broken_image" />
      </a>
    </aside>
  );
}