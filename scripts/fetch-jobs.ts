import 'dotenv/config'; // Load .env file variables
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { bulkStoreJobsFromApi, ensureJobIndexes } from '../lib/jobService';
import { JobSource } from '@/types/jobStorage';

/**
 * Fetch jobs from Remotive API
 */
async function fetchRemotiveJobs() {
  try {
    console.log('Fetching jobs from Remotive API...');
    
    const response = await fetch('https://remotive.com/api/remote-jobs', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Remotive: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error('Invalid response format from Remotive API');
    }
    
    console.log(`Found ${data.jobs.length} jobs from Remotive API`);
    return data.jobs;
  } catch (error) {
    console.error('Error fetching from Remotive API:', error);
    return [];
  }
}

/**
 * Fetch jobs from Jobicy API
 * Respects fair use guidelines (delay between requests)
 */
async function fetchJobicyJobs() {
  try {
    console.log('Fetching jobs from Jobicy API...');
    
    // Per Jobicy documentation, we'll use the default parameters
    // to get up to 50 jobs without any filters
    const response = await fetch('https://jobicy.com/api/v2/remote-jobs', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Jobicy: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error('Invalid response format from Jobicy API');
    }
    
    console.log(`Found ${data.jobs.length} jobs from Jobicy API`);
    return data.jobs;
  } catch (error) {
    console.error('Error fetching from Jobicy API:', error);
    return [];
  }
}

/**
 * Add additional API fetching functions here, for example:
 * 
 * async function fetchWeworkremotelyJobs() {
 *   // Implementation
 * }
 */

/**
 * Fetch and store jobs from all sources
 */
export async function fetchAllJobs() {
  try {
    // Ensure we have proper indexes
    await ensureJobIndexes();
    
    // Fetch and store Remotive jobs
    const remotiveJobs = await fetchRemotiveJobs();
    const remotiveCount = await bulkStoreJobsFromApi(remotiveJobs, 'remotive');
    console.log(`Stored ${remotiveCount} jobs from Remotive API`);
    
    // Fetch and store Jobicy jobs
    // Add a delay to respect Jobicy fair use guidelines
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    const jobicyJobs = await fetchJobicyJobs();
    const jobicyCount = await bulkStoreJobsFromApi(jobicyJobs, 'jobicy');
    console.log(`Stored ${jobicyCount} jobs from Jobicy API`);
    
    // Add more API sources here
    // const weworkremotelyJobs = await fetchWeworkremotelyJobs();
    // const weworkremotelyCount = await bulkStoreJobsFromApi(weworkremotelyJobs, 'weworkremotely');
    // console.log(`Stored ${weworkremotelyCount} jobs from We Work Remotely API`);
    
    console.log('Job fetch and store completed successfully');
    return {
      remotive: remotiveCount,
      jobicy: jobicyCount,
      // weworkremotely: weworkremotelyCount,
    };
  } catch (error) {
    console.error('Error in fetchAllJobs:', error);
    throw error;
  }
}

// If this script is run directly (not imported)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  console.log('Starting job fetch script...');
  
  // Run immediately
  fetchAllJobs()
    .then(results => {
      console.log('Initial job fetch completed:', results);
      
      // Then schedule for every 6 hours
      cron.schedule('0 */6 * * *', async () => {
        console.log('Running scheduled job fetch...');
        try {
          const results = await fetchAllJobs();
          console.log('Scheduled job fetch completed:', results);
        } catch (error) {
          console.error('Error in scheduled job fetch:', error);
        }
      });
      
      console.log('Job fetching scheduled for every 6 hours');
    })
    .catch(error => {
      console.error('Error in initial job fetch:', error);
      process.exit(1);
    });
} 