import { useState } from 'react';
import axios from 'axios';
import { HockeyPuckIcon, HockeyStickIcon, IceSkatesIcon, HockeyJerseyIcon } from '../../components/icons';

import './CommentForm.css';

const AVATARS = [
  { id: 1, component: HockeyPuckIcon, label: 'Hockey Puck' },
  { id: 2, component: HockeyStickIcon, label: 'Hockey Stick' },
  { id: 3, component: IceSkatesIcon, label: 'Ice Skates' },
  { id: 4, component: HockeyJerseyIcon, label: 'Hockey Jersey' },
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
            const IconComponent = avatar.component;
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
                <IconComponent 
                  size={40}
                  className={`avatar-preview ${parseInt(avatarId) === avatar.id ? 'selected' : ''}`}
                  color="#333"
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
