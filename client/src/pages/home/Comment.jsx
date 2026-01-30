export function Comment() {
  return (
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
  );
}