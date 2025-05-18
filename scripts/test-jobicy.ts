/**
 * Test script for Jobicy API integration
 * 
 * This script:
 * 1. Fetches jobs from Jobicy API
 * 2. Transforms and stores them in the database
 * 3. Retrieves them to verify the process worked
 */

import { bulkStoreJobsFromApi, ensureJobIndexes, getJobs } from '../lib/jobService';
import { jobicyTransformer } from '../lib/transformers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Fetch jobs from Jobicy API
 */
async function fetchJobicyJobs() {
  try {
    console.log('Fetching jobs from Jobicy API...');
    
    const response = await fetch('https://jobicy.com/api/v2/remote-jobs?count=5', {
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

async function testJobicyIntegration() {
  try {
    // Create required indexes
    await ensureJobIndexes();
    
    // Fetch jobs from Jobicy
    const jobs = await fetchJobicyJobs();
    
    if (jobs.length === 0) {
      throw new Error('No jobs found from Jobicy API');
    }
    
    // Print sample job for debugging
    console.log('\nSample job from API:');
    console.log(JSON.stringify(jobs[0], null, 2).substring(0, 500) + '...');
    
    // Store jobs in database
    console.log('\nStoring jobs in database...');
    const storedCount = await bulkStoreJobsFromApi(jobs, 'jobicy');
    console.log(`Successfully stored ${storedCount} jobs`);
    
    // Retrieve jobs to verify
    console.log('\nRetrieving jobs from database...');
    const storedJobs = await getJobs(10, { sources: 'jobicy' });
    console.log(`Retrieved ${storedJobs.length} Jobicy jobs from database`);
    
    if (storedJobs.length > 0) {
      // Transform to frontend format
      const transformedJob = jobicyTransformer.fromDatabaseToFrontend(storedJobs[0]);
      
      console.log('\nSample job (database to frontend):');
      console.log(JSON.stringify(transformedJob, null, 2));
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error);
  }
}

// Run the test
testJobicyIntegration(); 