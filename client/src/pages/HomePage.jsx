import { Header } from "../components/Header";
import { NavSidebar } from "../components/NavSidebar";
import { AdsSidebar } from "../components/AdsSidebar";
import DrewImage from '../assets/images/drew1.png';
import ThumbsUpIcon from '../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../assets/images/icons/thumbs-down.svg';
import './HomePage.css';

export function HomePage() {
  return (
    <>
      <title>Rate My Performance</title>
      <Header />

      <div className="layout">
        <NavSidebar />

        <main className="content">
          <section className="initial-post">
            <div className="initial-post-title">Thinking About Hooking Up With Drew Dumontier?</div>
            <div className="initial-post-image">
              <img src={DrewImage} />
            </div>
            <div className="initial-post-comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quo consequuntur esse! Dolorem consectetur qui quia ab enim dolorum eveniet recusandae pariatur laborum impedit! Excepturi veritatis vel voluptas. Odit, eligendi!
            </div>
          </section>
          {/* <!-- Comments section: post form + list --> */}
          <section className="comments-section">
            <h2>Comments</h2>

            {/* <!-- Post form (UI only) --> */}
            <form id="postForm" className="post-form" action="#" onsubmit="return false;">
              <div className="form-row">
                <label for="username">Display name</label>
                <input id="username" name="username" type="text" placeholder="Your name" maxlength="30" />
              </div>

              <div className="form-row avatar-picker">
                <div className="label">Choose an avatar</div>
                <div className="avatars">
                  <label className="avatar-option">
                    <input type="radio" name="avatar" value="A" checked />
                    <span className="avatar">A</span>
                  </label>
                  <label className="avatar-option">
                    <input type="radio" name="avatar" value="B" />
                    <span className="avatar">B</span>
                  </label>
                  <label className="avatar-option">
                    <input type="radio" name="avatar" value="C" />
                    <span className="avatar">C</span>
                  </label>
                  <label className="avatar-option">
                    <input type="radio" name="avatar" value="D" />
                    <span className="avatar">D</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <label for="body">Comment</label>
                <textarea id="body" name="body" rows="4" placeholder="Write your comment..."></textarea>
              </div>

              <div className="form-row form-actions">
                <button type="submit" className="btn-post">Post comment</button>
              </div>
            </form>

            {/* <!-- Static initial comments (UI only) --> */}
            <div className="comments-list">
              <article className="comment" data-id="1">
                <div className="comment-header">
                  <span className="avatar">CK</span>
                  <div className="meta">
                    <div className="username">Cadence Keys</div>
                    <div className="time">2 days ago</div>
                  </div>
                </div>
                <div className="comment-body">This is a sample initial comment. Love the energy here — good content for the world of Campus Rival.</div>
                <div className="comment-actions">
                  <button className="vote up">
                    <img src={ThumbsUpIcon} />
                    <span className="count">12</span>
                  </button>
                  <button className="vote down">
                    <img src={ThumbsDownIcon} />
                  </button>
                  <button className="reply">Reply</button>
                </div>
                <div className="replies">
                  <article className="comment reply" data-id="1-1">
                    <div className="comment-header">
                      <span className="avatar">DD</span>
                      <div className="meta">
                        <div className="username">Drew Dumontier</div>
                        <div className="time">1 day ago</div>
                      </div>
                    </div>
                    <div className="comment-body">Replying to this — haha great!</div>
                    <div className="comment-actions">
                      <button className="vote up">
                        <img src={ThumbsUpIcon} />
                        <span className="count">3</span>
                      </button>
                      <button className="vote down">
                        <img src={ThumbsDownIcon} />
                      </button>
                      <button className="reply">Reply</button>
                    </div>
                  </article>
                </div>
              </article>

              <article className="comment" data-id="2">
                <div className="comment-header">
                  <span className="avatar">TR</span>
                  <div className="meta">
                    <div className="username">T. Reader</div>
                    <div className="time">3 hours ago</div>
                  </div>
                </div>
                <div className="comment-body">Another sample comment — testing how content wraps and looks on mobile.</div>
                <div className="comment-actions">
                  <button className="vote up">
                    <img src={ThumbsUpIcon} />
                    <span className="count">5</span>
                  </button>
                  <button className="vote down">
                    <img src={ThumbsDownIcon} />
                  </button>
                  <button className="reply">Reply</button>
                </div>
              </article>
            </div>
          </section>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}