import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './Rules.css';

export function Rules() {
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
      <title>{tLegal('rules.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar onLinkClick={() => setSidebarOpen(false)} />
        
        <main className="content">
          <div className="rules-container">
            <div className="rules-header">
              <h1>{tLegal('rules.heading')}</h1>
              <p className="rules-subtitle">{t('common.effectiveDate', { date: 'March 31, 2026' })}</p>
              <p className="rules-subtitle">{tLegal('rules.subtitle')}</p>
            </div>

            <div className="rules-content">
              <section className="rule-section">
                <h2>{tLegal('rules.rule1Title')}</h2>
                <p>{tLegal('rules.rule1Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule2Title')}</h2>
                <p>{tLegal('rules.rule2Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule3Title')}</h2>
                <p>{tLegal('rules.rule3Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule4Title')}</h2>
                <p>{tLegal('rules.rule4Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule5Title')}</h2>
                <p>{tLegal('rules.rule5Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule6Title')}</h2>
                <p>{tLegal('rules.rule6Content')}</p>
              </section>

              <section className="rule-section">
                <h2>{tLegal('rules.rule7Title')}</h2>
                <p>{tLegal('rules.rule7Content')}</p>
              </section>

              <div className="enforcement-section">
                <h2>{tLegal('rules.enforcementTitle')}</h2>
                <p>{tLegal('rules.enforcementP1')}</p>
                <p>{tLegal('rules.enforcementP2')}</p>
                <p>{tLegal('rules.enforcementP3')}</p>
              </div>

              <div className="rules-footer">
                <p><Trans i18nKey="rules.footerP1" ns="legal" components={{ strong: <strong /> }} /></p>
                <p>
                  <Trans
                    i18nKey="rules.footerP2"
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