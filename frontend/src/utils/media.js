/**
 * Resolves any image/video URL or path into a valid, absolute URL.
 * Handles:
 * - Empty, undefined, or invalid URLs (returns empty string)
 * - Absolute URLs (starts with http:// or https://)
 * - Relative paths with/without leading slashes (e.g. 'uploads/img.png' or '/uploads/img.png')
 * - Windows-style backslashes (e.g. 'uploads\\img.png')
 * 
 * @param {string} url The media URL or file path from the database.
 * @returns {string} The fully qualified absolute URL.
 */
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Replace all backslashes with forward slashes and strip any leading slashes
  const normalizedPath = trimmed.replace(/\\/g, '/').replace(/^\//, '');
  
  return `https://ruh-dance-project.onrender.com/${normalizedPath}`;
};
