import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './Rules.css';

export function Rules() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <title>RMP Rules</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="rules-container">
            <div className="rules-header">
              <h1>Community Rules</h1>
              <p className="rules-subtitle">Keep it civil and keep it fun</p>
            </div>

            <div className="rules-content">
              <section className="rule-section">
                <h2>1. Be Respectful</h2>
                <p>
                  Treat other users with basic human decency. No harassment, personal attacks, 
                  or targeting individuals. Disagreeing with someone's opinion is fine - being 
                  rude about it isn't.
                </p>
              </section>

              <section className="rule-section">
                <h2>2. Stay On Topic</h2>
                <p>
                  This site is about sports romance, hockey, and the CFU series. Off-topic posts 
                  may be removed. If you're not sure if something fits, ask yourself: "Would 
                  someone here care about this?"
                </p>
              </section>

              <section className="rule-section">
                <h2>3. No Spam or Self-Promotion</h2>
                <p>
                  Don't use this space as your personal billboard. Excessive promotion, 
                  repetitive posts, or obvious spam will be removed. Share content because 
                  it's interesting, not because you're selling something.
                </p>
              </section>

              <section className="rule-section">
                <h2>4. Keep It Legal and Safe</h2>
                <p>
                  No illegal content, doxxing, threats, or anything that could put people at risk. 
                  This includes sharing personal information about yourself or others without consent.
                </p>
              </section>

              <section className="rule-section">
                <h2>5. Spoiler Etiquette</h2>
                <p>
                  When discussing books or series plot points, be considerate of others who 
                  haven't read them yet. Mark your spoilers clearly or keep major plot reveals 
                  vague in titles and previews.
                </p>
              </section>

              <section className="rule-section">
                <h2>6. Report, Don't Retaliate</h2>
                <p>
                  If someone breaks these rules, report them instead of responding in kind. 
                  Fighting fire with fire just creates more fire, and we're trying to keep 
                  things cool here.
                </p>
              </section>

              <div className="enforcement-section">
                <h2>Enforcement</h2>
                <p>
                  Rule violations may result in comment removal, temporary restrictions, or 
                  permanent bans depending on severity and frequency. We're not looking to 
                  ban people - we just want everyone to have a good time.
                </p>
                <p>
                  Moderators have discretion in how these rules are applied. If you have 
                  questions or concerns about moderation decisions, you can contact us directly.
                </p>
              </div>

              <div className="rules-footer">
                <p><strong>Questions?</strong> These rules might seem like common sense, but we've learned that spelling things out helps everyone stay on the same page. When in doubt, just be kind.</p>
              </div>
            </div>
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}