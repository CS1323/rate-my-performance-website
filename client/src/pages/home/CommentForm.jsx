import { useState } from 'react';
import axios from 'axios';

// Import avatar images
import avatar1 from '../../assets/images/avatars/avatar1.svg';
import avatar2 from '../../assets/images/avatars/avatar2.svg';
import avatar3 from '../../assets/images/avatars/avatar3.svg';
import avatar4 from '../../assets/images/avatars/avatar4.svg';

import './HomePage.css';

const AVATARS = [
  { id: 1, src: avatar1, label: 'Puck' },
  { id: 2, src: avatar2, label: 'Stick' },
  { id: 3, src: avatar3, label: 'Skates' },
  { id: 4, src: avatar4, label: 'Jersey' },
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
          {AVATARS.map((avatar) => (
            <label key={avatar.id} className="avatar-option">
              <input
                type="radio"
                name="avatar"
                value={avatar.id}
                checked={parseInt(avatarId) === avatar.id}
                onChange={(e) => setAvatarId(e.target.value)}
                disabled={loading}
              />
              <img src={avatar.src} alt={avatar.label} className="avatar-preview" />
            </label>
          ))}
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
