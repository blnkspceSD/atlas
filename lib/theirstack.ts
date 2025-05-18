/**
 * TheirStack API Client
 * Handles communication with the TheirStack Jobs API
 */

import axios, { AxiosError } from 'axios';

// Define TheirStack job type
export interface TheirStackJob {
  id: number;
  job_title: string;
  url: string;
  date_posted: string;
  company: string | { name: string };
  location: string;
  remote: boolean;
  salary_string?: string;
  min_annual_salary?: number;
  min_annual_salary_usd?: number;
  max_annual_salary?: number;
  max_annual_salary_usd?: number;
  avg_annual_salary_usd?: number;
  salary_currency?: string;
  country_code?: string;
  description?: string;
  company_domain?: string;
  [key: string]: any; // Allow for other properties
}

// Define search parameters interface
export interface TheirStackSearchParams {
  // At least one of these parameters is required
  posted_at_max_age_days?: number; // Jobs posted within this many days
  posted_at_gte?: string;          // Jobs posted on or after this date (ISO format)
  posted_at_lte?: string;          // Jobs posted on or before this date (ISO format)
  job_id_or?: number[];            // Array of job IDs to fetch
  company_name_or?: string[];      // Array of company names to search for
  
  // Optional parameters
  order_by?: Array<{desc: boolean; field: string}>;
  page?: number;
  limit?: number;
  remote?: boolean;
  include_total_results?: boolean;
  [key: string]: any; // Allow for other search parameters
}

// API Client Configuration
const API_BASE_URL = 'https://api.theirstack.com/v1';

// Get API key from environment variables
const API_KEY = process.env.THEIRSTACK_API_KEY;

// Create axios instance for API requests
const theirStackClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

/**
 * Default search parameters - can be customized when needed
 */
const DEFAULT_SEARCH_PARAMS: TheirStackSearchParams = {
  posted_at_max_age_days: 30, // Search for jobs posted in the last 30 days
  order_by: [
    {
      desc: true,
      field: "date_posted",
    },
    {
      desc: true,
      field: "discovered_at",
    },
  ],
  page: 0,
  limit: 100, // Fetch 100 jobs at once
  include_total_results: true,
  // Add remote filter to get remote jobs only
  remote: true
};

/**
 * Fetch job listings from TheirStack API
 * @param customParams Optional custom search parameters
 * @returns Array of job listings
 */
export async function fetchTheirStackJobs(customParams: TheirStackSearchParams = {}): Promise<TheirStackJob[]> {
  try {
    // Combine default parameters with any custom ones
    const searchParams = {
      ...DEFAULT_SEARCH_PARAMS,
      ...customParams
    };

    // Make API request to TheirStack
    const response = await theirStackClient.post('jobs/search', searchParams);
    
    // Check if API response has data
    if (response.data && response.data.data) {
      // Some API plans might return empty data but indicate total results in metadata
      if (response.data.data.length === 0 && 
          response.data.metadata && 
          response.data.metadata.total_results > 0) {
        console.log(`API plan limitation: Found ${response.data.metadata.total_results} total jobs, but access is restricted.`);
        console.log("Consider upgrading your TheirStack API plan to access this data.");
      }
      return response.data.data;
    }
    
    throw new Error('Unexpected API response format from TheirStack');
  } catch (error: unknown) {
    console.error('Error fetching jobs from TheirStack:', error);
    
    // Re-throw error with more context
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Server responded with a non-2xx status
      if (axiosError.response) {
        // Handle specific status codes
        if (axiosError.response.status === 402) {
          console.log("Payment required: Your TheirStack API plan doesn't allow access to this data.");
          console.log("Consider upgrading your plan to access more jobs.");
          return []; // Return empty array instead of throwing
        }
        
        throw new Error(`TheirStack API error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        // Request was made but no response received
        throw new Error('TheirStack API did not respond');
      }
    }
    // Something else went wrong
    throw error;
  }
}

/**
 * Pagination function to fetch all available jobs
 * @param customParams Optional custom search parameters
 * @returns Array of all job listings
 */
export async function fetchAllTheirStackJobs(customParams: TheirStackSearchParams = {}): Promise<TheirStackJob[]> {
  let allJobs: TheirStackJob[] = [];
  let currentPage = 0;
  let hasMoreJobs = true;
  const pageSize = customParams.limit || DEFAULT_SEARCH_PARAMS.limit || 100;
  
  console.log('Fetching jobs from TheirStack API...');
  
  while (hasMoreJobs) {
    // Update page number for pagination
    const params: TheirStackSearchParams = {
      ...customParams,
      page: currentPage,
      limit: pageSize
    };
    
    // Fetch jobs for current page
    const jobs = await fetchTheirStackJobs(params);
    
    if (jobs && jobs.length > 0) {
      console.log(`Fetched ${jobs.length} jobs from TheirStack (page ${currentPage + 1})`);
      allJobs = [...allJobs, ...jobs];
      currentPage++;
      
      // Check if we've reached the end (fewer jobs than page size)
      if (jobs.length < pageSize) {
        hasMoreJobs = false;
      }
    } else {
      // No more jobs
      hasMoreJobs = false;
    }
  }
  
  console.log(`Total jobs fetched from TheirStack: ${allJobs.length}`);
  return allJobs;
}

export default {
  fetchTheirStackJobs,
  fetchAllTheirStackJobs
}; 