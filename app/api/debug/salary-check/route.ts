import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/jobService';
import { unifiedTransformer } from '@/lib/transformers';
import { parseSalary } from '@/lib/salaryParser';

// No caching for this debug endpoint
export const revalidate = 0;

export async function GET() {
  try {
    // Get a sample of jobs from the database
    const jobRecords = await getJobs(10);
    
    // Analyze each job
    const results = jobRecords.map(job => {
      // Get the raw salary and check for salaryRange
      const rawSalary = job.salary;
      const hasSalaryRange = !!job.salaryRange;
      
      // Parse the salary if no salaryRange exists
      let parsedSalary = null;
      if (!hasSalaryRange && rawSalary) {
        parsedSalary = parseSalary(rawSalary);
      }
      
      // Transform to frontend format
      const frontendJob = unifiedTransformer.fromDatabaseToFrontend(job);
      
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        rawSalary,
        hasSalaryRangeInDb: hasSalaryRange,
        salaryRangeInDb: job.salaryRange,
        parsedSalary,
        hasSalaryRangeInFrontend: !!frontendJob.salaryRange,
        salaryRangeInFrontend: frontendJob.salaryRange
      };
    });
    
    return NextResponse.json({ 
      count: jobRecords.length,
      results 
    });
  } catch (error: any) {
    console.error('Error checking salary data:', error);
    return NextResponse.json(
      { error: 'Failed to check salary data', details: error.message }, 
      { status: 500 }
    );
  }
} 