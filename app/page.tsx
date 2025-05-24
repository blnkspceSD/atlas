'use client'

import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import JobList from '@/components/JobList'
import AppLayout from '@/components/AppLayout'
import { JobData } from '@/types/job'
import { JobFilterProvider, useJobFilters } from '@/contexts/JobFilterContext'

// New component to handle display of job list, loading, and error states
interface JobListAreaProps {
  isInitialLoading: boolean;
  fetchError: string | null;
}

const JobListArea: React.FC<JobListAreaProps> = ({ isInitialLoading, fetchError }) => {
  const { filteredJobs, isLoading: isFiltering } = useJobFilters(); // Renamed isLoading to isFiltering for clarity

  if (isInitialLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-xl">Loading jobs...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{fetchError}</div>
        <p className="mt-2">Please try refreshing the page or check back later.</p>
      </div>
    );
  }

  // If we are here, initial load is done and there was no fetch error.
  // Now, check filtering state from JobFilterContext.
  if (isFiltering) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-xl">Filtering jobs...</div>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl">No jobs match your filter criteria.</div>
      </div>
    );
  }

  return (
    // Outer container for the job listing area, including results count and job cards
    <div className="px-4">
      {/* Text displaying the number of jobs found */}
      <div className="my-4 text-sm text-gray-600">
        Showing {filteredJobs.length} remote jobs
      </div>
      <JobList jobs={filteredJobs} />
    </div>
  );
};

export default function Home() {
  const [allJobs, setAllJobs] = useState<JobData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Renamed from error

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsInitialLoading(true);
        setFetchError(null); // Clear previous errors
        const response = await fetch('/api/jobs');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.jobs && Array.isArray(data.jobs)) {
          setAllJobs(data.jobs);
        } else {
          console.error('Unexpected API response format:', data);
          setFetchError('Unexpected data format from API. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        let errorMessage = 'Failed to load jobs. Please try again later.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setFetchError(errorMessage);
      } finally {
        setIsInitialLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <AppLayout>
      <JobFilterProvider initialJobs={allJobs}>
        <SearchBar className="px-0" />
        <JobListArea 
          isInitialLoading={isInitialLoading} 
          fetchError={fetchError} 
        />
      </JobFilterProvider>
    </AppLayout>
  );
} 