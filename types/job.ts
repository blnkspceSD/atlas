export interface JobData {
  id: string;
  company: string;
  logo: string | null;
  title: string;
  salary: string;
  salaryRange?: SalaryRange; // Add structured salary data
  hasSalary: boolean;  // Indicates if the job has a real salary value
  benefits: string[];
  remote: boolean;
  usOnly: boolean;
  source: string;
  timePosted: string;
  
  // Additional fields from Remotive API
  url?: string;           // Original job URL (required for attribution)
  description?: string;   // HTML job description
  category?: string;      // Job category
  jobType?: string | null; // Employment type (full-time, contract, etc.)
  candidateRequiredLocation?: string | null; // Location requirements
}

/**
 * Structured salary data with range, currency and period
 */
export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;         // e.g. "USD", "PLN"
  period: "year"|"month"|"week"|"day"|"hour";
  note?: string;            // any trailing text like "+ equity"
} 