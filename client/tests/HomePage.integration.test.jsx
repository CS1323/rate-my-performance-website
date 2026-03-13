import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { HomePage } from '../src/pages/home/HomePage';

vi.mock('axios');

vi.mock('../src/components/Header', () => ({
  Header: () => <div data-testid="header" />,
}));
vi.mock('../src/components/NavSidebar', () => ({
  NavSidebar: () => <div data-testid="nav" />,
}));
vi.mock('../src/components/AdsSidebar', () => ({
  AdsSidebar: () => <div data-testid="ads" />,
}));
vi.mock('../src/pages/home/InitialPost', () => ({
  InitialPost: ({ post }) => <div data-testid="post">{post?.title || 'post'}</div>,
}));
vi.mock('../src/pages/home/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form" />,
}));
vi.mock('../src/pages/home/Comment', () => ({
  Comment: ({ comment }) => <div data-testid="comment-item">{comment.content}</div>,
}));
vi.mock('../src/hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: () => ({ current: null }),
}));
vi.mock('../src/utils/userIdentifier', () => ({
  getUserIdentifier: () => 'user-1',
}));

describe('HomePage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/posts/')) {
        return Promise.resolve({ data: { id: 'post-1', title: 'Initial Post' } });
      }
      if (url.includes('/api/comments/post/post-1')) {
        const isTop = url.includes('sort=top');
        return Promise.resolve({
          data: {
            comments: [
              {
                id: isTop ? 'comment-2' : 'comment-1',
                content: isTop ? 'Top comment' : 'First comment',
                likeCount: isTop ? 10 : 0,
                dislikeCount: 0,
                status: 'VISIBLE',
                replies: [],
              },
            ],
            pagination: { hasNextPage: false, totalCount: 1 },
          },
        });
      }
      if (url.includes('/api/votes/post-1?ipHash=user-1')) {
        return Promise.resolve({ data: {} });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
  });

  test('loads post and initial comments', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('post')).toHaveTextContent('Initial Post');
    });

    expect(await screen.findByText('First comment')).toBeInTheDocument();
  });

  test('changing sort mode refetches comments with top sort', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Top' }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/comments/post/post-1?sort=top&page=1&limit=10')
      );
    });

    expect(screen.getByText('Top comment')).toBeInTheDocument();
  });
});
