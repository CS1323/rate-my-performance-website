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

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      alert('Email copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy email');
    });
  };

  return (
    <>
      <title>RMP User Agreement</title>

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
              <p className="agreement-subtitle">Effective Date: March 31, 2026</p>
            </div>

            <div className="agreement-content">
              <section className="agreement-section">
                <h2>Welcome</h2>
                <p>
                  By using Rate My Performance (RMP), you are agreeing to these terms. If you 
                  do not agree with them, that is fine — you just cannot use the site. These 
                  terms might change occasionally, so check back if you are curious about updates.
                </p>
              </section>

              <section className="agreement-section">
                <h2>What This Site Is</h2>
                <p>
                  This is a fan community site focused on sports romance books, particularly 
                  the CFU hockey series. We provide discussion space, quizzes, and related 
                  content. We are not affiliated with any publisher, sports league, or 
                  educational institution.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Age Requirement</h2>
                <p>
                  You must be at least 13 years old to use this site. If you are under the 
                  age of 16 and located in the European Economic Area or UK, you may need 
                  parental consent to use this site under applicable law. By using the site, 
                  you confirm that you meet the applicable age requirement.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Your Use and Behavior</h2>
                <p>
                  You are responsible for what you post and how you behave here. Do not share 
                  other people's personal information, do not harass anyone, and do not post 
                  illegal content. Basic human decency applies.
                </p>
                <p>
                  We can remove content or restrict your access if you break our 
                  Community Rules or do things that make the site worse for everyone else. 
                  We would rather not, but sometimes it is necessary.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Content You Post</h2>
                <p>
                  You keep ownership of what you post, but you give us a non-exclusive, 
                  royalty-free, worldwide license to display it, moderate it, and use it as 
                  needed to operate this community. We will not sell your posts or use them 
                  for purposes unrelated to operating this site.
                </p>
                <p>
                  Do not post copyrighted material without permission. Fan discussion and 
                  fair use commentary are fine, but do not paste entire chapters of books 
                  or share pirated content.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Copyright and DMCA</h2>
                <p>
                  We respect the intellectual property rights of others. If you believe that 
                  content on this site infringes your copyright, you may submit a takedown 
                  request by emailing us at cadence@cadencekeys.com with the following 
                  information:
                </p>
                <ul>
                  <li>A description of the copyrighted work you believe has been infringed</li>
                  <li>The URL or location of the infringing content on our site</li>
                  <li>Your contact information (name and email)</li>
                  <li>A statement that you believe in good faith the use is not authorized by the copyright owner</li>
                  <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf</li>
                </ul>
                <p>
                  We will review valid takedown requests and remove infringing content 
                  where appropriate. Repeat infringers may have their access restricted.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Our Content</h2>
                <p>
                  The site design, original quizzes, and our original content belong to us. 
                  You can use the site as intended, but do not copy our stuff to create 
                  competing sites or commercial products.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Disclaimers</h2>
                <p>
                  We provide this site "as is" without guarantees of any kind, either express 
                  or implied. Sometimes it might be slow, sometimes features might not work 
                  perfectly, and sometimes we might have outages. We will try to keep things 
                  running smoothly, but we cannot promise perfection.
                </p>
                <p>
                  The quiz results are for entertainment purposes only. Your CFU boyfriend 
                  match does not constitute relationship advice or guarantee compatibility 
                  with fictional characters.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Privacy</h2>
                <p>
                  Check our Privacy Policy for details about data collection and use. 
                  The short version: we collect what we need to run the site and we are 
                  not in the business of selling user data.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Termination</h2>
                <p>
                  You can stop using the site at any time. We can also restrict or terminate 
                  your access if you violate these terms or make the site worse for other users. 
                  If we shut down the site entirely, we will try to give reasonable notice.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Governing Law and Disputes</h2>
                <p>
                  These terms are governed by the laws of the State of Montana, United States, 
                  without regard to conflict of law principles. If part of these terms turns 
                  out to be unenforceable, the rest still applies.
                </p>
                <p>
                  If you have a dispute about these terms or the site, please contact us 
                  directly first. We will try to resolve it informally within 30 days. If we 
                  cannot resolve it informally, any legal action must be brought in the courts 
                  located in Montana, and you consent to the jurisdiction of those courts.
                </p>
              </section>

              <section className="agreement-section">
                <h2>Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of 
                  profits or revenues, arising from your use of or inability to use the site. 
                  Our total liability for any claim related to the site shall not exceed 
                  the amount you paid us in the 12 months preceding the claim (which, since 
                  this site is free, would be zero).
                </p>
              </section>

              <div className="agreement-footer">
                <h2>Questions or Problems?</h2>
                <p>
                  These terms cover the essential legal bases, but they are not meant to be 
                  adversarial. We want people to enjoy using this site, and legal documents 
                  are just part of running a community responsibly.
                </p>
                <p>
                  If something seems unclear or if you have concerns about these terms, 
                  feel free to reach out. We are happy to explain our thinking or address 
                  reasonable concerns.
                </p>
                <p><strong>Contact:</strong> <span 
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
                  >cadence@cadencekeys.com</span></p>
              </div>
            </div>
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}