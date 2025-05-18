/**
 * Script to fetch recently posted jobs from TheirStack API
 * Suitable for running as a scheduled job
 * 
 * Usage:
 * THEIRSTACK_API_KEY=your_api_key MONGODB_URI=your_mongo_uri node scripts/update-theirstack-jobs.js
 */

// Use require for Node.js script
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const axios = require('axios');

// Load environment variables
dotenv.config();

// MongoDB connection details
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'atlas-jobs';
const JOBS_COLLECTION = 'jobs';
const THEIRSTACK_API_KEY = process.env.THEIRSTACK_API_KEY;

// API Base URL
const API_BASE_URL = 'https://api.theirstack.com/v1';

// Create TheirStack API client
const theirStackClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${THEIRSTACK_API_KEY}`
  }
});

// Search parameters - only recent jobs
const SEARCH_PARAMS = {
  posted_at_max_age_days: 2, // Get jobs posted in the last 2 days
  limit: 100,
  include_total_results: true,
  remote: true // Only get remote jobs
};

/**
 * Fetch job listings from TheirStack API
 */
async function fetchTheirStackJobs(page = 0) {
  try {
    const params = {
      ...SEARCH_PARAMS,
      page
    };

    console.log(`Fetching page ${page + 1}...`);
    const response = await theirStackClient.post('jobs/search', params);
    
    // Check if we have data in the response
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
  } catch (error) {
    if (error.response) {
      // Handle specific HTTP status codes
      if (error.response.status === 402) {
        console.log("Payment required: Your TheirStack API plan doesn't allow access to this data.");
        console.log("Consider upgrading your plan to access more jobs.");
      } else {
        console.error(`API error (${error.response.status}): ${error.response.statusText}`);
      }
      
      // Log the detailed error if available
      if (error.response.data) {
        console.error('API response details:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.error('Error fetching jobs from TheirStack:', error.message);
    }
    
    return []; // Return empty array on error
  }
}

/**
 * Transform a TheirStack job to our database format
 */
function transformTheirStackJob(theirStackJob) {
  // Generate a unique signature for the job
  const jobSignature = `theirstack-${theirStackJob.id}`;
  
  // Extract the company name
  const companyName = typeof theirStackJob.company === 'string' 
    ? theirStackJob.company 
    : theirStackJob.company?.name || '';
  
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
  
  // Simple HTML sanitization
  const sanitizeHtml = html => {
    if (!html) return '';
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
  };
  
  // Get company logo
  const getCompanyLogo = domain => {
    if (!domain) return null;
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return `https://logo.clearbit.com/${cleanDomain}`;
  };
  
  // Construct job object
  return {
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
    return { updated: true };
  } else {
    // Insert the new job
    await collection.insertOne(job);
    return { inserted: true };
  }
}

/**
 * Main function to fetch and store jobs
 */
async function main() {
  // Validate required environment variables
  if (!THEIRSTACK_API_KEY) {
    console.error('Error: THEIRSTACK_API_KEY environment variable is required');
    process.exit(1);
  }
  
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    let page = 0;
    let hasMoreJobs = true;
    let jobsProcessed = 0;
    let jobsInserted = 0;
    let jobsUpdated = 0;
    
    // Maximum number of pages to fetch (for safety)
    const MAX_PAGES = 5;
    
    // Fetch jobs
    while (hasMoreJobs && page < MAX_PAGES) {
      const jobs = await fetchTheirStackJobs(page);
      
      if (jobs.length === 0) {
        hasMoreJobs = false;
        continue;
      }
      
      console.log(`Processing ${jobs.length} jobs from page ${page + 1}...`);
      
      // Process each job
      for (const job of jobs) {
        const transformedJob = transformTheirStackJob(job);
        const result = await storeJob(db, transformedJob);
        
        if (result.inserted) jobsInserted++;
        if (result.updated) jobsUpdated++;
        jobsProcessed++;
      }
      
      page++;
    }
    
    console.log('\nUpdate completed successfully:');
    console.log(`Total jobs processed: ${jobsProcessed}`);
    console.log(`New jobs inserted: ${jobsInserted}`);
    console.log(`Existing jobs updated: ${jobsUpdated}`);
    
  } catch (error) {
    console.error('Error during job update process:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
main(); 