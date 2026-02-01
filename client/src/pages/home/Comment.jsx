import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../../assets/images/icons/thumbs-down.svg';
import FlagIcon from '../../assets/images/icons/flag.svg';
import { useState } from 'react';
import axios from 'axios';
import { getUserIdentifier } from '../../utils/userIdentifier';
import { CommentForm } from './CommentForm';
import avatar1 from '../../assets/images/avatars/avatar1.svg';
import avatar2 from '../../assets/images/avatars/avatar2.svg';
import avatar3 from '../../assets/images/avatars/avatar3.svg';
import avatar4 from '../../assets/images/avatars/avatar4.svg';


const AVATAR_IMAGES = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
};

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

export function Comment({ comment, onVote, onReply, userVoteState, onReplyPosted }) {
    const [reporting, setReporting] = useState(false);

    const handleFlagClick = async () => {
      setReporting(true);
      try {
        const reason = window.prompt('Why are you reporting this comment? (optional)', '');
        if (reason === null) {
          setReporting(false);
          return;
        }
        await axios.post('/api/reports', {
          commentId: comment.id,
          reason,
        });
        window.alert('Thank you for your report. Our moderators will review this comment.');
      } catch (err) {
        window.alert('Failed to report comment. Please try again later.');
        console.error('Report error:', err);
      } finally {
        setReporting(false);
      }
    };
  const [showReplyForm, setShowReplyForm] = useState(false);
  if (!comment) return null;

  const handleVoteClick = (voteType) => {
    if (onVote) {
      onVote(comment.id, voteType);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(true);
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    if (onReplyPosted) onReplyPosted();
  };

  const currentUserVote = userVoteState?.[comment.id];

  return (
    <>
      <article className="comment" data-id={comment.id}>

        <div className="comment-header">
          <span className="avatar">
            <img
              src={AVATAR_IMAGES[comment.avatarId]}
              alt="avatar"
              className="avatar-preview"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          </span>
          <div className="meta">
            <div className="username">{comment.authorName}</div>
            <div className="time">{formatTimeAgo(comment.createdAt)}</div>
          </div>
        </div>

        <div className="comment-body">{comment.content}</div>

        <div className="comment-actions">
          <button 
            className={`vote up ${currentUserVote === 'LIKE' ? 'voted' : ''}`} 
            onClick={() => handleVoteClick('LIKE')}
          >
            <img src={ThumbsUpIcon} alt="Like" />
            <span className="count">{comment.likeCount || 0}</span>
          </button>
          <button 
            className={`vote down ${currentUserVote === 'DISLIKE' ? 'voted' : ''}`}
            onClick={() => handleVoteClick('DISLIKE')}
          >
            <img src={ThumbsDownIcon} alt="Dislike" />
          </button>
          <button className="flag" title="Report this comment" onClick={handleFlagClick}>
            <img src={FlagIcon} alt="Flag" style={{ width: 20, height: 20 }} />
          </button>
          <button className="reply" onClick={handleReplyClick}>Reply</button>
        </div>

        {showReplyForm && (
          <CommentForm
            parentCommentId={comment.id}
            mode="reply"
            onSubmitSuccess={handleReplySuccess}
            onCancel={handleReplyCancel}
          />
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onVote={onVote}
                onReply={onReply}
                userVoteState={userVoteState}
                onReplyPosted={onReplyPosted}
              />
            ))}
          </div>
        )}
      </article>
    </>
  );
}