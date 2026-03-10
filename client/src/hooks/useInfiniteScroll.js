import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll functionality using Intersection Observer
 * @param {Function} loadMore - Callback to load more items
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether currently loading
 * @param {Object} options - Observer options (threshold, rootMargin)
 * @returns {Object} - Ref to attach to sentinel element
 */
export function useInfiniteScroll(loadMore, hasMore, isLoading, options = {}) {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observerOptions = {
      root: null,
      rootMargin: options.rootMargin || '100px',
      threshold: options.threshold || 0.1,
    };

    observerRef.current = new IntersectionObserver(handleObserver, observerOptions);
    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, options.rootMargin, options.threshold]);

  return sentinelRef;
}
