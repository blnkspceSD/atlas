'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AppLayout from '@/components/AppLayout'
import { formatSalary } from '@/lib/utils'

export default function SavedJobs() {
  // This would be fetched from Supabase based on the user's saved jobs
  const savedJobs = [
    {
      id: '1',
      company: 'Netflix',
      logo: '/logos/netflix.svg',
      title: 'Product Manager',
      location: 'Remote, US',
      salary: '131,000 - 140,000 USD',
      datePosted: '2023-07-15',
      savedAt: '2023-07-16',
      status: 'active'
    },
    {
      id: '2',
      company: 'Airbnb',
      logo: '/logos/airbnb.svg',
      title: 'Senior Product Marketing Manager',
      location: 'Remote, US',
      salary: '131,000 - 140,000 USD',
      datePosted: '2023-07-14',
      savedAt: '2023-07-15',
      status: 'active'
    },
    {
      id: '3',
      company: 'Meta',
      logo: '/logos/meta.svg',
      title: 'Product Specialist',
      location: 'Remote, US',
      salary: '131,000 - 140,000 USD',
      datePosted: '2023-07-10',
      savedAt: '2023-07-11',
      status: 'expired'
    }
  ]

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Saved Jobs</h1>
        
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div 
                key={job.id}
                className={`bg-white rounded-lg border ${
                  job.status === 'expired' ? 'border-gray-200 opacity-70' : 'border-gray-200'
                } p-6 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 relative overflow-hidden rounded-md mr-4">
                    <Image 
                      src={job.logo} 
                      alt={`${job.company} logo`} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          href={`/jobs/${job.id}`} 
                          className="text-lg font-medium hover:text-primary"
                        >
                          {job.title}
                        </Link>
                        <div className="text-gray-600">{job.company}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span className="flex items-center mr-4">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.status === 'expired' ? 'Expired' : 'Active'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">{formatSalary(job.salary)}</div>
                        <div className="text-sm text-gray-500 mt-1">Saved on {new Date(job.savedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Posted on {new Date(job.datePosted).toLocaleDateString()}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="text-red-600 text-sm hover:text-red-800 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                        
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No saved jobs yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              When you find a job that interests you, click the save icon to add it to this list for easy access later.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Browse jobs
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 