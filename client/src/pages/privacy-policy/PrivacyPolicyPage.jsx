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

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      alert('Email copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy email');
    });
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
              <p className="privacy-subtitle">Effective Date: March 31, 2026</p>
            </div>

            <div className="privacy-content">
              <section className="privacy-section">
                <h2>Who We Are</h2>
                <p>
                  Rate My Performance (RMP) is a fan community site focused on sports romance 
                  books and the CFU hockey series. This privacy policy explains what information 
                  we collect, how we use it, and what rights you have.
                </p>
              </section>

              <section className="privacy-section">
                <h2>What Information We Collect</h2>
                <p>
                  We collect information you provide directly (like when you comment or take quizzes), 
                  basic usage data (like which pages you visit), and standard web information 
                  (like your IP address and browser type).
                </p>
                <p>Specifically, we collect:</p>
                <ul>
                  <li><strong>Comments and replies:</strong> Display name, comment text, and avatar selection you choose when posting. No email or real name is required.</li>
                  <li><strong>Voting and reporting:</strong> When you vote on a comment or report content, we record which comment was acted on and use a device identifier to prevent duplicate actions.</li>
                  <li><strong>IP address (hashed):</strong> When you submit a report, your IP address is irreversibly hashed (one-way encrypted) and stored to prevent abuse. We cannot recover your original IP from this hash.</li>
                  <li><strong>Device identifier:</strong> We store a randomly generated identifier in your browser's local storage (labeled <code>rmp_user_id</code>) to track votes and reports per device. This is not linked to your real identity.</li>
                  <li><strong>Usage data:</strong> Pages visited, time on site, browser type, device type, and screen resolution — collected through Google Analytics (see Third-Party Services below).</li>
                  <li><strong>Error data:</strong> If something breaks while you are using the site, technical details about the error (not your personal data) are sent to our error monitoring service (see Third-Party Services below).</li>
                </ul>
                <p>
                  We do not collect sensitive personal information, track you across other websites, 
                  or require you to create accounts.
                </p>
              </section>

              <section className="privacy-section">
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Display your comments and quiz results</li>
                  <li>Prevent spam, abuse, and duplicate voting</li>
                  <li>Moderate content to keep the community safe (including automated content review — see Content Moderation below)</li>
                  <li>Understand how people use the site so we can improve it</li>
                  <li>Diagnose and fix technical problems</li>
                </ul>
                <p>
                  We do not sell your data to third parties or use it for purposes 
                  you would not expect.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Legal Basis for Processing (GDPR)</h2>
                <p>
                  If you are in the European Economic Area (EEA) or UK, we process your data 
                  under these legal bases:
                </p>
                <ul>
                  <li><strong>Legitimate interest:</strong> Running the site, preventing abuse, moderating content, and fixing errors. We have balanced these interests against your rights and believe they are reasonable for a community discussion site.</li>
                  <li><strong>Consent:</strong> Analytics tracking through Google Analytics. You can withdraw consent by using browser privacy settings or extensions that block analytics scripts.</li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>Cookies and Local Storage</h2>
                <p>
                  We do not use traditional cookies for tracking. Instead, we use browser 
                  local storage for one item:
                </p>
                <ul>
                  <li><strong><code>rmp_user_id</code></strong> — A randomly generated device identifier stored in your browser. Used to prevent duplicate votes and reports. Persists until you clear your browser data. Not sent to any third party.</li>
                </ul>
                <p>
                  Third-party services we use (Google Analytics, Sentry) may set their own 
                  cookies. See the Third-Party Services section below for details.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Third-Party Services</h2>
                <p>
                  We use the following external services. Each has its own privacy policy 
                  governing how they handle data:
                </p>
                <ul>
                  <li><strong>Google Analytics</strong> — Collects anonymous usage statistics (pages visited, device type, session duration). Data is retained for 26 months by default. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                  <li><strong>Sentry</strong> — Error monitoring service that receives technical error data (stack traces, browser info) when something breaks. Does not receive your comments, votes, or personal data. <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">Sentry Privacy Policy</a></li>
                  <li><strong>Google Gemini API</strong> — Comment text is sent to Google's AI service for automated content moderation (see Content Moderation below). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                  <li><strong>Affiliate links</strong> — Our sidebar contains book affiliate links. Clicking these takes you to external sites with their own tracking and privacy practices.</li>
                </ul>
                <p>
                  We choose reputable services, but we cannot control their data practices. 
                  If you are concerned about third-party tracking, consider using privacy-focused 
                  browser extensions or settings.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Content Moderation</h2>
                <p>
                  When you submit a comment, the text may be sent to Google's Gemini AI 
                  service for automated moderation scoring. This helps us identify harmful 
                  content quickly. The AI evaluates the text and returns a safety score — it 
                  does not store your comment or use it for training purposes beyond what 
                  Google's standard API terms allow.
                </p>
                <p>
                  Comments may also be checked against a keyword filter before reaching the AI. 
                  Content flagged by either system may be automatically hidden pending review.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Data Retention</h2>
                <ul>
                  <li><strong>Comments, votes, and reports:</strong> Stored indefinitely as part of the community discussion record. We may delete or anonymize content that violates our rules.</li>
                  <li><strong>IP hashes (reports):</strong> Stored indefinitely for abuse prevention. Cannot be reversed to recover your IP address.</li>
                  <li><strong>Google Analytics data:</strong> Retained for 26 months (Google's default), then automatically deleted.</li>
                  <li><strong>Sentry error data:</strong> Retained per Sentry's default retention period (90 days), then automatically deleted.</li>
                  <li><strong>Local storage identifier:</strong> Persists in your browser until you clear your browser data.</li>
                </ul>
              </section>

              <section className="privacy-section">
                <h2>International Data Transfers</h2>
                <p>
                  Our site is hosted in the United States. Data sent to Google Analytics, 
                  Google Gemini API, and Sentry may be processed in the United States or 
                  other countries where these providers operate. If you are located outside 
                  the United States, your information may be transferred to and processed in 
                  countries with different data protection laws.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Data Security</h2>
                <p>
                  We take reasonable steps to protect your information, including irreversible 
                  hashing of IP addresses, input sanitization to prevent injection attacks, and 
                  rate limiting to prevent abuse. No internet transmission is 100% secure, 
                  and we do not store sensitive information we do not need.
                </p>
                <p>
                  If we discover a security incident that affects user data, we will disclose 
                  what happened and what we are doing about it.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Your Rights</h2>
                <p>
                  Depending on where you live, you may have certain rights regarding your data:
                </p>
                <h3>For Everyone</h3>
                <ul>
                  <li>You can stop using the site at any time.</li>
                  <li>You can clear your browser's local storage to remove the device identifier we store.</li>
                  <li>You can use browser settings or extensions to block Google Analytics tracking.</li>
                  <li>You can contact us to ask what information we hold that may be associated with you.</li>
                </ul>
                <h3>For California Residents (CCPA/CPRA)</h3>
                <ul>
                  <li><strong>Right to know:</strong> You can request what personal information we have collected about you.</li>
                  <li><strong>Right to delete:</strong> You can request deletion of your personal information.</li>
                  <li><strong>Right to opt out of sale:</strong> We do not sell personal information. We do not share personal information for cross-context behavioral advertising.</li>
                  <li><strong>Non-discrimination:</strong> We will not treat you differently for exercising your privacy rights.</li>
                </ul>
                <h3>For EEA/UK Residents (GDPR)</h3>
                <ul>
                  <li><strong>Right of access:</strong> You can request a copy of the personal data we hold about you.</li>
                  <li><strong>Right to erasure:</strong> You can request deletion of your personal data.</li>
                  <li><strong>Right to rectification:</strong> You can request correction of inaccurate data.</li>
                  <li><strong>Right to restrict processing:</strong> You can request that we limit how we use your data.</li>
                  <li><strong>Right to data portability:</strong> You can request your data in a machine-readable format.</li>
                  <li><strong>Right to object:</strong> You can object to processing based on legitimate interest.</li>
                  <li><strong>Right to withdraw consent:</strong> Where processing is based on consent (analytics), you can withdraw at any time.</li>
                  <li><strong>Right to lodge a complaint:</strong> You have the right to complain to your local data protection authority.</li>
                </ul>
                <p>
                  To exercise any of these rights, contact us at the email below. Because this 
                  site is anonymous, we may need to verify your request relates to specific data 
                  before we can act on it.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Children's Privacy</h2>
                <p>
                  This site is not directed at children under 13 years of age. We do not 
                  knowingly collect personal information from children under 13. If you believe 
                  a child under 13 has provided us with personal information, please contact us 
                  and we will delete it promptly.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Do Not Track</h2>
                <p>
                  Some browsers send a "Do Not Track" (DNT) signal. There is currently no 
                  industry standard for how websites should respond to DNT signals. We do not 
                  currently alter our data collection practices based on DNT signals, but you 
                  can use browser extensions to block analytics tracking if you prefer.
                </p>
              </section>

              <section className="privacy-section">
                <h2>Changes to This Policy</h2>
                <p>
                  We may update this privacy policy occasionally. When we do, we will update 
                  the effective date at the top and note significant changes here. Continued 
                  use of the site after changes means you accept the updated policy.
                </p>
              </section>

              <div className="privacy-footer">
                <p>
                  <strong>Contact:</strong> If you have privacy-related questions or concerns, you can reach out at <span 
                    className="contact-email" 
                    onClick={() => handleCopyEmail('cadence@cadencekeys.com')}
                    role="button"
                    tabIndex="0"
                    aria-label="Copy email address to clipboard: cadence@cadencekeys.com"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopyEmail('cadence@cadencekeys.com');
                      }
                    }}
                  >cadence@cadencekeys.com</span>. We are real humans and will try to give you real answers.
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