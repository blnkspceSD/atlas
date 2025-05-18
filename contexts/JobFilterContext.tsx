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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter settings
  const [featuredFilterSettings, setFeaturedFilterSettings] = useState<FeaturedFilterSettings | null>(null);
  
  // Keep track of filter application status
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  
  // Clear error message
  const clearError = useCallback(() => setError(null), []);
  
  // Memoized filter function for better performance
  const filterJobs = useCallback((jobsList: JobData[], settings: FeaturedFilterSettings | null, currentSearchQuery: string) => {
    let tempJobs = jobsList;

    // Apply featured filters first
    if (settings) {
      tempJobs = tempJobs.filter(job => matchesFilterCriteria(job, settings));
    }

    // Then apply search query
    if (currentSearchQuery.trim() !== "") {
      const lowerQuery = currentSearchQuery.toLowerCase();
      tempJobs = tempJobs.filter(job => 
        job.title?.toLowerCase().includes(lowerQuery) ||
        job.company?.toLowerCase().includes(lowerQuery) ||
        job.description?.toLowerCase().includes(lowerQuery) ||
        job.category?.toLowerCase().includes(lowerQuery) ||
        job.jobType?.toLowerCase().includes(lowerQuery)
      );
    }
    return tempJobs;
  }, []);
  
  // Apply the current filters to the jobs list
  const applyFilters = useCallback((settings: FeaturedFilterSettings | null, currentSearchQuery: string) => {
    if (!settings && currentSearchQuery.trim() === "") {
      setManualFilteredJobs(jobs);
      setFiltersApplied(false);
      return;
    }
    
    try {
      const filtered = filterJobs(jobs, settings, currentSearchQuery);
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
  
  // Memoized filtered jobs - only recompute when dependencies change
  const computedFilteredJobs = useMemo(() => {
    // If we have manually set filtered jobs, use those
    if (filtersApplied) {
      return manualFilteredJobs;
    }
    
    // Otherwise, compute them based on current settings and search query
    return filterJobs(jobs, featuredFilterSettings, searchQuery);
  }, [jobs, manualFilteredJobs, featuredFilterSettings, searchQuery, filtersApplied, filterJobs]);
  
  // Update jobs when initialJobs changes
  useEffect(() => {
    setJobs(initialJobs);
    if (!filtersApplied) {
      setManualFilteredJobs(initialJobs);
    } else {
      try {
        const filtered = filterJobs(initialJobs, featuredFilterSettings, searchQuery);
        setManualFilteredJobs(filtered);
      } catch (error) {
        setError("Failed to apply filters to new jobs");
        setManualFilteredJobs(initialJobs);
      }
    }
  }, [initialJobs, featuredFilterSettings, searchQuery, filterJobs, filtersApplied]);
  
  // Load saved filter settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const settings = await loadFeaturedFilterSettings(false);
        if (settings) {
          setFeaturedFilterSettings(settings);
          applyFilters(settings, searchQuery);
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
  
  // Apply filters with current settings
  const applyFeaturedFilters = useCallback(() => {
    applyFilters(featuredFilterSettings, searchQuery);
  }, [featuredFilterSettings, searchQuery, applyFilters]);
  
  // Save filter settings and apply them
  const saveFeaturedSettings = useCallback(async (settings: FeaturedFilterSettings) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await saveFeaturedFilterSettings(settings, false);
      setFeaturedFilterSettings(settings);
      applyFilters(settings, searchQuery);
    } catch (error) {
      setError("Failed to save filter settings. Please try again.");
      if (filtersApplied) { 
        applyFilters(featuredFilterSettings, searchQuery); 
      } else {
        setManualFilteredJobs(jobs);
        setFiltersApplied(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobs, filterJobs, filtersApplied, featuredFilterSettings, searchQuery, applyFilters]);
  
  // Reset filters to show all jobs
  const resetFilters = useCallback(() => {
    setManualFilteredJobs(jobs);
    setFeaturedFilterSettings(null);
    setSearchQuery("");
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
        searchQuery,
        setSearchQuery,
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