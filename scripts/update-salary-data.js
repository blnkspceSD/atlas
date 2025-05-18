// @ts-check
/**
 * Script to update existing job records with structured salaryRange data
 * Run with: NODE_ENV=development node scripts/update-salary-data.js
 * 
 * This is a one-time script to update existing job data with parsed salaryRange objects
 */

// Need to use require for Node.js script
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection details ARE NOW MOVED INTO updateSalaryData()
const JOBS_COLLECTION = 'jobs';

// Import the actual parser is not possible with require in Node.js script
// So we'll include a simplified version of the parser here
function parseSalary(raw) {
  if (!raw) return undefined;
  
  // Number regex to capture values with commas and decimal points
  const numberRx = /([\d,]+(?:\.\d+)?)/g;
  
  // Check if there are any numbers in the salary string
  if (!numberRx.test(raw)) return undefined;
  
  // Reset regex lastIndex
  numberRx.lastIndex = 0;
  
  // Extract numbers
  const matches = raw.match(numberRx) || [];
  const nums = matches.map(match => {
    // Convert string number to float
    let num = parseFloat(match.replace(/,/g, ""));
    
    // Handle k/K suffix (e.g., 70k = 70,000)
    if (/\b\d+[kK]\b/.test(raw)) {
      num *= 1000;
    }
    
    return num;
  });
  
  // Get currency
  let currency = 'USD'; // Default
  const currencyRx = /(USD|EUR|GBP|PLN|usd|zrx|\$|€|£)/i;
  const currencyMatch = raw.match(currencyRx);
  
  if (currencyMatch) {
    const detectedCurrency = currencyMatch[1].toLowerCase();
    
    switch (detectedCurrency) {
      case '$': currency = 'USD'; break;
      case '€': currency = 'EUR'; break;
      case '£': currency = 'GBP'; break;
      case 'pln': currency = 'PLN'; break;
      case 'zrx': currency = 'ZRX'; break;
      case 'usd': currency = 'USD'; break;
      default: currency = detectedCurrency.toUpperCase();
    }
  }
  
  // Get period
  let period = 'year'; // Default
  const periodRx = /(per year|annually|\/year|per hour|\/hour|hourly|monthly|per month|\/month|per week|weekly|\/week|\/mo|\/yr|\/hr|\/day)/i;
  const periodMatch = raw.match(periodRx);
  
  if (periodMatch) {
    const periodText = periodMatch[0].toLowerCase();
    if (/hour|\/hr/.test(periodText)) {
      period = 'hour';
    } else if (/month|\/mo/.test(periodText)) {
      period = 'month';
    } else if (/week|\/wk/.test(periodText)) {
      period = 'week';
    } else if (/day/.test(periodText)) {
      period = 'day';
    }
  } else {
    // Check for special cases without explicit period markers
    if (/\/hour|hourly|per hour|\/hr/.test(raw.toLowerCase())) {
      period = 'hour';
    } else if (/pln\/month|\/month|monthly|per month|\/mo/.test(raw.toLowerCase())) {
      period = 'month';
    }
  }
  
  // Extract min and max (if range)
  let [min, max] = nums.length === 1 ? [nums[0], undefined] : nums.slice(0, 2);
  
  // Return simplified salary range
  return {
    min,
    max,
    currency,
    period,
    note: '' // No extra notes in the simplified format
  };
}

async function updateSalaryData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'atlas-jobs';

  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not set. Please set it and try again.');
    process.exit(1); 
  }

  console.log('Starting salary data update...');
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection(JOBS_COLLECTION);
    
    // Get all jobs that don't have salaryRange
    const jobs = await collection.find({ salaryRange: { $exists: false } }).toArray();
    console.log(`Found ${jobs.length} jobs without salaryRange`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each job
    for (const job of jobs) {
      // Skip jobs without salary information
      if (!job.salary) {
        skippedCount++;
        continue;
      }
      
      // Parse the salary string
      const salaryRange = parseSalary(job.salary);
      
      // Skip if parsing failed
      if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        skippedCount++;
        continue;
      }
      
      // Update the job record with the parsed salary range
      await collection.updateOne(
        { _id: job._id },
        { $set: { salaryRange } }
      );
      
      updatedCount++;
      
      // Log progress for every 10 jobs
      if (updatedCount % 10 === 0) {
        console.log(`Updated ${updatedCount} jobs so far...`);
      }
    }
    
    console.log('\nUpdate completed:');
    console.log(`- Total jobs processed: ${jobs.length}`);
    console.log(`- Jobs updated with salaryRange: ${updatedCount}`);
    console.log(`- Jobs skipped (no salary or parsing failed): ${skippedCount}`);
    
  } catch (error) {
    console.error('Error updating salary data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the update
updateSalaryData()
  .then(() => console.log('Script completed'))
  .catch(err => console.error('Script error:', err)); 