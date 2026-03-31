import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import { CommentForm } from './CommentForm';

vi.mock('axios');

describe('CommentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows validation error when display name is missing', async () => {
    const user = userEvent.setup();
    render(<CommentForm postId="post-1" />);

    await user.type(screen.getByLabelText('Comment'), 'Hello world');
    await user.click(screen.getByRole('button', { name: 'Post comment' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Display name required (minimum 1 character)');
  });

  test('submits a top-level comment and resets form', async () => {
    const user = userEvent.setup();
    const onSubmitSuccess = vi.fn();
    axios.post.mockResolvedValue({ data: { id: 'comment-1' } });

    render(<CommentForm postId="post-1" onSubmitSuccess={onSubmitSuccess} />);

    await user.type(screen.getByLabelText('Display name'), 'Casey');
    await user.type(screen.getByLabelText('Comment'), 'Great post');
    await user.click(screen.getByRole('button', { name: 'Post comment' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/comments/post/post-1'),
        expect.objectContaining({
          authorName: 'Casey',
          avatarId: 1,
          content: 'Great post',
        })
      );
    });

    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Display name')).toHaveValue('');
    expect(screen.getByLabelText('Comment')).toHaveValue('');
  });
});
