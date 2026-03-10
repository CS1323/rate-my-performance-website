import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../../assets/images/icons/thumbs-down.svg';
import FlagIcon from '../../assets/images/icons/flag.svg';
import MessageSquareIcon from '../../assets/images/icons/message-square.svg';
import { useState, useCallback, memo } from 'react';
import axios from 'axios';
import { getUserIdentifier } from '../../utils/userIdentifier';
import { CommentForm } from './CommentForm';
import { ReportModal } from './ReportModal';

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

// Helper to recursively count all nested replies (including descendants)
function countAllReplies(replies) {
  if (!replies || replies.length === 0) return 0;
  return replies.reduce((count, reply) => {
    return count + 1 + countAllReplies(reply.replies);
  }, 0);
}

function CommentComponent({ comment, onVote, onReply, userVoteState, onReplyPosted, depth = 0 }) {
    const [reporting, setReporting] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportStatus, setReportStatus] = useState('');
    const [expandedReplyCount, setExpandedReplyCount] = useState(10);
    const [isExpanded, setIsExpanded] = useState(depth < 2); // Default expanded for levels 0-1, collapsed for level 2+
    const [voteAnnouncementMessage, setVoteAnnouncementMessage] = useState('');
    const isMobile = isMobileScreen();

    const handleFlagClick = useCallback(() => {
      setReportModalOpen(true);
    }, []);

    const handleReportSubmit = useCallback(async (reason) => {
      setReporting(true);
      try {
        await axios.post(`${API_BASE_URL}/api/reports`, {
          commentId: comment.id,
          reason: reason || '',
        });
        setReportStatus('Thank you for your report. Our moderators will review this comment.');
        setReportModalOpen(false);
        // Clear the status message after 5 seconds
        setTimeout(() => setReportStatus(''), 5000);
      } catch (err) {
        setReportStatus('Failed to report comment. Please try again later.');
        console.error('Report error:', err);
      } finally {
        setReporting(false);
      }
    }, [comment.id]);

    const handleReportClose = useCallback(() => {
      setReportModalOpen(false);
    }, []);
  const [showReplyForm, setShowReplyForm] = useState(false);
  if (!comment) return null;

  // Determine if comment is hidden or deleted
  const isHidden = comment.status === 'HIDDEN';
  const isDeleted = comment.status === 'DELETED';
  const isVisible = comment.status === 'VISIBLE';

  const handleVoteClick = useCallback((voteType) => {
    if (onVote && isVisible) {
      onVote(comment.id, voteType);
      // Announce vote to screen readers
      const voteLabel = voteType === 'LIKE' ? 'liked' : 'disliked';
      setVoteAnnouncementMessage(`You ${voteLabel} this comment`);
      setTimeout(() => setVoteAnnouncementMessage(''), 3000); // Clear after 3 seconds
    }
  }, [onVote, isVisible, comment.id]);

  const handleReplyClick = useCallback(() => {
    if (isVisible) {
      setShowReplyForm(true);
    }
  }, [isVisible]);

  const handleReplyCancel = useCallback(() => {
    setShowReplyForm(false);
  }, []);

  const handleReplySuccess = useCallback(() => {
    setShowReplyForm(false);
    if (onReplyPosted) onReplyPosted();
  }, [onReplyPosted]);

  const currentUserVote = userVoteState?.[comment.id];

  // Render placeholder for hidden/deleted comments
  if (isHidden || isDeleted) {
    return (
      <>
        <article 
          className="comment comment-placeholder" 
          data-id={comment.id}
          aria-level={depth + 2}
        >
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
      <article 
        className="comment" 
        data-id={comment.id}
        aria-level={depth + 2}
      >
        {/* Live region for vote announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {voteAnnouncementMessage}
        </div>

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
          <button 
            className="reply" 
            onClick={handleReplyClick}
            aria-label="Reply to this comment"
          >
            <img src={MessageSquareIcon} alt="Reply" />
            Reply
          </button>
          <button 
            className={`vote up ${currentUserVote === 'LIKE' ? 'voted' : ''}`} 
            onClick={() => handleVoteClick('LIKE')}
            aria-label={`Like this comment, ${comment.likeCount || 0} likes`}
            aria-pressed={currentUserVote === 'LIKE'}
          >
            <img src={ThumbsUpIcon} alt="" />
            <span className="count">{comment.likeCount || 0}</span>
          </button>
          <button 
            className={`vote down ${currentUserVote === 'DISLIKE' ? 'voted' : ''}`}
            onClick={() => handleVoteClick('DISLIKE')}
            aria-label={`Dislike this comment, ${comment.dislikeCount || 0} dislikes`}
            aria-pressed={currentUserVote === 'DISLIKE'}
          >
            <img src={ThumbsDownIcon} alt="" />
            <span className="count" style={{ display: 'none' }}>{comment.dislikeCount || 0}</span>
          </button>
          <button 
            className="flag" 
            aria-label="Report this comment as inappropriate"
            onClick={handleFlagClick}
          >
            <img src={FlagIcon} alt="" />
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
              // Paginate if depth >= 2 OR if more than 10 direct replies
              const shouldPaginate = depth >= 2 || comment.replies.length > 10;
              const visibleReplies = isExpanded
                ? (shouldPaginate ? comment.replies.slice(0, expandedReplyCount) : comment.replies)
                : [];
              // Count hidden replies recursively (including their descendants)
              const hiddenReplies = isExpanded && shouldPaginate
                ? comment.replies.slice(expandedReplyCount)
                : (isExpanded ? [] : comment.replies);
              const hiddenCount = countAllReplies(hiddenReplies);
              // Count all nested replies recursively (Reddit-style)
              const totalReplies = countAllReplies(comment.replies);

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
                      <button
                        className={`collapse-replies ${isExpanded ? 'expanded' : 'collapsed'}`}
                        onClick={() => {
                          if (isExpanded && hiddenCount > 0) {
                            setExpandedReplyCount(comment.replies.length);
                            return;
                          }
                          setExpandedReplyCount(10); // Reset to initial value when toggling
                          setIsExpanded(!isExpanded);
                        }}
                        aria-expanded={isExpanded && hiddenCount === 0}
                        aria-label={
                          isExpanded && hiddenCount > 0
                            ? `Load ${hiddenCount} more ${hiddenCount === 1 ? 'reply' : 'replies'}`
                            : isExpanded
                              ? `Hide ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`
                              : `Load ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`
                        }
                      >
                        {isExpanded && hiddenCount > 0
                          ? `+ Load ${hiddenCount} ${hiddenCount === 1 ? 'reply' : 'replies'}`
                          : `${isExpanded ? '−' : '+'} ${isExpanded ? 'Hide' : 'Load'} ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </article>
      
      {reportStatus && (
        <div 
          className="sr-only" 
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          {reportStatus}
        </div>
      )}
      
      <ReportModal 
        isOpen={reportModalOpen}
        onClose={handleReportClose}
        onSubmit={handleReportSubmit}
        isLoading={reporting}
      />
    </>
  );
}

export const Comment = memo(CommentComponent);