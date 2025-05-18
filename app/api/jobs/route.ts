import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/jobService';
import { unifiedTransformer } from '@/lib/transformers';

// Cache the response for 60 seconds during development (was 3600 seconds)
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    // Get jobs from our database
    const jobRecords = await getJobs(100);
    
    // Convert database records to frontend format
    const jobs = jobRecords.map(job => unifiedTransformer.fromDatabaseToFrontend(job));
    
    return NextResponse.json({ jobs }, { 
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
} 