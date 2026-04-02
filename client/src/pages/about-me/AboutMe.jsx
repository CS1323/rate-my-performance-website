import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import AuthorPhoto from '../../assets/images/author-cadence-keys.webp';
import './AboutMe.css';

export function AboutMe() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation('legal');

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <title>{t('about.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar onLinkClick={() => setSidebarOpen(false)} />
        
        <main className="content">
          <div className="about-container">
            <div className="about-header">
              <h1>{t('about.heading')}</h1>
            </div>

            <div className="about-content">
              <div className="author-photo-container">
                <img 
                  src={AuthorPhoto} 
                  alt={t('about.imageAlt')} 
                  className="author-photo"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="photo-placeholder" style={{display: 'none'}}>
                  <span>{t('about.imageAlt')}</span>
                </div>
              </div>

              <div className="about-text">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
                <p>
                  <Trans i18nKey="about.p4" ns="legal">
                    Find out more about my books at <a href="https://cadencekeys.com/" target="_blank" rel="noopener noreferrer" className="contact-email">cadencekeys.com</a>
                  </Trans>
                </p>
              </div>
            </div>
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}