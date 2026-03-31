import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './UserAgreement.css';

export function UserAgreement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { t: tLegal } = useTranslation('legal');

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      alert(t('common.emailCopied'));
    }).catch(() => {
      alert(t('common.emailCopyFailed'));
    });
  };

  return (
    <>
      <title>{tLegal('terms.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="agreement-container">
            <div className="agreement-header">
              <h1>{tLegal('terms.heading')}</h1>
              <p className="agreement-subtitle">{t('common.effectiveDate', { date: 'March 31, 2026' })}</p>
            </div>

            <div className="agreement-content">
              <section className="agreement-section">
                <h2>{tLegal('terms.welcomeTitle')}</h2>
                <p>{tLegal('terms.welcomeContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.whatTitle')}</h2>
                <p>{tLegal('terms.whatContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.ageTitle')}</h2>
                <p>{tLegal('terms.ageContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.behaviorTitle')}</h2>
                <p>{tLegal('terms.behaviorP1')}</p>
                <p>{tLegal('terms.behaviorP2')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.contentTitle')}</h2>
                <p>{tLegal('terms.contentP1')}</p>
                <p>{tLegal('terms.contentP2')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.dmcaTitle')}</h2>
                <p>{tLegal('terms.dmcaIntro', { email: 'cadence@cadencekeys.com' })}</p>
                <ul>
                  <li>{tLegal('terms.dmcaItem1')}</li>
                  <li>{tLegal('terms.dmcaItem2')}</li>
                  <li>{tLegal('terms.dmcaItem3')}</li>
                  <li>{tLegal('terms.dmcaItem4')}</li>
                  <li>{tLegal('terms.dmcaItem5')}</li>
                </ul>
                <p>{tLegal('terms.dmcaClosing')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.ourContentTitle')}</h2>
                <p>{tLegal('terms.ourContentContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.disclaimersTitle')}</h2>
                <p>{tLegal('terms.disclaimersP1')}</p>
                <p>{tLegal('terms.disclaimersP2')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.privacyTitle')}</h2>
                <p>{tLegal('terms.privacyContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.terminationTitle')}</h2>
                <p>{tLegal('terms.terminationContent')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.governingTitle')}</h2>
                <p>{tLegal('terms.governingP1')}</p>
                <p>{tLegal('terms.governingP2')}</p>
              </section>

              <section className="agreement-section">
                <h2>{tLegal('terms.liabilityTitle')}</h2>
                <p>{tLegal('terms.liabilityContent')}</p>
              </section>

              <div className="agreement-footer">
                <h2>{tLegal('terms.questionsTitle')}</h2>
                <p>{tLegal('terms.questionsP1')}</p>
                <p>{tLegal('terms.questionsP2')}</p>
                <p>
                  <Trans i18nKey="terms.footerP1" ns="legal" values={{ email: 'cadence@cadencekeys.com' }}>
                    Contact: <span 
                      className="contact-email" 
                      onClick={() => handleCopyEmail('cadence@cadencekeys.com')}
                      role="button"
                      tabIndex="0"
                      aria-label={t('common.emailAriaLabel', { email: 'cadence@cadencekeys.com' })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCopyEmail('cadence@cadencekeys.com');
                        }
                      }}
                    >cadence@cadencekeys.com</span>
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