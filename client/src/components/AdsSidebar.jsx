import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { useAds } from '../context/AdsContext';
import './AdsSidebar.css';

export function AdsSidebar({ adIndex }) {
  const { ads, loading, error } = useAds();
  const { t } = useTranslation();

  if (loading) {
    return (
      <aside className="right sidebar">
        <div className="ad-placeholder">{t('ads.loading')}</div>
      </aside>
    );
  }

  if (error || ads.length === 0) {
    return (
      <aside className="right sidebar">
        <div className="ad-placeholder">{t('ads.noAds')}</div>
      </aside>
    );
  }

  // If adIndex is specified, show only that single ad (for mobile inline rotation)
  if (adIndex !== undefined && adIndex !== null) {
    const ad = ads[adIndex];
    if (!ad) return null;
    return (
      <aside className="right sidebar">
        <a href={ad.link || '#'} target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'ads', action: 'ads_clicked', label: ad.id?.toString() ?? ad.link })}>
          <img
            className="ad-image"
            src={ad.imageUrl}
            alt={ad.alt || t('ads.imageAlt')}
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
        <a key={ad.id} href={ad.link || '#'} target="_blank" rel="noopener noreferrer" onClick={() => ReactGA.event({ category: 'ads', action: 'ads_clicked', label: ad.id?.toString() ?? ad.link })}>
          <img
            className="ad-image"
            src={ad.imageUrl}
            alt={ad.alt || t('ads.imageAlt')}
            loading="eager"
          />
        </a>
      ))}
    </aside>
  );
}