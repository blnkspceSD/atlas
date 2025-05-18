import { v4 as uuidv4 } from 'uuid';
import { JobData, SalaryRange } from '@/types/job';
import { JobRecord, JobSource, JobTransformer, createJobSignature } from '@/types/jobStorage';
import { formatDate, formatSalary } from '@/lib/utils';
import { parseSalary, isValidSalaryFormat } from '@/lib/salaryParser';
import { transformTheirStackJob } from './transformers/theirStackTransformer';

/**
 * Validates if a salary string has a proper numeric format
 * Returns true for formats like "$XX,XXX - $XXX,XXX", "$XXX,XXX", etc.
 */
function isValidSalaryFormat2(salary: string | null | undefined): boolean {
  if (!salary || typeof salary !== 'string' || salary.trim() === '') {
    return false;
  }
  
  // Check if salary contains at least one number
  const containsNumber = /\d/.test(salary);
  
  // Check for proper formats like "$XX,XXX - $XXX,XXX" or "$XXX,XXX" or numeric ranges
  const hasProperFormat = (
    // Dollar amounts (with optional commas)
    /\$\s*\d{1,3}(,\d{3})*(\.\d+)?(\s*-\s*\$\s*\d{1,3}(,\d{3})*(\.\d+)?)?/.test(salary) ||
    // Numeric ranges with currency symbol
    /\d{1,3}(,\d{3})*(\.\d+)?\s*-\s*\d{1,3}(,\d{3})*(\.\d+)?\s*[A-Z]{3}/.test(salary) ||
    // Plain numeric ranges
    /\d{1,3}(,\d{3})*(\.\d+)?\s*-\s*\d{1,3}(,\d{3})*(\.\d+)?/.test(salary)
  );
  
  return containsNumber && hasProperFormat;
}

// Remotive API transformer
export const remotiveTransformer: JobTransformer = {
  fromApiToDatabase: (job: any, source: JobSource): Partial<JobRecord> => {
    // Generate a signature for deduplication
    const jobSignature = createJobSignature(job);

    // Parse salary if it exists
    const rawSalary = job.salary || null;
    const salaryRange = parseSalary(rawSalary);

    return {
      id: uuidv4(), // Generate a unique ID for our system
      title: job.title,
      company: job.company_name,
      logo: job.company_logo,
      description: job.description,
      salary: rawSalary,
      salaryRange,
      location: job.candidate_required_location || null,
      jobType: job.job_type || null,
      category: job.category || null,
      remote: true, // All Remotive jobs are remote
      
      // Deduplication fields
      jobSignature,
      sources: [source],
      sourceUrls: { [source]: job.url },
      sourceIds: { [source]: job.id.toString() },
      
      benefits: [], // Remotive doesn't provide benefits
      firstSeen: new Date(),
      lastSeen: new Date(),
    };
  },
  
  fromDatabaseToFrontend: (job: JobRecord): JobData => {
    const formattedSalary = formatSalary(job.salary);
    const hasSalary = isValidSalaryFormat(job.salary);
    
    return {
      id: job.id,
      company: job.company,
      logo: job.logo,
      title: job.title,
      salary: formattedSalary,
      salaryRange: job.salaryRange,
      hasSalary: hasSalary, // Add a flag to indicate if the job has a real salary
      benefits: job.benefits || [],
      remote: job.remote,
      usOnly: job.location?.includes('USA') || job.location?.includes('US only') || false,
      source: job.sources[0], // Primary source
      timePosted: formatDate(job.firstSeen),
      
      // Include source URLs for attribution
      url: job.sourceUrls.remotive || job.sourceUrls[job.sources[0]] || '',
      
      // Additional fields
      description: job.description,
      category: job.category || undefined,
      jobType: job.jobType || undefined,
      candidateRequiredLocation: job.location || undefined,
    };
  }
};

// Jobicy API transformer
export const jobicyTransformer: JobTransformer = {
  fromApiToDatabase: (job: any, source: JobSource): Partial<JobRecord> => {
    // Generate a signature for deduplication
    const jobSignature = createJobSignature(job);

    // Create raw salary string
    const rawSalary = job.annualSalaryMin && job.annualSalaryMax 
      ? `${job.annualSalaryMin}-${job.annualSalaryMax} ${job.salaryCurrency || 'USD'}`
      : job.salary || null;
      
    // Parse the salary - handle bonus if present
    const salaryRange = rawSalary ? parseSalary(rawSalary) : undefined;

    // Special case for Jobicy adding bonus information
    if (job.bonus && salaryRange) {
      const bonusAmount = parseFloat(job.bonus);
      if (!isNaN(bonusAmount)) {
        salaryRange.note = salaryRange.note ? `${salaryRange.note} + bonus: ${bonusAmount}` : `bonus: ${bonusAmount}`;
      }
    }
    
    // If we have direct min/max values, create structured data even if raw parsing fails
    if (job.annualSalaryMin && !salaryRange) {
      const min = parseFloat(job.annualSalaryMin);
      const max = job.annualSalaryMax ? parseFloat(job.annualSalaryMax) : undefined;
      
      return {
        id: uuidv4(), // Generate a unique ID for our system
        title: job.jobTitle,
        company: job.companyName,
        logo: job.companyLogo,
        description: job.jobDescription,
        salary: rawSalary,
        salaryRange: {
          min: isNaN(min) ? undefined : min,
          max: isNaN(max as number) ? undefined : max,
          currency: job.salaryCurrency || 'USD',
          period: 'year',
          note: ''
        },
        location: job.jobGeo || null,
        jobType: job.jobType || null,
        category: job.jobIndustry || null,
        remote: true, // All Jobicy jobs are remote
        
        // Deduplication fields
        jobSignature,
        sources: [source],
        sourceUrls: { [source]: job.url },
        sourceIds: { [source]: job.id.toString() },
        
        benefits: [], // Jobicy doesn't provide benefits
        firstSeen: new Date(),
        lastSeen: new Date(),
      };
    }

    return {
      id: uuidv4(), // Generate a unique ID for our system
      title: job.jobTitle,
      company: job.companyName,
      logo: job.companyLogo,
      description: job.jobDescription,
      salary: rawSalary,
      salaryRange,
      location: job.jobGeo || null,
      jobType: job.jobType || null,
      category: job.jobIndustry || null,
      remote: true, // All Jobicy jobs are remote
      
      // Deduplication fields
      jobSignature,
      sources: [source],
      sourceUrls: { [source]: job.url },
      sourceIds: { [source]: job.id.toString() },
      
      benefits: [], // Jobicy doesn't provide benefits
      firstSeen: new Date(),
      lastSeen: new Date(),
    };
  },
  
  fromDatabaseToFrontend: (job: JobRecord): JobData => {
    const formattedSalary = formatSalary(job.salary);
    const hasSalary = isValidSalaryFormat(job.salary);
    
    return {
      id: job.id,
      company: job.company,
      logo: job.logo,
      title: job.title,
      salary: formattedSalary,
      salaryRange: job.salaryRange,
      hasSalary: hasSalary, // Add a flag to indicate if the job has a real salary
      benefits: job.benefits || [],
      remote: job.remote,
      usOnly: job.location?.includes('USA') || job.location?.includes('US only') || false,
      source: job.sources[0], // Primary source
      timePosted: formatDate(job.firstSeen),
      
      // Include source URLs for attribution
      url: job.sourceUrls.jobicy || job.sourceUrls[job.sources[0]] || '',
      
      // Additional fields
      description: job.description,
      category: job.category || undefined,
      jobType: job.jobType || undefined,
      candidateRequiredLocation: job.location || undefined,
    };
  }
};

// Unified transformer that can detect source and use the appropriate transformer
export function getTransformerForSource(source: JobSource): JobTransformer {
  switch (source) {
    case 'remotive':
      return remotiveTransformer;
    case 'jobicy':
      return jobicyTransformer;
    case 'theirstack':
      // Create TheirStack transformer with same interface
      return {
        fromApiToDatabase: (job: any, source: JobSource): Partial<JobRecord> => {
          return transformTheirStackJob(job);
        },
        fromDatabaseToFrontend: (job: JobRecord): JobData => {
          // Use the remotive transformer as base
          return remotiveTransformer.fromDatabaseToFrontend(job);
        }
      };
    // Add more transformers as you add more API sources
    // case 'weworkremotely':
    //   return weworkremotelyTransformer;
    default:
      return remotiveTransformer; // Fallback to remotive format
  }
}

// Get a unified transformer 
export const unifiedTransformer = {
  fromDatabaseToFrontend: (job: JobRecord): JobData => {
    // Use the remotive transformer as a base
    const jobData: JobData = remotiveTransformer.fromDatabaseToFrontend(job);
    
    // Determine if this is a proper salary with numeric values
    const hasSalary = isValidSalaryFormat(job.salary);
    
    // Assign property
    jobData.hasSalary = hasSalary;
    
    // Ensure salary range is passed through
    jobData.salaryRange = job.salaryRange;
    
    return jobData;
  }
}; 