'use client'

import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import JobList from '@/components/JobList'
import AppLayout from '@/components/AppLayout'
import { JobData } from '@/types/job'
import { JobFilterProvider, useJobFilters } from '@/contexts/JobFilterContext'

// Removed sample data generators as we'll use real API data

export default function Home() {
  const [allJobs, setAllJobs] = useState<JobData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch jobs from our API that connects to Remotive
    async function fetchJobs() {
      try {
        setIsInitialLoading(true);
        const response = await fetch('/api/jobs');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.jobs && Array.isArray(data.jobs)) {
          setAllJobs(data.jobs);
        } else {
          console.error('Unexpected API response format:', data);
          setError('Unexpected data format from API');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setIsInitialLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <AppLayout>
      {isInitialLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-xl">Loading jobs...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
          <p className="mt-2">Please try refreshing the page.</p>
        </div>
      ) : (
        <JobFilterProvider initialJobs={allJobs}>
          <HomeContent />
        </JobFilterProvider>
      )}
    </AppLayout>
  )
}

// This component uses the JobFilterContext
function HomeContent() {
  const { filteredJobs, isLoading } = useJobFilters();
  
  return (
    <>
      <SearchBar />
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-pulse text-xl">Filtering jobs...</div>
        </div>
      )}
      
      {!isLoading && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-xl">No jobs match your filter criteria</div>
        </div>
      )}
      
      {!isLoading && filteredJobs.length > 0 && (
        <>
          <div className="my-4 text-sm text-gray-600">
            Showing {filteredJobs.length} remote jobs
          </div>
          <JobList jobs={filteredJobs} />
        </>
      )}
    </>
  );
} 