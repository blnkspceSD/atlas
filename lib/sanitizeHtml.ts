/**
 * Simple HTML sanitizer to clean up job descriptions
 */

/**
 * Sanitize HTML to prevent XSS and normalize formatting
 * @param html Raw HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // For now, we'll do basic sanitization
  // In a production app, you might want to use a library like DOMPurify or sanitize-html
  
  // Remove script tags and their contents
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove potentially dangerous attributes
  sanitized = sanitized.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
  
  // Remove inline styles for consistency
  sanitized = sanitized.replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
  
  // Remove comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
  
  return sanitized;
} 