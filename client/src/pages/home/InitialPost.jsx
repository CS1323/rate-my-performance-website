import './InitialPost.css';
import { getImageUrl } from '../../config/api';

export function InitialPost({ post }) {
  // Safely handle null/undefined post
  if (!post) {
    return (
      <section className="initial-post">
        <div className="initial-post-title">Loading...</div>
      </section>
    );
  }

  const imageUrl = getImageUrl(post.image);

  return (
    <section className="initial-post">
      <div className="initial-post-title">
        {post.title}
      </div>

      {post.image && (
        <div className="initial-post-image">
          <img src={imageUrl} alt={post.title} />
        </div>
      )}

      <div className="initial-post-comment">
        {post.content}
      </div>

      <div className="initial-post-instructions">
        <h3>How to Join the Discussion</h3>
        <p>Welcome to the unofficial Drew Dumontier reality check! This is an anonymous space where YOU can share the truth—why you should avoid him and what went wrong (or what you've heard about him). Whether you're venting about an experience with this <em>Campus Rival</em> character or just warning others to steer clear, this is your chance to speak up. Every honest comment helps readers make better choices!</p>
        <p>Ready to jump in? Fill out the form below with a nickname, pick your avatar, and drop your comment. Want to reply directly to someone? Just click the <strong>Reply</strong> button under their comment. You can also like or dislike comments and flag anything that seems off.</p>
      </div>
    </section>
  );
}