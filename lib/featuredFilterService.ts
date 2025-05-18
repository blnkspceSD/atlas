import { FeaturedFilterSettings } from '@/components/FeaturedFilterModal';
import { JobData } from '@/types/job';

// LocalStorage key
const STORAGE_KEY = 'featuredFilters';

// API endpoint
const API_ENDPOINT = '/api/user/settings/featured-filters';

/**
 * Save featured filter settings to API or localStorage depending on auth status
 */
export async function saveFeaturedFilterSettings(
  settings: FeaturedFilterSettings,
  isAuthenticated: boolean = false
): Promise<boolean> {
  try {
    console.log('Saving filter settings:', settings);
    
    if (isAuthenticated) {
      // Save to API if user is authenticated
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return true;
    } else {
      // Save to localStorage if not authenticated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      console.log('Saved filter settings to localStorage');
      return true;
    }
  } catch (error) {
    console.error('Error saving featured filter settings:', error);
    return false;
  }
}

/**
 * Load featured filter settings from API or localStorage
 */
export async function loadFeaturedFilterSettings(
  isAuthenticated: boolean = false
): Promise<FeaturedFilterSettings | null> {
  try {
    if (isAuthenticated) {
      // Load from API if authenticated
      const response = await fetch(API_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } else {
      // Load from localStorage if not authenticated
      const stored = localStorage.getItem(STORAGE_KEY);
      const settings = stored ? JSON.parse(stored) : null;
      console.log('Loaded filter settings from localStorage:', settings);
      return settings;
    }
  } catch (error) {
    console.error('Error loading featured filter settings:', error);
    return null;
  }
}

/**
 * Check if a job matches the featured filter criteria
 */
export function matchesFilterCriteria(job: JobData, settings: FeaturedFilterSettings): boolean {
  // If no criteria selected (i.e., all criteria are false), all jobs match if we interpret "Featured" as an opt-in filter set
  // However, the modal enforces at least one selection.
  // If settings.criteria has all false values (e.g. user unchecks everything that was checked)
  // then no job should match if the intention is "jobs that match these specific criteria".
  // Let's assume that if there are active criteria set, a job must match at least one.
  // The modal ensures that onSave, at least one criteria is true.

  const hasActiveCriteria = Object.values(settings.criteria).some(value => value === true);
  // If for some reason settings are saved with no active criteria (e.g. if modal logic changes)
  // we can decide here if it means "match all" or "match none".
  // Given the modal enforces at least one, this path might not be hit often with current UI.
  // Let's stick to "if there are criteria, match them; if none are active, match none".
  if (!hasActiveCriteria) {
    return false; 
  }

  // Check employment type
  // Note: settings.employmentType is always present from the modal's default.
  if (job.jobType) {
    const jobType = String(job.jobType).toLowerCase();
    if (settings.employmentType === 'full-time' && !(jobType.includes('full') || jobType.includes('full-time'))) {
      return false;
    }
    if (settings.employmentType === 'part-time' && !(jobType.includes('part') || jobType.includes('part-time'))) {
      return false;
    }
    if (settings.employmentType === 'contract' && !jobType.includes('contract')) {
      return false;
    }
  } else {
    // If the job has no jobType, it cannot match an employmentType filter.
    // If employmentType filtering is active (which it always is based on modal), then this job doesn't match.
    return false;
  }

  // Check additional criteria
  // A job must match AT LEAST ONE of the selected criteria if any are selected.
  // But the employmentType is a primary filter that must always be met.
  // The logic for isValid in the modal is: at least one of the *additional criteria* must be true.

  let additionalCriteriaMet = false;
  if (settings.criteria.hasSalary) {
    if (job.hasSalary === true) additionalCriteriaMet = true;
    else return false; // If this criterion is set, it MUST be met
  }
  if (settings.criteria.remoteOnly) {
    if (job.remote === true) additionalCriteriaMet = true;
    else return false; // If this criterion is set, it MUST be met
  }
  if (settings.criteria.seniorLevel) {
    const title = job.title ? job.title.toLowerCase() : '';
    if (title.includes('senior') || title.includes('sr.') || title.includes('lead')) additionalCriteriaMet = true;
    else return false; // If this criterion is set, it MUST be met
  }
  if (settings.criteria.recentlyPosted) {
    if (job.firstSeen) {
      const postedDate = new Date(job.firstSeen);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (postedDate >= sevenDaysAgo) additionalCriteriaMet = true;
      else return false; // If this criterion is set, it MUST be met
    } else {
      return false; // No date, so cannot be "recently posted"
    }
  }
  
  // If we reach here, the employmentType matched.
  // We also need to check if any of the *active* additional criteria were met.
  // The `isValid` in the modal ensures at least one *additional* criteria is true when saving.
  // So, `additionalCriteriaMet` should be true if any of those that were set to true in settings actually matched.

  // Let's refine: if a criterion in settings.criteria is true, the job MUST match it.
  // And at least one of them must be true overall for additionalCriteriaMet.

  let matchesAtLeastOneSelectedCriteria = false;
  let allSelectedCriteriaAreMet = true;

  if (settings.criteria.hasSalary) {
    if (job.hasSalary === true) matchesAtLeastOneSelectedCriteria = true; else allSelectedCriteriaAreMet = false;
  }
  if (settings.criteria.remoteOnly) {
    if (job.remote === true) matchesAtLeastOneSelectedCriteria = true; else allSelectedCriteriaAreMet = false;
  }
  if (settings.criteria.seniorLevel) {
    const title = job.title ? job.title.toLowerCase() : '';
    if (title.includes('senior') || title.includes('sr.') || title.includes('lead')) matchesAtLeastOneSelectedCriteria = true; else allSelectedCriteriaAreMet = false;
  }
  if (settings.criteria.recentlyPosted) {
    if (job.firstSeen) {
      const postedDate = new Date(job.firstSeen);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (postedDate >= sevenDaysAgo) matchesAtLeastOneSelectedCriteria = true; else allSelectedCriteriaAreMet = false;
    } else {
      allSelectedCriteriaAreMet = false; 
    }
  }

  // If no specific criteria were selected in the UI (e.g. hasSalary: false, remoteOnly: false etc for all)
  // then hasActiveCriteria would be false, and we would have returned false already.
  // So, at least one of settings.criteria.* is true.
  // The job must match ALL criteria that are set to true in the settings.
  return allSelectedCriteriaAreMet;
} 