import { useAds } from '../context/AdsContext';
import './AdsSidebar.css';

export function AdsSidebar() {
  const { ads, loading, error } = useAds();

  if (loading) {
    return (
      <aside className="right sidebar">
        <div className="ad-placeholder">Loading ads...</div>
      </aside>
    );
  }

  if (error || ads.length === 0) {
    return (
      <aside className="right sidebar">
        <div className="ad-placeholder">No ads available</div>
      </aside>
    );
  }

  return (
    <aside className="right sidebar">
      {ads.map((ad) => (
        <a key={ad.id} href={ad.link || '#'} target="_blank" rel="noopener noreferrer">
          <img className="ad-image" src={ad.imageUrl} alt={ad.alt || 'Advertisement'} />
        </a>
      ))}
    </aside>
  );
}