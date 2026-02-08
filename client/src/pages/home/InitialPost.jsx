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
    </section>
  );
}