'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { FeaturedFilterSettings } from '@/components/FeaturedFilterModal';
import { loadFeaturedFilterSettings, saveFeaturedFilterSettings, matchesFilterCriteria } from '@/lib/featuredFilterService';
import { JobData } from '@/types/job';

// Define types
interface JobFilterContextType {
  jobs: JobData[];
  filteredJobs: JobData[];
  isLoading: boolean;
  error: string | null;
  featuredFilterSettings: FeaturedFilterSettings | null;
  setFeaturedFilterSettings: (settings: FeaturedFilterSettings) => void;
  applyFeaturedFilters: () => void;
  resetFilters: () => void;
  clearError: () => void;
}

// Create context
const JobFilterContext = createContext<JobFilterContextType | undefined>(undefined);

// Context provider component
export const JobFilterProvider: React.FC<{ children: React.ReactNode, initialJobs: JobData[] }> = ({ 
  children, 
  initialJobs = []
}) => {
  // Jobs state
  const [jobs, setJobs] = useState<JobData[]>(initialJobs);
  const [manualFilteredJobs, setManualFilteredJobs] = useState<JobData[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter settings
  const [featuredFilterSettings, setFeaturedFilterSettings] = useState<FeaturedFilterSettings | null>(null);
  
  // Keep track of filter application status
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  
  // Clear error message
  const clearError = useCallback(() => setError(null), []);
  
  // Memoized filter function for better performance
  const filterJobs = useCallback((jobsList: JobData[], settings: FeaturedFilterSettings | null) => {
    if (!settings) return jobsList;
    
    return jobsList.filter(job => matchesFilterCriteria(job, settings));
  }, []);
  
  // Memoized filtered jobs - only recompute when dependencies change
  const computedFilteredJobs = useMemo(() => {
    // If we have manually set filtered jobs, use those
    if (filtersApplied) {
      return manualFilteredJobs;
    }
    
    // Otherwise, compute them based on current settings
    return filterJobs(jobs, featuredFilterSettings);
  }, [jobs, manualFilteredJobs, featuredFilterSettings, filtersApplied, filterJobs]);
  
  // Update jobs when initialJobs changes
  useEffect(() => {
    setJobs(initialJobs);
    if (!filtersApplied) {
      setManualFilteredJobs(initialJobs);
    } else if (featuredFilterSettings) {
      try {
        const filtered = filterJobs(initialJobs, featuredFilterSettings);
        setManualFilteredJobs(filtered);
      } catch (error) {
        setError("Failed to apply filters to new jobs");
        setManualFilteredJobs(initialJobs);
      }
    }
  }, [initialJobs, featuredFilterSettings, filterJobs, filtersApplied]);
  
  // Load saved filter settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const settings = await loadFeaturedFilterSettings(false);
        if (settings) {
          setFeaturedFilterSettings(settings);
          applyFilters(settings);
        } else {
          setManualFilteredJobs(jobs);
          setFiltersApplied(false);
        }
      } catch (error) {
        setError("Failed to load saved filters. Showing all jobs instead.");
        setManualFilteredJobs(jobs);
        setFiltersApplied(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save filter settings and apply them
  const saveFeaturedSettings = useCallback(async (settings: FeaturedFilterSettings) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await saveFeaturedFilterSettings(settings, false);
      setFeaturedFilterSettings(settings);
      
      const filtered = filterJobs(jobs, settings);
      setManualFilteredJobs(filtered);
      setFiltersApplied(true);
      
      if (filtered.length === 0 && jobs.length > 0) {
        setError("No jobs match your current filters. Try adjusting your criteria.");
      }
    } catch (error) {
      setError("Failed to save filter settings. Please try again.");
      if (filtersApplied) {
        applyFeaturedFilters();
      } else {
        setManualFilteredJobs(jobs);
        setFiltersApplied(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobs, filterJobs, filtersApplied, applyFeaturedFilters]);
  
  // Apply the current filters to the jobs list
  const applyFilters = useCallback((settings: FeaturedFilterSettings | null) => {
    if (!settings) {
      setManualFilteredJobs(jobs);
      setFiltersApplied(false);
      return;
    }
    
    try {
      const filtered = filterJobs(jobs, settings);
      setManualFilteredJobs(filtered);
      setFiltersApplied(true);
      setError(null);
      
      if (filtered.length === 0 && jobs.length > 0) {
        setError("No jobs match your current filters. Try adjusting your criteria.");
      }
    } catch (error) {
      setError("Failed to apply filters. Showing all available jobs.");
      setManualFilteredJobs(jobs);
      setFiltersApplied(false);
    }
  }, [jobs, filterJobs]);
  
  // Apply filters with current settings
  const applyFeaturedFilters = useCallback(() => {
    if (featuredFilterSettings) {
      applyFilters(featuredFilterSettings);
    } else {
      setManualFilteredJobs(jobs);
      setFiltersApplied(false);
    }
  }, [jobs, featuredFilterSettings, applyFilters]);
  
  // Reset filters to show all jobs
  const resetFilters = useCallback(() => {
    setManualFilteredJobs(jobs);
    setFeaturedFilterSettings(null);
    setFiltersApplied(false);
    setError(null);
  }, [jobs]);
  
  return (
    <JobFilterContext.Provider 
      value={{
        jobs,
        filteredJobs: computedFilteredJobs,
        isLoading,
        error,
        featuredFilterSettings,
        setFeaturedFilterSettings: saveFeaturedSettings,
        applyFeaturedFilters,
        resetFilters,
        clearError,
      }}
    >
      {children}
    </JobFilterContext.Provider>
  );
};

// Custom hook to use the context
export const useJobFilters = () => {
  const context = useContext(JobFilterContext);
  if (context === undefined) {
    throw new Error('useJobFilters must be used within a JobFilterProvider');
  }
  return context;
}; 