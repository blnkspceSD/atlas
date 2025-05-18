/**
 * Script to fetch and store jobs from TheirStack API
 * 
 * Usage:
 * THEIRSTACK_API_KEY=your_api_key MONGODB_URI=your_mongo_uri node scripts/fetch-theirstack.js
 */

// Use require for Node.js script
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// Load environment variables
dotenv.config();

// MongoDB connection details
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'atlas-jobs';
const JOBS_COLLECTION = 'jobs';
const THEIRSTACK_API_KEY = process.env.THEIRSTACK_API_KEY;

// API Base URL
const API_BASE_URL = 'https://api.theirstack.com/v1';

// Axios for HTTP requests
const axios = require('axios');

// Create TheirStack API client
const theirStackClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${THEIRSTACK_API_KEY}`
  }
});

// Default search parameters
const DEFAULT_SEARCH_PARAMS = {
  posted_at_max_age_days: 30, // Search for jobs posted in the last 30 days
  page: 0,
  limit: 20,
  include_total_results: true
};

/**
 * Fetch job listings from TheirStack API
 */
async function fetchTheirStackJobs(customParams = {}) {
  try {
    // Combine default parameters with any custom ones
    const searchParams = {
      ...DEFAULT_SEARCH_PARAMS,
      ...customParams
    };

    console.log('Search parameters:', JSON.stringify(searchParams, null, 2));

    // Make API request to TheirStack
    const response = await theirStackClient.post('jobs/search', searchParams);
    
    // Check if API response format is as expected
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Unexpected API response format from TheirStack');
  } catch (error) {
    console.error('Error fetching jobs from TheirStack:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('API response error details:', JSON.stringify(error.response.data, null, 2));
      // Server responded with a non-2xx status
      throw new Error(`TheirStack API error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('TheirStack API did not respond');
    } else {
      // Something else went wrong
      throw error;
    }
  }
}

/**
 * Transform a TheirStack job to our database format
 */
function transformTheirStackJob(theirStackJob) {
  // Generate a unique signature for the job
  const jobSignature = `theirstack-${theirStackJob.id}`;
  
  // Extract the company name (can be a string or an object)
  const companyName = typeof theirStackJob.company === 'string' 
    ? theirStackJob.company 
    : theirStackJob.company?.name || '';
  
  // Parse date
  const datePosted = theirStackJob.date_posted ? new Date(theirStackJob.date_posted) : new Date();
  
  // Create a structured salary range if salary data exists
  let salaryRange = undefined;
  
  if (theirStackJob.min_annual_salary_usd || theirStackJob.max_annual_salary_usd) {
    salaryRange = {
      min: theirStackJob.min_annual_salary_usd,
      max: theirStackJob.max_annual_salary_usd,
      currency: 'USD',
      period: 'year'
    };
  } else if (theirStackJob.salary_string) {
    // For this script, we'll use a simplified salary parser
    try {
      // Extract currency
      const currencyMatch = theirStackJob.salary_string.match(/USD|EUR|GBP|PLN|CAD|AUD|NZD/i);
      const currency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD';
      
      // Extract numbers
      const numbers = theirStackJob.salary_string.match(/\d[\d\s,]*(\.\d+)?/g);
      if (numbers && numbers.length) {
        // Clean up and convert to numbers
        const cleanedNumbers = numbers.map(n => parseFloat(n.replace(/[^\d.]/g, '')));
        
        // Find period (year, month, etc.)
        const periodMatch = theirStackJob.salary_string.match(/year|month|week|day|hour|annually/i);
        const period = periodMatch 
          ? periodMatch[0].toLowerCase().replace('annually', 'year')
          : 'year';
        
        salaryRange = {
          min: cleanedNumbers.length > 0 ? cleanedNumbers[0] : undefined,
          max: cleanedNumbers.length > 1 ? cleanedNumbers[1] : undefined,
          currency,
          period
        };
      }
    } catch (error) {
      console.error('Error parsing salary:', error);
    }
  }
  
  // Generate a unique ID
  const id = `theirstack-${theirStackJob.id}`;
  
  // Define the source
  const source = 'theirstack';
  
  // Basic HTML sanitization for description
  const sanitizeHtml = html => {
    if (!html) return '';
    
    // Remove script tags and their contents
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove potentially dangerous attributes
    sanitized = sanitized.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
    
    return sanitized;
  };
  
  // Generate company logo URL
  const getCompanyLogo = domain => {
    if (!domain) return null;
    
    // Make sure domain is properly formatted
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Use Clearbit's Logo API to fetch company logos
    return `https://logo.clearbit.com/${cleanDomain}`;
  };
  
  // Construct job object
  const job = {
    id,
    title: theirStackJob.job_title,
    company: companyName,
    location: theirStackJob.location || (theirStackJob.remote ? 'Remote' : 'Unknown'),
    description: theirStackJob.description ? sanitizeHtml(theirStackJob.description) : '',
    salary: theirStackJob.salary_string || null,
    salaryRange,
    remote: theirStackJob.remote || false,
    jobSignature,
    sources: [source],
    sourceUrls: {
      [source]: theirStackJob.url
    },
    sourceIds: {
      [source]: theirStackJob.id.toString()
    },
    logo: theirStackJob.company_domain ? getCompanyLogo(theirStackJob.company_domain) : null,
    jobType: null,
    category: null,
    benefits: [],
    firstSeen: new Date(),
    lastSeen: new Date()
  };
  
  return job;
}

/**
 * Store a job in MongoDB
 */
async function storeJob(db, job) {
  const collection = db.collection(JOBS_COLLECTION);
  
  // Check if the job already exists (by jobSignature)
  const existingJob = await collection.findOne({ jobSignature: job.jobSignature });
  
  if (existingJob) {
    // Update the existing job with new information
    await collection.updateOne(
      { jobSignature: job.jobSignature },
      { 
        $set: { 
          lastSeen: new Date(),
          // Update any fields that might have changed
          salary: job.salary || existingJob.salary,
          logo: job.logo || existingJob.logo,
          description: job.description || existingJob.description,
          salaryRange: job.salaryRange || existingJob.salaryRange,
        },
        $addToSet: { 
          sources: 'theirstack' 
        },
        $currentDate: { updatedAt: true }
      }
    );
    return { updated: true, id: existingJob._id };
  } else {
    // Insert the new job
    const result = await collection.insertOne(job);
    return { inserted: true, id: result.insertedId };
  }
}

/**
 * Main function to fetch and store jobs
 */
async function main() {
  // Validate API key
  if (!THEIRSTACK_API_KEY) {
    console.error('Error: THEIRSTACK_API_KEY environment variable is required');
    process.exit(1);
  }
  
  // Validate MongoDB URI
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    
    const db = client.db(dbName);
    
    // Fetch jobs
    console.log('Fetching jobs from TheirStack API...');
    
    // Pagination variables
    let currentPage = 0;
    let hasMoreJobs = true;
    let totalJobsProcessed = 0;
    let totalInserted = 0;
    let totalUpdated = 0;
    
    while (hasMoreJobs) {
      try {
        // Fetch jobs for current page
        const jobs = await fetchTheirStackJobs({ page: currentPage });
        
        if (jobs && jobs.length > 0) {
          console.log(`Fetched ${jobs.length} jobs from page ${currentPage + 1}`);
          
          // Process and store each job
          for (const job of jobs) {
            const transformedJob = transformTheirStackJob(job);
            const result = await storeJob(db, transformedJob);
            
            if (result.inserted) totalInserted++;
            if (result.updated) totalUpdated++;
            
            totalJobsProcessed++;
          }
          
          currentPage++;
          
          // Safety check - don't fetch too many pages
          if (currentPage >= 10) {
            console.log('Reached maximum page limit (10), stopping');
            hasMoreJobs = false;
          }
        } else {
          // No more jobs
          hasMoreJobs = false;
        }
      } catch (error) {
        console.error('Error processing page:', error);
        // Continue to next page even if current page fails
        currentPage++;
        
        // Safety check
        if (currentPage >= 10) {
          hasMoreJobs = false;
        }
      }
    }
    
    console.log('\nJob processing complete!');
    console.log(`Total jobs processed: ${totalJobsProcessed}`);
    console.log(`New jobs inserted: ${totalInserted}`);
    console.log(`Existing jobs updated: ${totalUpdated}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 