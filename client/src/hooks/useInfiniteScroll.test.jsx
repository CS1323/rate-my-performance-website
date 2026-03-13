import '@testing-library/jest-dom/vitest';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useInfiniteScroll } from './useInfiniteScroll';

let observerInstances = [];

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    observerInstances.push(this);
  }
}

function TestComponent({ loadMore, hasMore, isLoading, options }) {
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading, options);

  useEffect(() => {
    // Ensure ref attaches during render lifecycle in tests.
  }, []);

  return <div data-testid="sentinel" ref={sentinelRef} />;
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    observerInstances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('creates observer with default options and observes sentinel', () => {
    const loadMore = vi.fn();
    const { getByTestId } = render(
      <TestComponent loadMore={loadMore} hasMore={true} isLoading={false} options={{}} />
    );

    expect(getByTestId('sentinel')).toBeInTheDocument();
    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0].options).toEqual({
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });
    expect(observerInstances[0].observe).toHaveBeenCalledTimes(1);
  });

  test('calls loadMore when sentinel intersects and hasMore is true', () => {
    const loadMore = vi.fn();
    render(<TestComponent loadMore={loadMore} hasMore={true} isLoading={false} options={{}} />);

    observerInstances[0].callback([{ isIntersecting: true }]);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  test('does not call loadMore when already loading or no more items', () => {
    const loadMore = vi.fn();

    const { rerender } = render(
      <TestComponent loadMore={loadMore} hasMore={false} isLoading={false} options={{}} />
    );
    observerInstances[0].callback([{ isIntersecting: true }]);

    rerender(<TestComponent loadMore={loadMore} hasMore={true} isLoading={true} options={{}} />);
    observerInstances[1].callback([{ isIntersecting: true }]);

    expect(loadMore).not.toHaveBeenCalled();
  });

  test('disconnects observer on unmount', () => {
    const loadMore = vi.fn();
    const { unmount } = render(
      <TestComponent
        loadMore={loadMore}
        hasMore={true}
        isLoading={false}
        options={{ rootMargin: '200px', threshold: 0.5 }}
      />
    );

    unmount();

    expect(observerInstances[0].disconnect).toHaveBeenCalledTimes(1);
  });
});