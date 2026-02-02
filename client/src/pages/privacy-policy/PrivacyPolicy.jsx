import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="privacy-container">
            <div className="privacy-header">
              <h1>Privacy Policy</h1>
              <p className="privacy-subtitle">Effective Date: February 1, 2026</p>
            </div>

            <div className="privacy-content">
              <section className="privacy-section">
                <h2>What We Collect</h2>
                <p>
                  We collect information you provide directly (like when you comment or take quizzes), 
                  basic usage data (like which pages you visit), and standard web information 
                  (like your IP address and browser type).
                </p>
                <p>
                  We don't collect sensitive personal information, track you across other websites, 
                  or require you to create accounts. Most of what we gather is the same stuff 
                  any website sees when you visit.
                </p>
              </section>

              <section className="privacy-section">
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Keep the site running and fix problems</li>
                  <li>Understand which content people like</li>
                  <li>Prevent spam and abuse</li>
                  <li>Show relevant advertisements</li>
                </ul>
                <p>
                  We don't sell your data to sketchy third parties or use it for purposes 
                  unrelated to running this site.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Cookies and Tracking</h2>
                <p>
                  We use cookies to remember your preferences and keep the site functional. 
                  Most cookies are essential for basic features like remembering you took 
                  the quiz or keeping you logged in.
                </p>
                <p>
                  We also use analytics tools to understand how people use the site. These 
                  create anonymous usage statistics - we can't identify individual users 
                  from this data.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Third-Party Services</h2>
                <p>
                  We use some third-party services (like analytics providers and ad networks) 
                  that may collect their own data according to their privacy policies. 
                  We've tried to choose reputable services, but we can't control what they do.
                </p>
                <p>
                  If you click links to other websites, their privacy policies apply once 
                  you leave our site.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Data Security</h2>
                <p>
                  We take reasonable precautions to protect your information, but no internet 
                  transmission is 100% secure. We use standard security measures and don't 
                  store sensitive information we don't need.
                </p>
                <p>
                  If we discover a security incident that affects user data, we'll let people 
                  know what happened and what we're doing about it.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Your Rights</h2>
                <p>
                  You can usually control cookies through your browser settings. You can 
                  stop using the site anytime you want - we won't chase you down.
                </p>
                <p>
                  If you want to know what data we have about you or want us to delete it, 
                  contact us. We'll do our best to help, though some information might be 
                  needed to keep the site running properly.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Children's Privacy</h2>
                <p>
                  This site isn't designed for children under 13, and we don't knowingly 
                  collect information from them. If we learn we've collected data from 
                  a child, we'll delete it.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Changes to This Policy</h2>
                <p>
                  We might update this policy occasionally. If we make significant changes, 
                  we'll post the new version here and update the effective date. We won't 
                  make retroactive changes that materially affect your privacy without notice.
                </p>
              </section>

              <div className="contact-section">
                <h2>Questions?</h2>
                <p>
                  This policy covers the basics in plain English. If you have specific 
                  questions about privacy or data handling, feel free to ask. We're not 
                  trying to hide anything - privacy policies are just naturally boring 
                  to write.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-ad-mobile">
            <AdsSidebar />
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}