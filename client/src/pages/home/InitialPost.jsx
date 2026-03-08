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
        {post.content.split('\n').filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="initial-post-instructions">
        <h3>How to Join the Discussion</h3>
        <p>Think of this as your open mic. You can write a real review for whoever deserves it, make up a fictional one just like Harper did, or jump into the comments to react to everyone else's. However you participate — keep it funny, not cruel. Make Harper proud!</p>
        <p>Scroll down below to create a nickname, pick your avatar, and drop your comment. Want to reply directly to someone? Just click the <strong>Reply</strong> button under their comment. You can also like or dislike comments and flag anything that seems off.</p>
      </div>
    </section>
  );
}