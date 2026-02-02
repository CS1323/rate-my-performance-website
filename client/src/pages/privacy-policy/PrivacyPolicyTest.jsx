import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import "./PrivacyPolicy.css";

export function PrivacyPolicyTest() {
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
              <h1>Privacy Policy - Test</h1>
              <p className="privacy-subtitle">This is a test version</p>
            </div>

            <div className="privacy-content">
              <section className="privacy-section">
                <h2>Test Content</h2>
                <p>
                  This is a simple test to see if the basic structure works without any special characters.
                </p>
              </section>
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