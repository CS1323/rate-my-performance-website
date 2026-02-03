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
                <h3>Navigation</h3>
                <ul>
                  <li>Keyboard navigation support for all interactive elements</li>
                  <li>Skip links to jump to main content</li>
                  <li>Consistent navigation structure across pages</li>
                  <li>Clear focus indicators on interactive elements</li>
                </ul>
                
                <h3>Text and Reading</h3>
                <ul>
                  <li>Readable fonts and sufficient color contrast</li>
                  <li>Text that scales with browser zoom</li>
                  <li>Logical heading structure for screen readers</li>
                  <li>Alt text for images where appropriate</li>
                </ul>

                <h3>Mobile Experience</h3>
                <ul>
                  <li>Touch-friendly button sizes</li>
                  <li>Responsive design that works on various screen sizes</li>
                  <li>Simplified navigation on smaller screens</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>Known Issues</h2>
                <p>
                  We're aware of some accessibility challenges we're still working on:
                </p>
                <ul>
                  <li>Some quiz interactions could be clearer for screen reader users</li>
                  <li>Color-only information in a few places (we're adding text alternatives)</li>
                  <li>Form error messages could be more descriptive</li>
                </ul>
                <p>
                  If you encounter accessibility barriers not mentioned here, please let us know.
                </p>
              </section>

              <section className="accessibility-section">
                <h2>Browser and Technology Support</h2>
                <p>This site works best with:</p>
                <ul>
                  <li>Modern browsers (Chrome, Firefox, Safari, Edge)</li>
                  <li>Screen readers like NVDA, JAWS, or VoiceOver</li>
                  <li>Browser zoom up to 200%</li>
                  <li>Keyboard-only navigation</li>
                </ul>
                <p>
                  If you're using assistive technology and something isn't working, 
                  the problem might be on our end. Please contact us with details 
                  about what you're trying to do and what's not working.
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
                  <li>What browser and assistive technology you're using</li>
                  <li>What page or feature you're trying to use</li>
                  <li>What happened vs. what you expected</li>
                </ul>
              </section>

              <section className="accessibility-section">
                <h2>Third-Party Content</h2>
                <p>
                  Some features (like ads or embedded content) come from third parties 
                  and may not meet the same accessibility standards. We try to choose 
                  accessible options when possible, but we can't control everything.
                </p>
                <p>
                  If third-party content is blocking your access to important site 
                  features, let us know and we'll see what alternatives we can provide.
                </p>
              </section>

              <div className="accessibility-footer">
                <h2>Feedback Welcome</h2>
                <p>
                  Accessibility is an ongoing process, and feedback from actual users 
                  is invaluable. Whether you've found a problem, have a suggestion, 
                  or just want to let us know what's working well, we'd love to hear from you.
                </p>
                <p>
                  We're committed to making improvements based on user needs, not just 
                  checking boxes on compliance checklists.
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