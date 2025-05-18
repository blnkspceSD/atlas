/**
 * Transformer for TheirStack job data
 */
import { SalaryRange } from "@/types/job";
import { JobRecord, JobSource } from "@/types/jobStorage";
import { TheirStackJob } from "@/lib/theirstack";
import { parseSalary } from "@/lib/salaryParser";
import { sanitizeHtml } from "../sanitizeHtml";
import { getCompanyLogo } from "../companyLogo";

/**
 * Transform a TheirStack job to our database job record format
 * @param theirStackJob Original job from TheirStack API
 * @returns Transformed job in our database format
 */
export function transformTheirStackJob(theirStackJob: TheirStackJob): JobRecord {
  // Generate a unique signature for the job
  const jobSignature = `theirstack-${theirStackJob.id}`;
  
  // Extract the company name (can be a string or an object)
  const companyName = typeof theirStackJob.company === 'string' 
    ? theirStackJob.company 
    : theirStackJob.company?.name || '';
  
  // Parse date
  const datePosted = theirStackJob.date_posted ? new Date(theirStackJob.date_posted) : new Date();
  
  // Create a structured salary range if salary data exists
  let salaryRange: SalaryRange | undefined = undefined;
  
  if (theirStackJob.min_annual_salary_usd || theirStackJob.max_annual_salary_usd) {
    salaryRange = {
      min: theirStackJob.min_annual_salary_usd,
      max: theirStackJob.max_annual_salary_usd,
      currency: 'USD',
      period: 'year'
    };
  } else if (theirStackJob.salary_string) {
    // Try to parse from the salary string if structured data isn't available
    salaryRange = parseSalary(theirStackJob.salary_string);
  }
  
  // Generate a unique ID
  const id = `theirstack-${theirStackJob.id}`;
  
  // Define the source
  const source: JobSource = 'theirstack';
  
  // Construct job object
  const job: JobRecord = {
    id,
    title: theirStackJob.job_title,
    company: companyName,
    location: theirStackJob.location || (theirStackJob.remote ? 'Remote' : 'Unknown'),
    description: theirStackJob.description ? sanitizeHtml(theirStackJob.description) : '',
    salary: theirStackJob.salary_string || null,
    salaryRange,
    remote: theirStackJob.remote || false,
    jobSignature,
    sources: [source],
    sourceUrls: {
      [source]: theirStackJob.url
    },
    sourceIds: {
      [source]: theirStackJob.id.toString()
    },
    logo: theirStackJob.company_domain ? getCompanyLogo(theirStackJob.company_domain) : null,
    jobType: null,
    category: null,
    benefits: [],
    firstSeen: new Date(),
    lastSeen: new Date()
  };
  
  return job;
} 