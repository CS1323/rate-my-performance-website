import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';
import ThumbsDownIcon from '../../assets/images/icons/thumbs-down.svg';
import FlagIcon from '../../assets/images/icons/flag.svg';
import MessageSquareIcon from '../../assets/images/icons/message-square.svg';
import { useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { CommentForm } from './CommentForm';
import { ReportModal } from './ReportModal';
import { ReactGA } from 'react-ga4';

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
function formatTimeAgo(createdAt, isMobile = false, t) {
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
    if (diffMins < 60) return t('comment.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('comment.time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('comment.time.daysAgo', { count: diffDays });
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
    const { t } = useTranslation();
    const [reporting, setReporting] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportStatus, setReportStatus] = useState('');
    const [expandedReplyCount, setExpandedReplyCount] = useState(10);
    const [isExpanded, setIsExpanded] = useState(depth < 2); // Default expanded for levels 0-1, collapsed for level 2+
    const [voteAnnouncementMessage, setVoteAnnouncementMessage] = useState('');
    const isMobile = isMobileScreen();

    const handleFlagClick = useCallback(() => {
      const confirmed = window.confirm(t('comment.reportConfirm'));
      if (confirmed) {
        setReportModalOpen(true);
      }
    }, []);

    const handleReportSubmit = useCallback(async (reason) => {
      setReporting(true);
      try {
        await axios.post(`${API_BASE_URL}/api/reports`, {
          commentId: comment.id,
          reason: reason || '',
        });
        setReportStatus(t('comment.reportSuccess'));

        // Add report submission event to GA
        ReactGA.event({
          category: 'moderation',
          action: 'report_submit',
        });

        setReportModalOpen(false);

        // Clear the status message after 5 seconds
        setTimeout(() => setReportStatus(''), 5000);
      } catch (err) {
        setReportStatus(t('comment.reportError'));
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
      const voteLabel = voteType === 'LIKE' ? 'liked' : 'disliked';
      setVoteAnnouncementMessage(t('comment.voteAnnouncement', { type: voteLabel }));
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
                {t('comment.hiddenByModeration')}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined placeholder-icon">delete</span>
                {t('comment.deleted')}
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
              alt={t('comment.avatarAlt', { id: comment.avatarId })}
              className="avatar-preview"
              loading="lazy"
              decoding="async"
              title={t('comment.avatarAlt', { id: comment.avatarId })}
            />
          </span>
          <div className="meta">
            <div className="username">{comment.authorName} <span className="time-separator">·</span> <span className="time-inline">{formatTimeAgo(comment.createdAt, isMobile, t)}</span></div>
          </div>
        </div>

        <div className="comment-body">{comment.content}</div>

        <div className="comment-actions">
          <button 
            className="reply" 
            onClick={handleReplyClick}
            aria-label={t('comment.replyButton')}
          >
            <img src={MessageSquareIcon} alt="" aria-hidden="true" />
            {t('commentForm.submitReply')}
          </button>
          <button 
            className={`vote up ${currentUserVote === 'LIKE' ? 'voted' : ''}`} 
            onClick={() => handleVoteClick('LIKE')}
            aria-label={t('comment.likeButton', { count: comment.likeCount || 0 })}
            aria-pressed={currentUserVote === 'LIKE'}
          >
            <img src={ThumbsUpIcon} alt="" aria-hidden="true" />
            <span className="count">{comment.likeCount || 0}</span>
          </button>
          <button 
            className={`vote down ${currentUserVote === 'DISLIKE' ? 'voted' : ''}`}
            onClick={() => handleVoteClick('DISLIKE')}
            aria-label={t('comment.dislikeButton', { count: comment.dislikeCount || 0 })}
            aria-pressed={currentUserVote === 'DISLIKE'}
          >
            <img src={ThumbsDownIcon} alt="" aria-hidden="true" />
            <span className="count" style={{ display: 'none' }}>{comment.dislikeCount || 0}</span>
          </button>
          <button 
            className="flag" 
            aria-label={t('comment.reportButton')}
            onClick={handleFlagClick}
          >
            <img src={FlagIcon} alt="" aria-hidden="true" />
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
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded && hiddenCount > 0
                            ? t('comment.loadMoreReplies', { count: hiddenCount })
                            : isExpanded
                              ? t('comment.hideReplies', { count: totalReplies })
                              : t('comment.expandReplies', { count: totalReplies })
                        }
                      >
                        {isExpanded && hiddenCount > 0
                          ? `+ ${t('comment.loadMoreReplies', { count: hiddenCount })}`
                          : `${isExpanded ? '−' : '+'} ${isExpanded ? t('comment.hideReplies', { count: totalReplies }) : t('comment.expandReplies', { count: totalReplies })}`}
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