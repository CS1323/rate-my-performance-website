import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './Accessibility.css';

export function Accessibility() {
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
      <title>{tLegal('accessibility.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar onLinkClick={() => setSidebarOpen(false)} />
        
        <main className="content">
          <div className="accessibility-container">
            <div className="accessibility-header">
              <h1>{tLegal('accessibility.heading')}</h1>
              <p className="accessibility-subtitle">{tLegal('accessibility.subtitle')}</p>
              <p className="accessibility-subtitle">{tLegal('accessibility.reviewDate', { date: 'March 31, 2026' })}</p>
            </div>

            <div className="accessibility-content">
              <section className="accessibility-section">
                <h2>{tLegal('accessibility.commitmentTitle')}</h2>
                <p>{tLegal('accessibility.commitmentContent')}</p>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.featuresTitle')}</h2>
                <h3>{tLegal('accessibility.navTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.navItem1')}</li>
                  <li>{tLegal('accessibility.navItem2')}</li>
                  <li>{tLegal('accessibility.navItem3')}</li>
                  <li>{tLegal('accessibility.navItem4')}</li>
                  <li>{tLegal('accessibility.navItem5')}</li>
                  <li>{tLegal('accessibility.navItem6')}</li>
                  <li>{tLegal('accessibility.navItem7')}</li>
                  <li>{tLegal('accessibility.navItem8')}</li>
                  <li>{tLegal('accessibility.navItem9')}</li>
                  <li>{tLegal('accessibility.navItem10')}</li>
                  <li>{tLegal('accessibility.navItem11')}</li>
                </ul>
                
                <h3>{tLegal('accessibility.textTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.textItem1')}</li>
                  <li>{tLegal('accessibility.textItem2')}</li>
                  <li>{tLegal('accessibility.textItem3')}</li>
                  <li>{tLegal('accessibility.textItem4')}</li>
                </ul>

                <h3>{tLegal('accessibility.formTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.formItem1')}</li>
                  <li>{tLegal('accessibility.formItem2')}</li>
                  <li>{tLegal('accessibility.formItem3')}</li>
                  <li>{tLegal('accessibility.formItem4')}</li>
                  <li>{tLegal('accessibility.formItem5')}</li>
                  <li>{tLegal('accessibility.formItem6')}</li>
                </ul>

                <h3>{tLegal('accessibility.screenReaderTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.screenReaderItem1')}</li>
                  <li>{tLegal('accessibility.screenReaderItem2')}</li>
                  <li>{tLegal('accessibility.screenReaderItem3')}</li>
                  <li>{tLegal('accessibility.screenReaderItem4')}</li>
                  <li>{tLegal('accessibility.screenReaderItem5')}</li>
                  <li>{tLegal('accessibility.screenReaderItem6')}</li>
                  <li>{tLegal('accessibility.screenReaderItem7')}</li>
                  <li>{tLegal('accessibility.screenReaderItem8')}</li>
                  <li>{tLegal('accessibility.screenReaderItem9')}</li>
                  <li>{tLegal('accessibility.screenReaderItem10')}</li>
                  <li>{tLegal('accessibility.screenReaderItem11')}</li>
                </ul>

                <h3>{tLegal('accessibility.mobileTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.mobileItem1')}</li>
                  <li>{tLegal('accessibility.mobileItem2')}</li>
                  <li>{tLegal('accessibility.mobileItem3')}</li>
                  <li>{tLegal('accessibility.mobileItem4')}</li>
                </ul>

                <h3>{tLegal('accessibility.motionTitle')}</h3>
                <ul>
                  <li>{tLegal('accessibility.motionItem1')}</li>
                  <li>{tLegal('accessibility.motionItem2')}</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.knownIssuesTitle')}</h2>
                <p>{tLegal('accessibility.knownIssuesIntro')}</p>
                <ul>
                  <li><Trans i18nKey="accessibility.knownIssuesItem1" ns="legal"><strong>Browser/assistive tech combinations:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.knownIssuesItem2" ns="legal"><strong>Third-party embeds:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.knownIssuesItem3" ns="legal"><strong>Future enhancements:</strong></Trans></li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.browserTitle')}</h2>
                <p>{tLegal('accessibility.browserIntro')}</p>
                <ul>
                  <li><Trans i18nKey="accessibility.browserItem1" ns="legal"><strong>Browsers:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.browserItem2" ns="legal"><strong>Screen readers:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.browserItem3" ns="legal"><strong>Keyboard navigation:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.browserItem4" ns="legal"><strong>Browser zoom:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.browserItem5" ns="legal"><strong>High contrast mode:</strong></Trans></li>
                  <li><Trans i18nKey="accessibility.browserItem6" ns="legal"><strong>Mobile assistive tech:</strong></Trans></li>
                </ul>
                <p>{tLegal('accessibility.browserClosing')}</p>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.standardsTitle')}</h2>
                <p>{tLegal('accessibility.standardsIntro')}</p>
                <ul>
                  <li>{tLegal('accessibility.standardsItem1')}</li>
                  <li>{tLegal('accessibility.standardsItem2')}</li>
                  <li>{tLegal('accessibility.standardsItem3')}</li>
                  <li>{tLegal('accessibility.standardsItem4')}</li>
                  <li>{tLegal('accessibility.standardsItem5')}</li>
                </ul>
                <p>{tLegal('accessibility.standardsClosing')}</p>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.helpTitle')}</h2>
                <p>{tLegal('accessibility.helpP1')}</p>
                <p>{tLegal('accessibility.helpP2')}</p>
                <ul>
                  <li>{tLegal('accessibility.helpItem1')}</li>
                  <li>{tLegal('accessibility.helpItem2')}</li>
                  <li>{tLegal('accessibility.helpItem3')}</li>
                  <li>{tLegal('accessibility.helpItem4')}</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>{tLegal('accessibility.thirdPartyTitle')}</h2>
                <p>{tLegal('accessibility.thirdPartyP1')}</p>
                <p>{tLegal('accessibility.thirdPartyP2')}</p>
              </section>

              <div className="accessibility-footer">
                <p>
                  <Trans
                    i18nKey="accessibility.footerP1"
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