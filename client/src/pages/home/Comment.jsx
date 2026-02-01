import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../../assets/images/icons/thumbs-down.svg';

// Helper function to get avatar initials from author name
function getAvatarInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper function to format relative time
function formatTimeAgo(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  
  return created.toLocaleDateString();
}

export function Comment({ comment, onVote, onReply }) {
  if (!comment) return null;

  const handleVoteClick = (voteType) => {
    if (onVote) {
      onVote(comment.id, voteType);
    }
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply(comment.id);
    }
  };

  return (
    <>
      <article className="comment" data-id={comment.id}>
        <div className="comment-header">
          <span className="avatar">{getAvatarInitials(comment.authorName)}</span>
          <div className="meta">
            <div className="username">{comment.authorName}</div>
            <div className="time">{formatTimeAgo(comment.createdAt)}</div>
          </div>
        </div>

        <div className="comment-body">{comment.content}</div>

        <div className="comment-actions">
          <button className="vote up" onClick={() => handleVoteClick('LIKE')}>
            <img src={ThumbsUpIcon} alt="Like" />
            <span className="count">{comment.likeCount || 0}</span>
          </button>
          <button className="vote down" onClick={() => handleVoteClick('DISLIKE')}>
            <img src={ThumbsDownIcon} alt="Dislike" />
            {comment.dislikeCount > 0 && <span className="count">{comment.dislikeCount}</span>}
          </button>
          <button className="reply" onClick={handleReplyClick}>Reply</button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onVote={onVote}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </article>
    </>
  );
}