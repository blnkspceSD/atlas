import React from 'react'
import Image from 'next/image'
import JobCard from './JobCard'
import { JobData } from '@/types/job'

interface JobListProps {
  jobs: JobData[]
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

export default JobList 