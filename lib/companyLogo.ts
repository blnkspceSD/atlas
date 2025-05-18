/**
 * Utility for generating company logo URLs
 */

/**
 * Generate a company logo URL from a domain name
 * Uses Clearbit's Logo API to fetch logos
 * 
 * @param domain Company domain name
 * @returns URL to the company logo
 */
export function getCompanyLogo(domain: string): string {
  if (!domain) return '';
  
  // Make sure domain is properly formatted
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  // Use Clearbit's Logo API to fetch company logos
  // This is a free API with reasonable rate limits
  return `https://logo.clearbit.com/${cleanDomain}`;
} 