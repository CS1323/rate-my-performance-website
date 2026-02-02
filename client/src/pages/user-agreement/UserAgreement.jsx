import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import './UserAgreement.css';

export function UserAgreement() {
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
          <div className="agreement-container">
            <div className="agreement-header">
              <h1>User Agreement</h1>
              <p className="agreement-subtitle">Effective Date: February 1, 2026</p>
            </div>

            <div className="agreement-content">
              <section className="agreement-section">
                <h2>Welcome</h2>
                <p>
                  By using this site, you're agreeing to these terms. If you don't agree with 
                  them, that's fine – you just can't use the site. These terms might change 
                  occasionally, so check back if you're curious about updates.
                </p>
              </section>

              <section className="agreement-section">
                <h2>What This Site Is</h2>
                <p>
                  This is a fan community site focused on sports romance books, particularly 
                  the CFU hockey series. We provide discussion space, quizzes, and related 
                  content. We're not affiliated with any publisher, sports league, or 
                  educational institution.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Your Account and Behavior</h2>
                <p>
                  You're responsible for what you post and how you behave here. Don't share 
                  other people's personal information, don't harass anyone, and don't post 
                  illegal content. Basic human decency applies.
                </p>
                <p>
                  We can remove content or restrict access if you break our rules or do 
                  things that make the site worse for everyone else. We'd rather not, but 
                  sometimes it's necessary.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Content You Post</h2>
                <p>
                  You keep ownership of what you post, but you give us permission to display 
                  it, moderate it, and keep the site running. We won't sell your posts or 
                  use them for purposes unrelated to operating this community.
                </p>
                <p>
                  Don't post copyrighted material without permission. Fan discussion and 
                  fair use commentary are fine, but don't paste entire chapters of books 
                  or share pirated content.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Our Content</h2>
                <p>
                  The site design, original quizzes, and our original content belong to us. 
                  You can use the site as intended, but don't copy our stuff to create 
                  competing sites or commercial products.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Disclaimers</h2>
                <p>
                  We provide this site "as is" without guarantees. Sometimes it might be 
                  slow, sometimes features might not work perfectly, and sometimes we might 
                  have outages. We'll try to keep things running smoothly, but we can't 
                  promise perfection.
                </p>
                <p>
                  The quiz results are for entertainment purposes only. Your CFU boyfriend 
                  match doesn't constitute relationship advice or guarantee compatibility 
                  with fictional characters.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Privacy</h2>
                <p>
                  Check our Privacy Policy for details about data collection and use. 
                  The short version: we collect what we need to run the site and we're 
                  not in the business of selling user data.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Termination</h2>
                <p>
                  You can stop using the site anytime. We can also restrict or terminate 
                  accounts that violate these terms or make the site worse for other users. 
                  If we shut down the site entirely, we'll try to give reasonable notice.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Legal Stuff</h2>
                <p>
                  These terms are governed by applicable laws. If part of these terms turns 
                  out to be unenforceable, the rest still applies. We're not liable for 
                  indirect damages or losses beyond our control.
                </p>
                <p>
                  If you have legal concerns, please contact us directly before involving 
                  lawyers. Most issues can be resolved through reasonable discussion.
                </p>
              </section>

              <div className="agreement-footer">
                <h2>Questions or Problems?</h2>
                <p>
                  These terms cover the essential legal bases, but they're not meant to be 
                  adversarial. We want people to enjoy using this site, and legal documents 
                  are just part of running a community responsibly.
                </p>
                <p>
                  If something seems unclear or if you have concerns about these terms, 
                  feel free to reach out. We're happy to explain our thinking or address 
                  reasonable concerns.
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