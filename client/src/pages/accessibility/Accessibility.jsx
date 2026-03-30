import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './Accessibility.css';

export function Accessibility() {
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
      <title>Accessibility - RMP</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="accessibility-container">
            <div className="accessibility-header">
              <h1>Accessibility</h1>
              <p className="accessibility-subtitle">Making this site usable for everyone</p>
            </div>

            <div className="accessibility-content">
              <section className="accessibility-section">
                <h2>Our Commitment</h2>
                <p>
                  We want this site to be accessible to everyone, including people who use 
                  screen readers, keyboard navigation, or other assistive technologies. 
                  While we're not perfect, we're actively working to meet web accessibility 
                  standards and improve the experience for all users.
                </p>
              </section>

              <section className="accessibility-section">
                <h2>Current Features</h2>
                <h3>Navigation & Keyboard Access</h3>
                <ul>
                  <li>Keyboard navigation support for all interactive elements</li>
                  <li>Skip link to jump directly to main content (visible when focused)</li>
                  <li>Consistent navigation structure across all pages</li>
                  <li>Clear, visible focus indicators (outline) on buttons, links, and form inputs</li>
                  <li>Proper heading hierarchy (h1, h2, h3) for logical page structure</li>
                  <li>Keyboard-accessible modals with Escape key to close</li>
                  <li>Focus trapping inside modals so Tab/Shift+Tab stays within the dialog</li>
                  <li>Focus restored to the triggering button when a modal closes</li>
                  <li>Logical Tab order following reading order (top to bottom, left to right)</li>
                  <li>No keyboard traps: users can navigate away from any element using keyboard alone</li>
                  <li>All interactive elements have minimum 44×44px touch target size</li>
                </ul>
                
                <h3>Text and Reading</h3>
                <ul>
                  <li>Readable sans-serif fonts with sufficient line height</li>
                  <li>Dark text (#333) on light backgrounds meets WCAG AA color contrast (7:1 ratio)</li>
                  <li>Text scales properly with browser zoom up to 200%</li>
                  <li>Alt text on all images and icons that convey meaning</li>
                </ul>

                <h3>Form Validation & Error Handling</h3>
                <ul>
                  <li>All form inputs have visible, associated labels or aria-labels</li>
                  <li>Form validation errors are clearly identified with descriptive messages</li>
                  <li>Error messages explain how to fix the problem (e.g., "Display name must be 30 characters or less. Current: 45")</li>
                  <li>Errors are announced to screen readers via aria-live="assertive"</li>
                  <li>aria-invalid attributes indicate invalid fields</li>
                  <li>Critical actions (like reporting comments) require user confirmation before proceeding</li>
                </ul>

                <h3>Screen Readers & Assistive Technology</h3>
                <ul>
                  <li>ARIA labels on buttons to describe their function (e.g., "Like this comment")</li>
                  <li>ARIA alerts for error messages with role="alert" and aria-live="assertive"</li>
                  <li>ARIA status regions for vote count announcements</li>
                  <li>Toggle states communicated via aria-pressed (vote buttons) and aria-expanded (reply threads)</li>
                  <li>Proper form structure with fieldset/legend for grouped controls (avatar selector)</li>
                  <li>aria-describedby and aria-invalid attributes on form fields</li>
                  <li>Dialog and modal windows with proper aria-labelledby and aria-describedby</li>
                  <li>Decorative icons hidden from screen readers with aria-hidden to prevent duplicate announcements</li>
                  <li>Quiz progress bar with ARIA role="progressbar" and live updates for each question</li>
                  <li>Quiz answer buttons with descriptive aria-labels</li>
                  <li>Quiz results announced via live region (role="status" aria-live="polite")</li>
                </ul>

                <h3>Mobile Experience</h3>
                <ul>
                  <li>Touch-friendly button sizes (minimum 44x44px) via invisible touch target overlays</li>
                  <li>Responsive design that adapts to mobile, tablet, and desktop screens</li>
                  <li>Hamburger menu for mobile navigation with aria-label</li>
                  <li>Simplified layouts on smaller screens without loss of functionality</li>
                </ul>

                <h3>Motion & Visual Preferences</h3>
                <ul>
                  <li>Respects prefers-reduced-motion: all animations and transitions are disabled when the user's system setting requests reduced motion</li>
                  <li>No content depends solely on animation to be understood</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>Known Issues & Ongoing Improvements</h2>
                <p>
                  We continuously monitor and improve accessibility. If you encounter any issues, please let us know:
                </p>
                <ul>
                  <li><strong>Browser/assistive tech combinations:</strong> While we test on major browsers and screen readers (NVDA, JAWS, VoiceOver), some niche combinations may have issues</li>
                  <li><strong>Third-party embeds:</strong> Some ads or embedded content may not fully meet WCAG AA standards due to external provider limitations</li>
                  <li><strong>Future enhancements:</strong> We're always looking for ways to improve. Your feedback helps us identify accessibility barriers we may have missed</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>Browser and Technology Support</h2>
                <p>We test and support accessibility with:</p>
                <ul>
                  <li><strong>Browsers:</strong> Chrome, Firefox, Safari (desktop and mobile), and Edge (latest versions)</li>
                  <li><strong>Screen readers:</strong> NVDA (Windows), JAWS (Windows), and VoiceOver (macOS/iOS)</li>
                  <li><strong>Keyboard navigation:</strong> Full support for Tab, Enter, Spacebar, and Arrow keys</li>
                  <li><strong>Browser zoom:</strong> Responsive layouts at zoom levels from 80% to 200%</li>
                  <li><strong>High contrast mode:</strong> Windows High Contrast Mode support</li>
                  <li><strong>Mobile assistive tech:</strong> TalkBack (Android) and VoiceOver (iOS)</li>
                </ul>
                <p>
                  If you're using assistive technology and something isn't working as expected, 
                  please let us know. Sometimes the issue may be specific to a combination of 
                  browser + screen reader + operating system, and we want to help troubleshoot.
                </p>
              </section>

              <section className="accessibility-section">
                <h2>Accessibility Standards</h2>
                <p>
                  We aim to conform to WCAG 2.1 Level AA standards across the site. This means:
                </p>
                <ul>
                  <li>Color contrast ratios of at least 4.5:1 for normal text</li>
                  <li>Keyboard accessibility for all functionality</li>
                  <li>Proper use of semantic HTML and ARIA attributes</li>
                  <li>Descriptive labels and instructions for form controls</li>
                  <li>Sufficient time for users to read and interact with content</li>
                </ul>
                <p>
                  WCAG 2.1 Level AA is the gold standard for web accessibility and ensures that 
                  most users with disabilities can navigate and use the site effectively.
                </p>
              </section>

              <section className="accessibility-section">
                <h2>Getting Help</h2>
                <p>
                  If you need content in a different format or are having trouble 
                  accessing any part of the site, we're happy to help. We can provide 
                  information in alternative formats when possible.
                </p>
                <p>
                  When reporting accessibility issues, it helps if you can tell us:
                </p>
                <ul>
                  <li>What browser and assistive technology you're using (e.g., NVDA, JAWS, VoiceOver)</li>
                  <li>What page or feature you're trying to use</li>
                  <li>What happened vs. what you expected</li>
                  <li>Whether the issue affects core functionality (e.g., commenting) or secondary features (e.g., animations)</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>Third-Party Content & Limitations</h2>
                <p>
                  Some features on this site (such as ads or embedded content) come from third parties 
                  and may not meet the same accessibility standards that we maintain. We do our best 
                  to choose accessible third-party providers, but we can't control everything.
                </p>
                <p>
                  If third-party content is blocking your access to core site features 
                  (commenting, voting, navigation), please contact us and we'll look for alternatives 
                  or provide workarounds to ensure you can use the site fully.
                </p>
              </section>

              <div className="accessibility-footer">
                <p>
                  <strong>Contact:</strong> If you encounter accessibility barriers or have feedback, you can reach out at <span 
                    className="contact-email" 
                    onClick={() => handleCopyEmail('cadence@cadencekeys.com')}
                    role="button"
                    tabIndex="0"
                    aria-label="Copy email address to clipboard: cadence@cadencekeys.com"
                    onKeyPress={(e) => {
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