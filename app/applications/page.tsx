'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AppLayout from '@/components/AppLayout'

export default function Applications() {
  // This would be fetched from Supabase based on the user's applications
  const applications = [
    {
      id: '1',
      company: 'Netflix',
      logo: '/logos/netflix.svg',
      title: 'Product Manager',
      location: 'Remote, US',
      appliedDate: '2023-07-10',
      status: 'Interview',
      nextStep: 'Technical interview on July 25, 2023',
      lastUpdated: '2023-07-18'
    },
    {
      id: '2',
      company: 'Airbnb',
      logo: '/logos/airbnb.svg',
      title: 'Senior Product Marketing Manager',
      location: 'Remote, US',
      appliedDate: '2023-07-05',
      status: 'Rejected',
      nextStep: null,
      lastUpdated: '2023-07-15'
    },
    {
      id: '3',
      company: 'Meta',
      logo: '/logos/meta.svg',
      title: 'Product Specialist',
      location: 'Remote, US',
      appliedDate: '2023-07-01',
      status: 'Applied',
      nextStep: 'Waiting for response',
      lastUpdated: '2023-07-01'
    }
  ]

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Screening':
        return 'bg-purple-100 text-purple-800';
      case 'Interview':
        return 'bg-green-100 text-green-800';
      case 'Offer':
        return 'bg-teal-100 text-teal-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Applications</h1>
          <Link 
            href="/" 
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Find more jobs
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-5">Job</div>
              <div className="col-span-2">Applied</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Next Step</div>
            </div>
          </div>
          
          {applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 relative overflow-hidden rounded-md mr-3">
                          <Image 
                            src={application.logo} 
                            alt={`${application.company} logo`} 
                            fill 
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{application.title}</div>
                          <div className="text-sm text-gray-600">{application.company} • {application.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {application.nextStep || '-'}
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <Link 
                        href={`/applications/${application.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        <span className="sr-only">View details</span>
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No applications yet</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Start applying to jobs to track your application progress here.
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
        
        {applications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">Application Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Total Applications</div>
                <div className="text-2xl font-bold">{applications.length}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Interview Rate</div>
                <div className="text-2xl font-bold">
                  {Math.round((applications.filter(app => app.status === 'Interview' || app.status === 'Offer').length / applications.length) * 100)}%
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Active Applications</div>
                <div className="text-2xl font-bold">
                  {applications.filter(app => app.status !== 'Rejected').length}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Response Rate</div>
                <div className="text-2xl font-bold">
                  {Math.round((applications.filter(app => app.status !== 'Applied').length / applications.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 