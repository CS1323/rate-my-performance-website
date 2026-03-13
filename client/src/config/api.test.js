import { describe, expect, test } from 'vitest';

import { API_BASE_URL, getImageUrl } from './api';

describe('api config', () => {
  test('uses env base URL when set, otherwise falls back to localhost', () => {
    const expectedBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    expect(API_BASE_URL).toBe(expectedBaseUrl);
  });

  test('returns absolute URLs as-is', () => {
    expect(getImageUrl('https://cdn.example.com/ad.webp')).toBe('https://cdn.example.com/ad.webp');
    expect(getImageUrl('http://cdn.example.com/ad.webp')).toBe('http://cdn.example.com/ad.webp');
  });

  test('prefixes relative image paths with API base URL', () => {
    expect(getImageUrl('/images/ad.webp')).toBe(`${API_BASE_URL}/images/ad.webp`);
    expect(getImageUrl('images/ad.webp')).toBe(`${API_BASE_URL}/images/ad.webp`);
  });

  test('returns empty string for missing image path', () => {
    expect(getImageUrl('')).toBe('');
    expect(getImageUrl(null)).toBe('');
    expect(getImageUrl(undefined)).toBe('');
  });
});