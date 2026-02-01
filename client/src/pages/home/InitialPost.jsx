export function InitialPost({ post }) {
  // Safely handle null/undefined post
  if (!post) {
    return (
      <section className="initial-post">
        <div className="initial-post-title">Loading...</div>
      </section>
    );
  }

  return (
    <section className="initial-post">
      <div className="initial-post-title">
        {post.title}
      </div>

      {post.image && (
        <div className="initial-post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className="initial-post-comment">
        {post.content}
      </div>
    </section>
  );
}