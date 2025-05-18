import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import { formatSalary } from '@/lib/utils'
import { Salary } from '@/components/Salary'
import { parseSalary } from '@/lib/salaryParser'

export default function JobDetail({ params }: { params: { id: string } }) {
  // This would typically fetch the job data from Supabase based on the ID
  // For now, we'll use mock data
  const job = {
    id: params.id,
    company: 'Netflix',
    logo: '/logos/netflix.svg',
    title: 'Product Manager',
    location: 'Remote, US',
    salary: '131,000 - 140,000 USD',
    salaryRange: parseSalary('131,000 - 140,000 USD'), // Parse the salary
    description: `
      <p>Netflix is seeking a passionate Product Manager to join our growing team. In this role, you'll be responsible for driving the product vision, strategy, and roadmap for one of our core product areas.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Drive the product vision, strategy, and roadmap for your product area</li>
        <li>Work closely with engineering, design, content, and marketing teams to deliver great experiences</li>
        <li>Use data to inform product decisions and measure success</li>
        <li>Communicate product plans, benefits, and results to cross-functional teams and executives</li>
        <li>Identify market opportunities and develop business cases for new features</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>5+ years of product management experience</li>
        <li>Strong analytical and problem-solving skills</li>
        <li>Excellent communication and interpersonal abilities</li>
        <li>Experience with agile development methodologies</li>
        <li>Passion for creating exceptional user experiences</li>
      </ul>
    `,
    benefits: [
      'Fully remote',
      'Vacation budget',
      'Insurance',
      'Stock options',
      'Flexible work hours',
      'Home office stipend'
    ],
    remote: true,
    usOnly: true,
    source: 'LinkedIn',
    timePosted: '16 hours ago',
    applyLink: 'https://netflix.com/careers'
  }

  return (
    <main className="flex min-h-screen bg-white">
      <Sidebar 
        isOpen={true} 
        onClose={() => {}}
        isCollapsed={false}
        onToggleCollapse={() => {}}
        currentPath="/jobs"
      />
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary text-2xl font-bold">atlas.</Link>
          <div className="flex gap-3">
            <Link 
              href="/signin" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-primary hover:underline flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to jobs
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 mr-6 relative overflow-hidden rounded-md">
                <Image 
                  src={job.logo} 
                  alt={`${job.company} logo`} 
                  fill 
                  className="object-contain"
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                <div className="flex items-center text-gray-600">
                  <span className="mr-3">{job.company}</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                </div>
              </div>
              
              <div className="ml-auto">
                <a 
                  href={job.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                >
                  Apply Now
                </a>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Salary</h3>
                {job.salaryRange ? (
                  <Salary 
                    {...job.salaryRange} 
                    rawSalary={job.salary}
                    className="text-lg font-medium"
                  />
                ) : (
                  <p className="text-lg font-medium">{formatSalary(job.salary)}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Posted</h3>
                <p className="text-lg">{job.timePosted}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit) => (
                  <span 
                    key={benefit} 
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Job Description</h3>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">About Netflix</h2>
            <p className="text-gray-700 mb-6">
              Netflix is the world's leading streaming entertainment service with over 200 million paid memberships in over 190 countries enjoying TV series, documentaries and feature films across a wide variety of genres and languages.
            </p>
            <p className="text-gray-700 mb-6">
              Members can watch as much as they want, anytime, anywhere, on any internet-connected screen. Members can play, pause and resume watching, all without commercials or commitments.
            </p>
            <a 
              href="https://netflix.com/about" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              Learn more about Netflix
            </a>
          </div>
          
          <div className="flex justify-between items-center">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save job
            </button>
            
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Apply for this position
            </a>
          </div>
        </div>
      </div>
    </main>
  )
} 