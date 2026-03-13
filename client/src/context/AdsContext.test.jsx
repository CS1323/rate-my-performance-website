import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AdsProvider, useAds } from './AdsContext';

vi.mock('axios');

function AdsConsumer() {
  const { ads, loading, error } = useAds();

  if (loading) return <div>Loading state</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>Ads count: {ads.length}</div>;
}

describe('AdsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('throws when useAds is called outside AdsProvider', () => {
    expect(() => render(<AdsConsumer />)).toThrow('useAds must be used within AdsProvider');
  });

  test('provides mapped ads data from API', async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, imageUrl: '/images/ad.webp', link: 'https://example.com', alt: 'ad' }],
    });

    render(
      <AdsProvider>
        <AdsConsumer />
      </AdsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ads count: 1')).toBeInTheDocument();
    });
  });
});
