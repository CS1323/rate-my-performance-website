import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Comment } from './Comment';

vi.mock('axios');
vi.mock('./CommentForm', () => ({
  CommentForm: () => <div data-testid="reply-form">Reply Form</div>,
}));
vi.mock('./ReportModal', () => ({
  ReportModal: ({ isOpen, onSubmit, onClose }) =>
    isOpen ? (
      <div>
        <button onClick={() => onSubmit('spam')}>Submit report</button>
        <button onClick={onClose}>Close report</button>
      </div>
    ) : null,
}));

const baseComment = {
  id: 'comment-1',
  authorName: 'Casey',
  avatarId: 1,
  content: 'Sample comment',
  createdAt: '2026-03-12T10:00:00.000Z',
  likeCount: 2,
  dislikeCount: 0,
  status: 'VISIBLE',
  replies: [],
};

describe('Comment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders hidden placeholder for moderated comments', () => {
    render(<Comment comment={{ ...baseComment, status: 'HIDDEN' }} />);

    expect(screen.getByText('Comment hidden by moderation')).toBeInTheDocument();
  });

  test('calls onVote when like is clicked on visible comment', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();

    render(<Comment comment={baseComment} onVote={onVote} />);

    await user.click(screen.getByRole('button', { name: /^Like this comment/i }));

    expect(onVote).toHaveBeenCalledWith('comment-1', 'LIKE');
  });

  test('opens reply form when reply is clicked', async () => {
    const user = userEvent.setup();

    render(<Comment comment={baseComment} />);

    await user.click(screen.getByRole('button', { name: /Reply to this comment/i }));

    expect(screen.getByTestId('reply-form')).toBeInTheDocument();
  });

  test('submits report through API flow', async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<Comment comment={baseComment} />);

    await user.click(screen.getByRole('button', { name: /Report this comment as inappropriate/i }));
    await user.click(screen.getByRole('button', { name: 'Submit report' }));

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/reports'),
      { commentId: 'comment-1', reason: 'spam' }
    );
  });
});
