import { Collection, OptionalId, Document } from 'mongodb';
import { getCollection } from './mongodb';
import { JobRecord, JobSource } from '@/types/jobStorage';
import { getTransformerForSource } from './transformers';

const JOBS_COLLECTION = 'jobs';

/**
 * Stores a job from an API in the database, handling deduplication
 * @param job Raw job data from API
 * @param source Source API name
 */
export async function storeJobFromApi(job: any, source: JobSource): Promise<string> {
  const collection = await getCollection(JOBS_COLLECTION);
  
  // Use the appropriate transformer for this source
  const transformer = getTransformerForSource(source);
  
  // Transform API-specific job to our database format
  const dbJob = transformer.fromApiToDatabase(job, source);
  
  // Check if job already exists
  const existingJob = await collection.findOne({ jobSignature: dbJob.jobSignature }) as JobRecord | null;
  
  if (existingJob) {
    // Job exists, update it
    await collection.updateOne(
      { jobSignature: dbJob.jobSignature },
      { 
        $set: { 
          lastSeen: new Date(),
          // Update any fields that might have changed
          salary: dbJob.salary || existingJob.salary,
          logo: dbJob.logo || existingJob.logo,
          description: dbJob.description || existingJob.description,
          salaryRange: dbJob.salaryRange || existingJob.salaryRange,
        },
        $addToSet: { 
          sources: source 
        },
        $currentDate: { updatedAt: true }
      }
    );
    
    // Update source URLs and IDs
    if (dbJob.sourceUrls && Object.keys(dbJob.sourceUrls).length > 0) {
      await collection.updateOne(
        { jobSignature: dbJob.jobSignature },
        {
          $set: {
            [`sourceUrls.${source}`]: dbJob.sourceUrls[source],
            [`sourceIds.${source}`]: dbJob.sourceIds?.[source] || null
          }
        }
      );
    }
    
    return existingJob.id;
  } else {
    // New job, insert it
    const result = await collection.insertOne(dbJob as OptionalId<JobRecord>);
    return dbJob.id!;
  }
}

/**
 * Bulk store jobs from an API
 * @param jobs Array of raw jobs from API
 * @param source Source API name
 */
export async function bulkStoreJobsFromApi(jobs: any[], source: JobSource): Promise<number> {
  let storedCount = 0;
  
  for (const job of jobs) {
    try {
      await storeJobFromApi(job, source);
      storedCount++;
    } catch (error) {
      console.error(`Error storing job from ${source}:`, error);
    }
  }
  
  return storedCount;
}

/**
 * Get jobs from the database
 * @param limit Optional limit of jobs to return
 * @param filter Optional filter criteria
 */
export async function getJobs(limit: number = 100, filter: any = {}): Promise<JobRecord[]> {
  const collection = await getCollection(JOBS_COLLECTION);
  
  // Basic filter: only return jobs seen in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const combinedFilter = {
    ...filter,
    lastSeen: { $gte: thirtyDaysAgo }
  };
  
  // Get the jobs from DB and cast them to our JobRecord type
  const jobs = await collection
    .find(combinedFilter)
    .sort({ lastSeen: -1 })
    .limit(limit)
    .toArray();
    
  return jobs as unknown as JobRecord[];
}

/**
 * Create indexes for job collection
 */
export async function ensureJobIndexes(): Promise<void> {
  const collection = await getCollection(JOBS_COLLECTION);
  
  // Create indexes for faster lookups
  await collection.createIndex({ jobSignature: 1 }, { unique: true });
  await collection.createIndex({ lastSeen: -1 });
  await collection.createIndex({ sources: 1 });
  await collection.createIndex({ category: 1 });
  await collection.createIndex({ jobType: 1 });
  await collection.createIndex({ remote: 1 });
} 