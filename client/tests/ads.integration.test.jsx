import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AdsProvider } from '../src/context/AdsContext';
import { AdsSidebar } from '../src/components/AdsSidebar';

vi.mock('axios');

describe('Ads integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('AdsProvider fetches ads and AdsSidebar renders them', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          imageUrl: '/images/ad-1.webp',
          link: 'https://example.com/ad-1',
          alt: 'Ad One',
        },
      ],
    });

    render(
      <AdsProvider>
        <AdsSidebar />
      </AdsProvider>
    );

    expect(screen.getByText('Loading ads...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByAltText('Ad One')).toBeInTheDocument());
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/ad-1');
  });

  test('shows fallback when ads request fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('network failed'));

    render(
      <AdsProvider>
        <AdsSidebar />
      </AdsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No ads available')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
