import { nanoid } from 'nanoid';

/**
 * Generate or retrieve a unique user identifier for vote tracking
 * Uses localStorage to persist the same ID across sessions
 * Uses nanoid for cryptographically secure, URL-safe IDs
 */

const USER_ID_KEY = 'rmp_user_id';

export function getUserIdentifier() {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate a new unique identifier using nanoid
    userId = nanoid();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

/**
 * Clear the stored user identifier (useful for testing)
 */
export function clearUserIdentifier() {
  localStorage.removeItem(USER_ID_KEY);
}
