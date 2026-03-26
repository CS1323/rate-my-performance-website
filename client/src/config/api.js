/**
 * Centralized API configuration
 * 
 * During development: use empty string so requests go through Vite proxy at /api
 * During production: set VITE_API_BASE_URL to the actual backend URL
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Construct a full image URL from a relative or absolute path
 * @param {string} imagePath - Image path from API (e.g., 'images/name.png' or '/images/name.png')
 * @returns {string} Full absolute URL to the image
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  
  // If it's already an absolute URL (http:// or https://), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure path starts with / for proper URL joining
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${API_BASE_URL}${path}`;
}
