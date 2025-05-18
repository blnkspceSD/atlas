import { JobData, SalaryRange } from './job';

// Source API types
export type JobSource = 'remotive' | 'weworkremotely' | 'github' | 'jobicy' | 'theirstack' | 'other';

// Database job record
export interface JobRecord {
  id: string;                    // Unique ID in our system
  title: string;                 // Job title
  company: string;               // Company name
  logo: string | null;           // Company logo URL
  description: string;           // Job description (HTML)
  salary: string | null;         // Raw salary information (original text)
  salaryRange?: SalaryRange;     // Structured salary data
  location: string | null;       // Location requirements
  jobType: string | null;        // Job type (full-time, contract, etc)
  category: string | null;       // Job category
  remote: boolean;               // Is remote job
  
  // Deduplication and tracking fields
  jobSignature: string;          // Unique signature for deduplication
  sources: JobSource[];          // Array of API sources that have this job
  sourceUrls: {                  // Original URLs from each source
    [source in JobSource]?: string;
  };
  sourceIds: {                   // Original IDs from each source
    [source in JobSource]?: string;
  };
  benefits: string[];            // Job benefits
  firstSeen: Date;               // When job was first added to our system
  lastSeen: Date;                // When job was last seen in any API
}

// Used to transform to/from our frontend JobData type
export interface JobTransformer {
  // Convert from API-specific job format to our database format
  fromApiToDatabase: (job: any, source: JobSource) => Partial<JobRecord>;
  
  // Convert from our database format to frontend format
  fromDatabaseToFrontend: (job: JobRecord) => JobData;
}

// Creates a unique signature for job deduplication
export function createJobSignature(job: any): string {
  // Normalize fields based on different sources
  const company = (
    job.company || 
    job.company_name || 
    ''
  ).toLowerCase().trim();
  
  const title = (
    job.title || 
    job.position || 
    ''
  ).toLowerCase().trim();
  
  // Remove common words that don't help with uniqueness
  const cleanedTitle = title
    .replace(/senior|junior|mid-level|lead|principal/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Create a signature that combines these elements
  return `${company}__${cleanedTitle}`;
} 