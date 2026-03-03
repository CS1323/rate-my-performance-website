import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  console.log("Rendering PrivacyPolicyClean");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <title>RMP Privacy Policy</title>

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
                <h2>What Information We Collect</h2>
                <p>
                  We collect information you provide directly (like when you comment or take quizzes), 
                  basic usage data (like which pages you visit), and standard web information 
                  (like your IP address and browser type).
                </p>
                <p>
                  We do not collect sensitive personal information, track you across other websites, 
                  or require you to create accounts. Most of what we gather is the same stuff 
                  any website sees when you visit.
                </p>
              </section>

              <section className="privacy-section">
                <h2>How We Use Your Information</h2>
                <p>
                  Your information helps us run the site, show you quiz results, enable commenting, 
                  and understand how people use our features so we can make improvements.
                </p>
                <p>
                  We do not sell your data to sketchy third parties or use it for purposes 
                  you would not expect. If you took a hockey boyfriend quiz, we are not going 
                  to start sending you actual hockey equipment ads.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Cookies and Tracking</h2>
                <p>
                  Most cookies are essential for basic features like remembering you took 
                  the quiz or keeping you logged in.
                </p>
                <p>
                  We also use analytics tools to understand how people use the site. These 
                  create anonymous usage statistics - we cannot identify individual users 
                  from this data.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Third-Party Services</h2>
                <p>
                  We use some external services for things like website analytics and hosting. 
                  These services have their own privacy policies that govern how they handle data.
                </p>
                <p>
                  We have tried to choose reputable services, but we cannot control what they do. 
                  If you are concerned about third-party tracking, consider using privacy-focused 
                  browser extensions.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Data Security</h2>
                <p>
                  We take reasonable steps to protect your information, but no internet 
                  transmission is 100% secure. We use standard security measures and do not 
                  store sensitive information we do not need.
                </p>
                <p>
                  If we discover a security incident that affects user data, we will let people 
                  know what happened and what we are doing about it.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Your Rights</h2>
                <p>
                  You can stop using the site anytime you want - we will not chase you down.
                </p>
                <p>
                  If you have questions about what information we have about you, feel free to 
                  contact us. We will do our best to help, though some information might be 
                  automatically deleted or anonymized over time.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Changes to This Policy</h2>
                <p>
                  We might update this privacy policy occasionally. When we do, we will update 
                  the date at the top and let people know about significant changes.
                </p>
                <p>
                  We are not trying to hide anything - privacy policies are just naturally boring 
                  legal documents. If you have questions about any of this, feel free to ask.
                </p>
              </section>

              <div className="privacy-footer">
                <p>
                  <strong>Contact:</strong> If you have privacy-related questions or concerns, 
                  you can reach out through our contact information. We are real humans and will 
                  try to give you real answers.
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