import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'test-user-id-123'),
}));

import { clearUserIdentifier, getUserIdentifier } from './userIdentifier';

describe('userIdentifier', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('creates and stores an identifier when none exists', () => {
    const id = getUserIdentifier();

    expect(id).toBe('test-user-id-123');
    expect(localStorage.getItem('rmp_user_id')).toBe('test-user-id-123');
  });

  test('returns existing identifier from localStorage', () => {
    localStorage.setItem('rmp_user_id', 'existing-id-999');

    const id = getUserIdentifier();

    expect(id).toBe('existing-id-999');
  });

  test('clearUserIdentifier removes stored identifier', () => {
    localStorage.setItem('rmp_user_id', 'to-be-cleared');

    clearUserIdentifier();

    expect(localStorage.getItem('rmp_user_id')).toBeNull();
  });
});
