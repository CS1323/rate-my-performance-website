export function PostForm() {
  return (
    <form id="postForm" className="post-form" action="#" onsubmit="return false;">
      <div className="form-row">
        <label for="username">Display name</label>
        <input id="username" name="username" type="text" placeholder="Your name" maxlength="30" />
      </div>

      <div className="form-row avatar-picker">
        <div className="label">Choose an avatar</div>
        <div className="avatars">
          <label className="avatar-option">
            <input type="radio" name="avatar" value="A" checked />
            <span className="avatar">A</span>
          </label>
          <label className="avatar-option">
            <input type="radio" name="avatar" value="B" />
            <span className="avatar">B</span>
          </label>
          <label className="avatar-option">
            <input type="radio" name="avatar" value="C" />
            <span className="avatar">C</span>
          </label>
          <label className="avatar-option">
            <input type="radio" name="avatar" value="D" />
            <span className="avatar">D</span>
          </label>
        </div>
      </div>

      <div className="form-row">
        <label for="body">Comment</label>
        <textarea id="body" name="body" rows="4" placeholder="Write your comment..."></textarea>
      </div>

      <div className="form-row form-actions">
        <button type="submit" className="btn-post">Post comment</button>
      </div>
    </form>
  );
}