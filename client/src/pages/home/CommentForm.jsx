import { useState } from 'react';
import axios from 'axios';

import './CommentForm.css';

import HockeyStickSvg from '../../assets/images/icons/avatars/hockey-stick.svg';
import HockeySkate from '../../assets/images/icons/avatars/hockey-skate.svg';
import HockeyRink from '../../assets/images/icons/avatars/hockey-rink.svg';
import HockeyPlayer from '../../assets/images/icons/avatars/hockey-player.svg';

const AVATARS = [
  { id: 1, image: HockeyStickSvg, label: 'Hockey Stick' },
  { id: 2, image: HockeySkate, label: 'Hockey Skate' },
  { id: 3, image: HockeyRink, label: 'Hockey Rink' },
  { id: 4, image: HockeyPlayer, label: 'Hockey Player' },
];


export function CommentForm({ postId, parentCommentId, onSubmitSuccess, onCancel, mode = 'comment' }) {
  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a display name');
      return;
    }
    if (!content.trim()) {
      setError(`Please enter a ${mode === 'reply' ? 'reply' : 'comment'}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (mode === 'reply' && parentCommentId) {
        await axios.post(`/api/comments/${parentCommentId}/reply`, {
          authorName: username,
          avatarId: parseInt(avatarId),
          content: content,
        });
      } else if (postId) {
        await axios.post(`/api/comments/post/${postId}`, {
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
  };

  return (
    <form className={`comment-form${mode === 'reply' ? ' reply-form' : ''}`} onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor={mode + "-username"}>Display name</label>
        <input
          id={mode + "-username"}
          type="text"
          placeholder="Your name"
          maxLength="30"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="form-row avatar-picker">
        <div className="label">Choose an avatar</div>
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
      </div>

      <div className="form-row">
        <label htmlFor={mode + "-content"}>{mode === 'reply' ? 'Reply' : 'Comment'}</label>
        <textarea
          id={mode + "-content"}
          rows={mode === 'reply' ? 3 : 4}
          placeholder={mode === 'reply' ? 'Write your reply...' : 'Write your comment...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

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
