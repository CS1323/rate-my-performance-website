import { useAds } from '../context/AdsContext';
import './AdsSidebar.css';

export function AdsSidebar({ adIndex }) {
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

  // If adIndex is specified, show only that single ad (for mobile inline rotation)
  if (adIndex !== undefined && adIndex !== null) {
    const ad = ads[adIndex];
    if (!ad) return null;
    return (
      <aside className="right sidebar">
        <a href={ad.link || '#'} target="_blank" rel="noopener noreferrer">
          <img 
            className="ad-image" 
            src={ad.imageUrl} 
            alt={ad.alt || 'Advertisement'} 
            loading="lazy"
          />
        </a>
      </aside>
    );
  }

  // Show all ads (desktop sidebar behavior)
  return (
    <aside className="right sidebar">
      {ads.map((ad) => (
        <a key={ad.id} href={ad.link || '#'} target="_blank" rel="noopener noreferrer">
          <img 
            className="ad-image" 
            src={ad.imageUrl} 
            alt={ad.alt || 'Advertisement'} 
            loading="eager"
          />
        </a>
      ))}
    </aside>
  );
}