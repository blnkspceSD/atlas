/**
 * Debug script to verify salaryRange data in the MongoDB database
 * Run with: node scripts/check-db-salary.js
 */

const { getJobs } = require('../lib/jobService');
const { unifiedTransformer } = require('../lib/transformers');
const { parseSalary } = require('../lib/salaryParser');

// Utility to format the output
function prettyPrint(obj) {
  return JSON.stringify(obj, null, 2);
}

async function checkDatabaseSalaries() {
  console.log('Fetching jobs from database...');
  
  try {
    // Get a sample of jobs from the database
    const jobRecords = await getJobs(10);
    
    console.log(`Found ${jobRecords.length} jobs in database`);
    
    // Loop through each job and check its salary data
    jobRecords.forEach((job, index) => {
      console.log('\n' + '='.repeat(50));
      console.log(`JOB ${index + 1}: ${job.title} at ${job.company}`);
      console.log('='.repeat(50));
      
      console.log('Raw salary:', job.salary);
      console.log('Has salaryRange?', !!job.salaryRange);
      
      if (job.salaryRange) {
        console.log('Existing salaryRange:', prettyPrint(job.salaryRange));
      } else {
        console.log('No salaryRange found in database');
        
        // Attempt to parse the salary
        const parsedSalary = parseSalary(job.salary);
        console.log('Would be parsed as:', prettyPrint(parsedSalary));
      }
      
      // Transform to frontend format to check
      const frontendJob = unifiedTransformer.fromDatabaseToFrontend(job);
      console.log('Frontend job has salaryRange?', !!frontendJob.salaryRange);
      
      if (frontendJob.salaryRange) {
        console.log('Frontend salaryRange:', prettyPrint(frontendJob.salaryRange));
      }
    });
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// Run the check
checkDatabaseSalaries()
  .then(() => console.log('\nCheck complete'))
  .catch(err => console.error('Script error:', err))
  .finally(() => process.exit()); 