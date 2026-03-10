import { useState, useRef, useCallback, memo } from 'react';
import axios from 'axios';

import './CommentForm.css';

import HockeyStickSvg from '../../assets/images/icons/avatars/hockey-stick.svg';
import HockeySkate from '../../assets/images/icons/avatars/hockey-skate.svg';
import HockeyRink from '../../assets/images/icons/avatars/hockey-rink.svg';
import HockeyPlayer from '../../assets/images/icons/avatars/hockey-player.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const AVATARS = [
  { id: 1, image: HockeyStickSvg, label: 'Hockey Stick' },
  { id: 2, image: HockeySkate, label: 'Hockey Skate' },
  { id: 3, image: HockeyRink, label: 'Hockey Rink' },
  { id: 4, image: HockeyPlayer, label: 'Hockey Player' },
];


function CommentFormComponent({ postId, parentCommentId, onSubmitSuccess, onCancel, mode = 'comment' }) {
  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef(null);
  const contentRef = useRef(null);
  const errorRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a display name');
      usernameRef.current?.focus();
      return;
    }
    if (!content.trim()) {
      setError(`Please enter a ${mode === 'reply' ? 'reply' : 'comment'}`);
      contentRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (mode === 'reply' && parentCommentId) {
        await axios.post(`${API_BASE_URL}/api/comments/${parentCommentId}/reply`, {
          authorName: username,
          avatarId: parseInt(avatarId),
          content: content,
        });
      } else if (postId) {
        await axios.post(`${API_BASE_URL}/api/comments/post/${postId}`, {
          authorName: username,
          avatarId: parseInt(avatarId),
          content: content,
        });
      }
      setUsername('');
      setAvatarId(1);
      setContent('');
      if (onSubmitSuccess) onSubmitSuccess();
      if (onCancel) onCancel();
      
    } catch (err) {
      setError(err.response?.data?.error || `Failed to post ${mode}`);
      console.error(`Error posting ${mode}:`, err);
      
    } finally {
      setLoading(false);
    }
  }, [mode, parentCommentId, postId, username, avatarId, content, onSubmitSuccess, onCancel]);

  return (
    <form className={`comment-form${mode === 'reply' ? ' reply-form' : ''}`} onSubmit={handleSubmit}>
      {error && (
        <div 
          ref={errorRef}
          className="form-error" 
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </div>
      )}
      
      <div className="form-row">
        <label htmlFor={mode + "-username"}>Display name</label>
        <input
          ref={usernameRef}
          id={mode + "-username"}
          type="text"
          placeholder="Your name"
          maxLength="30"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          aria-invalid={error && error.includes('display name') ? 'true' : 'false'}
          aria-describedby={error && error.includes('display name') ? 'error-message' : undefined}
        />
      </div>
      
      <fieldset className="form-row avatar-picker">
        <legend>Choose an avatar</legend>
        <div className="avatars">
          {AVATARS.map((avatar) => {
            return (
              <label key={avatar.id} className="avatar-option">
                <input
                  type="radio"
                  name="avatar"
                  value={avatar.id}
                  checked={parseInt(avatarId) === avatar.id}
                  onChange={(e) => setAvatarId(e.target.value)}
                  disabled={loading}
                />
                <img 
                  src={avatar.image}
                  alt={avatar.label}
                  className={`avatar-preview ${parseInt(avatarId) === avatar.id ? 'selected' : ''}`}
                  title={avatar.label}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="form-row">
        <label htmlFor={mode + "-content"}>{mode === 'reply' ? 'Reply' : 'Comment'}</label>
        <textarea
          ref={contentRef}
          id={mode + "-content"}
          rows={mode === 'reply' ? 3 : 4}
          placeholder={mode === 'reply' ? 'Write your reply...' : 'Write your comment...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          aria-invalid={error && !error.includes('display name') ? 'true' : 'false'}
          aria-describedby={error && !error.includes('display name') ? 'error-message' : undefined}
        />
      </div>

      <div id="error-message" style={{ display: 'none' }}>
        {error}
      </div>

      <div className="form-row form-actions">
        <button type="submit" className="btn-post" disabled={loading}>
          {loading ? (mode === 'reply' ? 'Replying...' : 'Posting...') : (mode === 'reply' ? 'Reply' : 'Post comment')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="cancel-btn">Cancel</button>
        )}
      </div>
    </form>
  );
}

// Memoize CommentForm component
export const CommentForm = memo(CommentFormComponent, (prevProps, nextProps) => {
  // Only re-render if props change
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.parentCommentId === nextProps.parentCommentId &&
    prevProps.mode === nextProps.mode &&
    prevProps.onSubmitSuccess === nextProps.onSubmitSuccess &&
    prevProps.onCancel === nextProps.onCancel
  );
});
