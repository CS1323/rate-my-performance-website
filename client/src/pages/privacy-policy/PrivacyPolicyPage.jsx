import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './PrivacyPolicy.css';

export function PrivacyPolicy() {
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
      <title>{tLegal('privacy.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="privacy-container">
            <div className="privacy-header">
              <h1>{tLegal('privacy.heading')}</h1>
              <p className="privacy-subtitle">{t('common.effectiveDate', { date: 'March 31, 2026' })}</p>
            </div>

            <div className="privacy-content">
              <section className="privacy-section">
                <h2>{tLegal('privacy.whoWeAreTitle')}</h2>
                <p>{tLegal('privacy.whoWeAreContent')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.collectTitle')}</h2>
                <p>{tLegal('privacy.collectIntro')}</p>
                <p>{tLegal('privacy.collectListIntro')}</p>
                <ul>
                  <li><Trans i18nKey="privacy.collectItem1" ns="legal"><strong>Comments and replies:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.collectItem2" ns="legal"><strong>Voting and reporting:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.collectItem3" ns="legal"><strong>IP address (hashed):</strong></Trans></li>
                  <li><Trans i18nKey="privacy.collectItem4" ns="legal"><strong>Device identifier:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.collectItem5" ns="legal"><strong>Usage data:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.collectItem6" ns="legal"><strong>Error data:</strong></Trans></li>
                </ul>
                <p>{tLegal('privacy.collectClosing')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.useTitle')}</h2>
                <p>{tLegal('privacy.useIntro')}</p>
                <ul>
                  <li>{tLegal('privacy.useItem1')}</li>
                  <li>{tLegal('privacy.useItem2')}</li>
                  <li>{tLegal('privacy.useItem3')}</li>
                  <li>{tLegal('privacy.useItem4')}</li>
                  <li>{tLegal('privacy.useItem5')}</li>
                </ul>
                <p>{tLegal('privacy.useClosing')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.legalBasisTitle')}</h2>
                <p>{tLegal('privacy.legalBasisIntro')}</p>
                <ul>
                  <li><Trans i18nKey="privacy.legalBasisItem1" ns="legal"><strong>Legitimate interest:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.legalBasisItem2" ns="legal"><strong>Consent:</strong></Trans></li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.cookiesTitle')}</h2>
                <p>{tLegal('privacy.cookiesIntro')}</p>
                <ul>
                  <li><Trans i18nKey="privacy.cookiesItem1" ns="legal"><strong><code>rmp_user_id</code></strong></Trans></li>
                </ul>
                <p>{tLegal('privacy.cookiesClosing')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.thirdPartyTitle')}</h2>
                <p>{tLegal('privacy.thirdPartyIntro')}</p>
                <ul>
                  <li><Trans i18nKey="privacy.thirdPartyItem1" ns="legal" components={{ strong: <strong />, privacyLink: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" /> }}><strong>Google Analytics</strong></Trans></li>
                  <li><Trans i18nKey="privacy.thirdPartyItem2" ns="legal" components={{ strong: <strong />, privacyLink: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" /> }}><strong>Sentry</strong></Trans></li>
                  <li><Trans i18nKey="privacy.thirdPartyItem3" ns="legal" components={{ strong: <strong />, privacyLink: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" /> }}><strong>Google Gemini API</strong></Trans></li>
                  <li><Trans i18nKey="privacy.thirdPartyItem4" ns="legal"><strong>Affiliate links</strong></Trans></li>
                </ul>
                <p>{tLegal('privacy.thirdPartyClosing')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.moderationTitle')}</h2>
                <p>{tLegal('privacy.moderationP1')}</p>
                <p>{tLegal('privacy.moderationP2')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.retentionTitle')}</h2>
                <ul>
                  <li><Trans i18nKey="privacy.retentionItem1" ns="legal"><strong>Comments, votes, and reports:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.retentionItem2" ns="legal"><strong>IP hashes (reports):</strong></Trans></li>
                  <li><Trans i18nKey="privacy.retentionItem3" ns="legal"><strong>Google Analytics data:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.retentionItem4" ns="legal"><strong>Sentry error data:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.retentionItem5" ns="legal"><strong>Local storage identifier:</strong></Trans></li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.transferTitle')}</h2>
                <p>{tLegal('privacy.transferContent')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.securityTitle')}</h2>
                <p>{tLegal('privacy.securityP1')}</p>
                <p>{tLegal('privacy.securityP2')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.rightsTitle')}</h2>
                <p>{tLegal('privacy.rightsIntro')}</p>
                <h3>{tLegal('privacy.rightsEveryoneTitle')}</h3>
                <ul>
                  <li>{tLegal('privacy.rightsEveryoneItem1')}</li>
                  <li>{tLegal('privacy.rightsEveryoneItem2')}</li>
                  <li>{tLegal('privacy.rightsEveryoneItem3')}</li>
                  <li>{tLegal('privacy.rightsEveryoneItem4')}</li>
                </ul>
                <h3>{tLegal('privacy.rightsCcpaTitle')}</h3>
                <ul>
                  <li><Trans i18nKey="privacy.rightsCcpaItem1" ns="legal"><strong>Right to know:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsCcpaItem2" ns="legal"><strong>Right to delete:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsCcpaItem3" ns="legal"><strong>Right to opt out of sale:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsCcpaItem4" ns="legal"><strong>Non-discrimination:</strong></Trans></li>
                </ul>
                <h3>{tLegal('privacy.rightsGdprTitle')}</h3>
                <ul>
                  <li><Trans i18nKey="privacy.rightsGdprItem1" ns="legal"><strong>Right of access:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem2" ns="legal"><strong>Right to erasure:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem3" ns="legal"><strong>Right to rectification:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem4" ns="legal"><strong>Right to restrict processing:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem5" ns="legal"><strong>Right to data portability:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem6" ns="legal"><strong>Right to object:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem7" ns="legal"><strong>Right to withdraw consent:</strong></Trans></li>
                  <li><Trans i18nKey="privacy.rightsGdprItem8" ns="legal"><strong>Right to lodge a complaint:</strong></Trans></li>
                </ul>
                <p>{tLegal('privacy.rightsClosing')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.childrenTitle')}</h2>
                <p>{tLegal('privacy.childrenContent')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.dntTitle')}</h2>
                <p>{tLegal('privacy.dntContent')}</p>
              </section>

              <section className="privacy-section">
                <h2>{tLegal('privacy.changesTitle')}</h2>
                <p>{tLegal('privacy.changesContent')}</p>
              </section>

              <div className="privacy-footer">
                <p>
                  <Trans
                    i18nKey="privacy.footerP1"
                    ns="legal"
                    values={{ email: 'cadence@cadencekeys.com' }}
                    components={{
                      strong: <strong />,
                      1: <span
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
                      />
                    }}
                  />
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