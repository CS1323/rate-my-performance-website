import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './AboutMe.css';

// Placeholder for author photo - replace with actual image path
import AuthorPhoto from '../../assets/images/dukes-ad.png';

export function AboutMe() {
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
                  Welcome! I'm Cadence Keys, and I write sports romance novels that bring together 
                  the thrill of professional hockey with the heart-pounding excitement of finding 
                  your perfect match.
                </p>

                <p>
                  My CFU (Cascade Falls University) hockey series follows the lives, loves, and 
                  victories of an elite college hockey team. Each book dives deep into the world 
                  of competitive athletics while exploring the passionate relationships that develop 
                  both on and off the ice.
                </p>

                <p>
                  When I'm not writing about power plays and penalty shots, you can find me 
                  researching hockey statistics, attending games, or getting lost in the dynamics 
                  of team chemistry. I believe that the best sports romances capture not just the 
                  individual journey of finding love, but the way that love can elevate an entire 
                  team's performance.
                </p>

                <p>
                  The CFU series is close to my heart because it explores themes of ambition, 
                  teamwork, and the courage it takes to pursue both your dreams and your heart. 
                  Whether you're a lifelong hockey fan or new to the sport, I hope these stories 
                  bring you the same joy and excitement they've brought me to write.
                </p>

                <p>
                  Thank you for visiting, and I hope you enjoy getting to know the players 
                  of Cascade Falls University hockey as much as I do.
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