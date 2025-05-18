'use client'

import React from 'react'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'

export default function Profile() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Resume</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Profile</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="John"
                />
              </div>
              
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="Doe"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="john.doe@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="San Francisco, CA"
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="Product designer with 5+ years of experience in creating user-centric digital products."
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Job Preferences</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
                Desired job title
              </label>
              <input
                type="text"
                id="job-title"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="Senior Product Designer"
              />
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Desired salary range
              </label>
              <select
                id="salary"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="120-150"
              >
                <option value="80-100">$80,000 - $100,000</option>
                <option value="100-120">$100,000 - $120,000</option>
                <option value="120-150">$120,000 - $150,000</option>
                <option value="150-180">$150,000 - $180,000</option>
                <option value="180+">$180,000+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job type
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="full-time"
                    name="job-type"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="full-time" className="ml-2 block text-sm text-gray-700">
                    Full-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="contract"
                    name="job-type"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="contract" className="ml-2 block text-sm text-gray-700">
                    Contract
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="part-time"
                    name="job-type"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="part-time" className="ml-2 block text-sm text-gray-700">
                    Part-time
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred regions
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="remote-anywhere"
                    name="regions"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="remote-anywhere" className="ml-2 block text-sm text-gray-700">
                    Remote (Anywhere)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="us-only"
                    name="regions"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="us-only" className="ml-2 block text-sm text-gray-700">
                    US Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="europe"
                    name="regions"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="europe" className="ml-2 block text-sm text-gray-700">
                    Europe
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save preferences
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Email notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="job-matches"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="job-matches" className="ml-2 block text-sm text-gray-700">
                      Job matches
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">Get notified about new jobs that match your preferences</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="application-updates"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="application-updates" className="ml-2 block text-sm text-gray-700">
                      Application updates
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">Receive updates on your job applications</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="account-security"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="account-security" className="ml-2 block text-sm text-gray-700">
                      Account security
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">Get important security notifications</span>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Change password
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 