/**
 * One-time job import script to populate MongoDB Atlas
 * 
 * This script:
 * 1. Connects to MongoDB Atlas
 * 2. Creates necessary indexes
 * 3. Fetches jobs from both Remotive and Jobicy
 * 4. Stores them in the database with deduplication
 */

import { fetchAllJobs } from './fetch-jobs';
import { ensureJobIndexes } from '../lib/jobService';

async function importJobs() {
  console.log('Starting job import to MongoDB Atlas...');
  
  try {
    // Ensure database indexes are set up
    console.log('Creating database indexes...');
    await ensureJobIndexes();
    
    // Fetch and store jobs from all sources
    console.log('Fetching and storing jobs...');
    const results = await fetchAllJobs();
    
    console.log('Job import completed successfully!');
    console.log('Results:', results);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during job import:', error);
    process.exit(1);
  }
}

// Run the import
importJobs(); 