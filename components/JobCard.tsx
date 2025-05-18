import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { JobData } from '@/types/job'
import { Building2, ExternalLink, Cog } from 'lucide-react'
import { Salary } from '@/components/Salary'

interface JobCardProps {
  job: JobData
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [imageError, setImageError] = useState(false);

  // Updated SpaceWithLine component to use paddingTopInPx and paddingBottomInPx
  const SpaceWithLine = ({
    paddingTopInPx = 0,
    paddingBottomInPx = 0,
  }: {
    paddingTopInPx?: number;
    paddingBottomInPx?: number;
  }) => (
    <div style={{ paddingTop: `${paddingTopInPx}px`, paddingBottom: `${paddingBottomInPx}px` }}>
      <hr className="w-full border-t border-gray-200" />
    </div>
  );

  // Function to create placeholder benefits when real ones aren't available
  const getDisplayedBenefits = () => {
    if (job.benefits && job.benefits.length > 0) {
      return job.benefits.join(', ');
    }
    
    // If no benefits provided (e.g., from Remotive API), show job type and location
    const locationInfo = job.candidateRequiredLocation || (job.usOnly ? 'USA' : 'Worldwide');
    const jobTypeInfo = job.jobType || 'Remote';
    
    return `${jobTypeInfo} · ${locationInfo}`;
  };

  return (
    <div className="bg-[#F7F7F7] rounded-[24px] border border-[#ECECEC] overflow-hidden hover:shadow-md transition-shadow pt-3 px-2 pb-2 flex flex-col h-full">
      {/* Header: Company Icon + Name + Featured Badge if applicable */}
      <div className="flex items-center mb-2 px-2">
        <div className="w-6 h-6 mr-2 relative overflow-hidden rounded-md">
          {job.logo && !imageError ? (
            <Image 
              src={job.logo} 
              alt={`${job.company} logo`} 
              fill 
              className="object-contain"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md"> 
              <Building2 className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
        <span className="text-gray-900 text-xs truncate">{job.company}</span>
        
        {job.category && (
          <span className="ml-auto text-xs text-gray-500">{job.category}</span>
        )}
      </div>

      {/* White Content Box */}
      <div className="bg-white rounded-[16px] shadow-sm px-4 pt-4 pb-4 flex-grow flex flex-col">
        {/* Title with min-height and line-clamp */}
        <h3 className="text-xl font-semibold text-gray-900 min-h-14 line-clamp-2">{job.title}</h3> 
        
        {/* Salary Section */}
        <div className="min-h-12 mt-4">
          <h4 className="text-xs text-gray-400 mb-1">Salary</h4>
          {job.salaryRange ? (
            <Salary 
              {...job.salaryRange} 
              rawSalary={job.salary}
              className="text-gray-900"
            />
          ) : (
            <p className="text-gray-900">{job.salary}</p>
          )}
        </div>
        
        <SpaceWithLine paddingTopInPx={12} paddingBottomInPx={16} />
        
        {/* Benefits Section */}
        <div className="min-h-12">
          <h4 className="text-xs text-gray-400 mb-1">
            {job.benefits && job.benefits.length > 0 ? 'Benefits' : 'Job Details'}
          </h4>
          <p className="text-gray-900 leading-relaxed">{getDisplayedBenefits()}</p>
        </div>

        {/* Attribution Link to Remotive (required by API terms) */}
        {job.url && job.source === 'Remotive' && (
          <div className="mt-4">
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View on Remotive <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}
      </div>

      {/* Job Card Footer */}
      <div className="flex items-center text-xs text-gray-400 px-4 pt-2 pb-[2px]">
        <span className="mr-auto">From: {job.source}</span>
        <span>{job.timePosted}</span>
      </div>
    </div>
  )
}

export default JobCard 