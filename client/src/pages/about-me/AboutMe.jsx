import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import AuthorPhoto from '../../assets/images/author-cadence-keys.jpg';
import './AboutMe.css';

export function AboutMe() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <title>About Me - RMP</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="about-container">
            <div className="about-header">
              <h1>About Cadence Keys</h1>
            </div>

            <div className="about-content">
              <div className="author-photo-container">
                <img 
                  src={AuthorPhoto} 
                  alt="Cadence Keys" 
                  className="author-photo"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="photo-placeholder" style={{display: 'none'}}>
                  <span>Author Photo</span>
                </div>
              </div>

              <div className="about-text">
                <p>
                  Welcome! I'm Cadence, your friendly, neighborhood romance writer. 
                </p>

                <p>
                  By day, I look like an average frazzled mom of two toddlers who rarely does her hair (a mom bun totally counts, right?). By night, I let my imagination fly and write steamy scenes that have taken several of my closest friends by major surprise. I love writing heartfelt stories with relatable characters and a guaranteed happily ever after.
                </p>

                <p>
                  Thank you for visiting, and I hope you enjoy getting to know the players 
                  of Cascade Falls University hockey as much as I do!
                </p>
              </div>
            </div>
          </div>

          {/* Inline ads for mobile (same pattern as other pages) */}
          <div className="inline-ad-mobile">
            <AdsSidebar />
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}