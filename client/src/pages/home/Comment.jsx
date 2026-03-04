import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../../assets/images/icons/thumbs-down.svg';
import FlagIcon from '../../assets/images/icons/flag.svg';
import MessageSquareIcon from '../../assets/images/icons/message-square.svg';
import { useState } from 'react';
import axios from 'axios';
import { getUserIdentifier } from '../../utils/userIdentifier';
import { CommentForm } from './CommentForm';

import './Comment.css';

import HockeyStickSvg from '../../assets/images/icons/avatars/hockey-stick.svg';
import HockeySkate from '../../assets/images/icons/avatars/hockey-skate.svg';
import HockeyRink from '../../assets/images/icons/avatars/hockey-rink.svg';
import HockeyPlayer from '../../assets/images/icons/avatars/hockey-player.svg';

const AVATAR_IMAGES = {
  1: HockeyStickSvg,
  2: HockeySkate,
  3: HockeyRink,
  4: HockeyPlayer,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper function to format relative time
function formatTimeAgo(createdAt, isMobile = false) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (isMobile) {
    // Mobile: abbreviated format (1m, 2h, 3d)
    if (diffMins < 60) return diffMins <= 0 ? 'now' : `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 365) return `${diffDays}d`;
    return created.toLocaleDateString();
  } else {
    // Desktop: full format
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return created.toLocaleDateString();
  }
}

// Helper function to check if screen is mobile
function isMobileScreen() {
  return typeof window !== 'undefined' && window.innerWidth < 480;
}

export function Comment({ comment, onVote, onReply, userVoteState, onReplyPosted, depth = 0 }) {
    const [reporting, setReporting] = useState(false);
    const [expandedReplyCount, setExpandedReplyCount] = useState(3);
    const [isExpanded, setIsExpanded] = useState(depth < 2); // Default expanded for levels 0-1, collapsed for level 2+
    const isMobile = isMobileScreen();

    const handleFlagClick = async () => {
      setReporting(true);
      try {
        const reason = window.prompt('Why are you reporting this comment? (optional)', '');
        if (reason === null) {
          setReporting(false);
          return;
        }
        await axios.post(`${API_BASE_URL}/api/reports`, {
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

  // Determine if comment is hidden or deleted
  const isHidden = comment.status === 'HIDDEN';
  const isDeleted = comment.status === 'DELETED';
  const isVisible = comment.status === 'VISIBLE';

  const handleVoteClick = (voteType) => {
    if (onVote && isVisible) {
      onVote(comment.id, voteType);
    }
  };

  const handleReplyClick = () => {
    if (isVisible) {
      setShowReplyForm(true);
    }
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    if (onReplyPosted) onReplyPosted();
  };

  const currentUserVote = userVoteState?.[comment.id];

  // Render placeholder for hidden/deleted comments
  if (isHidden || isDeleted) {
    return (
      <>
        <article className="comment comment-placeholder" data-id={comment.id}>
          <div className="comment-body comment-placeholder-text">
            {isHidden ? (
              <>
                <span className="material-symbols-outlined placeholder-icon">visibility_off</span>
                Comment hidden by moderation
              </>
            ) : (
              <>
                <span className="material-symbols-outlined placeholder-icon">delete</span>
                Comment deleted
              </>
            )}
          </div>

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
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </article>
      </>
    );
  }

  return (
    <>
      <article className="comment" data-id={comment.id}>

        <div className="comment-header">
          <span className="avatar">
            <img
              src={AVATAR_IMAGES[comment.avatarId] || HockeyStickSvg}
              alt={`Avatar ${comment.avatarId}`}
              className="avatar-preview"
              title={`Avatar ${comment.avatarId}`}
            />
          </span>
          <div className="meta">
            <div className="username">{comment.authorName} <span className="time-separator">·</span> <span className="time-inline">{formatTimeAgo(comment.createdAt, isMobile)}</span></div>
          </div>
        </div>

        <div className="comment-body">{comment.content}</div>

        <div className="comment-actions">
          <button className="reply" onClick={handleReplyClick}>
            <img src={MessageSquareIcon} alt="Reply" />
            Reply
          </button>
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
            <img src={FlagIcon} alt="Flag" />
          </button>
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
          <div className="replies" data-depth={depth + 1}>
            {(() => {
              // For nested replies at depth >= 2, paginate children and allow collapse
              const shouldPaginate = depth >= 2;
              const visibleReplies = isExpanded
                ? (shouldPaginate ? comment.replies.slice(0, expandedReplyCount) : comment.replies)
                : [];
              const hiddenCount = isExpanded
                ? Math.max(0, comment.replies.length - expandedReplyCount)
                : comment.replies.length;
              const totalReplies = comment.replies.length;

              return (
                <>
                  {isExpanded && visibleReplies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      onVote={onVote}
                      onReply={onReply}
                      userVoteState={userVoteState}
                      onReplyPosted={onReplyPosted}
                      depth={depth + 1}
                    />
                  ))}
                  {shouldPaginate && (
                    <div className="reply-controls">
                      {isExpanded && hiddenCount > 0 && (
                        <button 
                          className="load-more-replies"
                          onClick={() => setExpandedReplyCount(comment.replies.length)}
                        >
                          + Load {hiddenCount} {hiddenCount === 1 ? 'reply' : 'replies'}
                        </button>
                      )}
                      <button
                        className={`collapse-replies ${isExpanded ? 'expanded' : 'collapsed'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? 'Collapse replies' : 'Expand replies'}
                      >
                        {isExpanded ? '−' : '+'} {isExpanded ? 'Hide' : 'Load'} {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
                      </button>
                    </div>
                  )}
                  {!shouldPaginate && hiddenCount > 0 && (
                    <button 
                      className="load-more-replies"
                      onClick={() => setExpandedReplyCount(comment.replies.length)}
                    >
                      + Load {hiddenCount} {hiddenCount === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </article>
    </>
  );
}